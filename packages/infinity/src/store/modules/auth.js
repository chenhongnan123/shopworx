import ApiService from '@shopworx/services/api/api.service';
import AuthService from '@shopworx/services/api/auth.service';
import SessionService from '@shopworx/services/util/session.service';
import { set } from '@shopworx/services/util/store.helper';
import { onLogin, onLogout } from '../../infinityLoader';

export default ({
  state: {
    loginType: 'INFINITY',
    sessionId: null,
  },
  mutations: {
    setSessionId: set('sessionId'),
  },
  actions: {
    initAuth: async ({ state, commit }) => {
      const { loginType } = state;
      const sessionId = SessionService.getSession();
      commit('setSessionId', sessionId);
      ApiService.setLoginTypeHeader(loginType);
      ApiService.setSessionHeader(sessionId);
    },

    authenticate: async ({
      state,
      commit,
      dispatch,
      rootGetters,
    }, payload) => {
      try {
        const { loginType } = state;
        const isWebView = rootGetters['helper/isWebView'];
        ApiService.setLoginTypeHeader(loginType);
        const { data } = await AuthService.authenticate(payload);
        if (data && data.sessionId) {
          commit('setSessionId', data.sessionId);
          SessionService.setSession(data.sessionId);
          ApiService.setSessionHeader(data.sessionId);
          const success = await dispatch('user/getMe', null, { root: true });
          if (success) {
            if (isWebView) {
              onLogin(data.sessionId);
            }
            return true;
          }
          commit('setSessionId', null);
          SessionService.removeSession();
          ApiService.removeHeader();
          onLogin(null);
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

    authenticateWithOtp: async ({
      state,
      commit,
      dispatch,
      rootGetters,
    }, payload) => {
      try {
        const { loginType } = state;
        const isWebView = rootGetters['helper/isWebView'];
        ApiService.setLoginTypeHeader(loginType);
        const { data } = await AuthService.authenticateWithOtp(payload);
        if (data && data.sessionId) {
          commit('setSessionId', data.sessionId);
          SessionService.setSession(data.sessionId);
          ApiService.setSessionHeader(data.sessionId);
          const success = await dispatch('user/getMe', null, { root: true });
          if (success) {
            if (isWebView) {
              onLogin(data.sessionId);
            }
            return true;
          }
          commit('setSessionId', null);
          SessionService.removeSession();
          ApiService.removeHeader();
          onLogin(null);
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

    logoutUser: async ({ commit, rootState, rootGetters }) => {
      try {
        const isWebView = rootGetters['helper/isWebView'];
        const { data } = await AuthService.logout();
        if (data && data.results) {
          const { storageLocation } = rootState.webApp;
          SessionService.removeSession();
          commit('setSessionId', null);
          commit('user/setMe', null, { root: true });
          commit('user/setMySolutions', [], { root: true });
          commit('webApp/resetConfig', null, { root: true });
          Object.keys(storageLocation).forEach((loc) => {
            localStorage.removeItem(storageLocation[loc]);
          });
          if (isWebView) {
            onLogout();
          }
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
