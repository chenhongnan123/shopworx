import Vue from 'vue';
import Setup from '@shopworx/setup';

import store from './store';
import router from './router';
import i18n from './i18n';

Vue.use(Setup, {
  router,
  store,
  i18n,
});
