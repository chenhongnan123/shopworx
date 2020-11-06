import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    lines: [],
    stations: [],
    processes: [],
    sublines: [],
    subStations: [],
    mlTransformationOutputList: [],
    processOutputList: [],
    processIntputList: [],
    processModelList: [],
  },
  mutations: {
    setLines: set('lines'),
    setStations: set('stations'),
    setProcesses: set('processes'),
    setSublines: set('sublines'),
    setSubStations: set('subStations'),
    setMlTransformationOutputList: set('mlTransformationOutputList'),
    setProcessOutputList: set('processOutputList'),
    setProcessInputList: set('processIntputList'),
    setProcessModelList: set('processModelList'),
  },
  actions: {
    addOutputRecordss: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'processoutputs',
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    addDeployModel: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'modeldeploymentorder',
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    addInputRecords: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'processinputs',
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    addProcessModel: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'processmodels',
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    getModelRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'processmodels',
          query,
        },
        { root: true },
      );
      if (list) {
        commit('setProcessModelList', list);
      }
      return list;
    },
    getOutputRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'processoutputs',
          query,
        },
        { root: true },
      );
      if (list) {
        commit('setProcessOutputList', list);
      }
      return list;
    },
    getInputRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'processinputs',
          query,
        },
        { root: true },
      );
      if (list) {
        commit('setProcessInputList', list);
      }
      return list;
    },
    deleteOutputRecords: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordById',
        {
          elementName: 'processoutputs',
          id,
        },
        { root: true },
      );
      return deleted;
    },
    deleteModel: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordById',
        {
          elementName: 'processmodels',
          id,
        },
        { root: true },
      );
      return deleted;
    },
    getMlTransformationOutputList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'mltransformationoutput',
          query,
        },
        { root: true },
      );
      commit('setMlTransformationOutputList', list);
      return true;
    },
    getLines: async ({ dispatch, commit }, query) => {
      const lineList = await dispatch(
        'element/getRecords',
        {
          elementName: 'line',
          query,
        },
        { root: true },
      );
      commit('setLines', lineList);
      return true;
    },
    getStations: async ({ dispatch, commit }, query) => {
      const localStations = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      commit('setStations', localStations);
    },
    getProcesses: async ({ dispatch, commit }, query) => {
      const localProcesses = await dispatch(
        'element/getRecords',
        {
          elementName: 'process',
          query,
        },
        { root: true },
      );
      commit('setProcesses', localProcesses);
    },
    getSublines: async ({ dispatch, commit }, query) => {
      const sublines = await dispatch(
        'element/getRecords',
        {
          elementName: 'subline',
          query,
        },
        { root: true },
      );
      commit('setSublines', sublines);
    },
    getSubStations: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      let subStations = [];
      if (list && list.length) {
        subStations = list.map((l) => ({
          ...l,
        }));
      }
      commit('setSubStations', subStations);
      return true;
    },
    deleteInput: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordById',
        {
          elementName: 'processinputs',
          id,
        },
        { root: true },
      );
      return deleted;
    },
  },
});
