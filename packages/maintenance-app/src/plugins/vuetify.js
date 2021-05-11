import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import theme from '@shopworx/assets/theme';
import icons from '@shopworx/assets/icons';
import i18n from '@/i18n';

Vue.use(Vuetify);

export default new Vuetify({
  rtl: false,
  theme,
  icons,
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
});
