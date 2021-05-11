import Vue from 'vue';
import LiveShopfloor from '@shopworx/live-shopfloor';
import MachineDashboard from '@shopworx/machine-dashboard';
import UtilityDashboard from '@shopworx/utility-dashboard';
import ProcessDashbaord from '@shopworx/process-dashboard';
import PoProductionDashboard from '@shopworx/po-production-dashboard';

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

Vue.use(UtilityDashboard, {
  router,
  store,
  i18n,
});

Vue.use(ProcessDashbaord, {
  router,
  store,
  i18n,
});

Vue.use(PoProductionDashboard, {
  router,
  store,
  i18n,
});
