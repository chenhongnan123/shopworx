import SiteService from '@shopworx/services/api/site.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    businessTime: null,
    businessHours: [],
  },
  mutations: {
    setBusinessTime: set('businessTime'),
    setBusinessHours: set('businessHours'),
  },
  actions: {
    getBusinessTime: async ({ commit }, timestamp) => {
      const { data } = await SiteService.getBusinessTime(timestamp || Date.now());
      if (data) {
        commit('setBusinessTime', data);
        return data;
      }
      return false;
    },

    getBusinessHours: async ({ commit }) => {
      const { data } = await SiteService.getBusinessHours();
      if (data) {
        commit('setBusinessHours', data.results);
        return true;
      }
      return false;
    },
  },
});
