import Vue from 'vue';
import ProductionLog from '@shopworx/production-log';
import DowntimeLog from '@shopworx/downtime-log';
import UserDashboard from '@shopworx/user-dashboard';
import store from './store';
import router from './router';
import i18n from './i18n';

Vue.use(UserDashboard, {
  router,
  store,
  i18n,
});

Vue.use(ProductionLog, {
  router,
  store,
  i18n,
});

Vue.use(DowntimeLog, {
  router,
  store,
  i18n,
});
