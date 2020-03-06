import Vue from 'vue';
import DataOnboarding from '@shopworx/data-onboarding';
import Masters from '@shopworx/masters';
import Planning from '@shopworx/planning';

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

Vue.use(Planning, {
  router,
  store,
  i18n,
});
