import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    filter: false,
    roadmapList: [],
    roadmapDetails: [],
    roadmapTypeList: [],
    subStationList: [],
    stationList: [],
    subLineList: [],
    createdRoadmap: {},
    productList: [],
    stationNamebySubline: [],
    subStationNamebyStation: [],
    preSubStationList: [],
    lineList: [],
    preStationList: [],
    setFilteredroadmapType: null,
  },
  mutations: {
    setSelectedRoadmapType: set('setFilteredroadmapType'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setRoadmapList: set('roadmapList'),
    setRoadmapDetails: set('roadmapDetails'),
    setRoadmapTypeList: set('roadmapTypeList'),
    setSubStationList: set('subStationList'),
    setStationList: set('stationList'),
    setPreStationList: set('preStationList'),
    setSubLineList: set('subLineList'),
    setCreatedRoadmap: set('createdRoadmap'),
    setProductList: set('productList'),
    setStationNamebySubline: set('stationNamebySubline'),
    setSubStationNamebyStation: set('subStationNamebyStation'),
    setPreSubStationList: set('preSubStationList'),
    setLineList: set('lineList'),
  },
  actions: {
    getLineList: async ({ dispatch, commit }, query) => {
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
    getPreSubStationList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setPreSubStationList', list);
      return list;
    },
    getStationNamesbysubline: async ({ dispatch, commit }, query) => {
      const stationNamebySubline = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      commit('setStationNamebySubline', stationNamebySubline);
      return true;
    },
    getSubStationNamesbyStation: async ({ dispatch, commit }, query) => {
      const subStationNamebyStation = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setSubStationNamebyStation', subStationNamebyStation);
      return true;
    },
    getRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmaplist',
          query,
        },
        { root: true },
      );
      let roadmap = [];
      if (list && list.length) {
        roadmap = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setRoadmapList', roadmap);
      return roadmap;
    },
    getRoadmapTypeList: async ({ dispatch, commit }, query) => {
      const roadmap = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmaptype',
          query,
        },
        { root: true },
      );
      commit('setRoadmapTypeList', roadmap);
      return roadmap;
    },
    getProductListFromRoadmapName: async ({ dispatch, commit }, query) => {
      const products = await dispatch(
        'element/getRecords',
        {
          elementName: 'part',
          query,
        },
        { root: true },
      );
      commit('setProductList', products);
      return products;
    },
    createProductDetails: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'productdetails',
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    getSubStationList: async ({ dispatch, commit }, query) => {
      const roadmap = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setSubStationList', roadmap);
      return roadmap;
    },
    getStationList: async ({ dispatch, commit }, query) => {
      const roadmap = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      commit('setStationList', roadmap);
      return roadmap;
    },
    getPreStationList: async ({ dispatch, commit }, query) => {
      const roadmap = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      commit('setPreStationList', roadmap);
      return roadmap;
    },
    getSubLineList: async ({ dispatch, commit }, query) => {
      const roadmap = await dispatch(
        'element/getRecords',
        {
          elementName: 'subline',
          query,
        },
        { root: true },
      );
      commit('setSubLineList', roadmap);
      return roadmap;
    },
    deleteRoadmapById: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'roadmaplist',
          queryParam: `?query=id=="${id}"`,
        },
        { root: true },
      );
      if (deleted) {
        const records = await dispatch('getRecords');
        if (records) {
          return true;
        }
      }
      return deleted;
    },
    updateRoadmap: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'roadmaplist',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        const records = await dispatch('getRecords');
        if (records) {
          return true;
        }
      }
      return created;
    },

    updateRoadmapDetails: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'roadmapdetails',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      return created;
    },

    deleteRoadmapDetails: async ({ dispatch, commit }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'roadmapdetails',
          queryParam: `?query=id==${id.id}`,
        },
        { root: true },
      );
      if (deleted) {
        const query = `?query=roadmapid=="${id.roadmapid}"`;
        const roadmap = await dispatch(
          'element/getRecords',
          {
            elementName: 'roadmapdetails',
            query,
          },
          { root: true },
        );
        if (roadmap) {
          commit('setRoadmapDetails', roadmap);
          return roadmap;
        }
      }
      return deleted;
    },
    getDetailsRecords: async ({ dispatch, commit }, query) => {
      const roadmap = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmapdetails',
          query,
        },
        { root: true },
      );
      commit('setRoadmapDetails', roadmap);
      return roadmap;
    },
    createRoadmapDetails: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'roadmapdetails',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createBulkRoadmapDetails: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'roadmapdetails',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createRoadmap: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'roadmaplist',
          payload,
        },
        { root: true },
      );
      if (created) {
        commit('setCreatedRoadmap', created);
        const records = await dispatch('getRecords');
        if (records) {
          return true;
        }
      }
      return created;
    },
  },
});
