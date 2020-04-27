import SiteService from '@shopworx/services/api/site.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    reportViews: [],
    reportView: null,
  },
  mutations: {
    setReportViews: set('reportViews'),
    setReportView: set('reportView'),
  },
  actions: {
    getReportViews: async ({ commit }, reportCategoryId) => {
      try {
        const { data } = await SiteService.getReportViews(reportCategoryId);
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

    isBaseReport: ({ reportView }) => {
      if (reportView) {
        return !reportView.gridObject;
      }
      return false;
    },
  },
});
