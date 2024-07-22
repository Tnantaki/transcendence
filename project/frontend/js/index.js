// Button - Hide & Visible Password
function togglePassword(inputPassword) {
  const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  inputPassword.setAttribute('type', type);
}

// function checkPassword() {
//   const password = document.getElementById("inputPassword");
//   const errMsg = document.getElementById("inputPasswordError");

//   errMsg.style.display = "block";
//   if (password.value.length < 8) {
//     errMsg.innerHTML = "Password must have at least 8 character";
//   } else {
//     errMsg.style.display = "none";
//   }
// }

// function checkConfirmPassword() {
//   const password = document.getElementById("inputPassword");
//   const confirmPassword = document.getElementById("inputConfirmPassword");
//   const errMsg = document.getElementById("inputConfirmPasswordError");

//   errMsg.style.display = "block";
//   if (password.value.length < 8) {
//     errMsg.innerHTML = "Password must have at least 8 character";
//   } else {
//     errMsg.style.display = "none";
//   }
// }
// Password must be the same!

window.togglePassword = togglePassword;
// window.checkPassword = checkPassword;

document.addEventListener("DOMContentLoaded", () => {
  console.log("for input box");
  const inputs = document.querySelectorAll(".input-box");

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1) {
        if (index < inputs.length -1) {
          inputs[index + 1].focus();
        }
      }
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && input.value.length === 0)
        if (index > 0) {
          inputs[index - 1].focus();
        }
    });
  });

});