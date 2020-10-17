import ReportService from '@shopworx/services/api/report.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    report: {},
  },
  mutations: {
    setReport: set('report'),
  },
  actions: {
    executeReport: async ({ commit }, { reportName, payload }) => {
      try {
        const { data } = await ReportService.executeReport(reportName, payload);
        if (data && data.reportData) {
          commit('setReport', JSON.parse(data.reportData));
          return data.reportData;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
  },
});
