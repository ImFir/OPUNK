const phoneNumberFormatter = function (number) {
  // 1. Menghilangkan karakter selain angka
  let formatted = number.replace(/\D/g, "");

  // 2. Menghilangkan angka 0 di depan (prefix)
  //    Kemudian diganti dengan 62
  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.substr(1);
  }

  // 3. Menambahkan angka 0 di depan (prefix) jika angka awalnya 8,
  //    ini biasa terjadi ketika melakukan save pada excel ke format csv, angka 0 nya hilang.
  if (formatted.startsWith("8")) {
    formatted = "62" + formatted;
  }

  if (!formatted.endsWith("@c.us")) {
    formatted += "@c.us";
  }

  return formatted;
};

module.exports = {
  phoneNumberFormatter,
};