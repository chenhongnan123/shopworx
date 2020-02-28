import ReportService from '@shopworx/services/api/report.service';
import { set } from '@shopworx/services/util/store.service';

export default ({
  state: {
    reportData: null,
    reportFilters: [],
    selectedChart: 0,
  },
  mutations: {
    setReportData: set('reportData'),
    setReportFilters: set('reportFilters'),
    setSelectedChart: set('selectedChart'),
  },
  actions: {
    getReportFilters: async ({ commit }, reportName) => {
      const { data, status } = await ReportService.getReportFilters(reportName);
      if (status === 200) {
        const filters = data.results.filters.map((filter) => ({
          name: filter.reportObjectParameter.parameterName,
          choices: filter.choices,
          type: filter.reportObjectParameter.parameterType,
        }));
        commit('setReportFilters', filters);
      }
      return data;
    },

    executeReport: async ({ commit, state }, reportName) => {
      const { reportFilters } = state;
      const payload = {};
      reportFilters.forEach((filter) => {
        if (filter.name === 'startdate') {
          payload[filter.name] = 1571077800000;
        } else if (filter.name === 'enddate') {
          payload[filter.name] = 1572633000000;
        } else if (filter.name === 'singledaterange') {
          payload[filter.name] = false;
        } else {
          payload[filter.name] = `{${filter.choices.join()}}`;
        }
      });
      try {
        const { data, status } = await ReportService.executeReport(reportName, payload);
        if (status === 200) {
          const result = JSON.parse(data.reportData);
          commit('setReportData', result);
        }
        return data;
      } catch (e) {
        console.error(e);
      }
      return null;
    },
  },
  getters: {
    chartType: ({ selectedChart }) => {
      switch (selectedChart) {
        case 0:
          return 'area';
        case 1:
          return 'spline';
        case 2:
          return 'column';
        case 3:
          return 'line';
        default:
          return 'area';
      }
    },

    columnDefinition: ({ reportData }) => {
      let columnDefs = [];
      if (reportData) {
        columnDefs = reportData.cols.map((col) => ({
          headerName: col.description,
          field: col.name,
          type: col.type,
        }));
      }
      return columnDefs;
    },

    rowData: ({ reportData }) => {
      let data = [];
      if (reportData) {
        data = reportData.reportData;
      }
      return data;
    },
  },
});
