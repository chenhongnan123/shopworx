import routes from './src/customer-sms-routes';
import store from './src/customer-sms-store';

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
    const routerData = options.router.options.routes
      .find((r) => r.path === '/');
    const customerRoute = routerData.children
      .find((r) => r.path === 'customer');
    customerRoute.children = routes;
    routerData.children = [...routerData.children, customerRoute];
    options.router.addRoutes([routerData]);
    options.store.registerModule('customerSms', store);
    loadLocaleMessages(options.i18n);
  },
};
