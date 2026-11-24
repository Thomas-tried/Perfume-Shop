type AlertIcon = "error" | "success" | "warning" | "info";

const DEFAULT_TITLES: Record<AlertIcon, string> = {
  error: "Oops...",
  success: "Done",
  warning: "Warning",
  info: "Notice",
};

const toScriptValue = (value: string) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export function alertRedirect(
  message: string,
  redirectUrl: string,
  icon: AlertIcon = "error",
  title?: string,
): string {
  const autoClose = icon === "success";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script>
    (function () {
      var theme = "light";
      try {
        theme =
          localStorage.getItem("theme") ||
          (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      } catch (e) {}
      document.documentElement.setAttribute("data-theme", theme);
    })();
  </script>
  <title>Perfume Shop Admin</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2316130f'/%3E%3Crect x='25' y='8' width='14' height='10' rx='2' fill='%23b08d57'/%3E%3Crect x='29' y='18' width='6' height='6' fill='%23b08d57'/%3E%3Crect x='16' y='24' width='32' height='32' rx='5' fill='none' stroke='%23b08d57' stroke-width='3.5'/%3E%3Crect x='24' y='34' width='16' height='12' rx='2' fill='%23b08d57'/%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/main.css" />
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.5/dist/sweetalert2.all.min.js"></script>
  <script src="/js/alerts.js"></script>
</head>
<body class="alert-page">
  <script>
    var go = function () {
      window.location.replace(${toScriptValue(redirectUrl)});
    };
    if (typeof swalBase === "undefined") {
      go();
    } else swalBase.fire({
      icon: ${toScriptValue(icon)},
      title: ${toScriptValue(title ?? DEFAULT_TITLES[icon])},
      text: ${toScriptValue(message)},
      allowOutsideClick: false,
      ${
        autoClose
          ? "timer: 1800, timerProgressBar: true, showConfirmButton: false,"
          : 'confirmButtonText: "OK",'
      }
    }).then(go);
  </script>
</body>
</html>`;
}
