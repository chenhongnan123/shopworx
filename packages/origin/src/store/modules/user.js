import UserService from '@shopworx/services/api/user.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    me: null,
    roles: [],
    userState: null,
    activeSite: null,
    mySolutions: [],
    myDevices: [],
    licenses: [],
    isDeviceElemAvailable: false,
  },
  mutations: {
    setMe: set('me'),
    setRoles: set('roles'),
    setUserState: set('userState'),
    setActiveSite: set('activeSite'),
    setMySolutions: set('mySolutions'),
    setMyDevices: set('myDevices'),
    setLicenses: set('licenses'),
    setIsDeviceElemAvailable: set('isDeviceElemAvailable'),
  },
  actions: {
    getMe: async ({ commit }) => {
      try {
        const { data } = await UserService.getMe();
        if (data && data.results) {
          commit('setMe', data.results);
          const siteId = data.results.activeSiteId;
          const userState = data.results.user.userState.toUpperCase().trim();
          commit('setActiveSite', siteId);
          commit('setUserState', userState);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },

    getMySolutions: async ({ commit }) => {
      try {
        const { data } = await UserService.getSolution();
        if (data && data.results) {
          commit('setMySolutions', data.results);
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

    updateActiveSite: async ({ commit }, id) => {
      try {
        const { data } = await UserService.setUserSite(id);
        if (data && data.results) {
          commit('setActiveSite', id);
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

    updateUser: async ({ commit, dispatch }, payload) => {
      try {
        const { data } = await UserService.updateUser(payload);
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
        const me = await dispatch('getMe');
        if (me) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    updatePassword: async ({ commit, dispatch, state }, payload) => {
      try {
        const { data } = await UserService.updatePassword(payload);
        const { me } = state;
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
        const updatedMe = await dispatch('updateUser', {
          userId: me.user.id,
          userState: 'ACTIVE',
        });
        if (updatedMe) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    activateUser: async ({ state, commit }) => {
      const { me } = state;
      let id = null;
      if (me && me.user) {
        ({ id } = me.user);
      }
      try {
        const { data } = await UserService.activateUser(id);
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

    inviteUsers: async (_, payload) => {
      try {
        const { data } = await UserService.inviteUsers(payload);
        return data;
      } catch (e) {
        return false;
      }
    },

    resendInvitation: async (_, payload) => {
      const { data } = await UserService.resendInvitation(payload);
      return data;
    },

    getRoles: async () => {
      try {
        const { data } = await UserService.getRoles();
        if (data && data.results) {
          return data.results;
        }
        return false;
      } catch (e) {
        return false;
      }
    },

    getUserRoles: async ({ commit }) => {
      try {
        const { data } = await UserService.getRoles();
        if (data && data.results) {
          commit('setRoles', data.results);
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
    isAccountUpdated: ({ userState }) => {
      if (userState) {
        return userState !== 'REGISTERED';
      }
      return false;
    },

    isPasswordUpdated: ({ userState }) => {
      if (userState) {
        return userState !== 'REGISTERED' && userState !== 'RESET';
      }
      return false;
    },

    currentCustomer: ({ me }) => {
      if (me && me.customer) {
        return me.customer.description;
      }
      return '';
    },

    fullName: ({ me }) => {
      if (me && me.user) {
        return `${me.user.firstname} ${me.user.lastname}`;
      }
      return '';
    },

    role: ({ me }) => {
      if (me && me.user) {
        return me.role.roleDescription;
      }
      return '';
    },

    roleName: ({ me }) => {
      if (me && me.user) {
        return me.role.roleName;
      }
      return '';
    },

    sites: ({ me }) => {
      if (me && me.site && me.site.length) {
        return me.site.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.siteDescription,
        }));
      }
      return [];
    },

    currentSite: ({ activeSite }, { sites }) => {
      if (sites && sites.length && activeSite) {
        const site = sites.find((s) => s.id === activeSite);
        if (site) {
          return site.description;
        }
      }
      return '';
    },
  },
});
