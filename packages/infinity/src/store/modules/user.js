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

    getDeviceElement: async ({ commit, dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'devices',
        { root: true },
      );
      if (!element) {
        const deviceMaster = await dispatch('getDeviceMaster');
        if (deviceMaster) {
          const elementId = await dispatch('createDeviceElement', deviceMaster);
          if (elementId) {
            commit('setIsDeviceElemAvailable', true);
            return true;
          }
        }
        commit('setIsDeviceElemAvailable', false);
        return false;
      }
      commit('setIsDeviceElemAvailable', true);
      return true;
    },

    getDeviceMaster: async ({ dispatch }) => {
      const masterElements = await dispatch(
        'industry/getMasterElements',
        null,
        { root: true },
      );
      return masterElements
        .find((elem) => elem.masterElement.elementName === 'devices');
    },

    createDeviceElement: async ({ dispatch }, deviceMaster) => {
      const element = deviceMaster.masterElement;
      const tags = deviceMaster.masterTags;
      const payload = {
        element,
        tags,
      };
      const elementId = await dispatch(
        'element/createElementAndTags',
        payload,
        { root: true },
      );
      return elementId;
    },

    getMyDevices: async ({ commit, dispatch }) => {
      const devices = await dispatch(
        'element/getRecords',
        { elementName: 'devices' },
        { root: true },
      );
      commit('setMyDevices', devices);
    },

    createTV: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'devices',
          payload,
        },
        { root: true },
      );
      return created;
    },

    updateTV: async ({ dispatch }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'devices',
          id,
          payload,
        },
        { root: true },
      );
      return updated;
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

    modules: ({ mySolutions }) => {
      const modules = {
        items: [],
        adminItems: [],
      };
      if (mySolutions && mySolutions.length) {
        mySolutions.forEach((solution) => solution.modules
          .sort((a, b) => a.id - b.id)
          .map((module) => {
            const isApp = module.moduleName.toUpperCase().trim() === 'APPS';
            const isDashboard = module.moduleName.toUpperCase().trim() === 'DASHBOARDS';
            const isReport = module.moduleName.toUpperCase().trim() === 'REPORTS';
            const isMaster = module.moduleName.toUpperCase().trim() === 'MASTERS';
            const isRawData = module.moduleName.toUpperCase().trim() === 'RAWDATA';
            const isAdmin = module.moduleName.toUpperCase().trim() === 'ADMIN';
            const isInsight = module.moduleName.toUpperCase().trim() === 'INSIGHTS';
            if (isApp || isDashboard) {
              if (isDashboard) {
                modules.items.push({ header: module.moduleName });
              }
              module.details.forEach((detail) => {
                const isExternal = detail.webAppLink.includes('/#');
                modules.items.push({
                  id: detail.id,
                  icon: detail.iconURL,
                  to: detail.webAppLink,
                  title: detail.webAppName,
                  external: isExternal,
                });
              });
            } else if (isReport) {
              modules.items.push({ header: module.moduleName });
              module.details.forEach((detail) => {
                modules.items.push({
                  id: detail.id,
                  icon: detail.iconUrl,
                  to: module.moduleName,
                  title: detail.reportsCategoryName,
                });
              });
            } else if (isMaster) {
              modules.adminItems.push({
                id: module.id,
                to: module.moduleLink,
                title: module.moduleName,
                icon: `$${module.moduleName}`,
              });
            } else if (isRawData) {
              modules.adminItems.push({
                id: module.id,
                to: module.moduleLink,
                title: module.moduleName,
                icon: `$${module.moduleName}`,
              });
            } else if (isAdmin) {
              modules.adminItems.push({
                id: module.id,
                to: module.moduleLink,
                title: module.moduleName,
                icon: `$${module.moduleName}`,
              });
            } else if (!isInsight) {
              modules.items.push({ header: module.moduleName });
              module.details.forEach((detail) => {
                modules.items.push({
                  id: detail.id,
                  icon: detail.iconURL,
                  to: detail.webAppLink,
                  title: detail.webAppName,
                });
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

    myDashboards: ({ mySolutions }) => {
      const dashboards = [];
      if (mySolutions && mySolutions.length) {
        mySolutions.forEach((solution) => solution.modules
          .sort((a, b) => a.id - b.id)
          .map((module) => {
            const isDashboard = module.moduleName.toUpperCase().trim() === 'DASHBOARDS';
            if (isDashboard) {
              module.details.forEach((detail) => {
                dashboards.push({
                  id: detail.id,
                  icon: detail.iconURL,
                  to: detail.webAppLink,
                  title: detail.webAppName,
                });
              });
            }
            return dashboards;
          }));
      }
      return dashboards;
    },

    myTvs: ({ myDevices }) => {
      let tvs = [];
      if (myDevices && myDevices.length) {
        tvs = myDevices.filter((device) => device.devicetype
          .toUpperCase()
          .trim() === 'TV');
      }
      return tvs;
    },
  },
});
