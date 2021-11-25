const _0x864ec = _0x4da7;

function _0x4da7(e, t) {
    var a = _0x5b55();
    return (_0x4da7 = function (e, t) {
        return a[e -= 244]
    })(e, t)
}

function _0x5b55() {
    var e = [") td:eq(5) select option:selected", "submit", "#app-content", "input[type=file]", "select[name='opttemplate']", "trim", "ready", "input[name='delay']", "10232CJeVRD", "textarea[name='numbers']", "files", "focus", "<em>(", "link", "html", "attr", "filelink", "length", ") di skiped - karena Link Media tidak tersedia!</em>, ", "number", "129oAgQep", ".mode", "Kirim", "csv", "each", "response", '" class=""><option value="link">Link</option><option value="upload">Upload</option></select></td>', "</em><br>", "textarea[name='message']", "currentTarget", "<em>", "<div class='table-responsive'><table class='table' id='tabelwa'><thead><tr><th>No.</th><th>contact</th><th>name</th><th>message</th><th>Sumber Media (link)</th><th>Tipe Sumber Media</th><th>Sumber Media (Upload)</th></tr></thead><tbody>", "input[name='delay2']", "Upload", "#qrcode", "show", "removeAttr", "parse", "a.pilihmode", "</em>,<br> ", "div#", "No Whatsapp tujuan tidak boleh kosong", "Pesan tidak boleh kosong", "5327424BoRAXi", '<td class="tipemedia"><select id="tipemedia_', "table tbody tr", "File .csv belum di upload!", "#uploadForm", "preventDefault", " - ", "change", "552143sROGAh", "active", ":checked", "split", "<td>", "prepend", "File is uploading...", "1631yRQkRz", "normal", "addClass", ") td:eq(6) input[type='file']", "removeClass", "</td>", "23410yxOLvw", "post", "<td><input type='file' name='mediaupload_", "#template_msg", "6899060uybngU", "table tbody tr:eq(", "#btnuploadcsv", "upload", "val", "src", "file", "authenticated", "Media Upload tidak boleh kosong", "toString", "8748JISRGW", "<i class='fas fa-times-circle'></i> Gagal", "replace", ") di skiped - karena File Upload Media tidak tersedia!</em>, ", "{{ hp }}", "click", "<i class='fas fa-check-circle'></i> Terkirim", "button#kirim-mode1", "{{ pesan }}", " dari ", "1537944EpUyif", ") td:eq(3)", "name", "88372UHOaEU", "stringify", "multipart/form-data", "status", "</tr>", "href", "msgtype", "image", "#app-qrcode", "disabled", "append", "{{ link }}", "linksource", "hide", ".logs", "ajax", "Template pesan tidak boleh kosong!", "readonly", "type", "button#kirim-mode2"];
    return (_0x5b55 = function () {
        return e
    })()
}(function () {
    const e = _0x4da7,
        t = _0x5b55();
    for (;;) try {
        if (876557 == -parseInt(e(258)) + parseInt(e(295)) / 2 + parseInt(e(338)) / 3 * (parseInt(e(298)) / 4) + -parseInt(e(275)) / 5 + -parseInt(e(250)) / 6 + -parseInt(e(265)) / 7 * (parseInt(e(326)) / 8) + -parseInt(e(285)) / 9 * (-parseInt(e(271)) / 10)) break;
        t.push(t.shift())
    } catch (e) {
        t.push(t.shift())
    }
})(), $(document)[_0x864ec(324)](function () {
    const h = _0x864ec;
    var c = 0,
        e = io(),
        a = !0;
    const t = Date(Date.now()),
        s = t[h(284)](),
        n = "http://localhost:8000/send-message";

    function b(e, t) {
        const s = h;
        $[s(313)]({
            url: n,
            type: "post",
            data: {
                number: e,
                message: t,
                msgtype: s(266)
            },
            success: function (e) {
                const t = s,
                    a = JSON.stringify(e),
                    n = JSON.parse(a);
                e = !0 === n[t(301)] ? t(291) : t(286);
                p("0" + n[t(343)].to[t(287)]("@c.us", "").substr(2), e, "")
            }
        })
    }

    function g(o, i, e) {
        const r = h;
        $.ajax({
            url: n,
            type: r(272),
            data: {
                number: o,
                message: i,
                file: e,
                msgtype: r(334)
            },
            success: function (e) {
                const t = r,
                    a = JSON[t(299)](e),
                    n = JSON.parse(a);
                var s = !0 === n.status ? t(291) : t(286),
                    e = n.response.type;
                e !== t(305) && b(o, i), p(o, s, e)
            }
        })
    }

    function k(o, i, e) {
        const r = h;
        var t = new FormData,
            e = e[0].files[0];
        t[r(308)](r(337), o), t[r(308)]("message", i), t[r(308)](r(281), e), t[r(308)](r(304), "fileupload"), $.ajax({
            url: n,
            type: r(272),
            data: t,
            contentType: !1,
            processData: !1,
            mimeType: r(300),
            success: function (e) {
                const t = r,
                    a = JSON[t(244)](e),
                    n = !0 === a[t(301)] ? "<i class='fas fa-check-circle'></i> Terkirim" : t(286),
                    s = a.response[t(316)];
                s !== t(305) && b(o, i), p(o, n, s)
            }
        })
    }

    function p(e, t, a) {
        const n = h;
        $(".logs").prepend("<em>(" + s + ") " + e + n(256) + t + n(256) + a + n(246))
    }
    e.on("message", function (e) {
        const t = h;
        $(t(312))[t(263)](t(348) + e + t(345)), 1 == a && ($(t(352))[t(311)](), $("#app-qrcode")[t(311)](), $(t(320)).show()), 0 == a && ($(t(320))[t(311)](), $(t(306))[t(353)](), $("#qrcode")[t(353)](), $("#msgscan")[t(332)](e))
    }), e.on("qr", function (e) {
        const t = h;
        a = !1, $("#app-content")[t(311)](), $(t(306)).show(), $("#qrcode").show(), $("#qrcode")[t(333)](t(280), e)
    }), e.on(h(324), function (e) {
        const t = h;
        a = !0, $(t(306))[t(311)](), $(t(320))[t(353)](), $(t(352))[t(311)]()
    }), e.on(h(282), function (e) {
        const t = h;
        $(t(306))[t(311)](), $(t(352)).hide()
    }), $(h(339))[h(342)](function () {
        const e = h;
        $(this)[e(311)]()
    }), $(h(245)).on("click", function (e) {
        const t = h;
        e[t(255)]();
        e = $(this)[t(333)](t(303)).substring(1);
        $(t(339))[t(311)](), $(t(247) + e).show(), $(t(245)).each(function () {
            const e = t;
            $(e(245))[e(269)](e(259))
        }), $("a." + e)[t(267)](t(259))
    }), $("button#kirim-mode1").on(h(290), function (e) {
        const t = h;
        $(t(292))[t(333)](t(307), t(307)), c = 0,
            function t() {
                const a = h;
                var e = $(a(327))[a(279)](),
                    n = $(a(346))[a(279)](),
                    s = e[a(261)](";"),
                    o = $(a(325))[a(279)](),
                    i = $("input[name='mediafilemode1']"),
                    r = i[a(279)]();
                if (0 == parseInt(e[a(335)])) return alert(a(248)), $(a(327))[a(329)](), $(a(292)).removeAttr(a(307)), !1;
                if (0 == n[a(335)]) return alert(a(249)), $(a(346))[a(329)](), $(a(292))[a(354)]("disabled"), !1;
                $(a(292))[a(333)](a(307), a(307)), $("button#kirim-mode1")[a(332)](parseInt(c) + 1 + a(294) + parseInt(s[a(335)]));
                if (parseInt(c) == parseInt(s.length)) return $(a(292))[a(354)](a(307)), $(a(292)).html("Kirim"), c = null, !1;
                setTimeout(() => {
                    const e = a;
                    (0 < s[c][e(335)] || null !== c) && (0 == r.trim()[e(335)] && b(s[c], n), 0 < r[e(323)]()[e(335)] && k(s[c], n, i), c++, t())
                }, 1e3 * parseInt(o))
            }()
    }), $(h(317)).on(h(290), function (e) {
        const t = h;
        $(t(317))[t(333)](t(307), "disabled"),
            function n(s) {
                const o = h;
                var e = $("textarea[name='template_msg']")[o(279)](),
                    t = $(o(350))[o(279)](),
                    i = $(o(252))[o(335)];
                if (0 === e[o(335)]) return alert(o(314)), $("textarea[name='template_msg']").focus(), !1;
                if (i <= 0) return alert(o(253)), !1;
                if (null !== s) {
                    const r = $(o(276) + s + ") td:eq(1)")[o(332)](),
                        a = $(o(276) + s + ") td:eq(2)").html(),
                        c = $(o(276) + s + o(296))[o(332)](),
                        p = $("table tbody tr:eq(" + s + ") td:eq(4)")[o(332)](),
                        l = $(o(276) + s + o(318)).val(),
                        d = $(o(276) + s + ") td:eq(6) input[type='file']")[o(279)](),
                        u = e[o(287)](o(289), r)[o(287)]("{{ nama }}", a)[o(287)](o(293), c)[o(287)](o(309), p),
                        m = Date(Date.now()),
                        f = m[o(284)]();
                    return l === o(278) && 0 == d[o(323)]()[o(335)] ? (alert(o(283)), $(o(312))[o(263)](o(330) + f + o(288)), n(s + 1), !1) : l === o(331) && 0 == p[o(323)]()[o(335)] ? ($(o(312))[o(263)](o(330) + f + o(336)), n(s + 1), !1) : ($(o(317))[o(333)]("disabled", o(307)), $(o(317))[o(332)](parseInt(s) + 1 + o(294) + parseInt(i)), void setTimeout(() => {
                        const e = o;
                        if (parseInt(s) + 1 <= parseInt(i)) {
                            const a = $("input[name='includemedia']");
                            var t;
                            if (a.is(e(260)) ? (l === e(331) && g(r, u, p), l === e(278) && (t = $(e(276) + s + e(268)), k(r, u, t))) : b(r, u), n(s + 1), parseInt(s) + 1 >= parseInt(i)) return $(e(317))[e(354)]("disabled"), $(e(317))[e(332)](e(340)), !1
                        }
                    }, 1e3 * parseInt(t)))
                }
            }(0)
    }), $(h(322)).on(h(257), function () {
        const t = h;
        var a = $(t(274)).val();
        $("select[name='opttemplate'] option:selected")[t(342)](function () {
            const e = t;
            a += $(this)[e(279)]() + " "
        }), $(t(274))[t(279)](a)
    }).trigger(h(257)), $(h(254))[h(319)](function (e) {
        const s = h;
        $(s(277)).attr(s(315), s(315)), $(s(277)).val(s(264)), e[s(255)]();
        var t = e[s(347)].action,
            e = new FormData;
        e[s(308)](s(316), s(341)), e[s(308)](s(281), $(s(321))[1][s(328)][0]), $[s(313)]({
            url: t,
            type: "post",
            data: e,
            contentType: !1,
            processData: !1,
            mimeType: "multipart/form-data",
            success: function (e) {
                const t = s,
                    a = JSON.parse(e);
                let n = t(349);
                for (let e = 0; e < a[t(343)][t(335)]; e++) n += "<tr>", n += t(262) + (e + 1) + t(270), n += t(262) + a[t(343)][e].contact + t(270), n += "<td>" + a[t(343)][e][t(297)] + t(270), n += "<td>" + a.response[e].message + t(270), n += t(262) + a.response[e][t(310)] + t(270), n += t(251) + e + t(344), n += t(273) + e + "' id=''></td>", n += t(302);
                n += "</tbody></table></div>", $("#isicsv")[t(332)](n), $(t(277))[t(354)](t(315)), $(t(277)).val(t(351))
            }
        })
    })
});