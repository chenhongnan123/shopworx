import UserService from '@shopworx/services/api/user.service';
import { set } from '@shopworx/services/util/store.service';

export default ({
  state: {
    me: null,
    mySolutions: [],
    activeSite: null,
    roles: [],
  },
  mutations: {
    setMe: set('me'),
    setMySolutions: set('mySolutions'),
    setActiveSite: set('activeSite'),
    setRoles: set('roles'),
  },
  actions: {
    getMe: async ({ commit }) => {
      try {
        const { data } = await UserService.getMe();
        if (data && data.results) {
          commit('setMe', data.results);
          commit('setActiveSite', data.results.activeSiteId);
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
        console.error(e);
        return false;
      }
      return true;
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
        console.error(e);
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
        console.error(e);
        return false;
      }
      return true;
    },

    updateUser: async ({ commit }, payload) => {
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
      } catch (e) {
        console.error(e);
        return false;
      }
      return true;
    },

    updatePassword: async ({ commit }, payload) => {
      try {
        const { data } = await UserService.updatePassword(payload);
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
        console.error(e);
        return false;
      }
      return true;
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
        console.error(e);
        return false;
      }
      return true;
    },

    isUsernameAvailable: async ({ commit }, { username }) => {
      try {
        const { data } = await UserService.isUsernameAvailable(username);
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
        console.error(e);
        return false;
      }
      return true;
    },

    inviteUsers: async (_, payload) => {
      try {
        const { data } = await UserService.inviteUsers(payload);
        return data;
      } catch (e) {
        console.error(e);
        return false;
      }
    },

    resendInvitation: async (_, payload) => {
      const { data } = await UserService.resendInvitation(payload);
      return data;
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
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
  getters: {
    isRegistrationComplete: ({ me }) => {
      if (me && me.user.userState) {
        return me.user.userState.toUpperCase().trim() !== 'REGISTERED';
      }
      return null;
    },

    isOnboardingComplete: ({ me, activeSite }) => {
      if (me && me.site && me.site.length) {
        const site = me.site.find((s) => s.id === activeSite);
        return site.onboardingCompleted;
      }
      return null;
    },

    isAdmin: ({ me }) => {
      if (me && me.role.roleType) {
        return me.role.roleType.toUpperCase().trim() === 'ADMINISTRATOR';
      }
      return null;
    },

    fullName: ({ me }) => {
      if (me && me.user) {
        return `${me.user.firstname} ${me.user.lastname.charAt(0)}`;
      }
      return null;
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

    modules: ({ mySolutions }) => {
      const modules = {
        items: [{
          title: 'home',
          icon: '$home',
          to: 'user-dashboard',
        }],
        adminItems: [],
      };
      if (mySolutions && mySolutions.length) {
        mySolutions.forEach((solution) => solution.modules.map((module) => {
          if (module.moduleName.toUpperCase().trim() === 'APPS') {
            module.details.forEach((detail) => {
              modules.items.push({
                title: detail.webAppName,
                icon: detail.iconURL,
                to: detail.webAppLink,
              });
            });
          }
          if (module.moduleName.toUpperCase().trim() === 'REPORTS') {
            modules.items.push({ header: 'reports' });
            module.details.forEach((detail) => {
              modules.items.push({
                title: detail.subModuleName,
                icon: detail.iconUrl,
                group: detail.subModuleName,
                children: detail.reportViews.map((report) => ({
                  title: report.reportDescription,
                  to: 'reports',
                  param: report.reportName,
                  avatarText: report.reportDescription.match(/\b(\w)/g).join(''),
                })),
              });
            });
          }
          if (module.moduleName.toUpperCase().trim() === 'MASTERS') {
            modules.adminItems.push({
              title: module.moduleName,
              icon: `$${module.moduleName}`,
              to: module.moduleLink,
            });
          }
          if (module.moduleName.toUpperCase().trim() === 'ADMIN') {
            modules.adminItems.push({
              title: module.moduleName,
              icon: `$${module.moduleName}`,
              to: module.moduleLink,
            });
          }
          return modules;
        }));
      }
      return modules;
    },
  },
});
