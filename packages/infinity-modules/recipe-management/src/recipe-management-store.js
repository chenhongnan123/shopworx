// import { set } from '@shopworx/services/util/store.helper';
import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    recipeList: [],
    filter: false,
    recipeListDetails: [],
    lineList: [],
    subLineList: [],
    stationList: [],
    filterLine: {},
    filterSubLine: {},
    filterStation: {},
    filterBList: [],
  },
  mutations: {
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setRecipeList: set('recipeList'),
    setRecipeListDetails: set('recipeListDetails'),
    setLineList: set('lineList'),
    setSubLineList: set('subLineList'),
    setStationList: set('stationList'),
    setFilterLine: set('filterLine'),
    setFilterSubLine: set('filterSubLine'),
    setFilterStation: set('filterStation'),
    setFilterBackupList: set('filterBList'),
  },
  actions: {
    getRecipeListRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'recipelist',
          query,
        },
        { root: true },
      );
      let recipe = [];
      if (list && list.length) {
        recipe = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setRecipeList', recipe);
      commit('setFilterBackupList', recipe);
      return recipe;
    },
    getOrderRecords: async ({ dispatch }, query) => {
      const orders = await dispatch(
        'element/getRecords',
        {
          elementName: 'order',
          query,
        },
        { root: true },
      );
      return orders;
    },
    deleteRecipeByRecipeNumber: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'recipelist',
          queryParam: `?query=recipenumber=="${id}"`,
        },
        { root: true },
      );
      if (deleted) {
        dispatch('getRecipeListRecords');
        return true;
      }
      return deleted;
    },
    deleteRecipeDetails: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'recipedetails',
          queryParam: `?query=tagname=="${id}"`,
        },
        { root: true },
      );
      if (deleted) {
        dispatch('getRecipeDetailListRecords');
        return true;
      }
      return deleted;
    },
    // getProductDetails
    getProductDetails: async ({ dispatch }, query) => {
      const orders = await dispatch(
        'element/getRecords',
        {
          elementName: 'productdetails',
          query,
        },
        { root: true },
      );
      return orders;
    },
    getLines: async ({ dispatch, commit }, query) => {
      const line = await dispatch(
        'element/getRecords',
        {
          elementName: 'line',
          query,
        },
        { root: true },
      );
      commit('setLineList', line);
      return line;
    },
    getSubLines: async ({ dispatch, commit }, query) => {
      const subline = await dispatch(
        'element/getRecords',
        {
          elementName: 'subline',
          query,
        },
        { root: true },
      );
      commit('setSubLineList', subline);
      return subline;
    },
    getStations: async ({ dispatch, commit }, query) => {
      const station = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      commit('setStationList', station);
      return station;
    },
    getRecipeDetailListRecords: async ({ dispatch, commit }, query) => {
      const recipeDetails = await dispatch(
        'element/getRecords',
        {
          elementName: 'recipedetails',
          query,
        },
        { root: true },
      );
      commit('setRecipeListDetails', recipeDetails);
      return recipeDetails;
    },
    createRecipe: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'recipelist',
          payload,
        },
        { root: true },
      );
      if (created) {
        dispatch('getRecipeListRecords');
        return true;
      }
      return created;
    },
    updateRecipe: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/putRecord',
        {
          elementName: 'recipelist',
          payload,
        },
        { root: true },
      );
      if (created) {
        dispatch('getRecipeListRecords');
        return true;
      }
      return created;
    },
    updateRecipeDetails: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/putRecord',
        {
          elementName: 'recipedetails',
          payload,
        },
        { root: true },
      );
      if (created) {
        dispatch('getRecipeDetailListRecords');
        return true;
      }
      return created;
    },
  },
});
