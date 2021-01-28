import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import theme from '@shopworx/assets/theme';
import icons from '@shopworx/assets/icons';

Vue.use(Vuetify);

export default new Vuetify({
  rtl: false,
  theme,
  icons,
});
