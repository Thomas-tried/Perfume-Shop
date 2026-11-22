console.log("Users frontend javascript file");

$(function () {
  $(".member-status").on("change", function () {
    const $select = $(this);
    const id = $select.attr("data-id");
    const previous = $select.attr("data-status");
    const memberStatus = $select.val();

    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        if (response.data.data) {
          $select.attr("data-status", memberStatus);
          showToast("Status updated");
        } else throw new Error("Update failed");
      })
      .catch((err) => {
        console.log(err);
        $select.val(previous);
        showError("User update failed!", "Update failed");
      });
  });
});
