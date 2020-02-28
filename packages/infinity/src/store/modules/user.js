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
      const { data, status } = await UserService.getMe();
      if (status === 200) {
        commit('setMe', data.results);
        commit('setActiveSite', data.results.activeSiteId);
      }
      return data;
    },

    getMySolutions: async ({ commit }) => {
      const { data, status } = await UserService.getSolution();
      if (status === 200) {
        commit('setMySolutions', data.results);
      }
      return data;
    },

    updateActiveSite: async ({ commit }, id) => {
      const { data, status } = await UserService.setUserSite(id);
      if (status === 200) {
        commit('setActiveSite', id);
      }
      return data;
    },

    updateUser: async (_, payload) => {
      const { data } = await UserService.updateUser(payload);
      return data;
    },

    updatePassword: async (_, payload) => {
      const { data } = await UserService.updatePassword(payload);
      return data;
    },

    activateUser: async ({ state }) => {
      const { me } = state;
      let id = null;
      if (me && me.user) {
        ({ id } = me.user);
      }
      const { data } = await UserService.activateUser(id);
      return data;
    },

    isUsernameAvailable: async (_, { username }) => {
      const { data } = await UserService.isUsernameAvailable(username);
      return data;
    },

    inviteUsers: async (_, payload) => {
      const { data } = await UserService.inviteUsers(payload);
      return data;
    },

    resendInvitation: async (_, payload) => {
      const { data } = await UserService.resendInvitation(payload);
      return data;
    },

    getUserRoles: async ({ commit }) => {
      const { data, status } = await UserService.getRoles();
      if (status === 200) {
        commit('setRoles', data.results);
      }
      return data;
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
