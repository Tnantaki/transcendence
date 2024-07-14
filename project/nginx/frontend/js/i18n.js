import enLanguage from '../locales/en.json' with {type: "json"};
import thLanguage from '../locales/th.json' with {type: "json"};


// import thLanguage from '../locales/th.json';

// async function loadTranslations() {
//   const enResponse = await fetch('/locales/en.json');
//   translations.en = await enResponse.json();
  
//   const esResponse = await fetch('/locales/es.json');
//   translations.es = await esResponse.json();
// }

export function loadLanguage() {
  let currentLanguage = localStorage.getItem('currentLanguage');

  if (currentLanguage === 'undefined') {
    currentLanguage = 'en';
    localStorage.setItem('currentLanguage', currentLanguage);
  }
  translatePage(currentLanguage);
}

export function translatePage(language) {
  let translations = {};
  if (language === 'th')
    translations = thLanguage;  
  else
    translations = enLanguage;  
  console.log("translage page");
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    console.log("translage");
    const key = element.getAttribute('data-i18n');
    if (element.placeholder !== undefined) {
      element.placeholder = translations[key] || key;
    } else {
      element.textContent = translations[key] || key;
    }
  });
}



// document.addEventListener('DOMContentLoaded', () => {
//   loadTranslations();
//   const savedLanguage = localStorage.getItem('language');
//   if (savedLanguage) {
//     currentLanguage = savedLanguage;
//   }
//   translatePage();
// });
