import { loadLanguage } from "./i18n.js";

console.log("Viewing main page.");

if (document.readyState !== 'loading') {
  setDisplayLaguage();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    setDisplayLaguage();
  });
}

function setDisplayLaguage() {
  const selectedLanguage = document.getElementsByClassName('language-select')[0];

  if (selectedLanguage) {
    let savedLanguage = localStorage.getItem('currentLanguage');

    if (savedLanguage === 'undefined')
      savedLanguage = 'en';
    selectedLanguage.value = savedLanguage
  }
  loadLanguage();
}