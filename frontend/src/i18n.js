import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import bem from './locales/bem.json';
import nya from './locales/nya.json';
import to from './locales/to.json';
import loz from './locales/loz.json';
import kqn from './locales/kqn.json';
import lun from './locales/lun.json';
import luv from './locales/luv.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bem: { translation: bem },
      nya: { translation: nya },
      to: { translation: to },
      loz: { translation: loz },
      kqn: { translation: kqn },
      lun: { translation: lun },
      luv: { translation: luv }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
