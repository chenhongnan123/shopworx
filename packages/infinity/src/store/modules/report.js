import ReportService from '@shopworx/services/api/report.service';

export default ({
  actions: {
    executeReport: async (_, { reportName, payload }) => {
      try {
        const { data } = await ReportService.executeReport(reportName, payload);
        if (data && data.results) {
          return data.results;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
  },
});
