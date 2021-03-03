import 'ag-grid-enterprise';
import routes from './src/calibration-app-routes';
import store from './src/calibration-app-store';

export default {
  install(Vue, options) {
    const routerData = options.router.options.routes.find((r) => r.path === '/');
    routerData.children = routes;
    options.router.addRoutes([routerData]);
    options.store.registerModule('calibrationApp', store);
  },
};
