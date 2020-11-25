import Vue from 'vue';
import MachineDashboard from '@shopworx/machine-dashboard';

import store from './store';
import router from './router';
import i18n from './i18n';

Vue.use(MachineDashboard, {
  router,
  store,
  i18n,
});
