console.log("Signup frontend javascript file");

$(function () {
  $(".member-image").on("change", function () {
    const file = this.files && this.files[0];
    if (!file) return;

    const validImageType = ["image/jpg", "image/jpeg", "image/png"];

    if (!validImageType.includes(file.type)) {
      this.value = "";
      showWarning("Please insert only png, jpg, jpeg!", "Invalid file type");
      return;
    }

    $(".upload-img-frame")
      .attr("src", URL.createObjectURL(file))
      .prop("hidden", false);
    $(".avatar-plus").hide();
  });
});

function validateSignupForm() {
  const memberNick = $(".member-nick").val().trim(),
    memberPhone = $(".member-phone").val().trim(),
    memberPassword = $(".member-password").val(),
    confirmPassword = $(".confirm-password").val();

  if (
    memberNick === "" ||
    memberPhone === "" ||
    memberPassword === "" ||
    confirmPassword === ""
  ) {
    showWarning("Please insert all required inputs", "Missing information");
    return false;
  }

  if (memberPassword !== confirmPassword) {
    showError("Password differs, please check again!", "Password mismatch");
    return false;
  }

  const memberImage = $(".member-image").get(0).files[0];
  if (!memberImage) {
    showWarning("Please insert the shop image!", "Image required");
    return false;
  }

  return true;
}
