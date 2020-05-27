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
  },
});
