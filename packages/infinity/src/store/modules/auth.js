import ApiService from '@shopworx/services/api/api.service';
import AuthService from '@shopworx/services/api/auth.service';
import SessionService from '@shopworx/services/util/session.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    sessionId: null,
  },
  mutations: {
    setSessionId: set('sessionId'),
  },
  actions: {
    initAuth: async ({ commit }) => {
      const sessionId = SessionService.getSession();
      commit('setSessionId', sessionId);
      ApiService.setHeader(sessionId);
    },

    authenticate: async ({ commit, dispatch }, payload) => {
      try {
        const { data } = await AuthService.authenticate(payload);
        if (data && data.sessionId) {
          commit('setSessionId', data.sessionId);
          SessionService.setSession(data.sessionId);
          ApiService.setHeader(data.sessionId);
          const success = await dispatch('user/getMe', null, { root: true });
          if (success) {
            return true;
          }
        } else if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    authenticateWithOtp: async ({ commit, dispatch }, payload) => {
      try {
        const { data } = await AuthService.authenticateWithOtp(payload);
        if (data && data.sessionId) {
          commit('setSessionId', data.sessionId);
          SessionService.setSession(data.sessionId);
          ApiService.setHeader(data.sessionId);
          const success = await dispatch('user/getMe', null, { root: true });
          if (success) {
            return true;
          }
        } else if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    logoutUser: async ({ commit }) => {
      try {
        const { data } = await AuthService.logout();
        if (data && data.results) {
          SessionService.removeSession();
          commit('setSessionId', null);
          commit('user/setMe', null, { root: true });
          commit('user/setMySolutions', [], { root: true });
        } else if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },

    generateOtp: async ({ commit }, payload) => {
      try {
        const { data } = await AuthService.generateOtp(payload);
        if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },

    resetPassword: async ({ commit }, payload) => {
      try {
        const { data } = await AuthService.resetPassword(payload);
        if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },
  },
  getters: {
    isLoggedIn: ({ sessionId }) => !!sessionId,
  },
});
