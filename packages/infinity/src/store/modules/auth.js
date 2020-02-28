import ApiService from '@shopworx/services/api/api.service';
import AuthService from '@shopworx/services/api/auth.service';
import SessionService from '@shopworx/services/util/session.service';
import { set } from '@shopworx/services/util/store.service';

export default ({
  state: {
    sessionId: null,
    loginWithOtp: null,
  },
  mutations: {
    setSessionId: set('sessionId'),
    setLoginWithOtp: set('loginWithOtp'),
  },
  actions: {
    initAuth: async ({ commit }) => {
      const sessionId = SessionService.getSession();
      commit('setSessionId', sessionId);
      ApiService.setHeader(sessionId);
    },

    loginWithPassword: async ({ commit }, payload) => {
      const { data, status } = await AuthService.authenticate(payload);
      if (status === 200) {
        commit('setSessionId', data.sessionId);
        SessionService.setSession(data.sessionId);
        ApiService.setHeader(data.sessionId);
      }
      return data;
    },

    loginWithOtp: async ({ commit }, payload) => {
      const { data, status } = await AuthService.authenticateWithOtp(payload);
      if (status === 200) {
        commit('setSessionId', data.sessionId);
        SessionService.setSession(data.sessionId);
        ApiService.setHeader(data.sessionId);
      }
      return data;
    },

    logoutUser: async () => {
      const { data, status } = await AuthService.logout();
      if (status === 200) {
        SessionService.removeSession();
      }
      return data;
    },

    generateOtp: async (_, payload) => {
      const { data } = await AuthService.generateOtp(payload);
      return data;
    },

    resetPassword: async (_, payload) => {
      const { data } = await AuthService.resetPassword(payload);
      return data;
    },
  },
});
