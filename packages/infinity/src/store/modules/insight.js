import { set } from '@shopworx/services/util/store.helper';
import ReportService from '@shopworx/services/api/report.service';

export default ({
  state: {
    insightsOnDemand: [],
    followUpInsights: [],
    query: null,
    window: 0,
    loading: false,
    insightDetails: null,
  },
  mutations: {
    setInsightsOnDemand: set('insightsOnDemand'),
    setFollowUpInsights: set('followUpInsights'),
    setQuery: set('query'),
    setWindow: set('window'),
    setLoading: set('loading'),
    setInsightDetails: set('insightDetails'),
  },
  actions: {
    getInsightsOnDemand: async ({ commit, dispatch }) => {
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
            categoryId: query.categoryId,
            reportName: query.reportName,
            inputMap: query.inputMap,
          });
        } else {
          insightArr[query.categoryId] = [{
            id: query.id,
            name: query.name,
            categoryId: query.categoryId,
            reportName: query.reportName,
            inputMap: query.inputMap,
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

    getFollowUpInsightViews: async ({ commit }, { categoryId, parentId }) => {
      try {
        const { data } = await ReportService.getInsightViews(categoryId, parentId);
        if (data && data.results) {
          commit('setFollowUpInsights', data.results);
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    fetchInsightDetails: async ({
      dispatch,
      state,
      rootState,
      commit,
    }) => {
      const { query } = state;
      const { activeSite } = rootState.user;
      await dispatch('calendar/getBusinessTime', null, { root: true });
      const { businessTime } = rootState.calendar;
      const inputMap = JSON.parse(query.inputMap);
      const time = inputMap
        ? inputMap.time
        : {};
      const payload = {};
      Object.keys(time).forEach((key) => {
        payload[`${key}Val`] = businessTime[key] + time[key];
      });
      if (inputMap && inputMap.siteId) {
        payload.siteid = activeSite;
      }
      const insightDetails = await dispatch(
        'report/executeReport',
        { reportName: query.reportName, payload },
        { root: true },
      );
      commit('setInsightDetails', insightDetails && JSON.parse(insightDetails));
      await dispatch('getFollowUpInsightViews', {
        categoryId: query.categoryId,
        parentId: query.id,
      });
    },
  },
});
