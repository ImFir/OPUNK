$(document).ready(function () {
  var kirim_ke = 0;
  var socket = io();
  const d = Date(Date.now());
  const a = d.toString();
  const host = "http://localhost:8000/";
  const urlsendMessage = host + "send-message";
  const urlgetContactGroups = host + "group-getcontact";

  socket.on("message", function (msg) {
    $(".logs").prepend("<em>" + msg + "</em><br>");
    $("#qrcode").hide();
    $("#app-qrcode").hide();
    $("#app-content").show();
    if (msg === "QR Code received, scan please!") {
      $("#app-qrcode").show();
      $("#app-content").hide();
      $("#qrcode").show();
      $("#msgscan").html(msg);
    }
  });

  socket.on("qr", function (src) {
    $("#qrcode").show;
    $("#qrcode").attr("src", src);
  });

  socket.on("ready", function (src) {
    $("#app-qrcode").hide();
    $("#app-content").show();
    $("#qrcode").hide();
  });

  socket.on("authenticated", function (src) {
    $("#app-qrcode").hide();
    $("#app-content").show();
    $("#qrcode").hide();
  });

  $(".mode").each(function () {
    $(this).hide();
  });

  $("a.pilihmode").on("click", function (e) {
    e.preventDefault();
    const getMode = $(this).attr("href").substring(1);
    $(".mode").hide();
    $("div#" + getMode).show();
    $("a.pilihmode").each(function () {
      $("a.pilihmode").removeClass("active");
    });
    $("a." + getMode).addClass("active");
  });

  $("button#kirim-mode1").on("click", function (e) {
    $("button#kirim-mode1").attr("disabled", "disabled");
    kirim_ke = 0;
    broadcastPesan();
  });

  $("button#kirim-mode2").on("click", function (e) {
    $("button#kirim-mode2").attr("disabled", "disabled");
    broadcastPesan2(0);
  });

  $("button#getcontactgroups").on("click", function (e) {
    $(this).html('Please wait..');
    getContactGroups();
  });

  $("select[name='numbers']").select2({
    tags: true,
    tokenSeparators: [';', ' '],
    multiple: true,
    width: '100%',
    minimumInputLength: 8,
    newTag: true,
    cache: true
  });
  $(document).on('keypress', '.select2-search__field', function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
      event.preventDefault();
    }
  });

  $("select[name='opttemplate']")
    .on("change", function () {
      var str = $("#template_msg").val();
      $("select[name='opttemplate'] option:selected").each(function () {
        str += $(this).val() + " ";
      });
      $("#template_msg").val(str);
    })
    .trigger("change");

  $("#uploadForm").submit(function (e) {
    $("#btnuploadcsv").attr("readonly", "readonly");
    $("#btnuploadcsv").val("File is uploading...");
    e.preventDefault();

    var actionurl = e.currentTarget.action;

    var formData = new FormData();
    formData.append("type", "csv");
    formData.append("file", $("input[type=file]")[1].files[0]);

    $.ajax({
      url: actionurl,
      type: "post",
      data: formData,
      contentType: false,
      processData: false,
      mimeType: "multipart/form-data",
      success: function (data) {
        const obj = JSON.parse(data);
        let tbl =
          "<div class='table-responsive'><table class='table' id='tabelwa'><thead><tr><th>No.</th><th>contact</th><th>name</th><th>message</th><th>Sumber Media (link)</th><th>Tipe Sumber Media</th><th>Sumber Media (Upload)</th></tr></thead><tbody>";
        for (let index = 0; index < obj.response.length; index++) {
          tbl += "<tr>";
          tbl += "<td>" + (index + 1) + "</td>";
          tbl += "<td>" + obj.response[index].contact + "</td>";
          tbl += "<td>" + obj.response[index].name + "</td>";
          tbl += "<td>" + obj.response[index].message + "</td>";
          tbl += "<td>" + obj.response[index].linksource + "</td>";
          tbl +=
            '<td class="tipemedia"><select id="tipemedia_' +
            index +
            '" class=""><option value="link">Link</option><option value="upload">Upload</option></select></td>';
          tbl +=
            "<td><input type='file' name='mediaupload_" +
            index +
            "' id=''></td>";
          tbl += "</tr>";
        }
        tbl += "</tbody></table></div>";
        $("#isicsv").html(tbl);
        $("#btnuploadcsv").removeAttr("readonly");
        $("#btnuploadcsv").val("Upload");
      },
    });
  });

  function broadcastPesan2(count = null) {
    var template_msg = $("textarea[name='template_msg']").val();
    var delay = $("input[name='delay2']").val();
    var count_pesan = $("table tbody tr").length;
    if (template_msg.length === 0) {
      alert("Template pesan tidak boleh kosong!");
      $("textarea[name='template_msg']").focus();
      return false;
    }

    if (count_pesan <= 0) {
      alert("File .csv belum di upload!");
      return false;
    }

    if (count !== null) {
      const contact = $("table tbody tr:eq(" + count + ") td:eq(1)").html();
      const name = $("table tbody tr:eq(" + count + ") td:eq(2)").html();
      const message = $("table tbody tr:eq(" + count + ") td:eq(3)").html();
      const link = $("table tbody tr:eq(" + count + ") td:eq(4)").html();
      const tipe_sumber = $(
        "table tbody tr:eq(" + count + ") td:eq(5) select option:selected"
      ).val();
      const media_upload = $(
        "table tbody tr:eq(" + count + ") td:eq(6) input[type='file']"
      ).val();
      const caption = template_msg
        .replace("{{ hp }}", contact)
        .replace("{{ nama }}", name)
        .replace("{{ pesan }}", message)
        .replace("{{ link }}", link);
      const d = Date(Date.now());
      const a = d.toString();

      if (tipe_sumber === "upload" && media_upload.trim().length == 0) {
        alert("Media Upload tidak boleh kosong");
        $(".logs").prepend(
          "<em>(" +
          a +
          ") di skiped - karena File Upload Media tidak tersedia!</em>, "
        );
        broadcastPesan2(count + 1);
        return false;
      }
      if (tipe_sumber === "link" && link.trim().length == 0) {
        $(".logs").prepend(
          "<em>(" + a + ") di skiped - karena Link Media tidak tersedia!</em>, "
        );
        broadcastPesan2(count + 1);
        return false;
      }

      $("button#kirim-mode2").attr("disabled", "disabled");
      $("button#kirim-mode2").html(
        parseInt(count) + 1 + " dari " + parseInt(count_pesan)
      );

      setTimeout(() => {
        if (parseInt(count) + 1 <= parseInt(count_pesan)) {
          const checkmedia = $("input[name='includemedia']");
          if (checkmedia.is(":checked")) {
            if (tipe_sumber === "link") {
              withMediaLinkBC(contact, caption, link);
            }
            if (tipe_sumber === "upload") {
              const element = $(
                "table tbody tr:eq(" + count + ") td:eq(6) input[type='file']"
              );

              withMediaUploadBC(contact, caption, element);
            }
          } else {
            simpleBc(contact, caption);
          }

          broadcastPesan2(count + 1);
          if (parseInt(count) + 1 >= parseInt(count_pesan)) {
            $("button#kirim-mode2").removeAttr("disabled");
            $("button#kirim-mode2").html("Kirim");
            return false;
          }
        }
      }, parseInt(delay) * 1000);
    }
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
        var terkirim =
          obj["status"] === true ?
          "<i class='fas fa-check-circle text-success'></i> Terkirim" :
          "<i class='fas fa-times-circle text-danger'></i> Gagal";
        var to = obj["response"]["to"].replace("@c.us", "").substr(2);
        logMsg("0" + to, terkirim, "");
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
        var terkirim =
          obj["status"] === true ?
          "<i class='fas fa-check-circle text-success'></i> Terkirim" :
          "<i class='fas fa-times-circle text-danger'></i> Gagal";
        const tipemsg = obj["response"]["type"];
        if (tipemsg !== "image") {
          simpleBc(number, caption);
        }
        logMsg(number, terkirim, tipemsg);
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
        const terkirim =
          obj.status === true ?
          "<i class='fas fa-check-circle text-success'></i> Terkirim" :
          "<i class='fas fa-times-circle text-danger'></i> Gagal";
        const tipemsg = obj.response.type;
        if (tipemsg !== "image") {
          simpleBc(number, caption);
        }
        logMsg(number, terkirim, tipemsg);
      },
    });
  }

  function logMsg(number, result, tipemsg = null) {
    $(".logs").prepend(
      "<label class='badge badge-info text-dark bg-warning text-start m-1'>(" +
      a +
      ")<br> " +
      number +
      " - " +
      result +
      " - " +
      tipemsg +
      "</label>,<br> "
    );
  }

  function broadcastPesan() {
    var numbers = $("select[name='numbers']").val();
    var message = $("textarea[name='message']").val();
    var array_numbers = numbers.toString().split(",");
    var delay = $("input[name='delay']").val();
    var media = $("input[name='mediafilemode1']");
    var mediaVal = media.val();
    if (parseInt(numbers.length) == 0) {
      alert("No Whatsapp tujuan tidak boleh kosong");
      $("select[name='numbers']").focus();
      $("button#kirim-mode1").removeAttr("disabled");
      return false;
    }
    if (message.length == 0) {
      alert("Pesan tidak boleh kosong");
      $("textarea[name='message']").focus();
      $("button#kirim-mode1").removeAttr("disabled");
      return false;
    }
    $("button#kirim-mode1").attr("disabled", "disabled");
    $("button#kirim-mode1").html(
      parseInt(kirim_ke) + 1 + " dari " + parseInt(array_numbers.length)
    );
    if (parseInt(kirim_ke) == parseInt(array_numbers.length)) {
      $("button#kirim-mode1").removeAttr("disabled");
      $("button#kirim-mode1").html("Kirim");
      kirim_ke = null;
      return false;
    }

    setTimeout(() => {
      if (array_numbers[kirim_ke].length > 0 || kirim_ke !== null) {
        if (mediaVal.trim().length == 0) {
          simpleBc(array_numbers[kirim_ke], message);
        }

        if (mediaVal.trim().length > 0) {
          withMediaUploadBC(array_numbers[kirim_ke], message, media);
        }

        kirim_ke++;
        broadcastPesan();
      }
    }, parseInt(delay) * 1000);
  }

  async function getContactGroups() {

    return $.ajax({
      url: urlgetContactGroups,
      type: "get",
    }).then((response) => {
      const objx = JSON.stringify(response);
      const obj = JSON.parse(objx);

      if (obj["status"] === true) {
        const dataGroup = obj["response"][0]['yourGroups'];
        if (dataGroup.length > 0) {
          let html = '<table class="table table-sm table-striped" id="tblkontakgroup" style="width:100%"><thead><tr><th>No.</th><th>ID Grup</th><th>Nama Group</th><th>Jml Kontak</th><th>No. Kontak</th></tr></thead><tbody>';

          for (let i = 0; i < dataGroup.length; i++) {
            const c = (dataGroup[i]['contacts']).replace(/@c.us/gi, "").replace(/,/gi, ";");
            const cs = c.split(";");
            const id = dataGroup[i]['id_group'];
            const nm = dataGroup[i]['name_group'];
            const no = parseInt(i + 1);

            html += '<tr>';
            html += '<td>' + no + '</td>';
            html += '<td>' + id + '</td>';
            html += '<td>' + nm + '</td>';
            html += '<td>' + '(' + cs.length + ' kontak)</td>';
            html += '<td>' + c + '</td>';
            html += '</tr>';
          }
          html += '</tbody></table>';
          $("#list-contact").html(html);
          $("button#getcontactgroups").html('Dapatkan kontak');
          $('#tblkontakgroup').DataTable({
            responsive: true,
          });
          console.log(obj["response"][0]['yourGroups']);
        }
      }
    });
  }
});