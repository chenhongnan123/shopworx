import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    alert: {
      show: false,
      type: null,
      message: null,
    },
    locales: [
      {
        text: 'English',
        value: 'en',
      },
      {
        text: 'हिन्दी',
        value: 'hi',
      },
      {
        text: '中文',
        value: 'zhHans',
      },
      {
        text: 'ไทย',
        value: 'th',
      },
      {
        text: 'Deutsche',
        value: 'de',
      },
    ],
    isDark: null,
  },
  mutations: {
    setAlert: set('alert'),
    setIsDark: set('isDark'),
    toggleIsDark: toggle('isDark'),
  },
});
