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