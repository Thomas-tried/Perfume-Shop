console.log("Perfumes frontend javascript file");

$(function () {
  const $form = $("#perfume-form");
  const $newBtn = $("#new-perfume-btn");

  $newBtn.on("click", () => {
    $form.slideDown(300);
    $newBtn.prop("hidden", true);
    $("html, body").animate({ scrollTop: $form.offset().top - 90 }, 300);
  });

  $("#cancel-btn").on("click", () => {
    $form.slideUp(200);
    $newBtn.prop("hidden", false);
    resetPreviews();
    $form[0].reset();
  });

  $(".product-status-select").on("change", async function () {
    const $select = $(this);
    const id = $select.attr("data-id");
    const previous = $select.attr("data-status");
    const productStatus = $select.val();

    try {
      const response = await axios.post(`/admin/product/${id}`, {
        productStatus: productStatus,
      });

      if (response.data.data) {
        $select.attr("data-status", productStatus);
        showToast("Status updated");
      } else throw new Error("Update failed");
    } catch (err) {
      console.log(err);
      $select.val(previous);
      showError("Perfume update failed!", "Update failed");
    }
  });
});

function validateForm() {
  const required = [
    ".product-name",
    ".product-brand",
    ".product-price",
    ".product-left-count",
    ".product-volume",
  ];

  const hasEmpty = required.some((selector) => {
    return String($(selector).val()).trim() === "";
  });

  if (hasEmpty) {
    showWarning("Please insert all required details!", "Missing information");
    return false;
  }

  return true;
}

function resetPreviews() {
  $(".upload-box").removeClass("has-image");
  $(".upload-box img").attr("src", "").prop("hidden", true);
}

function previewFileHandler(input, order) {
  const file = input.files && input.files[0];
  if (!file) return;

  const validImageType = ["image/jpg", "image/jpeg", "image/png"];

  if (!validImageType.includes(file.type)) {
    input.value = "";
    showWarning("Please insert only png, jpg, jpeg!", "Invalid file type");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    $(`#image-section-${order}`).attr("src", reader.result).prop("hidden", false);
    $(input).closest(".upload-box").addClass("has-image");
  };
  reader.readAsDataURL(file);
}
