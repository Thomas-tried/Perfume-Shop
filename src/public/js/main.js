console.log("Basic frontend javascript file");

const swalBase = Swal.mixin({
  heightAuto: false, // fixes the white area at the bottom of the page
  scrollbarPadding: false, // stops the page from shifting sideways
  confirmButtonColor: "#16130f",
});

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1800,
  timerProgressBar: true,
});

function showError(text, title = "Oops...") {
  return swalBase.fire({ icon: "error", title, text });
}

function showWarning(text, title = "Warning") {
  return swalBase.fire({ icon: "warning", title, text });
}

function showSuccess(title, text = "") {
  return swalBase.fire({
    icon: "success",
    title,
    text,
    timer: 1500,
    showConfirmButton: false,
  });
}

function showToast(title, icon = "success") {
  return toast.fire({ icon, title });
}

// hide the preloader when the page is ready
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
  }
});

$(document).on("click", ".logout-link", function (e) {
  e.preventDefault(); // stop the link from opening right away
  const url = $(this).attr("href");

  swalBase
    .fire({
      icon: "question",
      title: "Logout",
      text: "Do you really want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b4443a",
    })
    .then((result) => {
      if (result.isConfirmed) {
        window.location.href = url;
      }
    });
});
