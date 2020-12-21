import Vue from 'vue';
import CustomerDeployment from '@shopworx/customer-deployment';
import store from './store';
import router from './router';
import i18n from './i18n';

Vue.use(CustomerDeployment, {
  router,
  store,
  i18n,
});
