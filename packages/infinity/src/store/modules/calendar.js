import SiteService from '@shopworx/services/api/site.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    businessTime: null,
  },
  mutations: {
    setBusinessTime: set('businessTime'),
  },
  actions: {
    getBusinessTime: async ({ commit }, timestamp) => {
      const { data } = await SiteService.getBusinessTime(timestamp);
      if (data) {
        commit('setBusinessTime', data);
        return true;
      }
      return false;
    },
  },
});
