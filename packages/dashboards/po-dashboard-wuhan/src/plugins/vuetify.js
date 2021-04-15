import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify, {
    theme: {
      primary: '#245692',
      secondary: '#13253C',
      accent: '#283B52',
      error: '#CB352B',
      info: '#6D7885 100%',
      success: '#038F33 100%',
      warning: '#E65100',
      attention: '#FBC02D',
    },
    options: {
      customProperties: true,
    },
    iconfont: 'mdi',
    icons: {
      clock: 'mdi-clock-outline',
    },
});

export default new Vuetify({
});
