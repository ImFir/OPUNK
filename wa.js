const { Client, MessageMedia } = require("whatsapp-web.js");

const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

const cookieParser = require("cookie-parser");

const qrcode = require("qrcode");
const { phoneNumberFormatter } = require("./helpers/formatter");
const { assetSource } = require("./helpers/assets");
const axios = require("axios");
const mime = require("mime-types");
const CSVToJSON = require("csvtojson");
const admin = require("firebase-admin");
const port = process.env.PORT || 8000;

const key =
  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNThowatHMH3S3\nXS2FVdMSK1FfRcsJFs+cploycG+Lzum89rk0ME/XeE9IUEmJ7Uh9l05HozQLnNPb\nD2oxyGkbq74b54cU2nHnBE8FdmZEe5DJb9TPcKLQCLWpSR7V+U0Sy95lN+TemKKd\nbwMES0niiZ9NdlvsxE8Wyn7xKPFBok+epEkUBEvPh3cuIXu0b0gouAFgb6JUIrl2\nPeiJ17jU3exKHTfIG9nAsBr6/UUoneY8tzu+Uwmf3nDzFeBCQol8BO+q3MgHAc2O\nCXtjya7+Ppuh23lVyKMh3u4qvwEI/UIlaGxADwPAtV/yd1Ogykewd8E/1d5UuLVO\np42xMI4BAgMBAAECggEAFuNkg2NVR7F2Ef80VPoa0Zq8s/y+7vYjvS4ak3xPeJcK\nc0Ok+s7Wsonkz4YL53GUXv61qReRH35OFsz4JNwCmSV4yKRI6KfrLOXLvYB+qZcx\nBBQQoJ5zuEeloQgthONfQVTd0rZRhgjJkE2mWMiKpdPRS7yB8Q/NqsJ2i9eUVfcE\nUP5PgmdbFQX8ijo7AIOR9VIvVdylzER5oIg+uaMy8ske05vv7xO4jfHMguwjr0HX\n7E/OMu3V9pU91t/lDLP4jlWrOUG2Vq//Xre3UK7vRX8943/9gurCPJhP4AON0lkh\nIr57Sfrvggz1u8VrwDg0r1uGPs0Gj4OOCHoxS9k41QKBgQDrM9dXW8t0JsZQ152i\nSghmtgf5ZMRg3zxopg1ljkuQbQ7Yn2ek21rG7hCpcnBsoOXk9nMu76xh1JTCBri1\nuGquKhUlPBhMTaLAj1r1JGg8cn6ocIN1PFJaze7KZTlKU2qnwMpcLEkaZLQoQbLO\nzJVm+vtzQ7ToH8xBhSCzcMx0vwKBgQDfdX0TJPAz/qFlreh4fGE2F5hhffnqnKKO\nQhRX+7mv1AoGRLXA4fOBmgAk8yvxuGc5Y21RlaqJab8LziKnu2Lm9CS8s0rnUuJ/\n//aksYCt/YwXfVWBKlRKSg+6Rao6qomR1iSAuF/LHzt4WF9wZBYPLE3YqnsCN7ME\nclsTFPXtPwKBgGjuSeYJZ+0710H9z6+1g6X/E/OphwsIzPSLEHL8Vq3qWbM++ohL\n7GXPk9Nk4M81wRqy8JRCDQ/gPTWKtiEsUzu8Po7MDrML984cpqGzSmWdVvBiseM9\ntCgas6vMGREVwgFxO1Z/02VZBB7poJIuJ4E3+7JixHTCqueYMwybCDwVAoGBAJwE\nDrCYILFcvdkdI+tDhCfdL4IaD6yTchd64XNQiKPPmrQnsvKZj4dUO3eQ5ISfKEr0\nNXY51didIUsfwCh196ainSe20rxRrVyLHOx+FgbkuLQJyPIm2LUJopN+Yk0Vlnlh\nFxlcIV3TT5VFtlTlPFWZrDxzQvEYbH/VS+s1vkLHAoGADcb0/8hO76pjG+GTH594\nySoEQZ5/vXgyEMWyXl3y+yfKzLvn66QbYgp7RAh4Ph7uhdLyg1vRGSbHCuQb2AjP\n3mEZ2VvJVj+1P3PrRrzdW6qGrICJtJtTIlwjteimrE3g6KBHhE8BgqFtg7qqsScI\nuK704XiWNgnnqCh2lJ2Zhsk=\n-----END PRIVATE KEY-----\n";

admin.initializeApp({
  credential: admin.credential.cert({
    private_key: key.replace(/\\n/g, "\n"),
    client_email: "firebase-adminsdk-qimex@opunk-9c443.iam.gserviceaccount.com",
    project_id: "opunk-9c443",
  }),
});

