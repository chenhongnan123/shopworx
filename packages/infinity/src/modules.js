import Vue from 'vue';
import Setup from '@shopworx/setup';
import Planning from '@shopworx/planning';

import store from './store';
import router from './router';
import i18n from './i18n';

Vue.use(Setup, {
  router,
  store,
  i18n,
});

Vue.use(Planning, {
  router,
  store,
  i18n,
});
