console.log("Perfumes frontend javascript file");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const STATUS_MESSAGES = {
  PROCESS: "Perfume is now on sale",
  PAUSE: "Perfume paused",
  DELETE: "Perfume deleted",
};

$(function () {
  const $form = $("#perfume-form");
  const $newBtn = $("#new-perfume-btn");
  // the browser's own "required" bubble can silently block a hidden file input,
  // so only our alerts are used for validation
  $form.attr("novalidate", "novalidate");
  $form.find('input[type="file"]').removeAttr("required");

  const initialState = $form.serialize();

  const isDirty = () =>
    $form.serialize() !== initialState ||
    $form.find(".upload-box.has-image").length > 0;

  function closeForm() {
    $form.slideUp(200);
    $newBtn.prop("hidden", false);
    resetPreviews();
    $form[0].reset();
  }

  $newBtn.on("click", () => {
    $form.slideDown(300);
    $newBtn.prop("hidden", true);
    $("html, body").animate({ scrollTop: $form.offset().top - 90 }, 300);
  });

  $("#cancel-btn").on("click", async () => {
    if (isDirty()) {
      const confirmed = await confirmAction({
        icon: "warning",
        title: "Discard this perfume?",
        text: "Everything you entered will be lost.",
        confirmText: "Yes, discard",
        cancelText: "Keep editing",
        danger: true,
      });
      if (!confirmed) return;
    }
    closeForm();
  });

  $(".product-status-select").on("change", async function () {
    const $select = $(this);
    const id = $select.attr("data-id");
    const previous = $select.attr("data-status");
    const productStatus = $select.val();

    // the colour changes right away, no question asked
    $select.attr("data-status", productStatus);

    try {
      const response = await axios.post(`/admin/product/${id}`, {
        productStatus: productStatus,
      });

      if (!response.data.data) throw new Error("Update failed");
    } catch (err) {
      // saving failed: put the dropdown back to the saved status
      $select.val(previous).attr("data-status", previous);
      handleRequestError(err, "Update failed");
      return;
    }

    showToast(STATUS_MESSAGES[productStatus] || "Status updated");
  });
});

function validateForm() {
  const fields = [
    [".product-name", "perfume name"],
    [".product-brand", "brand"],
    [".product-price", "price"],
    [".product-left-count", "stock"],
    [".product-volume", "bottle size"],
  ];

  const missing = fields
    .filter(([selector]) => String($(selector).val()).trim() === "")
    .map(([, label]) => label);

  if (missing.length) {
    showWarning(
      `Please fill in: ${missing.join(", ")}.`,
      "Missing information",
    );
    return false;
  }

  if (Number($(".product-price").val()) < 0) {
    showWarning("The price cannot be negative.", "Invalid price");
    return false;
  }

  const stock = Number($(".product-left-count").val());
  if (stock < 0 || !Number.isInteger(stock)) {
    showWarning("Stock must be a whole number, 0 or more.", "Invalid stock");
    return false;
  }

  if (Number($(".product-volume").val()) <= 0) {
    showWarning("The bottle size must be more than 0 ml.", "Invalid size");
    return false;
  }

  const firstImage = $('input[name="productImages"]').get(0).files[0];
  if (!firstImage) {
    showWarning(
      "Please add at least one image of the perfume.",
      "Image required",
    );
    return false;
  }

  return true;
}

function resetPreviews() {
  $(".upload-box").removeClass("has-image");
  $(".upload-box img").attr("src", "").prop("hidden", true);
}

function previewFileHandler(input) {
  const file = input.files && input.files[0];
  if (!file) return;

  // which of the 5 boxes is this? (1 to 5)
  const order = $('input[name="productImages"]').index(input) + 1;

  const validImageType = ["image/jpg", "image/jpeg", "image/png"];

  if (!validImageType.includes(file.type)) {
    input.value = "";
    showWarning("Please insert only png, jpg, jpeg!", "Invalid file type");
    return;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    input.value = "";
    showWarning("Each image must be smaller than 5 MB.", "Image too large");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    $(`#image-section-${order}`)
      .attr("src", reader.result)
      .prop("hidden", false);
    $(input).closest(".upload-box").addClass("has-image");
  };
  reader.readAsDataURL(file);
}
