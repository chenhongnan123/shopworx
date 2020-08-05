import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    lines: [],
    sublines: [],
    subStations: [],
    roadMaps: [],
    sublinesbylines: [],
    selectedLine: {},
    filter: false,
    subStationbySubline: [],
    ngCodeConfigRecord: [],
  },
  mutations: {
    setLines: set('lines'),
    setSublines: set('sublines'),
    setSubStations: set('subStations'),
    setroadMapsList: set('roadMaps'),
    setSublinesbyline: set('sublinesbylines'),
    setSelectedLine: set('selectedLine'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setSubstationbySubline: set('subStationbySubline'),
    setNgCodeConfigRecord: set('ngCodeConfigRecord'),
  },
  actions: {
    getNgCodeConfig: async ({ dispatch, commit }, query) => {
      const ngcodelist = await dispatch(
        'element/getRecords',
        {
          elementName: 'ngcodeconfig',
          query,
        },
        { root: true },
      );
      commit('setNgCodeConfigRecord', ngcodelist);
      return true;
    },
    getSublinebyline: async ({ dispatch, commit }, query) => {
      const sublines = await dispatch(
        'element/getRecords',
        {
          elementName: 'subline',
          query,
        },
        { root: true },
      );
      commit('setSublinesbyline', sublines);
      return true;
    },
    getSubstationbySubline: async ({ dispatch, commit }, query) => {
      const subStations = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      debugger;
      commit('setSubstationbySubline', subStations);
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
    createNgConfig: async ({ dispatch, commit }, payload) => {
      let listNg;
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'ngcodeconfig',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const ngcodeconfig = await dispatch(
          'element/getRecords',
          {
            elementName: 'ngcodeconfig',
            query,
          },
          { root: true },
        );
        if (ngcodeconfig) {
          commit('setNgCodeConfigRecord', []);
          listNg = ngcodeconfig;
          commit('setNgCodeConfigRecord', listNg);
          return ngcodeconfig;
        }
      }
      return created;
      // debugger;
      // commit('setNgCodeConfigRecord', listNg);
      // return true;
    },
  },
});
