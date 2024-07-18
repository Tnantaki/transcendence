// Button - Hide & Visible Password
function togglePassword(inputPassword) {
  console.log("test: ", inputPassword);
  const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  inputPassword.setAttribute('type', type);
}

window.togglePassword = togglePassword;