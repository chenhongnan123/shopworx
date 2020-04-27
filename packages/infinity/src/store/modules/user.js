import UserService from '@shopworx/services/api/user.service';
import SiteService from '@shopworx/services/api/site.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    me: null,
    roles: [],
    userState: null,
    activeSite: null,
    mySolutions: [],
    licenses: [],
  },
  mutations: {
    setMe: set('me'),
    setRoles: set('roles'),
    setUserState: set('userState'),
    setActiveSite: set('activeSite'),
    setMySolutions: set('mySolutions'),
    setLicenses: set('licenses'),
  },
  actions: {
    getMe: async ({ commit }) => {
      try {
        const { data } = await UserService.getMe();
        if (data && data.results) {
          commit('setMe', data.results);
          const customerId = data.results.customer.id;
          const siteId = data.results.activeSiteId;
          const userState = data.results.user.userState.toUpperCase().trim();
          commit('setActiveSite', siteId);
          commit('setUserState', userState);
          const site = await SiteService.getLicense(customerId, siteId);
          if (site && site.data.results) {
            const result = site.data.results
              .filter((res) => res.status.toUpperCase().trim() === 'ACTIVE');
            commit('setLicenses', result);
            if (!result.length) {
              commit('helper/setAlert', {
                show: true,
                type: 'error',
                message: 'NO_LICENSE',
              }, {
                root: true,
              });
              return false;
            }
          } else {
            commit('helper/setAlert', {
              show: true,
              type: 'error',
              message: 'CANNOT_FETCH_LICENSE',
            }, {
              root: true,
            });
            return false;
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

    updatePassword: async ({ commit, dispatch }, payload) => {
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
        const updatedMe = await dispatch('updateUser', { userState: 'ACTIVE' });
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

    isOnboardingComplete: ({ me, activeSite }) => {
      if (me && me.site && me.site.length) {
        const site = me.site.find((s) => s.id === activeSite);
        return site.onboardingCompleted;
      }
      return false;
    },

    isAdmin: ({ me }) => {
      if (me && me.role.roleType) {
        return me.role.roleType.toUpperCase().trim() === 'ADMINISTRATOR';
      }
      return false;
    },

    customer: ({ me }) => {
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

    modules: ({ mySolutions }) => {
      const modules = {
        items: [],
        adminItems: [],
      };
      if (mySolutions && mySolutions.length) {
        mySolutions.forEach((solution) => solution.modules.map((module) => {
          if (module.moduleName.toUpperCase().trim() === 'APPS') {
            module.details.forEach((detail) => {
              modules.items.push({
                id: detail.id,
                icon: detail.iconURL,
                to: detail.webAppLink,
                title: detail.webAppName,
              });
            });
          }
          if (module.moduleName.toUpperCase().trim() === 'REPORTS') {
            modules.items.push({ header: module.moduleName });
            module.details.forEach((detail) => {
              modules.items.push({
                id: detail.id,
                icon: detail.iconUrl,
                to: module.moduleName,
                title: detail.reportsCategoryName,
              });
            });
          }
          if (module.moduleName.toUpperCase().trim() === 'MASTERS') {
            modules.adminItems.push({
              id: module.id,
              to: module.moduleLink,
              title: module.moduleName,
              icon: `$${module.moduleName}`,
            });
          }
          if (module.moduleName.toUpperCase().trim() === 'ADMIN') {
            modules.adminItems.push({
              id: module.id,
              to: module.moduleLink,
              title: module.moduleName,
              icon: `$${module.moduleName}`,
            });
          }
          return modules;
        }));
      }
      return modules;
    },

    licensedAssets: ({ licenses }) => {
      let assets = [];
      if (licenses && licenses.length) {
        assets = licenses.map((license) => license.assetId);
      }
      return assets;
    },

    isAppProvisioned: (_, { modules }) => (appName) => {
      let isProvisioned = false;
      if (modules) {
        const { items, adminItems } = modules;
        const itemTitles = items
          .filter((item) => item.to)
          .map((item) => item.to);
        const adminItemTitles = adminItems
          .filter((item) => item.to)
          .map((item) => item.to);
        const mods = [...itemTitles, ...adminItemTitles];
        isProvisioned = mods.includes(appName);
      }
      return isProvisioned;
    },
  },
});
