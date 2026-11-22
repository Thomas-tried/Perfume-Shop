type AlertIcon = "error" | "success" | "warning" | "info";

const DEFAULT_TITLES: Record<AlertIcon, string> = {
  error: "Oops...",
  success: "Done",
  warning: "Warning",
  info: "Notice",
};

// JSON-encode a value so it is safe to place inside an inline <script>
const toScriptValue = (value: string) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

/**
 * Returns a small HTML page that shows a SweetAlert2 popup
 * and then redirects the browser to `redirectUrl`.
 * Used instead of the plain browser alert().
 */
export function alertRedirect(
  message: string,
  redirectUrl: string,
  icon: AlertIcon = "error",
  title?: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Perfume Shop Admin</title>
  <link rel="stylesheet" href="/css/main.css" />
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.14.5/dist/sweetalert2.all.min.js"></script>
</head>
<body class="alert-page">
  <script>
    Swal.fire({
      icon: ${toScriptValue(icon)},
      title: ${toScriptValue(title ?? DEFAULT_TITLES[icon])},
      text: ${toScriptValue(message)},
      confirmButtonColor: "#16130f",
      heightAuto: false,
      scrollbarPadding: false,
    }).then(function () {
      window.location.replace(${toScriptValue(redirectUrl)});
    });
  </script>
</body>
</html>`;
}
