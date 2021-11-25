const co = $(".container");
const doc = $(document);
const sc = $("div.sub-container");
const ho = $("#home");
const qr = $("#qrcode");
const at = $("a.tampilmodul");
const as = "a.tampilsubmodul";
const host = "http://localhost:8000/";
const urlsendMessage = host + "send-message";
const hmod = host + "assets/mod";
const uploadcsv = host + "uploadfile";
const urlgetContactGroups = host + "group-getcontact";
const socket = io();
const iconS = "<i class='fas fa-check-circle text-success'></i> ";
const iconG = "<i class='fas fa-times-circle text-danger'></i> ";
const d = Date(Date.now());
const a = d.toString();

$(document).ready(function () {
  /** Menampilkan isi menu ketika di klik */
  socket.on("message", function (msg) {
    logMsg(null, msg, null);
    if (msg === "QR Code received, scan please!") {
      showQR(true);
    }
    showQR(false);
  });
  socket.on("qr", function (src) {
    showQR(true);
    $("#qrcode").attr("src", src);
  });

  socket.on("ready", function (src) {
    showQR(false);
  });

  socket.on("authenticated", function (src) {
    showQR(false);
  });

  at.on("click", function (e) {
    e.preventDefault();
    const param = $(this).attr("href").substring(1);
    $.ajax({
      type: "get",
      url: hmod + param,
      success: function (response) {
        co.html(response);
        if (param === null || param === undefined) {
          ho.addClass("d-block");
        }
        at.each(function () {
          at.parents("li").removeClass("active");
        });
        $("a." + param)
          .parents("li")
          .addClass("active");
        afterloadSubmodul();
      },
    });
  });
  /** Menampilkan isi sub menu ketika di klik */
  co.on("click", ".card " + as, function (e) {
    e.preventDefault();
    const param = $(this).attr("href").substring(1);
    const sad = $(".container div.sub-container");
    $.ajax({
      type: "get",
      url: hmod + param,
      success: function (response) {
        sad.html(response);
        /*  afterloadSubmodul(); */
      },
    });
  });
  /* socketIO(); */
});

function afterloadSubmodul() {
  /* socketIO(); */
  select2Numbers();
  modalOptionKirim();
  clearMessage1();
  sendModeMudah();
  sendModeSusah();
  grabContactGroup();
}
function select2Numbers() {
  /** Menambahkan fungsi select2 di kolom mumbers/ nomor tujuan */
  $("select[name='numbers']").select2({
    tags: true,
    tokenSeparators: [";", " "],
    multiple: true,
    width: "100%",
    minimumInputLength: 8,
    newTag: true,
    cache: true,
  });
}
function modalOptionKirim() {
  $(".modalOptModemudah-media").on("shown.bs.modal", function () {
    sertakanMedia();
  });
  $(".modalOptModemudah-durasi").on("shown.bs.modal", function () {
    simpanOptMessage1("durasi");
  });
  $(".modalOptModemudah-uploadcsv").on("shown.bs.modal", function () {
    alert("sdasdasdas");
    simpanOptMessage1("uploadcsv");
  });
}
function clearMessage1() {
  $("a.clear-message").on("click", function (e) {
    e.preventDefault();
    $("select[name='numbers']").text(null);
    $("textarea[name='message']").val("");
  });
}
function sertakanMedia(params = null) {
  $("input[name='sertakanmedia']").on("change", function () {
    $("input[name='sertakanmedia']").each(function () {
      if ($(this).prop("checked") == true) {
        $(".sertakanmedia").removeAttr("disabled");
        $(".sertakanmedia").removeClass("d-none");
        $(".mediaattach").removeClass("d-none");
        $("select[name='sumber-media']").val("attach");
        sumberMedia();
      }
      if ($(this).prop("checked") == false) {
        $(".sertakanmedia").addClass("d-none");
        $(".sertakanmedia").attr("disabled", "disabled");
        $(".mediaattach").addClass("d-none");
        $(".mediaurl").addClass("d-none");
      }
      simpanOptMessage1("sourcemedia");
    });
  });
}

