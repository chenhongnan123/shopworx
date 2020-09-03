import { set } from '@shopworx/services/util/store.helper';
import UserService from '@shopworx/services/api/user.service';
import SiteService from '@shopworx/services/api/site.service';

export default ({
  namespaced: true,
  state: {
    users: [],
    masterSolutions: [],
  },
  mutations: {
    setUsers: set('users'),
    setMasterSolutions: set('masterSolutions'),
  },
  actions: {
    getAllUsers: async ({ commit }) => {
      try {
        const { data } = await UserService.getUsers();
        if (data && data.results) {
          const users = data.results;
          commit('setUsers', users);
        } else {
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

    getMasterSolutions: async ({ commit }) => {
      try {
        const { data } = await SiteService.getMasterSolutions();
        if (data && data.results) {
          const solutions = data.results;
          commit('setMasterSolutions', solutions);
        } else {
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

    resendInvitation: async (_, payload) => {
      try {
        const { data } = await UserService.resendInvitation(payload);
        return data;
      } catch (e) {
        return false;
      }
    },

    updateUser: async ({ dispatch, commit }, payload) => {
      try {
        const { data } = await UserService.updateUser(payload);
        if (data && data.results) {
          commit('helper/setAlert', {
            show: true,
            type: 'success',
            message: 'USER_DELETED',
          }, {
            root: true,
          });
          await dispatch('getAllUsers');
        } else {
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

    updateUserRole: async ({ commit }, { userId, roleId }) => {
      try {
        const { data } = await UserService.updateUserRole(userId, roleId);
        if (data && data.updated) {
          commit('helper/setAlert', {
            show: true,
            type: 'success',
            message: 'ROLE_UPDATED',
          }, {
            root: true,
          });
        } else {
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

    updateRole: async ({ commit }, payload) => {
      try {
        const { data } = await UserService.updateRole(payload);
        if (data && data.results) {
          commit('helper/setAlert', {
            show: true,
            type: 'success',
            message: 'ROLE_UPDATED',
          }, {
            root: true,
          });
        } else {
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
});
