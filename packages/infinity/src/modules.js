import Vue from 'vue';
import ParameterConfiguration from '@shopworx/parameter-configuration';
import MaterialManagement from '@shopworx/material-management';
import store from './store';
import router from './router';
import i18n from './i18n';

Vue.use(ParameterConfiguration, {
  router,
  store,
  i18n,
});

Vue.use(MaterialManagement, {
  router,
  store,
  i18n,
});
