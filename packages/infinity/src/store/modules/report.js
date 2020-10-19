import ReportService from '@shopworx/services/api/report.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    loading: false,
  },
  mutations: {
    setLoading: set('loading'),
  },
  actions: {
    executeReport: async ({ commit }, { reportName, payload }) => {
      try {
        const { data } = await ReportService.executeReport(reportName, payload);
        commit('setLoading', true);
        if (data && data.reportData) {
          return data.reportData;
        }
        commit('setLoading', false);
      } catch (e) {
        return false;
      }
      return false;
    },
  },
});
