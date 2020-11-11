import { set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    lines: [],
    selectedLine: null,
    selectedSubline: null,
    selectedStation: null,
    selectedSubstation: null,
    selectedProcess: null,
    selectedProcessName: null,
    lineDetails: [],
    fetchingLineDetails: false,
    models: [],
    fetchingModels: false,
  },
  mutations: {
    setLines: set('lines'),
    setSelectedLine: set('selectedLine'),
    setSelectedSubline: set('selectedSubline'),
    setSelectedStation: set('selectedStation'),
    setSelectedSubstation: set('selectedSubstation'),
    setSelectedProcess: set('selectedProcess'),
    setSelectedProcessName: set('selectedProcessName'),
    setLineDetails: set('lineDetails'),
    setFetchingLineDetails: set('fetchingLineDetails'),
    setModels: set('models'),
    setFetchingModels: set('fetchingModels'),
  },
  actions: {
    getLines: async ({ dispatch, commit }) => {
      const lines = await dispatch(
        'element/getRecords',
        {
          elementName: 'line',
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
          elementName: 'subline',
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
          elementName: 'station',
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
          elementName: 'substation',
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
          elementName: 'process',
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
          elementName: 'models',
          query: `?query=lineid==${selectedLine}%26%26stationid=="${selectedStation}"%26%26subprocessid=="${selectedProcess}"`,
        },
        { root: true },
      );
      commit('setModels', sortArray(models, 'modelname'));
      commit('setFetchingModels', false);
    },
  },
});
