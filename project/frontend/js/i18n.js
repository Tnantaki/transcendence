import enLanguage from '../locales/en.js'
import thLanguage from '../locales/th.js'
import frLanguage from '../locales/fr.js'

export function setSelectLanguage() {
  const savedLanguage = localStorage.getItem('currentLanguage') ?? 'en';
  const selectLanguage = document.getElementsByClassName('language-select')[0];

  if (selectLanguage) {
    selectLanguage.addEventListener('change', (event) => {
      const savedLanguage  = localStorage.getItem('currentLanguage');
      const chooseLanguage = event.target.value;

      if (chooseLanguage != savedLanguage) {
        translatePage(chooseLanguage);
      }
    });
    selectLanguage.value = savedLanguage;
  }
  translatePage(savedLanguage);
}

export function translatePage(language) {
  let translations = {};

  if (language === 'th')
    translations = thLanguage;  
  else if (language === 'fr')
    translations = frLanguage;  
  else
    translations = enLanguage;  
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (element.placeholder !== undefined) {
      element.placeholder = translations[key] || key;
    } else {
      element.textContent = translations[key] || key;
    }
  });
  localStorage.setItem('currentLanguage', language);
}

export function getTranslateLanguage(language, key) {
  if (language === 'th')
    return thLanguage[key]
  else if (language === 'fr')
    return frLanguage[key]
  else
    return enLanguage[key]
} 