function sumberMedia(params = null) {
  $("select[name='sumber-media']").on("change", function () {
    const selectSumber = $("select[name='sumber-media'] :selected").val();

    if (selectSumber === "attach") {
      $(".mediaattach").removeClass("d-none");
      $(".mediaurl").addClass("d-none");
    }
    if (selectSumber === "link") {
      $(".mediaurl").removeClass("d-none");
      $(".mediaattach").addClass("d-none");
    }
  });
}

function simpanOptMessage1(t = null) {
  if (t === "sourcemedia") {
    $("div.modalOptModemudah-media").on(
      "click",
      "button#simpan-sourcemedia",
      function () {
        const sm = $("select[name='sumber-media'] :selected").val();
        const url = $("input[name='sourcemediaurl']").val();
        const file = $("input[name='sourcemediaattach']").val();
        if (sm === "attach") {
          if (file.length == 0) {
            alert("sumber media file tidak boleh kosoong!");
            return false;
          }
          $(".smedia").html(file);
          $(".ssmedia").html(sm);
          $("div.modalOptModemudah-media").modal("hide");
          /* $("div.modalOptModemudah-media").modal("dispose"); */
        }
        if (sm === "link") {
          if (url.length == 0) {
            alert("sumber media Lnk tidak boleh kosoong!");
            return false;
          }
          $(".smedia").html(url);
          $(".ssmedia").html(sm);
          $("div.modalOptModemudah-media").modal("hide");
          /*  $("div.modalOptModemudah-media").modal("dispose"); */
        }
      }
    );
  }
  if (t === "durasi") {
    $("#simpan-durasi").on("click", function () {
      const dur = $("input[name='durasi-kirim']").val();
      if (dur.length == 0) {
        alert("Durasi kirim harus diisi!");
        return false;
      }
      $(".sdurasi").html(dur);
      $("div.modalOptModemudah-durasi").modal("hide");
    });
  }
  if (t === "uploadcsv") {
    $("div.modal").on("click", "button#upload-csv", function (e) {
      //e.preventDefault();
      alert("asdasdasdasdasdas");
      var formData = new FormData();
      formData.append("type", "csv");
      formData.append("file", $("input[type=file]")[0].files[0]);
      $.ajax({
        url: uploadcsv,
        type: "post",
        data: formData,
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        success: function (data) {
          const obj = JSON.parse(data);
          let tbl =
            "<table class='table table-striped m-0' id='tabelwa'><thead><tr><th>No.</th><th>contact</th><th>name</th><th>message</th><th>Sumber Media (link)</th><th>Tipe </th><th>Sumber Media (Upload)</th></tr></thead><tbody>";
          for (let index = 0; index < obj.response.length; index++) {
            tbl += "<tr>";
            tbl += "<td class='m-0'>" + (index + 1) + "</td>";
            tbl += "<td class='m-0'>" + obj.response[index].contact + "</td>";
            tbl += "<td class='m-0'>" + obj.response[index].name + "</td>";
            tbl += "<td class='m-0'>" + obj.response[index].message + "</td>";
            tbl +=
              "<td class='m-0'>" + obj.response[index].linksource + "</td>";
            tbl +=
              '<td class="tipemedia m-0"><select id="tipemedia_' +
              index +
              '" class=""><option value="link">Link</option><option value="upload">Upload</option></select></td>';
            tbl +=
              "<td class='m-0'><input type='file' name='mediaupload_" +
              index +
              "' id=''></td>";
            tbl += "</tr>";
          }
          tbl += "</tbody></table>";
          $("#list-contact").html(tbl);
          $("div.modalOptModemudah-uploadcsv").modal("hide");
        },
      });
    });
  }
}
function socketIO() {
  socket.on("message", function (msg) {
    logMsg(null, msg, null);
    if (msg === "QR Code received, scan please!") {
      showQR(true);
    }
    showQR(false);
  });
  socket.on("qr", function (src) {
    showQR(true);
    $("#qrcode").attr("src", src);
  });

  socket.on("ready", function (src) {
    showQR(false);
  });

  socket.on("authenticated", function (src) {
    showQR(false);
  });
}

