import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    lines: [],
    sublines: [],
    subStations: [],
    roadMaps: [],
  },
  mutations: {
    setLines: set('lines'),
    setSublines: set('sublines'),
    setSubStations: set('subStations'),
    setroadMapsList: set('roadMaps'),
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
      const subStations = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setSubStations', subStations);
      return true;
    },
    getroadMapsList: async ({ dispatch, commit }, query) => {
      const roadMaps = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmaplist',
          query,
        },
        { root: true },
      );
      commit('setroadMapsList', roadMaps);
      return true;
    },
  },
});
