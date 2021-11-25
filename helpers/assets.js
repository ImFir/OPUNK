const assetSource = function (request) {
  let pathSource = "/views/assets/vendor/";
  const req =
    request.substring(0, 3) !== "mod" ? request : request.substring(3);

  switch (req) {
    /** Font-awesome */
    case "css_fontawesome":
      pathSource += "font-awesome/css/all.min.css";
      break;
    case "js_fontawesome":
      pathSource += "font-awesome/js/all.min.js";
      break;

    /** Template Socoalv */
    case "css_socialv":
      pathSource += "socialv/css/socialv.css";
      break;
    case "css_socialv_lib":
      pathSource += "socialv/css/libs.min.css";
      break;
    case "js_socialv_lib":
      pathSource += "socialv/js/libs.min.js";
      break;
    case "js_socialv_app":
      pathSource += "socialv/js/app.js";
      break;

    /** Bootstrap */
    case "css_bootstrap":
      pathSource += "bootstrap/css/bootstrap.min.css";
      break;
    case "js_bootstrap":
      pathSource += "bootstrap/js/bootstrap.min.js";
      break;
    case "js_bootstrap_bundle":
      pathSource += "bootstrap/js/bootstrap.bundle.min.js";
      break;

    /** DataTables */
    case "css_data-tables-jquery":
      pathSource += "data-tables/css/jquery.dataTables.min.css";
      break;
    case "css_data-tables-bootstrap5":
      pathSource += "data-tables/css/dataTables.bootstrap5.min.css";
      break;
    case "js_data-tables-jquery":
      pathSource += "data-tables/js/jquery.dataTables.min.js";
      break;
    case "js_data-tables-bootstrap5":
      pathSource += "data-tables/js/dataTables.bootstrap5.min.js";
      break;

    /** Select2 */
    case "css_select2":
      pathSource += "select2/css/select2.min.css";
      break;
    case "js_select2":
      pathSource += "select2/js/select2.min.js";
      break;

    /** jquery-csv */
    case "js_jquery-csv":
      pathSource += "jquery-csv/jquery.csv.min.js";
      break;

    /** jquery-csv */
    case "js_socket.io":
      pathSource += "socket.io/socket.io.min.js";
      break;

    /** jquery-csv */
    default:
      pathSource = "/views/app_modules/" + req + ".html";
      break;
  }

  return pathSource;
};

module.exports = {
  assetSource,
};
