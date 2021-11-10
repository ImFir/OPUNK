/** Whatsapp-web --> */
const { Client, MessageMedia } = require("whatsapp-web.js");
/** Express --> */
const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const fs = require("fs");
/** Socket.IO--> */
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
/** Socket.IO--> */
const fileUpload = require("express-fileupload");
const qrcode = require("qrcode");
const { phoneNumberFormatter } = require("./helpers/formatter");
const axios = require("axios");
const mime = require("mime-types");
const CSVToJSON = require("csvtojson");
const port = process.env.PORT || 8000;

let sessionCfg;
const SESSION_FILE_PATH = "./whatsapp-session.json";

if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
  session: sessionCfg,
});

client.initialize();

const checkRegisteredNumber = async function (number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
};

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  } else if (msg.body == "good morning") {
    msg.reply("selamat pagi");
  } else if (msg.body == "!groups") {
    client.getChats().then((chats) => {
      const groups = chats.filter((chat) => chat.isGroup);

      if (groups.length == 0) {
        msg.reply("You have no group yet.");
      } else {
        let replyMsg = "*YOUR GROUPS*\n\n";
        groups.forEach((group, i) => {
          replyMsg += `ID: ${group.id._serialized}\nName: ${group.name}\n\n`;
        });
        replyMsg +=
          "_You can use the group id to send a message to the group._";
        msg.reply(replyMsg);
      }
    });
  }

  // Downloading media
  if (msg.hasMedia) {
    msg.downloadMedia().then((media) => {
      // To better understanding
      // Please look at the console what data we get
      console.log(media);

      if (media) {
        // The folder to store: change as you want!
        // Create if not exists
        const mediaPath = "./downloaded-media/";

        if (!fs.existsSync(mediaPath)) {
          fs.mkdirSync(mediaPath);
        }

        // Get the file extension by mime-type
        const extension = mime.extension(media.mimetype);

        // Filename: change as you want!
        // I will use the time for this example
        // Why not use media.filename? Because the value is not certain exists
        const filename = new Date().getTime();

        const fullFilename = mediaPath + filename + "." + extension;

        // Save to file
        try {
          fs.writeFileSync(fullFilename, media.data, { encoding: "base64" });
          console.log("File downloaded successfully!", fullFilename);
        } catch (err) {
          console.log("Failed to save the file:", err);
        }
      }
    });
  }
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  fileUpload({
    debug: true,
  })
);

// Socket IO
io.on("connection", (socket) => {
  socket.emit("message", "preparing...");

  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit("message", "QR Code received, scan please!");
    });
  });
  client.on("ready", () => {
    socket.emit("ready", "Whatsapp is ready!");
    socket.emit("message", "Whatsapp is ready!");
  });

  client.on("authenticated", (session) => {
    socket.emit("authenticated", "Whatsapp is authenticated!");
    socket.emit("message", "Whatsapp is authenticated!");
    console.log("AUTHENTICATED", session);
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
      if (err) {
        console.error(err);
      }
    });
  });

  client.on("auth_failure", function (session) {
    socket.emit("message", "Auth failure, restarting...");
  });

  client.on("disconnected", (reason) => {
    socket.emit("message", "Whatsapp is disconnected!");
    fs.unlinkSync(SESSION_FILE_PATH, function (err) {
      if (err) return console.log(err);
      console.log("Session file deleted!");
    });
    client.destroy();
    client.initialize();
  });
});

// request from client
app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname,
  });
});

app.get("/download", function (req, res) {
  const file = `${__dirname}/uploads/template_msg.csv`;
  res.download(file); // Set disposition and send it.
});

// upload file request
app.post("/uploadfile", function (req, res, next) {
  const file_upload = req.files.file;
  const file_type = req.body.type;
  const path_upload = "./uploads/" + file_type + "/";

  if (!fs.existsSync(path_upload)) {
    fs.mkdirSync(path_upload);
  }

  file_upload.mv(path_upload + file_upload.name, function (err, result) {
    if (err) throw err;

    CSVToJSON()
      .fromFile(path_upload + file_upload.name)
      .then((csv) => {
        return res.status(200).json({
          status: true,
          response: csv,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          response: err,
        });
      });
  });
});

// Send message
app.post(
  "/send-message",
  [body("number").notEmpty(), body("message").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req).formatWith(({ msg }) => {
      return msg;
    });

    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: errors.mapped(),
        response: errors.mapped(),
      });
    }

    const number = phoneNumberFormatter(req.body.number);
    const message = req.body.message;
    const msgtype = req.body.msgtype;
    const isRegisteredNumber = await checkRegisteredNumber(number);

    if (!isRegisteredNumber) {
      return res.status(422).json({
        status: false,
        message: "The number is not registered",
        response: "The number is not registered",
      });
    }
    if (msgtype === "normal") {
      client
        .sendMessage(number, message)
        .then((response) => {
          res.status(200).json({
            status: true,
            response: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            response: err,
          });
        });
    }
    if (msgtype === "fileupload") {
      const file = req.files.file;
      const media = new MessageMedia(
        file.mimetype,
        file.data.toString("base64"),
        file.name
      );
      client
        .sendMessage(number, media, { caption: message })
        .then((response) => {
          res.status(200).json({
            status: true,
            response: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            response: err,
          });
        });
    }
    if (msgtype === "filelink") {
      const fileUrl = req.body.file;

      let mimetype;
      const attachment = await axios
        .get(fileUrl, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          mimetype = response.headers["content-type"];
          return response.data.toString("base64");
        });
      const namemedia =
        fileUrl.name != undefined ? fileUrl.name : "file attachment";

      const media = new MessageMedia(mimetype, attachment, namemedia);
      client
        .sendMessage(number, media, { caption: message })
        .then((response) => {
          res.status(200).json({
            status: true,
            response: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            response: err,
          });
        });
    }
  }
);

server.listen(port, function () {
  console.log("App running on *: " + port);
});
