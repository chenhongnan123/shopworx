import SiteService from '@shopworx/services/api/site.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    reportViews: [],
  },
  mutations: {
    setReportViews: set('reportViews'),
  },
  actions: {
    getReportViews: async ({ commit }) => {
      try {
        const { data } = await SiteService.getReportViews();
        if (data && data.results) {
          commit('setReportViews', data.results);
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
  },
});
