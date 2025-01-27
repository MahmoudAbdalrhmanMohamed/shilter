import { configure } from "vee-validate";
import { localize } from "@vee-validate/i18n";
import { defineRule } from "vee-validate";
import { required } from "@vee-validate/rules";
defineRule("required", required);

// List of languages with their locale codes
const supportedLanguages = {
  en: () => import("@vee-validate/i18n/dist/locale/en.json"),
  ar: () => import("@vee-validate/i18n/dist/locale/ar.json"),
  zh: () => import("@vee-validate/i18n/dist/locale/zh_CN.json"),
  it: () => import("@vee-validate/i18n/dist/locale/it.json"),
  es: () => import("@vee-validate/i18n/dist/locale/es.json"),
  ru: () => import("@vee-validate/i18n/dist/locale/ru.json"),
  tr: () => import("@vee-validate/i18n/dist/locale/tr.json"),
  fr: () => import("@vee-validate/i18n/dist/locale/fr.json"),
  de: () => import("@vee-validate/i18n/dist/locale/de.json"),
};

export async function initVeeValidate() {
  // Dynamically load all the locale files
  const loadedLocales = await Promise.all(
    Object.entries(supportedLanguages).map(async ([code, loader]) => {
      const locale = await loader();
      return { code, messages: locale };
    }),
  );

  // Generate localized messages
  const localizedMessages = loadedLocales.reduce((acc, { code, messages }) => {
    acc[code] = messages;
    return acc;
  }, {});

  // Configure vee-validate
  configure({
    generateMessage: localize(localizedMessages),
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: true,
    validateOnModelUpdate: true,
  });
}
