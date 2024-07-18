// if (document.readyState !== 'loading') {
//   setATagDefault();
// } else {
//   document.addEventListener('DOMContentLoaded', () => {
//     setATagDefault();
//   });
// }

// console.log(linkTags.length);
// for (const link of linkTags) {
//   console.log(link);
// }
// linkTag.forEach(e => {
//   console.log(e);
// });

// Button - Hide & Visible Password
function togglePassword(inputPassword) {
  console.log("test: ", inputPassword);
  const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  inputPassword.setAttribute('type', type);
}

// Button - Switch Language
function toggleLanguage(event) {

}

window.togglePassword = togglePassword;
window.toggleLanguage = toggleLanguage;