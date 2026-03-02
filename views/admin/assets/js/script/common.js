// Show Change Password Popup
function showForgotPasswordPopup() {
  $(".popup-title").html("<h2>Change Password</h2>");
  $("#forgotPasswordPopup").modal("show");
  $("#old_password").val("");
  $("#new_password").val("");
  $("#confirm_password").val("");
}


// Run once DOM is ready
$(document).ready(function () {
  const token = localStorage.getItem("TOKEN");

  // ==========================
  // Check Login on Page Load
  // ==========================
  if (!token) {
    window.location = BASE_URL + "admin";
    return;
  }

  $.ajax({
    type: "GET",
    url: BASE_URL + "admin/login_check",
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
    success: function (response) {
      if (response.status !== 200 && response.err !== 0) {

        window.location = BASE_URL + "admin";
      }
    },
    error: function (response) {
      if (response.responseJSON?.status === 401) {
        localStorage.removeItem("TOKEN");
        window.location = BASE_URL + "admin";
      }
    },
  });

  // ==========================
  // Change Password Handling
  // ==========================
  $("#changePasswordForm").submit(function (e) {
    e.preventDefault();

    const old_password = $("#old_password").val();
    const new_password = $("#new_password").val();
    const confirm_password = $("#confirm_password").val();

    if (old_password && new_password && confirm_password) {
      if (new_password === confirm_password) {
        $.ajax({
          type: "POST",
          url: BASE_URL + "admin/change_password",
          headers: {
            authorization: token ? `Bearer ${token}` : "",
          },
          data: {
            old_password,
            new_password,
            confirm_password,
          },
          success: function (response) {
            const alertOptions = {
              buttonsStyling: false,
              confirmButtonText: "Ok got it",
              customClass: { confirmButton: "btn btn-primary" },
            };

            if (response.err == 1) {
              Swal.fire({
                background: "#ffffffff",
                text: response.msg,
                icon: "error",
                ...alertOptions,
              });
            } else {
              Swal.fire({
                background: "#ffffffff",
                text: response.msg,
                icon: "success",
                ...alertOptions,
              });
              $("#forgotPasswordPopup").modal("hide");
            }
          },
          error: function (xhr, status, error) {
            $(".indicator-progress").hide();
            Swal.fire({
              background: "#ffffffff",
              html: xhr.responseJSON.msg,
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary",
              },
            });
          },
        });
      } else {
        Swal.fire({
          background: "#ffffffff",
          text: "Password and confirm password must be the same",
          icon: "warning",
          buttonsStyling: false,
          confirmButtonText: "Ok got it",
          customClass: { confirmButton: "btn btn-primary" },
        });
      }
    } else {
      Swal.fire({
        background: "#ffffffff",
        text: "Please enter all fields",
        icon: "warning",
        buttonsStyling: false,
        confirmButtonText: "Ok got it",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  });

  // Cancel Change Password Modal
  $("#cancelForgotPassword").click(function () {
    $("#forgotPasswordPopup").modal("hide");
  });

  // ==========================
  // Handle Sign Out
  // ==========================
  $("#sign_out").on("click", function () {
    Swal.fire({
      background: "#ffffffff",
      title: "Confirm Sign Out",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out",
    }).then((result) => {
      if (result.isConfirmed) {
        if (token) {
          $.ajax({
            type: "POST",
            url: BASE_URL + "admin/logout",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { token },
            success: function (response) {
              $(".indicator-progress").hide();

              if (response.err == 1) {
                Swal.fire({
                  background: "#ffffffff",
                  text: response.msg,
                  icon: "error",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: { confirmButton: "btn btn-primary" },
                });
              } else {
                console.log("You have successfully logged out!");
                localStorage.removeItem("TOKEN");
                window.location.href = BASE_URL + "admin";
              }
            },
            error: function (xhr, status, error) {
              $(".indicator-progress").hide();
              console.error("Error:", error);
            },
          });
        } else {
          Swal.fire("Error", "Token not found.", "error");
        }
      }
    });
  });
});
