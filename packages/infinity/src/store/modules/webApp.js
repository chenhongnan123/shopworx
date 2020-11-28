import Vue from 'vue';
import SiteService from '@shopworx/services/api/site.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    appSchema: null,
    activeAppId: null,
    config: {
      filters: {},
      sort: {},
    },
  },
  mutations: {
    setAppSchema: set('appSchema'),
    setActiveAppId: set('activeAppId'),
    setConfig: set('config'),
    setFilter: (state, { field, value }) => {
      const { config: { filters } } = state;
      Vue.set(filters, field, value);
    },
    setSort: (state, { field, value }) => {
      const { config: { sort } } = state;
      Vue.set(sort, field, value);
    },
  },
  actions: {
    getAppSchema: async ({ commit, state, rootState }, appId = null) => {
      try {
        const { me } = rootState.user;
        const roleId = me.role.id;
        let activeAppId = appId;
        if (!appId) {
          ({ activeAppId } = state);
        }
        const { data } = await SiteService.getApp(roleId, activeAppId);
        if (data && data.results) {
          try {
            commit('setAppSchema', JSON.parse(data.results.schema));
          } catch (e) {
            /* commit('helper/setAlert', {
              show: true,
              type: 'error',
              message: 'INVALID_APP_SCHEMA',
            }, {
              root: true,
            }); */
          }
        }
      } catch (e) {
        return false;
      }
      return true;
    },
  },
  getters: {
    filters: ({ config }) => config.filters,

    sort: ({ config }) => config.sort,
  },
});
