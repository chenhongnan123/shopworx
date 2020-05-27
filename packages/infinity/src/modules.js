import Vue from 'vue';
import Admin from '@shopworx/admin';
import MachineDashboard from '@shopworx/machine-dashboard';
import Masters from '@shopworx/masters';
import Planning from '@shopworx/planning';
import ProductionLog from '@shopworx/production-log';
import RoadmapManagement from '@shopworx/roadmap-management';
import ProductManagement from '@shopworx/product-management';
import ReportViewer from '@shopworx/report-viewer';
import Setup from '@shopworx/setup';
import UserDashboard from '@shopworx/user-dashboard';
import OrderManagement from '@shopworx/order-management';
import store from './store';
import router from './router';
import i18n from './i18n';

Vue.use(Admin, {
  router,
  store,
  i18n,
});

Vue.use(RoadmapManagement, {
  router,
  store,
  i18n,
});

Vue.use(ProductManagement, {
  router,
  store,
  i18n,
});

Vue.use(MachineDashboard, {
  router,
  store,
  i18n,
});

Vue.use(OrderManagement, {
  router,
  store,
  i18n,
});

Vue.use(Masters, {
  router,
  store,
  i18n,
});

Vue.use(Planning, {
  router,
  store,
  i18n,
});

Vue.use(ProductionLog, {
  router,
  store,
  i18n,
});

Vue.use(ReportViewer, {
  router,
  store,
  i18n,
});

Vue.use(Setup, {
  router,
  store,
  i18n,
});

Vue.use(UserDashboard, {
  router,
  store,
  i18n,
});
