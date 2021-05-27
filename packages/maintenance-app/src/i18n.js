import Vue from 'vue';
import VueI18n from 'vue-i18n';
import LocaleService from '@shopworx/services/util/locale.service';

Vue.use(VueI18n);

const loadLocaleMessages = () => {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
};

const detectLanguage = () => {
  const locale = LocaleService.getLocale();
  if (locale) {
    return locale;
  }
  let language = null;
  if (window.navigator.language.split('-')[0] === 'zh') {
    language = 'zhHans';
  } else {
    language = window.navigator.language.split('-')[0] || 'en';
  }
  return language;
};

export default new VueI18n({
  locale: detectLanguage(),
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
});
