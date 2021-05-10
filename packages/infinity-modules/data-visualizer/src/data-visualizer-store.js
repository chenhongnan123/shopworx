import { set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';
import { formatDate } from '@shopworx/services/util/date.service';
import ElementService from '@shopworx/services/api/element.service';

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
    records: null,
    columns: [],
    totalCount: 0,
    fetching: false,
    downloadLogs: [],
    logCount: 0,
    fetchingLogs: false,
  },
  mutations: {
    setElements: set('elements'),
    setLines: set('lines'),
    setRecords: set('records'),
    setColumns: set('columns'),
    setTotalCount: set('totalCount'),
    setFetching: set('fetching'),
    setDownloadLogs: set('downloadLogs'),
    setLogCount: set('logCount'),
    setFetchingLogs: set('fetchingLogs'),
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

    getDefaultParameters: async ({ dispatch }, subStationId) => {
      const params = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.PARAMETER_CATEGORY,
          query: '?query=flagforrawdata==true',
        },
        { root: true },
      );
      if (params && params.length) {
        const result = await Promise.all(params.map(async (param) => dispatch('getParameters', {
          subStationId,
          categoryId: param.id,
        })));
        const parameters = result.flat();
        if (parameters && parameters.length) {
          return parameters.map((p) => p.name);
        }
      }
      return [];
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

    getParameters: async ({ dispatch }, { subStationId, categoryId }) => {
      const parameters = await dispatch(
        'element/getRecords',
        {
          elementName: ELEMENTS.PARAMETERS,
          query: `?query=substationid=="${subStationId}"%26%26parametercategory=="${categoryId}"`,
        },
        { root: true },
      );
      return parameters;
    },

    getDownloadLog: async ({ rootState, commit }, { pageSize, pageNumber }) => {
      commit('setFetchingLogs', true);
      const { activeSite } = rootState.user;
      const { data } = await ElementService.getCollectionRecords(
        'datadownload',
        `?query=siteId==${activeSite}&pagenumber=${pageNumber}&pagesize=${pageSize}`,
      );
      if (data && data.results) {
        commit('setDownloadLogs', data.results);
        commit('setLogCount', data.totalCount);
      } else {
        commit('setDownloadLogs', []);
        commit('setLogCount', 0);
      }
      commit('setFetchingLogs', false);
    },

    createDownloadRequest: async ({ dispatch }, {
      dateFrom,
      dateTo,
      emailIds,
      elementName,
      fields,
    }) => {
      const queryParam = `?datefrom=${dateFrom}&dateto=${dateTo}`;
      const payload = {
        emailIds,
        elementName,
        fields,
      };
      try {
        const { data } = await ElementService.downloadData(queryParam, payload);
        if (data && data.id) {
          await dispatch('getDownloadLog');
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
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
