import { set } from '@shopworx/services/util/store.helper';
import ReportService from '@shopworx/services/api/report.service';

export default ({
  state: {
    insightsOnDemand: [],
    query: null,
    window: 0,
  },
  mutations: {
    setInsightsOnDemand: set('insightsOnDemand'),
    setQuery: set('query'),
    setWindow: set('window'),
  },
  actions: {
    createInsightsOnDemand: async ({ commit, dispatch }) => {
      const categories = await dispatch('getInsightCategories');
      const categoryQueries = categories.map(async (category) => dispatch('getInsightViews', {
        categoryId: category.id,
        parentId: 0,
      }));
      const queries = await Promise.all(categoryQueries);
      const queryItems = queries.flat();
      const groupByQueries = queryItems.reduce((insightArr, query) => {
        if (insightArr[query.categoryId]) {
          insightArr[query.categoryId].push({
            id: query.id,
            name: query.name,
            reportName: query.reportName,
          });
        } else {
          insightArr[query.categoryId] = [{
            id: query.id,
            name: query.name,
            reportName: query.reportName,
          }];
        }
        return insightArr;
      }, {});
      const insightOnDemand = categories.map(({ name, description, id }) => ({
        icon: name,
        category: description,
        queries: groupByQueries[id],
      }));
      commit('setInsightsOnDemand', insightOnDemand);
    },
    getInsightCategories: async () => {
      try {
        const { data } = await ReportService.getInsightCategories();
        if (data && data.results) {
          return data.results;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    getInsightViews: async (_, { categoryId, parentId }) => {
      try {
        const { data } = await ReportService.getInsightViews(categoryId, parentId);
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
