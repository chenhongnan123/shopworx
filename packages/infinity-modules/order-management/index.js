import 'ag-grid-enterprise';
import routes from './src/order-management-routes';
import store from './src/order-management-store';

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
    const routerData = options.router.options.routes.find((r) => r.path === '/');
    routerData.children = routes;
    options.router.addRoutes([routerData]);
    options.store.registerModule('orderManagement', store);
    loadLocaleMessages(options.i18n);
  },
};
