import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    version: process.env.VUE_APP_VERSION || '0',
    alert: {
      show: false,
      type: null,
      message: null,
      options: {},
    },
    isSessionValid: true,
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
    originLoading: false,
  },
  mutations: {
    setAlert: set('alert'),
    setIsSessionValid: set('isSessionValid'),
    setIsDark: set('isDark'),
    toggleIsDark: toggle('isDark'),
    setExtendedHeader: set('extendedHeader'),
    setOriginLoading: toggle('originLoading'),
    setInsightsDrawer: set('insightsDrawer'),
    toggleInsightsDrawer: toggle('insightsDrawer'),
  },
});
