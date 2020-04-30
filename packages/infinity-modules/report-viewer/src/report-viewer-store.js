import ReportService from '@shopworx/services/api/report.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    reportViews: [],
    reportView: null,
    reportMappings: [],
    reportMapping: null,
    chartType: null,
    dateRange: {
      start: null,
      end: null,
    },
    report: null,
    gridObject: '',
  },
  mutations: {
    setReportViews: set('reportViews'),
    setReportView: set('reportView'),
    setReportMappings: set('reportMappings'),
    setReportMapping: set('reportMapping'),
    setChartType: set('chartType'),
    setDateRange: set('dateRange'),
    setReport: set('report'),
    setGridObject: set('gridObject'),
  },
  actions: {
    getReportViews: async ({ commit }, reportCategoryId) => {
      try {
        const { data } = await ReportService.getReportViews(reportCategoryId);
        if (data && data.results) {
          commit('setReportViews', data.results);
          return data.results;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    getReportMappings: async ({ commit, state }) => {
      try {
        const { reportView } = state;
        const id = reportView ? reportView.id : null;
        const { data } = await ReportService.getReportMappings(id);
        if (data && data.results) {
          commit('setReportMappings', data.results);
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    executeReport: async ({ commit, state }) => {
      try {
        const { reportMapping, dateRange } = state;
        const reportName = reportMapping ? reportMapping.reportName : '';
        const { data } = await ReportService.executeReport(reportName, dateRange);
        if (data && data.reportData) {
          commit('setReport', data.reportData);
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    saveAsNewReport: async ({ commit, state, dispatch }, reportViewName) => {
      try {
        const {
          reportView,
          reportMapping,
          gridObject,
        } = state;
        const payload = {
          gridObject,
          reportViewName,
          reportId: reportMapping.reportId,
          reportsCategoryId: reportView.reportsCategoryId,
        };
        const { data } = await ReportService.createReportView(payload);
        if (data && data.created) {
          const views = await dispatch('getReportViews', reportView.reportsCategoryId);
          if (views && views.length) {
            const view = views.find((report) => report.id === data.reportViewId);
            commit('setReportView', view);
            return true;
          }
        }
      } catch (e) {
        return false;
      }
      return false;
    },
  },
  getters: {
    reportCategories: (state, getters, rootState, rootGetters) => {
      const modules = rootGetters['user/modules'];
      if (modules && modules.items && modules.items.length) {
        return modules.items.filter((module) => module.to === 'reports');
      }
      return [];
    },

    activeReportCategory: (_, { reportCategories }) => (title) => {
      if (reportCategories && reportCategories.length) {
        return reportCategories.find((category) => category.title === title);
      }
      return null;
    },

    reportTitle: ({ reportView }) => {
      if (reportView) {
        return reportView.reportViewName;
      }
      return '';
    },

    gridObject: ({ reportView }) => {
      if (reportView) {
        return reportView.gridObject;
        // return JSON.parse(reportView.gridObject);
      }
      return null;
    },

    isBaseReport: (_, { gridObject }) => !gridObject,
  },
});
