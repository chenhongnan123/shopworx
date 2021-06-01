import Vue from 'vue';
import CustomerAddNew from '@shopworx/customer-add-new';
import CustomerAssets from '@shopworx/customer-assets';
import CustomerData from '@shopworx/customer-data';
import CustomerDeployment from '@shopworx/customer-deployment';
import CustomerSms from '@shopworx/customer-sms';
import CustomerSolutions from '@shopworx/customer-solutions';
import CustomerUsers from '@shopworx/customer-users';
import CustomerWebhooks from '@shopworx/customer-webhooks';
import LogManagement from '@shopworx/log-management';
import store from './store';
import router from './router';
import i18n from './i18n';

Vue.use(CustomerAddNew, {
  router,
  store,
  i18n,
});

Vue.use(CustomerAssets, {
  router,
  store,
  i18n,
});

Vue.use(CustomerData, {
  router,
  store,
  i18n,
});

Vue.use(CustomerDeployment, {
  router,
  store,
  i18n,
});

Vue.use(CustomerSms, {
  router,
  store,
  i18n,
});

Vue.use(CustomerSolutions, {
  router,
  store,
  i18n,
});

Vue.use(CustomerUsers, {
  router,
  store,
  i18n,
});

Vue.use(CustomerWebhooks, {
  router,
  store,
  i18n,
});

Vue.use(LogManagement, {
  router,
  store,
  i18n,
});
