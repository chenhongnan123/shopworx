import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    lines: [],
    stations: [],
    processes: [],
    sublines: [],
    subStations: [],
  },
  mutations: {
    setLines: set('lines'),
    setStations: set('stations'),
    setProcesses: set('processes'),
    setSublines: set('sublines'),
    setSubStations: set('subStations'),
  },
  actions: {
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
          stationcolor: 0,
          // numberIndex: index + 1,
        }));
      }
      commit('setSubStations', subStations);
      return true;
    },
  },
});
