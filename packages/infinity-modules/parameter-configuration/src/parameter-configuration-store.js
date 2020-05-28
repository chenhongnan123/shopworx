// import HourService from '@shopworx/services/api/hour.service';
import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    addParameterDialog: false,
    parameterList: [],
    directionList: [],
    categoryList: [],
    datatypeList: [],
    lineList: [],
    sublineList: [],
    stationList: [],
    substationList: [],
    lineValue: '',
    sublineValue: '',
    stationValue: '',
    substationValue: '',
    filter: false,
  },
  mutations: {
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setAddParameterDialog: set('addParameterDialog'),
    setParameterList: set('parameterList'),
    setDirectionList: set('directionList'),
    setCategoryList: set('categoryList'),
    setDatatypeList: set('datatypeList'),
    setLineList: set('lineList'),
    setSublineList: set('sublineList'),
    setStationList: set('stationList'),
    setSubstationList: set('substationList'),
    setLineValue: set('lineValue'),
    setSublineValue: set('sublineValue'),
    setStationValue: set('stationValue'),
    setSubstationValue: set('substationValue'),
  },
  actions: {
    getPageDataList: async ({ commit, dispatch }) => {
      const directionList = await dispatch(
        'element/getRecords',
        { elementName: 'directions' },
        { root: true },
      );
      const categoryList = await dispatch(
        'element/getRecords',
        { elementName: 'category' },
        { root: true },
      );
      const datatypeList = await dispatch(
        'element/getRecords',
        { elementName: 'datatypes' },
        { root: true },
      );
      const lineList = await dispatch(
        'element/getRecords',
        { elementName: 'line' },
        { root: true },
      );
      console.log(directionList, 'directionList');
      console.log(categoryList, 'categoryList');
      console.log(datatypeList, 'datatypeList');
      console.log(lineList, 'lineList');
      if (directionList && directionList.length) {
        commit('setDirectionList', directionList);
      }
      if (categoryList && categoryList.length) {
        commit('setCategoryList', categoryList);
      }
      if (datatypeList && datatypeList.length) {
        commit('setDatatypeList', datatypeList);
      }
      if (lineList) {
        commit('setLineList', lineList);
      }
    },
    getSublineList: async ({ commit, dispatch }, query) => {
      const sublineList = await dispatch(
        'element/getRecords',
        { elementName: 'subline', query },
        { root: true },
      );
      console.log(sublineList, 'sublineList');
      if (sublineList) {
        commit('setSublineList', sublineList);
      }
    },
    getStationList: async ({ commit, dispatch }, query) => {
      const stationList = await dispatch(
        'element/getRecords',
        { elementName: 'station', query },
        { root: true },
      );
      console.log(stationList, 'stationList');
      if (stationList) {
        commit('setStationList', stationList);
      }
    },
    getSubstationList: async ({ commit, dispatch }, query) => {
      const substationList = await dispatch(
        'element/getRecords',
        { elementName: 'substation', query },
        { root: true },
      );
      console.log(substationList, 'substationList');
      if (substationList) {
        commit('setSubstationList', substationList);
      }
    },
    createParameter: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'parameters',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createParameterList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'parameters',
          payload,
        },
        { root: true },
      );
      return created;
    },
    // getParameterListRecords: async ({ dispatch, commit }, query) => {
    getParameterListRecords: async ({ dispatch, commit }, query) => {
      const parameterList = await dispatch(
        'element/getRecords',
        {
          elementName: 'parameters',
          query,
        },
        { root: true },
      );
      parameterList.forEach((item, key) => {
        item.number = key + 1;
        item.datatype = Number(item.datatype);
        item.parametercategory = Number(item.parametercategory);
        item.parameterdirection = Number(item.parameterdirection);
      });
      commit('setParameterList', parameterList);
      return parameterList;
    },
    updateParameter: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/putRecord',
        {
          elementName: 'parameters',
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteParameter: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecord',
        {
          elementName: 'parameters',
          id,
        },
        { root: true },
      );
      console.log(deleteParameter, 'deleteParameter');
      return deleteParameter;
    },
  },
  getters: {
  },
});
