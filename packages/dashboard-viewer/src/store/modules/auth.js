import ApiService from '@shopworx/services/api/api.service';
import AuthService from '@shopworx/services/api/auth.service';
import SessionService from '@shopworx/services/util/session.service';
import { set } from '@shopworx/services/util/store.helper';

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

    authenticate: async ({ state, commit, dispatch }, payload) => {
      try {
        const { loginType } = state;
        ApiService.setLoginTypeHeader(loginType);
        const { data } = await AuthService.authenticate(payload);
        if (data && data.sessionId) {
          commit('setSessionId', data.sessionId);
          SessionService.setSession(data.sessionId);
          ApiService.setSessionHeader(data.sessionId);
          const success = await dispatch('user/getMe', null, { root: true });
          if (success) {
            return true;
          }
          commit('setSessionId', null);
          SessionService.removeSession();
          ApiService.removeHeader();
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
  },
  getters: {
    isLoggedIn: ({ sessionId }) => !!sessionId,
  },
});
