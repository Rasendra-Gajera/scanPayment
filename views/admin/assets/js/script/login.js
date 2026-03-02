jQuery(document).ready(function ($) {
  $("#togglePassword").click(function () {
    var passwordInput = $("#password");
    var type = passwordInput.attr("type") === "password" ? "text" : "password";
    passwordInput.attr("type", type);
  });

  $("#kt_sign_in_form").on("submit", function (e) {
    e.preventDefault();
    $(".indicator-progress").css("display", "contents");
    const username = $("#username").val();
    console.log("username: ", username);
    const password = $("#password").val();
    console.log("password: ", password);

    $.ajax({
      type: "POST",
      url: BASE_URL + "admin/login",
      data: {
        username: username,
        password: password,
      },
      success: function (response) {
        $(".indicator-progress").hide();
        if (response.err === 1) {
          Swal.fire({
            background: "#ffffffff",
            text: response.msg,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        } else {
          localStorage.setItem("TOKEN", response.data.token);
          Swal.fire({
            background: "#ffffffff",
            text: response.msg ,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          window.location.href = BASE_URL + "admin/dashboard"; // Directly redirect after setting the token
        }
      },
      error: function (xhr, status, error) {
        $(".indicator-progress").hide();
        Swal.fire({
          background: "#ffffffff",
          text: 'Wrong Credentials, Please try again.',
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      },
    });
  });
});
