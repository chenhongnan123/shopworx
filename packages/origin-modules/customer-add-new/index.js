import 'ag-grid-enterprise';
import routes from './src/customer-add-new-routes';
import store from './src/customer-add-new-store';

function loadLocaleMessages(i18nInstance) {
  const locales = require.context('./src/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      i18nInstance.mergeLocaleMessage(locale, locales(key));
    }
  });
}

export default {
  install(Vue, options) {
    options.router.addRoutes(routes);
    options.store.registerModule('newCustomer', store);
    loadLocaleMessages(options.i18n);
  },
};
