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
      const recipe = await dispatch(
        'element/getRecords',
        {
          elementName: 'recipelist',
          query,
        },
        { root: true },
      );
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
    deleteRecipeByRecipeNumber: async ({ dispatch, commit }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'recipelist',
          queryParam: `?query=recipenumber=="${id}"`,
        },
        { root: true },
      );
      if (deleted) {
        const query = '';
        const recipe = await dispatch(
          'element/getRecords',
          {
            elementName: 'recipelist',
            query,
          },
          { root: true },
        );
        if (recipe) {
          commit('setRecipeList', recipe);
          commit('setFilterBackupList', recipe);
          return recipe;
        }
      }
      return deleted;
    },
    deleteRecipeDetails: async ({ dispatch, commit }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'recipedetails',
          queryParam: `?query=tagname=="${id}"`,
        },
        { root: true },
      );
      if (deleted) {
        const query = '';
        const recipe = await dispatch(
          'element/getRecords',
          {
            elementName: 'recipedetails',
            query,
          },
          { root: true },
        );
        if (recipe) {
          commit('setRecipeListDetails', recipe);
          return recipe;
        }
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
    createRecipe: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'recipelist',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const recipe = await dispatch(
          'element/getRecords',
          {
            elementName: 'recipelist',
            query,
          },
          { root: true },
        );
        if (recipe) {
          commit('setRecipeList', recipe);
          commit('setFilterBackupList', recipe);
          return recipe;
        }
      }
      return created;
    },
    updateRecipe: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/putRecord',
        {
          elementName: 'recipelist',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const recipe = await dispatch(
          'element/getRecords',
          {
            elementName: 'recipelist',
            query,
          },
          { root: true },
        );
        if (recipe) {
          commit('setRecipeList', recipe);
          commit('setFilterBackupList', recipe);
          return recipe;
        }
      }
      return created;
    },
    updateRecipeDetails: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/putRecord',
        {
          elementName: 'recipedetails',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const recipe = await dispatch(
          'element/getRecords',
          {
            elementName: 'recipedetails',
            query,
          },
          { root: true },
        );
        if (recipe) {
          commit('setRecipeListDetails', recipe);
          return recipe;
        }
      }
      return created;
    },
  },
});
