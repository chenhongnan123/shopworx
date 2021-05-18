import routes from './src/manual-outbound-routes';
import store from './src/manual-outbound-store';

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
    options.store.registerModule('manual-outbound', store);
    loadLocaleMessages(options.i18n);
  },
};