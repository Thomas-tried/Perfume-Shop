console.log("Basic frontend javascript file");

// If alerts.js could not be loaded, fall back to the plain browser popups,
// so a missing file never makes the site fail silently.
if (typeof swalBase === "undefined") {
  console.warn(
    "alerts.js is not loaded! Check that src/public/js/alerts.js exists. Using plain browser popups instead.",
  );
  const plain = (title, text) =>
    window.alert(text ? `${title}\n\n${text}` : title);

  window.showError = (text, title = "Oops...") => plain(title, text);
  window.showWarning = (text, title = "Warning") => plain(title, text);
  window.showSuccess = (title, text = "") => plain(title, text);
  window.showToast = (title) => console.log(title);
  window.confirmAction = ({ title, text = "" }) =>
    Promise.resolve(window.confirm(text ? `${title}\n\n${text}` : title));
  window.getErrorMessage = (err, fallback = "Something went wrong!") =>
    (err && err.response && err.response.data && err.response.data.message) ||
    fallback;
}

// hide the preloader when the page is ready
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
  }
});

// A background request answered 401 = the login session ended
if (typeof axios !== "undefined") {
  axios.interceptors.response.use(
    (response) => response,
    (err) => {
      if (err.response && err.response.status === 401) {
        if (typeof swalBase === "undefined") {
          window.location.href = "/admin/login";
          return Promise.reject(err);
        }
        swalBase
          .fire({
            icon: "warning",
            title: "Session expired",
            text: "Please login again to continue.",
            confirmButtonText: "Login",
            allowOutsideClick: false,
          })
          .then(() => {
            window.location.href = "/admin/login";
          });
      }
      return Promise.reject(err);
    },
  );
}

/** Shows the error of a failed request (the session-expired case is already handled above). */
function handleRequestError(err, title = "Update failed") {
  console.log(err);
  if (err && err.response && err.response.status === 401) return;
  return showError(getErrorMessage(err), title);
}

$(document).on("click", ".logout-link", function (e) {
  e.preventDefault(); // stop the link from opening right away
  const url = $(this).attr("href");

  // popup file (alerts.js) not loaded: just logout
  if (typeof confirmAction !== "function") {
    window.location.href = url;
    return;
  }

  confirmAction({
    icon: "question",
    title: "Logout",
    text: "Do you really want to logout?",
    confirmText: "Yes, logout",
    danger: true,
  }).then((confirmed) => {
    if (confirmed) window.location.href = url;
  });
});

// day / night switch
$(document).on("click", "#theme-toggle", function () {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

  root.classList.add("theme-anim"); // fade the colours
  root.setAttribute("data-theme", next);
  setTimeout(() => root.classList.remove("theme-anim"), 400);

  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});
