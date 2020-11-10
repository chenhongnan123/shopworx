import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    version: process.env.VUE_APP_VERSION || '0',
    alert: {
      show: false,
      type: null,
      message: null,
    },
    isSessionValid: true,
    isServerError: false,
    serverError: null,
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
    insightsDrawer: false,
    extendedHeader: false,
    infinityLoading: false,
  },
  mutations: {
    setAlert: set('alert'),
    setIsSessionValid: set('isSessionValid'),
    setIsServerError: set('isServerError'),
    setServerError: set('serverError'),
    setIsDark: set('isDark'),
    toggleIsDark: toggle('isDark'),
    setExtendedHeader: set('extendedHeader'),
    setInfinityLoading: toggle('infinityLoading'),
    setInsightsDrawer: set('insightsDrawer'),
    toggleInsightsDrawer: toggle('insightsDrawer'),
  },
});
