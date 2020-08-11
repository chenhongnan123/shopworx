import ReportService from '@shopworx/services/api/report.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    reportViews: [],
    reportView: null,
    newReportTitle: '',
    reportMappings: [],
    reportMapping: null,
    chartType: null,
    dateRange: [new Date().toISOString().substr(0, 10),
      new Date().toISOString().substr(0, 10)],
    report: null,
    gridState: '',
  },
  mutations: {
    setReportViews: set('reportViews'),
    setReportView: set('reportView'),
    setNewReportTitle: set('newReportTitle'),
    setReportMappings: set('reportMappings'),
    setReportMapping: set('reportMapping'),
    setChartType: set('chartType'),
    setDateRange: set('dateRange'),
    setReport: set('report'),
    setGridState: set('gridState'),
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

    executeReport: async ({ commit, state, rootState }) => {
      try {
        const { reportMapping, dateRange } = state;
        const { activeSite } = rootState.user;
        const reportName = reportMapping ? reportMapping.reportName : '';
        const [start, end] = dateRange;
        const payload = {
          start: parseInt(start.replace(/-/g, ''), 10),
          end: parseInt(end.replace(/-/g, ''), 10),
          siteid: activeSite,
        };
        const { data } = await ReportService.executeReport(reportName, payload);
        if (data && data.reportData) {
          commit('setReport', JSON.parse(data.reportData));
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
          gridState,
        } = state;
        const payload = {
          gridObject: gridState,
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

    updateReport: async ({
      state,
      dispatch,
      commit,
      getters,
    }) => {
      try {
        const {
          reportView,
          gridState,
          newReportTitle,
        } = state;
        const { reportTitle } = getters;
        let payload = {
          reportViewId: reportView.id,
          reportViewName: newReportTitle,
          gridObject: gridState,
        };
        if (reportTitle === newReportTitle) {
          payload = {
            reportViewId: reportView.id,
            gridObject: gridState,
          };
        }
        const { data } = await ReportService.updateReportView(payload);
        if (data && data.updated) {
          const views = await dispatch('getReportViews', reportView.reportsCategoryId);
          if (views && views.length) {
            const view = views.find((report) => report.id === reportView.id);
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
      }
      return null;
    },

    isBaseReport: (_, { gridObject }) => !gridObject,
  },
});
