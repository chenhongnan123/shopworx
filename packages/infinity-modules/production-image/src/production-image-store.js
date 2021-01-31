import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    lineList: [],
    subLineList: [],
    stationList: [],
    subStationList: [],
  },
  mutations: {
    setLineList: set('lineList'),
    setSubLineList: set('subLineList'),
    setStationList: set('stationList'),
    setSubStationList: set('subStationList'),
  },
  actions: {
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
  },
  getters: {},
});
