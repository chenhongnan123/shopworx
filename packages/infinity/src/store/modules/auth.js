import ApiService from '@shopworx/services/api/api.service';
import AuthService from '@shopworx/services/api/auth.service';
import SessionService from '@shopworx/services/util/session.service';
import { set } from '@shopworx/services/util/store.service';

export default ({
  state: {
    loading: false,
    otpSent: false,
    sessionId: null,
    loginWithOtp: false,
  },
  mutations: {
    setLoading: set('loading'),
    setOtpSent: set('otpSent'),
    setSessionId: set('sessionId'),
    setLoginWithOtp: set('loginWithOtp'),
  },
  actions: {
    initAuth: async ({ commit }) => {
      const sessionId = SessionService.getSession();
      commit('setSessionId', sessionId);
      ApiService.setHeader(sessionId);
    },

    loginWithPassword: async ({ commit, dispatch }, payload) => {
      try {
        commit('setLoading', true);
        const { data } = await AuthService.authenticate(payload);
        if (data && data.sessionId) {
          commit('setSessionId', data.sessionId);
          SessionService.setSession(data.sessionId);
          ApiService.setHeader(data.sessionId);
          const success = await dispatch('user/getMe', null, { root: true });
          if (success) {
            commit('setLoading', false);
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
          commit('setLoading', false);
          return false;
        }
      } catch (e) {
        console.error(e);
        commit('setLoading', false);
        return false;
      }
      commit('setLoading', false);
      return true;
    },

    loginWithOtp: async ({ commit, dispatch }, payload) => {
      try {
        commit('setLoading', true);
        const { data } = await AuthService.authenticateWithOtp(payload);
        if (data && data.sessionId) {
          commit('setSessionId', data.sessionId);
          SessionService.setSession(data.sessionId);
          ApiService.setHeader(data.sessionId);
          const success = await dispatch('user/getMe', null, { root: true });
          if (success) {
            commit('setLoading', false);
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
          commit('setLoading', false);
          return false;
        }
      } catch (e) {
        console.error(e);
        commit('setLoading', false);
        return false;
      }
      commit('setLoading', false);
      return true;
    },

    logoutUser: async ({ commit }) => {
      try {
        commit('setLoading', true);
        const { data } = await AuthService.logout();
        // TODO: update data.result to data.results
        if (data && data.result) {
          SessionService.removeSession();
        } else if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          commit('setLoading', false);
          return false;
        }
      } catch (e) {
        console.error(e);
        commit('setLoading', false);
        return false;
      }
      commit('setLoading', false);
      return true;
    },

    generateOtp: async ({ commit }, payload) => {
      try {
        commit('setLoading', true);
        const { data } = await AuthService.generateOtp(payload);
        if (data && data.results) {
          commit('setOtpSent', true);
          commit('helper/setAlert', {
            show: true,
            type: 'success',
            message: 'OTP_SENT',
          }, {
            root: true,
          });
        } else if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          commit('setLoading', false);
          return false;
        }
      } catch (e) {
        console.error(e);
        commit('setLoading', false);
        return false;
      }
      commit('setLoading', false);
      return true;
    },

    resetPassword: async ({ commit }, payload) => {
      try {
        commit('setLoading', true);
        const { data } = await AuthService.resetPassword(payload);
        if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          commit('setLoading', false);
          return false;
        }
      } catch (e) {
        console.error(e);
        commit('setLoading', false);
        return false;
      }
      commit('setLoading', false);
      return true;
    },
  },
});
