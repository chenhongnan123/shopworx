import { set } from '@shopworx/services/util/store.helper';
import UserService from '@shopworx/services/api/user.service';

export default ({
  namespaced: true,
  state: {
    users: [],
  },
  mutations: {
    setUsers: set('users'),
  },
  actions: {
    getAllUsers: async ({ commit }) => {
      try {
        const { data } = await UserService.getUsers();
        if (data && data.results) {
          const users = data.results.map((user) => user.emgUser);
          commit('setUsers', users);
        } else {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
        }
      } catch (e) {
        console.error(e);
      }
    },

    resendInvitation: async (_, payload) => {
      try {
        const { data } = await UserService.resendInvitation(payload);
        return data;
      } catch (e) {
        console.error(e);
      }
      return false;
    },
  },
});
