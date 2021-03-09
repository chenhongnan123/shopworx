import AuthService from '@shopworx/services/api/auth.service';
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
    insightsDrawer: false,
    extendedHeader: false,
    infinityLoading: false,
    isConnected: true,
  },
  mutations: {
    setAlert: set('alert'),
    setIsSessionValid: set('isSessionValid'),
    setIsDark: set('isDark'),
    toggleIsDark: toggle('isDark'),
    setExtendedHeader: set('extendedHeader'),
    setInfinityLoading: toggle('infinityLoading'),
    setInsightsDrawer: set('insightsDrawer'),
    toggleInsightsDrawer: toggle('insightsDrawer'),
    setIsConnected: set('isConnected'),
  },
  actions: {
    getServerTime: async ({ commit, rootState }) => {
      const { sessionId } = rootState.auth;
      try {
        const { data } = await AuthService.getServerTime(sessionId);
        if (data && data.results) {
          return true;
        }
      } catch (e) {
        commit('setIsConnected', false);
        return false;
      }
      commit('setIsConnected', false);
      return false;
    },
  },
  getters: {
    isWebView: ({ userAgent }) => userAgent.includes('wv'),
  },
});
