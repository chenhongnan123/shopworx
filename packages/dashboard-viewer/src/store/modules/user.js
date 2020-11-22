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
  },
  getters: {
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

    isAppProvisioned: (_, { myDashboards }) => (appLink) => {
      let isProvisioned = false;
      if (myDashboards && myDashboards.length) {
        isProvisioned = myDashboards.find((d) => d.to.includes(appLink));
      }
      return isProvisioned;
    },
  },
});