function simpleBc(number, msg) {
  $.ajax({
    url: urlsendMessage,
    type: "post",
    data: {
      number: number,
      message: msg,
      msgtype: "normal",
    },
    success: function (response) {
      const objx = JSON.stringify(response);
      const obj = JSON.parse(objx);
      var terkirim = obj["status"] === true ? iconS : iconG;
      var to = obj["response"]["to"].replace("@c.us", "").substr(2);
      logMsg("0" + to, msg + " - " + terkirim, "");
    },
  });
}
function withMediaLinkBC(number, caption, link) {
  $.ajax({
    url: urlsendMessage,
    type: "post",
    data: {
      number: number,
      message: caption,
      file: link,
      msgtype: "filelink",
    },
    success: function (response) {
      const objx = JSON.stringify(response);
      const obj = JSON.parse(objx);
      var terkirim = obj["status"] === true ? iconS : iconG;
      const tipemsg = obj["response"]["type"];
      if (tipemsg !== "image") {
        simpleBc(number, caption);
      }
      logMsg(
        number,
        caption +
          '<br><img src="' +
          link +
          '" style="width: 100px;" /><br>' +
          " - " +
          terkirim,
        tipemsg
      );
    },
  });
}

function withMediaUploadBC(number, caption, element) {
  var formData = new FormData();
  var file = element[0].files[0];

  formData.append("number", number);
  formData.append("message", caption);
  formData.append("file", file);
  formData.append("msgtype", "fileupload");

  $.ajax({
    url: urlsendMessage,
    type: "post",
    data: formData,
    contentType: false,
    processData: false,
    mimeType: "multipart/form-data",
    success: function (response) {
      const obj = JSON.parse(response);
      const terkirim = obj.status === true ? iconS : iconG;
      const tipemsg = obj.response.type;
      if (tipemsg !== "image") {
        simpleBc(number, caption);
      }
      logMsg(number, caption + " - " + terkirim, tipemsg);
    },
  });
}

function logMsg(number = null, result, tipemsg = null) {
  $(".toast").addClass("show");
  if (tipemsg !== "document" || tipemsg !== "image") {
    tipemsg = "text";
  }
  let content = "";
  content +=
    '<div class="alert alert-left alert-success alert-dismissible fade show mb-1" role="alert">';
  content += '<span><i class="fas fa-comment"></i></span>&nbsp;';
  content += "<span>" + number + "</span><br>";
  content += "<em style='font-size: 0.5em;'>" + a + "</em><br>";
  content += "<span>" + result + "</span><br>";
  content += "<code>" + tipemsg + "</code>";
  content +=
    '<button type="button"class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

  $(".toast").toast("show");
  $(".toast-body").prepend(
    "(" +
      a +
      ")<br> Tipe: " +
      tipemsg +
      " - HP: " +
      number +
      " - Status: " +
      result +
      "<hr>"
  );
  $("#isi-history-send").prepend(content);
}
function sendModeMudah() {
  $("#send-mudah").on("click", function (e) {
    e.preventDefault();
    const numbers = $("select[name='numbers']");
    const message = $("textarea[name='message']");
    const durasi = $(".sdurasi").html().length == 0 ? 10 : $(".sdurasi").html();
    const sumberM = $(".ssmedia").html();
    const media = $(".smedia").html();

    $(this).attr("disabled", "disabled");
    $(".toast-body").html("");
    if (parseInt(numbers.val().length) == 0) {
      alert("No Whatsapp tujuan tidak boleh kosong");
      numbers.focus();
      return false;
    }
    if (message.val().length == 0) {
      alert("Pesan tidak boleh kosong");
      message.focus();
      return false;
    }
    if (sumberM.length > 0) {
      if (media.length === 0) {
        alert("Sumber media tidak boleh kosong!");
        return false;
      }
      procSendMudah(numbers.val(), message.val(), sumberM, media, durasi);
    }
    if (sumberM.length == 0) {
      procSendMudah(numbers.val(), message.val(), null, null, durasi);
    }
  });
}

