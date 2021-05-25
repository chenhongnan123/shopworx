import { set } from '@shopworx/services/util/store.helper';
import ElementService from '@shopworx/services/api/element.service';

export default ({
  namespaced: true,
  state: {
    elements: [],
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
        const defaultElements = elements
          .filter((elem) => elem.element.elementType === 'DEFAULT');
        commit('setElements', defaultElements);
      }
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
      pageNumber,
      pageSize,
    }) => {
      commit('setFetching', true);
      commit('setRecords', null);
      commit('setTotalCount', 0);
      commit('setColumns', columns);
      const queryParam = `?datefrom=${dateFrom}&dateto=${dateTo}&pagenumber=${pageNumber}&pagesize=${pageSize}`;
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
        const records = data.results;
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
