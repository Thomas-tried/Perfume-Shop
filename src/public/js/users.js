console.log("Users frontend javascript file");

const USER_STATUS_MESSAGES = {
  ACTIVE: "User is active again",
  BLOCK: "User blocked",
  DELETE: "User deleted",
};

$(function () {
  $(".member-status").on("change", async function () {
    const $select = $(this);
    const id = $select.attr("data-id");
    const previous = $select.attr("data-status");
    const memberStatus = $select.val();

    // the colour changes right away, no question asked
    $select.attr("data-status", memberStatus);

    try {
      const response = await axios.post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      });

      if (!response.data.data) throw new Error("Update failed");
    } catch (err) {
      // saving failed: put the dropdown back to the saved status
      $select.val(previous).attr("data-status", previous);
      handleRequestError(err, "Update failed");
      return;
    }

    showToast(USER_STATUS_MESSAGES[memberStatus] || "Status updated");
  });
});
