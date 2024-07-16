// const apiURL = "http://localhost:8000";
import { translatePage } from "./i18n.js";

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
  const selectLanguage = event.target.value;
  const savedLanguage  = localStorage.getItem('currentLanguage');

  if (selectLanguage != savedLanguage) {
    console.log("language change");
    translatePage(selectLanguage);
    localStorage.setItem('currentLanguage', selectLanguage);
  }
}

window.togglePassword = togglePassword;
window.toggleLanguage = toggleLanguage;