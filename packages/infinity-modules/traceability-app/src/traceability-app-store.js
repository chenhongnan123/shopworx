import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    lineList: [],
    subLineList: [],
    stationList: [],
    subStationList: [],
    checkOutList: [],
    partStatusList: [],
    processParametersList: [],
    componentData: [],
    recipeViewState: 0,
    subStationInfo: {},
    componentList: [],
    trecibilityState: {},
    sortedSubStation: [],
  },
  mutations: {
    setLineList: set('lineList'),
    setSubLineList: set('subLineList'),
    setStationList: set('stationList'),
    setSubStationList: set('subStationList'),
    setCheckOutList: set('checkOutList'),
    setPartStatusList: set('partStatusList'),
    setProcessParametersList: set('processParametersList'),
    setComponentData: set('componentData'),
    setRecipeViewState: set('recipeViewState'),
    setSubStationInfo: set('subStationInfo'),
    setComponentList: set('componentList'),
    setTrecibilityState: set('trecibilityState'),
    setSortedSubStation: set('sortedSubStation'),
  },
  actions: {
    getPartStatus: async ({ dispatch, commit }, query) => {
      const part = await dispatch(
        'element/getRecords',
        {
          elementName: 'partstatus',
          query,
        },
        { root: true },
      );
      commit('setPartStatusList', part);
      return part;
    },
    getProcessParameters: async ({ dispatch, commit }, { elementname, payload }) => {
      const paramters = await dispatch(
        'element/getRecords',
        {
          elementName: elementname,
          query: payload,
        },
        { root: true },
      );
      commit('setProcessParametersList', paramters);
      return paramters;
    },
    getProcessElement: async ({ dispatch }, elementName) => {
      const element = await dispatch(
        'element/getElement',
        elementName,
        { root: true },
      );
      return element;
    },
    getComponentList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'component',
          query,
        },
        { root: true },
      );
      commit('setComponentList', list);
      return list;
    },
    getCheckOutLists: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'checkout',
          query,
        },
        { root: true },
      );
      commit('setCheckOutList', list);
      return list;
    },
    getComponentData: async ({ dispatch, commit }, query) => {
      const component = await dispatch(
        'element/getRecords',
        {
          elementName: 'component',
          query,
        },
        { root: true },
      );
      commit('setComponentData', component);
      return component;
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
    getSortedSubStations: async ({ dispatch, commit }, query) => {
      const sortedSubStation = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setSortedSubStation', sortedSubStation);
      return sortedSubStation;
    },
  },
  getters: {
  },
});
