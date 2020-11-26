import { set, reactiveSet } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

const ELEMENTS = {
  LINE: 'line',
  SUBLINE: 'subline',
  STATION: 'station',
  SUBSTATION: 'substation',
  PROCESS: 'process',
  MODELS: 'models',
  PARAMETERS: 'parameters',
  TRANSFORMATIONS: 'mltransformationoutput',
  MODEL_INPUTS: 'modelinputs',
  MODEL_LOGS: 'modeldeploymentorderslogs',
  MODEL_FILES: 'modelfiles',
  MODEL_OUTPUTS: 'modeloutputs',
  MODEL_DEPLOYMENT: 'modeldeploymentorder',
};
const ASSETID = 4;
const OPERATION_NAME = 'Deploy Model';
const DEPLOYMENT_STATUS = 'Pending';
const formatDate = (input) => {
  const [date, hr, min, sec] = input.split(':');
  const [day, month, year] = date.split('-');
  return new Date(year, month - 1, day, hr, min, sec).getTime();
};

export default ({
  namespaced: true,
  state: {
    lines: [],
    selectedLine: null,
    selectedSubline: null,
    selectedStation: null,
    selectedStationName: null,
    selectedSubstation: null,
    selectedSubstationName: null,
    selectedProcess: null,
    selectedProcessName: null,
    lineDetails: [],
    fetchingLineDetails: false,
    models: [],
    fetchingModels: false,
    fetchingMaster: false,
    uploadingFiles: false,
    inputParameters: [],
    outputTransformations: [],
    modelDetails: null,
    files: [],
    createdModelId: null,
    lastStatusUpdate: {},
    deployedModels: [],
  },
  mutations: {
    setLines: set('lines'),
    setSelectedLine: set('selectedLine'),
    setSelectedSubline: set('selectedSubline'),
    setSelectedStation: set('selectedStation'),
    setSelectedStationName: set('selectedStationName'),
    setSelectedSubstation: set('selectedSubstation'),
    setSelectedSubstationName: set('selectedSubstationName'),
    setSelectedProcess: set('selectedProcess'),
    setSelectedProcessName: set('selectedProcessName'),
    setLineDetails: set('lineDetails'),
    setFetchingLineDetails: set('fetchingLineDetails'),
    setModels: set('models'),
    setFetchingModels: set('fetchingModels'),
    setFetchingMaster: set('fetchingMaster'),
    setUploadingFiles: set('uploadingFiles'),
    setInputParameters: set('inputParameters'),
    setOutputTransformations: set('outputTransformations'),
    setModelDetails: set('modelDetails'),
    setFiles: set('files'),
    setCreatedModelId: set('createdModelId'),
    setLastStatusUpdate: reactiveSet('lastStatusUpdate'),
    setDeployedModels: set('deployedModels'),
  },
  actions: {
    getLines: async ({ dispatch, commit }) => {
      const lines = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.LINE,
        },
        { root: true },
      );
      commit('setLines', sortArray(lines, 'name'));
    },

    fetchLineDetails: async ({ commit, dispatch }) => {
      commit('setFetchingLineDetails', true);
      commit('setSelectedSubline', null);
      commit('setSelectedStation', null);
      commit('setSelectedSubstation', null);
      commit('setSelectedProcess', null);
      commit('setSelectedProcessName', null);
      const sublines = await dispatch('getSublines');
      const lineDetails = await Promise.all(sublines.map(async (subline) => {
        const stations = await dispatch('getStations', subline.id);
        const stationDetails = await Promise.all(stations.map(async (station) => {
          const substations = await dispatch('getSubstations', station.id);
          const substationDetails = await Promise.all(substations.map(async (substation) => {
            const processes = await dispatch('getProcesses', substation.id);
            return {
              id: substation.id,
              name: substation.name,
              processes: processes.map(({ id, name }) => ({ id, name })),
            };
          }));
          return {
            id: station.id,
            name: station.name,
            substations: substationDetails,
          };
        }));
        return {
          id: subline.id,
          name: subline.name,
          stations: stationDetails,
        };
      }));
      commit('setLineDetails', lineDetails);
      commit('setFetchingLineDetails', false);
    },

    getSublines: async ({ state, dispatch }) => {
      const { selectedLine } = state;
      const sublines = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.SUBLINE,
          query: `?query=lineid==${selectedLine}`,
        },
        { root: true },
      );
      return sortArray(sublines, 'name');
    },

    getStations: async ({ dispatch }, sublineId) => {
      const stations = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.STATION,
          query: `?query=sublineid=="${sublineId}"`,
        },
        { root: true },
      );
      return sortArray(stations, 'name');
    },

    getSubstations: async ({ dispatch }, stationId) => {
      const substations = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.SUBSTATION,
          query: `?query=stationid=="${stationId}"`,
        },
        { root: true },
      );
      return sortArray(substations, 'name');
    },

    getProcesses: async ({ dispatch }, substationId) => {
      const processes = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.PROCESS,
          query: `?query=substationid=="${substationId}"`,
        },
        { root: true },
      );
      return sortArray(processes, 'name');
    },

    getModels: async ({ state, commit, dispatch }) => {
      const { selectedLine, selectedStation, selectedProcess } = state;
      commit('setFetchingModels', true);
      commit('setModels', []);
      const models = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.MODELS,
          query: `?query=lineid==${selectedLine}%26%26stationid=="${selectedStation}"%26%26subprocessid=="${selectedProcess}"`,
        },
        { root: true },
      );
      const mappedModels = await Promise.all(models
        .map(async ({
          _id,
          modelname,
          modeldescription,
          modifiedtimestamp,
        }) => {
          let model = {
            id: _id,
            name: modelname,
            description: modeldescription,
            lastModified: formatDate(modifiedtimestamp),
            status: 'N.A',
          };
          const deployment = await dispatch('getLastDeploymentStatus', _id);
          if (deployment) {
            model = {
              ...model,
              lastModified: formatDate(deployment.modifiedtimestamp),
              status: deployment.status,
            };
          }
          const eventData = {
            key: model.id,
            status: model.status,
          };
          commit('setLastStatusUpdate', eventData);
          return model;
        })
        .sort((a, b) => a.lastModified - b.lastModified));
      commit('setModels', mappedModels);
      commit('setFetchingModels', false);
    },

    getLastDeploymentStatus: async ({ dispatch }, modelId) => {
      const query = `modelid=="${modelId}"`;
      const sortQuery = 'createdTimestamp==-1';
      const paginatedQuery = 'pagenumber=1&pagesize=1';
      const deployment = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.MODEL_DEPLOYMENT,
          query: `?query=${query}&sortquery=${sortQuery}&${paginatedQuery}`,
        },
        { root: true },
      );
      return deployment[0];
    },

    getInputParameters: async ({ commit, dispatch }) => {
      const parameters = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.PARAMETERS,
          query: '?query=parametercategory=="51"',
        },
        { root: true },
      );
      const params = sortArray(parameters, 'description')
        .map(({ id, description }) => ({
          id,
          description,
        }));
      commit('setInputParameters', params);
    },

    getOutputTransformations: async ({ commit, dispatch }) => {
      const transformations = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.TRANSFORMATIONS,
        },
        { root: true },
      );
      const mappedTransformations = transformations
        .sort((a, b) => a.sortorder - b.sortorder)
        .map(({ _id, name }) => ({
          id: _id,
          name,
        }));
      commit('setOutputTransformations', mappedTransformations);
    },

    fetchModelDetails: async ({ state, commit, dispatch }, modelId) => {
      const { selectedLine, selectedStation, selectedProcess } = state;
      const query = `?query=lineid==${selectedLine}%26%26stationid=="${selectedStation}"%26%26subprocessid=="${selectedProcess}"%26%26modelid=="${modelId}"`;
      const data = await Promise.all([
        dispatch('getModelInputs', query),
        dispatch('getModelFiles', query),
        dispatch('getModelOutputs', query),
      ]);
      const modelDetails = data.reduce((a, b) => {
        const key = Object.keys(b)[0];
        const value = b[key];
        // eslint-disable-next-line
        a[key] = value;
        return a;
      }, {});
      commit('setModelDetails', modelDetails);
    },

    fetchDeployedModels: async ({ state, commit, dispatch }, modelId) => {
      const {
        selectedLine,
        selectedStation,
        selectedProcess,
        selectedStationName,
        selectedSubstationName,
        selectedProcessName,
      } = state;
      const query = `?query=lineid==${selectedLine}%26%26stationid=="${selectedStation}"%26%26subprocessid=="${selectedProcess}"%26%26modelid=="${modelId}"`;
      const models = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.MODEL_DEPLOYMENT,
          query,
        },
        { root: true },
      );
      let modelList = [];
      if (models) {
        modelList = models.map((l) => ({
          ...l,
          logs: [],
        }));
        Promise.all(modelList.map(async (l) => {
          let list = await dispatch(
            'element/getRecords',
            {
              elementName: 'modeldeploymentorderslogs',
              query: `?query=modeldeploymentorderid=="${l._id}"`,
            },
            { root: true },
          );
          list = list.map((m) => ({
            ...m,
            stationid: selectedStationName,
            substationid: selectedSubstationName,
            subprocessid: selectedProcessName,
            operationname: l.operationname,
          }));
          l.logs = list;
        }));
      }
      commit('setDeployedModels', modelList);
    },

    getModelInputs: async ({ dispatch }, query) => {
      const modelInputs = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.MODEL_INPUTS,
          query,
        },
        { root: true },
      );
      const inputs = modelInputs.map(({ parameterid, _id }) => ({
        parameterId: parameterid,
        id: _id,
      }));
      return { modelInputs: inputs };
    },

    getModelFiles: async ({ dispatch }, query) => {
      const modelFiles = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.MODEL_FILES,
          query,
        },
        { root: true },
      );
      const files = modelFiles.map(({
        originalFilename,
        _id,
        extension,
        downloadlink,
      }) => ({
        originalFilename,
        extension,
        downloadLink: downloadlink,
        id: _id,
      }));
      return { modelFiles: files };
    },

    getModelOutputs: async ({ dispatch }, query) => {
      const modelOutputs = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.MODEL_OUTPUTS,
          query,
        },
        { root: true },
      );
      const outputs = modelOutputs.map(({ mltransformationoutputid, _id }) => ({
        transformationId: mltransformationoutputid,
        id: _id,
      }));
      return { modelOutputs: outputs };
    },

    createInputParameter: async (
      { state, commit, dispatch },
      { modelId, parameterId },
    ) => {
      const {
        selectedLine,
        selectedStation,
        selectedSubstation,
        selectedProcess,
      } = state;
      const payload = {
        lineid: selectedLine,
        stationid: selectedStation,
        substationid: selectedSubstation,
        subprocessid: selectedProcess,
        assetid: ASSETID,
        modelid: modelId,
        parameterid: parameterId,
      };
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: ELEMENTS.MODEL_INPUTS,
          payload,
        },
        { root: true },
      );
      if (created) {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'success',
            message: 'PARAMETER_CREATE',
          },
          { root: true },
        );
      } else {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'error',
            message: 'PARAMETER_CREATE',
          },
          { root: true },
        );
      }
      return created;
    },

    deleteInputParameter: async ({ commit, dispatch }, modelInputId) => {
      const deleted = await dispatch(
        'element/deleteRecordById',
        {
          elementName: ELEMENTS.MODEL_INPUTS,
          id: modelInputId,
        },
        { root: true },
      );
      if (deleted) {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'success',
            message: 'PARAMETER_DELETE',
          },
          { root: true },
        );
      } else {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'error',
            message: 'PARAMETER_DELETE',
          },
          { root: true },
        );
      }
      return deleted;
    },

    createOutputTransformation: async (
      { state, commit, dispatch },
      { modelId, transformationId },
    ) => {
      const {
        selectedLine,
        selectedStation,
        selectedSubstation,
        selectedProcess,
      } = state;
      const payload = {
        lineid: selectedLine,
        stationid: selectedStation,
        substationid: selectedSubstation,
        subprocessid: selectedProcess,
        assetid: ASSETID,
        modelid: modelId,
        mltransformationoutputid: transformationId,
      };
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: ELEMENTS.MODEL_OUTPUTS,
          payload,
        },
        { root: true },
      );
      if (created) {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'success',
            message: 'TRANSFORMATION_CREATE',
          },
          { root: true },
        );
      } else {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'error',
            message: 'TRANSFORMATION_CREATE',
          },
          { root: true },
        );
      }
      return created;
    },

    deleteOutputTransformation: async ({ commit, dispatch }, modelOutputId) => {
      const deleted = await dispatch(
        'element/deleteRecordById',
        {
          elementName: ELEMENTS.MODEL_OUTPUTS,
          id: modelOutputId,
        },
        { root: true },
      );
      if (deleted) {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'success',
            message: 'TRANSFORMATION_DELETE',
          },
          { root: true },
        );
      } else {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'error',
            message: 'TRANSFORMATION_DELETE',
          },
          { root: true },
        );
      }
      return deleted;
    },

    updateModelFile: async ({ state, dispatch }, { modelId, id }) => {
      const {
        selectedLine,
        selectedStation,
        selectedSubstation,
        selectedProcess,
      } = state;
      const payload = {
        lineid: selectedLine,
        stationid: selectedStation,
        substationid: selectedSubstation,
        subprocessid: selectedProcess,
        modelid: modelId,
      };
      await dispatch(
        'element/updateRecordById',
        {
          elementName: ELEMENTS.MODEL_FILES,
          id,
          payload,
        },
        { root: true },
      );
    },

    createNewModel: async ({ state, commit, dispatch }, payload) => {
      const {
        selectedLine,
        selectedStation,
        selectedSubstation,
        selectedProcess,
      } = state;
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: ELEMENTS.MODELS,
          payload: {
            ...payload,
            lineid: selectedLine,
            stationid: selectedStation,
            substationid: selectedSubstation,
            subprocessid: selectedProcess,
            assetid: ASSETID,
          },
        },
        { root: true },
      );
      if (created && created.id) {
        commit('setCreatedModelId', created.id);
        await dispatch('getModels');
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'success',
            message: 'MODEL_CREATE',
          },
          { root: true },
        );
      } else {
        commit('setCreatedModelId', null);
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'error',
            message: 'MODEL_CREATE',
          },
          { root: true },
        );
      }
      return created;
    },

    getModelById: async ({ dispatch }, id) => {
      const model = await dispatch(
        'element/getRecordById',
        {
          elementName: ELEMENTS.MODELS,
          id,
        },
        { root: true },
      );
      if (model) {
        return {
          // eslint-disable-next-line
          id: model._id,
          name: model.modelname,
          description: model.modeldescription,
          lastModified: formatDate(model.modifiedtimestamp),
          status: 'N.A',
        };
      }
      return false;
    },

    createNewDeploymentOrder: async ({
      state,
      commit,
      dispatch,
      getters,
    }, modelId) => {
      const {
        selectedLine,
        selectedStation,
        selectedSubstation,
        selectedProcess,
      } = state;
      await dispatch('fetchModelDetails', modelId);
      const { isDeploymentAllowed } = getters;
      if (isDeploymentAllowed) {
        const status = DEPLOYMENT_STATUS;
        const created = await dispatch(
          'element/postRecord',
          {
            elementName: ELEMENTS.MODEL_DEPLOYMENT,
            payload: {
              lineid: selectedLine,
              stationid: selectedStation,
              substationid: selectedSubstation,
              subprocessid: selectedProcess,
              status,
              operationname: OPERATION_NAME,
              modelid: modelId,
              assetid: ASSETID,
            },
          },
          { root: true },
        );
        if (created && created.id) {
          const eventData = {
            key: modelId,
            status,
          };
          commit('setLastStatusUpdate', eventData);
          commit(
            'helper/setAlert',
            {
              show: true,
              type: 'success',
              message: 'MODEL_ORDER_CREATE',
            },
            { root: true },
          );
        } else {
          commit(
            'helper/setAlert',
            {
              show: true,
              type: 'error',
              message: 'MODEL_ORDER_CREATE',
            },
            { root: true },
          );
        }
        return created;
      }
      commit(
        'helper/setAlert',
        {
          show: true,
          type: 'error',
          message: 'MODEL_CONFIGURE',
        },
        { root: true },
      );
      return false;
    },

    deleteModel: async ({ state, commit, dispatch }, modelId) => {
      const { modelDetails } = state;
      const deleteInputs = dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: ELEMENTS.MODEL_INPUTS,
          queryParam: `?query=modelid=="${modelId}"`,
        },
        { root: true },
      );
      const deleteOutputs = dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: ELEMENTS.MODEL_OUTPUTS,
          queryParam: `?query=modelid=="${modelId}"`,
        },
        { root: true },
      );
      const { modelFiles } = modelDetails;
      const deleteFiles = await Promise.all([
        modelFiles.forEach((file) => dispatch(
          'file/deleteFile',
          {
            elementName: ELEMENTS.MODEL_FILES,
            id: file.id,
          },
          { root: true },
        )),
      ]);
      const deleteModel = dispatch(
        'element/deleteRecordById',
        {
          elementName: ELEMENTS.MODELS,
          id: modelId,
        },
        { root: true },
      );
      const deleted = await Promise.all([
        deleteInputs,
        deleteFiles,
        deleteOutputs,
        deleteModel,
      ]);
      if (deleted) {
        await dispatch('getModels');
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'success',
            message: 'MODEL_DELETE',
          },
          { root: true },
        );
      } else {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'error',
            message: 'MODEL_DELETE',
          },
          { root: true },
        );
      }
    },
  },
  getters: {
    isDeploymentAllowed: ({ modelDetails }) => {
      let isAllowed = false;
      if (modelDetails) {
        // const isInputConfigured = modelDetails.modelInputs.length > 0;
        const isFileConfigured = modelDetails.modelFiles.length > 0;
        // const isOutputConfigured = modelDetails.modelOutputs.length > 0;
        isAllowed = isFileConfigured;
      }
      return isAllowed;
    },
  },
});
