import Vue from 'vue';
import 'ag-grid-enterprise';

import './registerServiceWorker';

import App from './App.vue';

import router from './router';
import store from './store';
import i18n from './i18n';

import './web-modules';

import vuetify from './plugins/vuetify';
import './plugins/scrollbar';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
