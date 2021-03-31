import { set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

const ELEMENTS = {
  LINE: 'line',
  SUBLINE: 'subline',
  STATION: 'station',
  SUBSTATION: 'substation',
  PARAMETERS: 'parameters',
  PARAMETER_CATEGORY: 'category',
};

export default ({
  namespaced: true,
  state: {
    elements: [],
    lines: [],
    defaultParameters: [],
  },
  mutations: {
    setElements: set('elements'),
    setLines: set('lines'),
    setDefaultParameters: set('defaultParameters'),
  },
  actions: {
    getElements: async ({ commit, rootState, dispatch }) => {
      const { activeSite } = rootState.user;
      const elements = await dispatch(
        'element/getElementsBySite',
        activeSite,
        { root: true },
      );
      if (elements && elements.length) {
        commit('setElements', elements);
      }
    },

    getDefaultParameters: async ({ dispatch, commit }) => {
      const params = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.PARAMETER_CATEGORY,
          query: '?query=flagforrawdata==true',
        },
        { root: true },
      );
      commit('setDefaultParameters', sortArray(params, 'name'));
    },

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

    getSublines: async ({ dispatch }, lineId) => {
      const sublines = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.SUBLINE,
          query: `?query=lineid==${lineId}`,
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

    getSubStations: async ({ dispatch }, stationId) => {
      const subStations = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.SUBSTATION,
          query: `?query=stationid=="${stationId}"`,
        },
        { root: true },
      );
      return sortArray(subStations, 'name');
    },

    getParameters: async ({ dispatch }, subStationId) => {
      const parameters = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.PARAMETERS,
          query: `?query=substationid=="${subStationId}"`,
        },
        { root: true },
      );
      return sortArray(parameters, 'name');
    },
  },
  getters: {},
});
