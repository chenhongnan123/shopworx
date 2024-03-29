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
    subStationList: [],
    filterLine: {},
    filterSubLine: [],
    filterStation: [],
    filterRecipe: [],
    filterBList: [],
    datatypeList: [],
    parametersList: [],
    sublineInState: [],
    stationInState: [],
    substationInState: [],
    recipeNames: [],
  },
  mutations: {
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setRecipeList: set('recipeList'),
    setRecipeListDetails: set('recipeListDetails'),
    setLineList: set('lineList'),
    setSubLineList: set('subLineList'),
    setStationList: set('stationList'),
    setSubStationList: set('subStationList'),
    setFilterLine: set('filterLine'),
    setFilterSubLine: set('filterSubLine'),
    setFilterStation: set('filterStation'),
    setFilterRecipe: set('filterRecipe'),
    setFilterBackupList: set('filterBList'),
    setDataTypeList: set('datatypeList'),
    setParamtersList: set('parametersList'),
    setInStateSubline: set('sublineInState'),
    setInStateStation: set('stationInState'),
    setInStateSubStation: set('substationInState'),
    setRecipeName: set('recipeNames'),
  },
  actions: {
    getMonitorValues: async ({ dispatch }, payload) => {
      const orders = await dispatch(
        'element/postSocket', {
          functionName: 'parameterupload',
          payload,
        },
        { root: true },
      );
      return orders;
    },
    uploadToPLC: async ({ dispatch }, payload) => {
      const orders = await dispatch(
        'element/postSocket', {
          functionName: 'recipeupload',
          payload,
        },
        { root: true },
      );
      return orders;
    },
    downloadFromPLC: async ({ dispatch }, payload) => {
      const orders = await dispatch(
        'element/postSocket', {
          functionName: 'recipedownload',
          payload,
        },
        { root: true },
      );
      return orders;
    },
    getRecipeNameByStation: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'recipelist',
          query,
        },
        { root: true },
      );
      commit('setRecipeName', list);
      return true;
    },
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
    getDataTypes: async ({ dispatch, commit }, query) => {
      const datatype = await dispatch(
        'element/getRecords',
        {
          elementName: 'datatypes',
          query,
        },
        { root: true },
      );
      commit('setDataTypeList', datatype);
      return datatype;
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
    getParametersRecords: async ({ dispatch, commit }, query) => {
      let parameters = await dispatch(
        'element/getRecords',
        {
          elementName: 'parameters',
          query,
        },
        { root: true },
      );
      parameters = parameters.filter((d) => d.parametercategory === '35' || d.parametercategory === '7' || d.parametercategory === '58');
      commit('setParamtersList', parameters);
      return parameters;
    },
    createRecipeDetails: async ({ dispatch }, payload) => {
      await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'recipedetails',
          queryParam: `?query=recipeid=="${payload.recipeid}"%26%26versionnumber==${payload.versionnumber}`,
        },
        { root: true },
      );
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'recipedetails',
          payload: payload.list,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    deleteRecipeByRecipeNumber: async ({ dispatch, state }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'recipelist',
          queryParam: `?query=recipenumber=="${id}"`,
        },
        { root: true },
      );
      if (deleted) {
        const { filterSubLine, filterStation, filterRecipe } = state;
        let param = '';
        if (filterSubLine && filterSubLine.id && !filterStation.id && !filterRecipe.recipenumber) {
          param += `?query=sublineid=="${filterSubLine.id}"`;
        }
        if (filterStation && filterStation.id && !filterSubLine.id && !filterRecipe.recipenumber) {
          param += `?query=stationid=="${filterStation.id}"`;
        }
        if (filterRecipe && filterRecipe.recipenumber && !filterStation.id && !filterSubLine.id) {
          param += `?query=recipenumber=="${filterRecipe.recipenumber}"`;
        }
        if (filterSubLine && filterSubLine.id && filterStation && filterStation.id
           && !filterRecipe.recipenumber) {
          param += `?query=sublineid=="${filterSubLine.id}"%26%26stationid=="${filterStation.id}"`;
        }
        if (filterStation && filterStation.id && filterRecipe && filterRecipe.recipenumber
            && !filterSubLine.id) {
          param += `?query=stationid=="${filterStation.id}"%26%26recipenumber=="${filterRecipe.recipenumber}"`;
        }
        if (filterSubLine && filterSubLine.id && filterStation
            && filterStation.id && filterRecipe && filterRecipe.recipenumber) {
          param += `?query=sublineid=="${filterSubLine.id}"%26%26stationid=="${filterStation.id}"%26%26recipenumber=="${filterRecipe.recipenumber}"`;
        }
        if (!filterSubLine.id && !filterStation.id && filterRecipe.recipenumber) {
          param = '';
        }
        await dispatch('getRecipeListRecords', param);
        return true;
      }
      return deleted;
    },
    deleteRecipeDetails: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'recipedetails',
          queryParam: id,
        },
        { root: true },
      );
      if (deleted) {
        dispatch('getRecipeDetailListRecords', '?sortquery=sequence==1');
        return true;
      }
      return deleted;
    },
    getRecipeInUse: async ({ dispatch }, query) => {
      const recipeInUse = await dispatch(
        'element/getRecords',
        {
          elementName: 'productdetails',
          query,
        },
        { root: true },
      );
      if (recipeInUse && recipeInUse.length) {
        return recipeInUse[0];
      }
      return false;
    },
    // getProductDetails
    getProductDetails: async ({ dispatch, commit }, query) => {
      const orders = await dispatch(
        'element/getRecords',
        {
          elementName: 'productdetails',
          query,
        },
        { root: true },
      );
      let recipe = [];
      if (orders && orders.length) {
        recipe = orders.map((l) => ({
          ...l,
          plcrecipename: '',
          plcrecipenumber: '',
          plcrecipeversion: '',
          notmatchname: 1,
          notmatchversion: 1,
        }));
      }
      commit('setRecipeList', recipe);
      return recipe;
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
    getSubStations: async ({ dispatch, commit }, query) => {
      const station = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setSubStationList', station);
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
    createRecipe: async ({ dispatch, state }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'recipelist',
          payload,
        },
        { root: true },
      );
      if (created) {
        const { filterSubLine, filterStation, filterRecipe } = state;
        let param = '';
        if (filterSubLine && filterSubLine.id && !filterStation.id && !filterRecipe.recipenumber) {
          param += `?query=sublineid=="${filterSubLine.id}"`;
        }
        if (filterStation && filterStation.id && !filterSubLine.id && !filterRecipe.recipenumber) {
          param += `?query=stationid=="${filterStation.id}"`;
        }
        if (filterRecipe && filterRecipe.recipenumber && !filterStation.id && !filterSubLine.id) {
          param += `?query=recipenumber=="${filterRecipe.recipenumber}"`;
        }
        if (filterSubLine && filterSubLine.id && filterStation && filterStation.id
           && !filterRecipe.recipenumber) {
          param += `?query=sublineid=="${filterSubLine.id}"%26%26stationid=="${filterStation.id}"`;
        }
        if (filterStation && filterStation.id && filterRecipe && filterRecipe.recipenumber
            && !filterSubLine.id) {
          param += `?query=stationid=="${filterStation.id}"%26%26recipenumber=="${filterRecipe.recipenumber}"`;
        }
        if (filterSubLine && filterSubLine.id && filterStation
            && filterStation.id && filterRecipe && filterRecipe.recipenumber) {
          param += `?query=sublineid=="${filterSubLine.id}"%26%26stationid=="${filterStation.id}"%26%26recipenumber=="${filterRecipe.recipenumber}"`;
        }
        if (!filterSubLine.id && !filterStation.id && filterRecipe.recipenumber) {
          param = '';
        }
        await dispatch('getRecipeListRecords', param);
        return true;
      }
      return created;
    },
    updateRecipe: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'recipelist',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        dispatch('getRecipeListRecords');
        return true;
      }
      return created;
    },
    updateProductDetails: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'productdetails',
          id: `?query=recipenumber=="${payload.id}"`,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        dispatch('getProductDetails');
        return true;
      }
      return created;
    },
    updateRecipeDetails: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'recipedetails',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        dispatch('getRecipeDetailListRecords', '?sortquery=sequence==1');
        return true;
      }
      return created;
    },
    updateRecipeDetailById: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'recipedetails',
          id: payload.id,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        dispatch('getRecipeDetailListRecords', '?sortquery=sequence==1');
        return true;
      }
      return created;
    },
  },
});
