import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    version: process.env.VUE_APP_VERSION || '0',
    alert: {
      show: false,
      type: null,
      message: null,
    },
    userAgent: navigator.userAgent,
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
    isFullscreen: false,
    dashboardLoading: false,
    configDrawer: false,
    showHeaderButtons: true,
  },
  mutations: {
    setAlert: set('alert'),
    setIsSessionValid: set('isSessionValid'),
    setIsDark: set('isDark'),
    toggleIsDark: toggle('isDark'),
    setIsFullscreen: set('isFullscreen'),
    setConfigDrawer: set('configDrawer'),
    toggleConfigDrawer: toggle('configDrawer'),
    setDashboardLoading: toggle('dashboardLoading'),
    setShowHeaderButtons: set('showHeaderButtons'),
  },
  getters: {
    isTV: ({ userAgent }) => userAgent.includes('wv'),
  },
});
