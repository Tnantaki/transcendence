import enLanguage from '../locales/en.json' with {type: "json"};
import thLanguage from '../locales/th.json' with {type: "json"};
import frLanguage from '../locales/fr.json' with {type: "json"};

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
