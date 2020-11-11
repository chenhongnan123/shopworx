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
    selectedParameterList: [],
    modelFilesList: [],
    modelDeploymentOrderList: [],
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
    setSelectedParameterList: set('selectedParameterList'),
    setModelFilesList: set('modelFilesList'),
    setModelDeploymentOrderList: set('modelDeploymentOrderList'),
  },
  actions: {
    uploadFile: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/uploadFiles',
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
    addOutputRecordss: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'modeloutputs',
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
          elementName: 'modelinputs',
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
          elementName: 'models',
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    addModelFiles: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'modelfiles',
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    getModelDeploymentOrder: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'modeldeploymentorder',
          query,
        },
        { root: true },
      );
      if (list) {
        let modelList = [];
        if (list) {
          modelList = list.map((l) => ({
            ...l,
            logslist: [],
          }));
          modelList.forEach(async (element) => {
            const logs = await dispatch(
              'element/getRecords',
              {
                elementName: 'modeldeploymentorderslogs',
                query: `?query=modeldeploymentorderid=="${element._id}"`,
              },
              { root: true },
            );
            element.logslist = logs;
          });
          commit('setModelDeploymentOrderList', modelList);
        }
      }
      return list;
    },
    getModelFiles: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'modelfiles',
          query,
        },
        { root: true },
      );
      if (list) {
        commit('setModelFilesList', list);
      }
      return list;
    },
    getModelRecords: async ({ dispatch, commit }, query) => {
      let modelList = [];
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'models',
          query,
        },
        { root: true },
      );
      if (list) {
        modelList = list.map((l) => ({
          ...l,
          inputlist: [],
          filelist: [],
          outputlist: [],
          parameterlist: [],
        }));
        commit('setProcessModelList', modelList);
      }
      return modelList;
    },
    getOutputRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'modeloutputs',
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
          elementName: 'modelinputs',
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
    deleteModelById: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordById',
        {
          elementName: 'models',
          id,
        },
        { root: true },
      );
      return deleted;
    },
    deleteFileById: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordById',
        {
          elementName: 'modelfiles',
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
