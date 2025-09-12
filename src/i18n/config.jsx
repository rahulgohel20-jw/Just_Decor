import { toAbsoluteUrl } from "@/utils";
import arMessages from "./messages/ar.json";
import enMessages from "./messages/en.json";
import frMessages from "./messages/fr.json";
import zhMessages from "./messages/zh.json";
import hiMessages from "./messages/hi.json";
import guMessages from "./messages/gu.json";

const I18N_MESSAGES = {
  en: enMessages,
  ar: arMessages,
  fr: frMessages,
  zh: zhMessages,
  hi: hiMessages,
  gu: guMessages,
};

const I18N_LANGUAGES = [
  {
    label: "English",
    code: "en",
    direction: "ltr",
    flag: toAbsoluteUrl("/media/flags/united-states.svg"),
    messages: I18N_MESSAGES.en,
  },
  {
    label: "Arabic (Saudi)",
    code: "ar",
    direction: "rtl",
    flag: toAbsoluteUrl("/media/flags/saudi-arabia.svg"),
    messages: I18N_MESSAGES.ar,
  },
  {
    label: "French",
    code: "fr",
    direction: "ltr",
    flag: toAbsoluteUrl("/media/flags/france.svg"),
    messages: I18N_MESSAGES.fr,
  },
  {
    label: "Chinese",
    code: "zh",
    direction: "ltr",
    flag: toAbsoluteUrl("/media/flags/china.svg"),
    messages: I18N_MESSAGES.zh,
  },
  {
    label: "Hindi",
    code: "hi",
    direction: "ltr",
    flag: toAbsoluteUrl("/media/flags/india.svg"),
    messages: I18N_MESSAGES.hi,
  },
  {
    label: "Gujarati",
    code: "gu",
    direction: "ltr",
    flag: toAbsoluteUrl("/media/flags/india.svg"),
    messages: I18N_MESSAGES.gu,
  },
];

const I18N_DEFAULT_LANGUAGE = I18N_LANGUAGES[0];

const I18N_CONFIG_KEY = "i18nConfig";

export {
  I18N_CONFIG_KEY,
  I18N_DEFAULT_LANGUAGE,
  I18N_LANGUAGES,
  I18N_MESSAGES,
};
