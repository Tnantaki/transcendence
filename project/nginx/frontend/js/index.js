const apiURL = "http://localhost:8000";

function togglePassword(inputPassword) {
  console.log("test: ", inputPassword);
  const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  inputPassword.setAttribute('type', type);
}
