/* Perfume Shop Admin: themed alerts (SweetAlert2) */

function swalClasses(overrides) {
  return Object.assign(
    {
      popup: "swal-popup",
      title: "swal-title",
      htmlContainer: "swal-text",
      actions: "swal-actions",
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-ghost",
      denyButton: "btn btn-danger",
    },
    overrides || {},
  );
}

const swalBase = Swal.mixin({
  buttonsStyling: false, // our own .btn styles are used instead
  heightAuto: false, // fixes the white area at the bottom of the page
  scrollbarPadding: false, // stops the page from shifting sideways
  customClass: swalClasses(),
});

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  buttonsStyling: false,
  customClass: swalClasses(),
  didOpen: function (el) {
    el.addEventListener("mouseenter", Swal.stopTimer);
    el.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function showError(text, title = "Oops...") {
  return swalBase.fire({ icon: "error", title, text, confirmButtonText: "OK" });
}

function showWarning(text, title = "Warning") {
  return swalBase.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: "OK",
  });
}

function showSuccess(title, text = "") {
  return swalBase.fire({
    icon: "success",
    title,
    text,
    timer: 1800,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

function showToast(title, icon = "success") {
  return toast.fire({ icon, title });
}

/** Asks the user to confirm. Resolves to true (confirmed) or false (cancelled). */
function confirmAction(options) {
  const {
    title,
    text = "",
    confirmText = "Yes",
    cancelText = "Cancel",
    icon = "question",
    danger = false,
  } = options;

  return swalBase
    .fire({
      icon,
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      focusCancel: danger,
      customClass: swalClasses(
        danger ? { confirmButton: "btn btn-danger" } : {},
      ),
    })
    .then((result) => result.isConfirmed);
}

/** Picks the message sent by the server, or a fallback. */
function getErrorMessage(err, fallback = "Something went wrong!") {
  return (
    (err && err.response && err.response.data && err.response.data.message) ||
    fallback
  );
}
