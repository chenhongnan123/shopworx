import Vue from 'vue';
import LiveShopfloor from '@shopworx/live-shopfloor';
import MachineDashboard from '@shopworx/machine-dashboard';

import store from './store';
import router from './router';
import i18n from './i18n';

Vue.use(LiveShopfloor, {
  router,
  store,
  i18n,
});

Vue.use(MachineDashboard, {
  router,
  store,
  i18n,
});
