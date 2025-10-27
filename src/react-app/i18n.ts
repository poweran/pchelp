import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './locales/ru.json';
import en from './locales/en.json';
import hy from './locales/hy.json';

const resources = {
  ru: {
    translation: ru,
  },
  en: {
    translation: en,
  },
  hy: {
    translation: hy,
  },
};

i18n
   .use(LanguageDetector)
   .use(initReactI18next)
   .init({
     resources,
     lng: 'hy',
     fallbackLng: 'hy',

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;