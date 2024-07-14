// const apiURL = "http://localhost:8000";
import { translatePage } from "./i18n.js";

function togglePassword(inputPassword) {
  console.log("test: ", inputPassword);
  const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  inputPassword.setAttribute('type', type);
}

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