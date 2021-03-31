import { set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';
import { formatDate } from '@shopworx/services/util/date.service';
import dataDownloadElement from './data/dataDownloadElement';

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
    records: null,
    columns: [],
    totalCount: 0,
    fetching: false,
  },
  mutations: {
    setElements: set('elements'),
    setLines: set('lines'),
    setDefaultParameters: set('defaultParameters'),
    setRecords: set('records'),
    setColumns: set('columns'),
    setTotalCount: set('totalCount'),
    setFetching: set('fetching'),
  },
  actions: {
    initElement: async ({ dispatch }) => {
      const { element, tags } = dataDownloadElement;
      const e = await dispatch(
        'element/getElement',
        element.elementName,
        { root: true },
      );
      if (!e) {
        const payload = {
          element,
          tags,
        };
        await dispatch(
          'element/createElementAndTags',
          payload,
          { root: true },
        );
      }
    },

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

    getRecords: async ({ dispatch, commit }, {
      elementName,
      tags,
      columns,
      dateFrom,
      dateTo,
      // mainId,
      pageNumber,
      pageSize,
    }) => {
      commit('setFetching', true);
      commit('setRecords', null);
      commit('setTotalCount', 0);
      commit('setColumns', columns);
      const queryParam = `?datefrom=${dateFrom}&dateto=${dateTo}&pagenumber=${pageNumber}&pagesize=${pageSize}`;
      /* if (mainId) {
        queryParam += `&query=mainid==%22${mainId}%22`;
      } */
      const data = await dispatch(
        'element/getRecordsByTags',
        {
          elementName,
          queryParam,
          request: { tags },
        },
        { root: true },
      );
      if (data && data.results) {
        const records = data.results.map(({ _id, timestamp, ...d }) => ({
          id: _id,
          timestamp: formatDate(timestamp, 'yyyy-MM-dd HH:mm:ss.SSS'),
          ...d,
        }));
        commit('setRecords', data.results);
        commit('setTotalCount', data.totalCount);
        commit('setFetching', false);
        return {
          results: records,
          totalCount: data.totalCount,
        };
      }
      commit('setRecords', []);
      commit('setFetching', false);
      return false;
    },
  },
});