function procSendMudah(
  numbers,
  message,
  smedia = null,
  media = null,
  durasi = parseInt(10)
) {
  let array_numbers = numbers.toString().split(",");
  $(".pesanke").html(0);
  $(".pesandari").html(array_numbers.length);

  var goSend = setInterval(() => {
    let pesanKe = parseInt($(".pesanke").html());
    let pesandari = parseInt($(".pesandari").html());

    if (array_numbers[pesanKe].length > 0) {
      if (parseInt(pesanKe) === parseInt(pesandari)) {
        $("#send-mudah").html('<i class="fas fa-paper-plane"></i> Send');
        $("#send-mudah").removeAttr("disabled");
        clearInterval(goSend);
        return false;
      }
      if (smedia === null) {
        simpleBc(array_numbers[pesanKe], message);
      }

      if (smedia !== null) {
        if (smedia === "attach") {
          const element = $("input[name='sourcemediaattach']");
          withMediaUploadBC(array_numbers[pesanKe], message, element);
        }
        if (smedia === "link") {
          withMediaLinkBC(array_numbers[pesanKe], message, media);
        }
      }
      pesanKe++;
      $("#send-mudah").html(pesanKe + " of " + pesandari);
      $(".pesanke").html(pesanKe);
      if (parseInt(pesanKe) === parseInt(pesandari)) {
        $("#send-mudah").html('<i class="fas fa-paper-plane"></i> Send');
        $("#send-mudah").removeAttr("disabled");
        clearInterval(goSend);
      }

      /* procSendMudah(numbers, message, smedia, media, durasi); */
    }
  }, parseInt(durasi) * 1000);
}
function sendModeSusah() {
  $("select[name='opttemplate']")
    .on("change", function () {
      var msg = $("#message");
      var str = msg.val();
      $("select[name='opttemplate'] option:selected").each(function () {
        str += $(this).val() + " ";
      });
      msg.val(str);
    })
    .trigger("change");
  $("#send-susah").on("click", function (e) {
    e.preventDefault();
    const tmessage = $("textarea[name='message']");
    const durasi = $(".sdurasi").html().length == 0 ? 10 : $(".sdurasi").html();
    const count_pesan = $("table tbody tr").length;
    let sertakanMedia = false;
    $(this).attr("disabled", "disabled");
    $(".toast-body").html("");

    if (tmessage.val().trim().length == 0) {
      alert("Pesan tidak boleh kosong");
      tmessage.focus();
      $(this).removeAttr("disabled");
      return false;
    }
    if (count_pesan <= 0) {
      alert("File .csv belum di upload!");
      $(this).removeAttr("disabled");
      return false;
    }

    if (count_pesan > 0) {
      $("input[name='sertakanmedia']").each(function () {
        if ($(this).prop("checked") == true) {
          sertakanMedia = true;
        }
      });
      if (sertakanMedia == false) {
        procSendSusah(parseInt(count_pesan), tmessage.val(), durasi);
        return false;
      }
      procSendSusah(parseInt(count_pesan), tmessage.val(), durasi, true);
    }
  });
}
function procSendSusah(
  countMsg,
  tmessage,
  durasi = parseInt(10),
  media = false
) {
  $(".pesanke").html(0);
  $(".pesandari").html(countMsg);

  var goSend = setInterval(() => {
    let pesanKe = parseInt($(".pesanke").html());
    let pesanDari = parseInt($(".pesandari").html());

    if (pesanKe < pesanDari) {
      if (pesanKe === pesanDari) {
        $("#send-susah").html('<i class="fas fa-paper-plane"></i> Send');
        $("#send-susah").removeAttr("disabled");
        clearInterval(goSend);
        return false;
      }

      const contact = $("table tbody tr:eq(" + pesanKe + ") td:eq(1)").html();
      const name = $("table tbody tr:eq(" + pesanKe + ") td:eq(2)").html();
      const message = $("table tbody tr:eq(" + pesanKe + ") td:eq(3)").html();
      const link = $("table tbody tr:eq(" + pesanKe + ") td:eq(4)").html();
      const tipe_sumber = $(
        "table tbody tr:eq(" + pesanKe + ") td:eq(5) select option:selected"
      ).val();
      const media_upload = $(
        "table tbody tr:eq(" + pesanKe + ") td:eq(6) input[type='file']"
      ).val();
      const caption = tmessage
        .replace("{{ hp }}", contact)
        .replace("{{ nama }}", name)
        .replace("{{ pesan }}", message)
        .replace("{{ link }}", link);

      if (contact.trim().length < 1) {
        logMsg("-", iconG + " (No. HP Kosong) ", "-");
      }
      if (contact.trim().length > 0) {
        if (media === false) {
          simpleBc(contact, caption);
        }
        if (media === true) {
          if (tipe_sumber === "upload") {
            if (media_upload.trim().length < 1) {
              logMsg("-", iconG + " (file sumber kosong) ", "-");
            }
            if (media_upload.trim().length > 0) {
              const element = $(
                "table tbody tr:eq(" + pesanKe + ") td:eq(6) input[type='file']"
              );
              withMediaUploadBC(contact, caption, element);
            }
          }
          if (tipe_sumber === "link") {
            if (link.trim().length < 1) {
              logMsg("-", iconG + " (file sumber kosong) ", "-");
            }
            if (link.trim().length > 0) {
              withMediaLinkBC(contact, caption, link);
            }
          }
        }
      }
      pesanKe++;
      $("#send-susah").html(pesanKe + " of " + pesanDari);
      $(".pesanke").html(pesanKe);
      if (parseInt(pesanKe) === parseInt(pesanDari)) {
        $("#send-susah").html('<i class="fas fa-paper-plane"></i> Send');
        $("#send-susah").removeAttr("disabled");
        clearInterval(goSend);
      }
    }
  }, parseInt(durasi) * 1000);
}
function grabContactGroup() {
  $("button#grab-allcontact").on("click", function (e) {
    $(this).html("Please wait..");
    procGetContactGroups();
  });
}
async function procGetContactGroups() {
  return $.ajax({
    url: urlgetContactGroups,
    type: "get",
  }).then((response) => {
    const objx = JSON.stringify(response);
    const obj = JSON.parse(objx);

    if (obj["status"] === true) {
      const dataGroup = obj["response"][0]["yourGroups"];
      if (dataGroup.length > 0) {
        let html =
          '<table class="table table-sm table-striped" id="tblkontakgroup" style="width:100%"><thead><tr><th>No.</th><th>ID Grup</th><th>Nama Group</th><th>Jml Kontak</th><th>No. Kontak</th></tr></thead><tbody>';

        for (let i = 0; i < dataGroup.length; i++) {
          const c = dataGroup[i]["contacts"]
            .replace(/@c.us/gi, "")
            .replace(/,/gi, ";");
          const cs = c.split(";");
          const id = dataGroup[i]["id_group"];
          const nm = dataGroup[i]["name_group"];
          const no = parseInt(i + 1);

          html += "<tr>";
          html += "<td>" + no + "</td>";
          html += "<td>" + id + "</td>";
          html += "<td>" + nm + "</td>";
          html += "<td>" + "(" + cs.length + " kontak)</td>";
          html += "<td>" + c + "</td>";
          html += "</tr>";
        }
        html += "</tbody></table>";
        $("#list-contact").html(html);
        $("button#getcontactgroups").html("Dapatkan kontak");
        $("#tblkontakgroup").DataTable({
          responsive: true,
        });
        console.log(obj["response"][0]["yourGroups"]);
      }
    }
  });
}
function showQR(p = true) {
  if (p == true) {
    $("div#modulqrcode").removeClass("d-none");
    $("div#modulqrcode").show();
    $("div.iq-sidebar").addClass("d-none");
    $("div.iq-sidebar").hide();
  }
  if (p == false) {
    $("div#modulqrcode").addClass("d-none");
    $("div#modulqrcode").hide();
    $("div.iq-sidebar").removeClass("d-none");
    $("div.iq-sidebar").show();
  }
}
