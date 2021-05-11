import { set, toggle } from '@shopworx/services/util/store.helper';

export default {
  namespaced: true,
  state: {
    assets: {},
    filter: false,
    isApply: false,
    warehouseList: [],
    locationList: [],
    partList: [],
    warehouseValue: '',
    locationValue: '',
    partValue: '',
    typeValue: '',
    bulktypeValue: [
      {
        key: 2,
        description: '手工出库',
        type: 'Manual-OutBound',
      },
    ],
    bulkrecordList: [],
    // dialog
    addOutboundDialog: false,
  },
  mutations: {
    setAssets: set('assets'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setApply: set('isApply'),
    setWarehouseList: set('warehouseList'),
    setLocationList: set('locationList'),
    setPartList: set('partList'),
    setWarehouseValue: set('warehouseValue'),
    setLocationValue: set('locationValue'),
    setPartValue: set('partValue'),
    setBulkTypeValue: set('bulktypeValue'),
    setBulkrecordList: set('bulkrecordList'),
    // dialog
    setAddOutboundDialog: set('addOutboundDialog'),
  },
  actions: {
    getBulkType: async ({ dispatch, commit }) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'bulktype',
          query: '?query=key==2',
        },
        { root: true },
      );
      if (list.length >= 1) {
        commit('setBulkTypeValue', list);
      }
      return list;
    },
    getAssets: async ({ commit, dispatch }) => {
      const assets = await dispatch(
        'industry/getAssets',
        null,
        { root: true },
      );
      if (assets && assets.length) {
        commit('setAssets', assets);
        return true;
      }
      return false;
    },
    updateBulkrecord: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'bulkrecord',
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteBulkrecord: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'bulkrecord',
          queryParam: `?query=planid=="${id}"`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    createBulkrecord: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'bulkrecord',
          payload,
        },
        { root: true },
      );
      return created;
    },
    getRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'bulkrecord',
          query,
        },
        { root: true },
      );
      let record = [];
      if (list && list.length) {
        record = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setBulkrecordList', record);
      return record;
    },
    deleteRecordById: async ({ dispatch }, { id, name }) => {
      const deleterecord = await dispatch(
        'element/deleteRecordById',
        {
          elementName: name,
          id,
        },
        { root: true },
      );
      return deleterecord;
    },
    getWarehouseList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'warehouse',
          query,
        },
        { root: true },
      );
      commit('setWarehouseList', list);
      return list;
    },
    getLocationLists: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'location',
          query,
        },
        { root: true },
      );
      commit('setLocationList', list);
      return list;
    },
    getPartLists: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'sparepart',
          query,
        },
        { root: true },
      );
      commit('setPartList', list);
      return list;
    },
  },
};
