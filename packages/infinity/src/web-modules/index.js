import Vue from 'vue';
import DataOnboarding from '@shopworx/data-onboarding';
import Masters from '@shopworx/masters';

import router from '../router';
import store from '../store';
import i18n from '../i18n';

Vue.use(DataOnboarding, {
  router,
  store,
  i18n,
});

Vue.use(Masters, {
  router,
  store,
  i18n,
});