let sessionCfg;
const SESSION_FILE_PATH = `${__dirname}whatsapp-session.json`;

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
      "--single-process",
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
          replyMsg += `ID: ${group.id._serialized}\nName: ${
            group.name
          }\nContact Participant: ${group.participants.map(
            (c) => c.id._serialized
          )}\n\n`;
        });
        replyMsg +=
          "_You can use the group id to send a message to the group._";
        msg.reply(replyMsg);
      }
    });
  }

  if (msg.hasMedia) {
    msg.downloadMedia().then((media) => {
      console.log(media);

      if (media) {
        const mediaPath = "./downloaded-media/";

        if (!fs.existsSync(mediaPath)) {
          fs.mkdirSync(mediaPath);
        }

        const extension = mime.extension(media.mimetype);

        const filename = new Date().getTime();

        const fullFilename = mediaPath + filename + "." + extension;

        try {
          fs.writeFileSync(fullFilename, media.data, {
            encoding: "base64",
          });
          console.log("File downloaded successfully!", fullFilename);
        } catch (err) {
          console.log("Failed to save the file:", err);
        }
      }
    });
  }
});

app.use(express.json());

app.use(express.static(__dirname + "views/js"));

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

app.use(cookieParser());

io.on("connection", (socket) => {
  socket.emit("message", "Whatsapp is connected");

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

app.get("/", checkCookie, (req, res) => {
  res.sendFile("views/index.min.html", {
    root: __dirname,
  });
  console.log("UID of Signed in User is" + req.decodedClaims.uid);
});

app.get("/login", (req, res) => {
  res.sendFile("views/login.min.html", {
    root: __dirname,
  });
});
app.get("/hal/:source", (req, res) => {
  res.sendFile(`views/${req.params.source}.min.html`, {
    root: __dirname,
  });
});

app.get("/logout", (req, res) => {
  sessionLogout(req, res, "__session");
});

app.get("/savecookie", (req, res) => {
  const Idtoken = req.query.idToken;
  console.log(Idtoken, res);
  savecookie(Idtoken, res);
});

app.get("/download", function (req, res) {
  const file = `${__dirname}/uploads/template_msg.csv`;
  res.download(file);
});
app.get("/js-index", function (req, res) {
  const file = `${__dirname}/views/js/index.min.js`;
  res.download(file);
});
app.get("/js-auth", function (req, res) {
  const file = `${__dirname}/views/js/auth.min.js`;
  res.download(file);
});

app.get("/assets/:source", function (req, res) {
  const file = `${__dirname + assetSource(req.params.source)}`;
  res.download(file);
});

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
app.get("/group-getcontact", function (req, res) {
  client.getChats().then((chats) => {
    const groups = chats.filter((chat) => chat.isGroup);

    if (groups.length == 0) {
      return res.status(422).json({
        status: false,
        response: "You have no group yet.",
      });
    } else {
      let dataArray = [];
      let yourGroups = [];
      groups.forEach((group, i) => {
        yourGroups.push({
          id_group: `${group.id._serialized}`,
          name_group: `${group.name}`,
          contacts: `${group.participants.map((c) => c.id._serialized)}`,
        });
      });

      dataArray.push({
        yourGroups: yourGroups,
      });
      return res.status(200).json({
        status: true,
        response: dataArray,
      });
    }
  });
});
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
        .sendMessage(number, media, {
          caption: message,
        })
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
        .sendMessage(number, media, {
          caption: message,
        })
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

function savecookie(idtoken, res) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  admin
    .auth()
    .createSessionCookie(idtoken, {
      expiresIn,
    })
    .then(
      (sessionCookie) => {
        const options = {
          maxAge: expiresIn,
          httpOnly: true,
          secure: true,
        };
        res.cookie("__session", sessionCookie, options);

        admin
          .auth()
          .verifyIdToken(idtoken)
          .then(function (decodedClaims) {
            res.redirect("/");
          });
      },
      (error) => {
        console.log(error);
        res.status(401).send("UnAuthorised Request");
      }
    );
}

function checkCookie(req, res, next) {
  const sessionCookie = req.cookies.__session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      req.decodedClaims = decodedClaims;
      next();
    })
    .catch((error) => {
      res.redirect("/login");
    });
}

function sessionLogout(req, res, session) {
  const sessionCookie = req.cookies.__session || "";
  res.clearCookie(session);
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      return admin.auth().revokeRefreshTokens(decodedClaims.sub);
    })
    .then(() => {
      return fs.unlinkSync(SESSION_FILE_PATH, function (err) {
        if (err) return console.log(err);
        console.log("Session file deleted!");
      });
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      res.redirect("/login");
    });
}

server.listen(port, function () {
  console.log("App running on *: " + port);
});
