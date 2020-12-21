import Vue from 'vue';

import './registerServiceWorker';

import App from './App.vue';

import router from './router';
import store from './store';
import i18n from './i18n';

import vuetify from './plugins/vuetify';
import './plugins/perfect-scrollbar';
import './plugins/vee-validate';
import './plugins/highcharts';
import './plugins/portal';

// import './modules';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
