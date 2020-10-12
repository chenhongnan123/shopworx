// import HourService from '@shopworx/services/api/hour.service';
import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    bomList: [],
    onboarded: false,
    addBomDialog: false,
    lineList: [],
    sublineList: [],
    substationList: [],
    categoryList: [],
    filter: false,
    lineValue: '',
    sublineValue: '',
    bomDetails: '',
    parameterList: '',
  },
  mutations: {
    setOnboarded: set('onboarded'),
    setBomList: set('bomList'),
    setaddBomDialog: set('addBomDialog'),
    setLineList: set('lineList'),
    setSublineList: set('sublineList'),
    setCategoryList: set('categoryList'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setLineValue: set('lineValue'),
    setSublineValue: set('sublineValue'),
    setBomDetailsList: set('bomDetailsList'),
    setParameterList: set('parameterList'),
    setSubstationList: set('substationList'),
  },
  actions: {
    getBomListRecords: async ({ dispatch, commit, state }, query) => {
      const { lineList } = state;
      let bomlist = await dispatch(
        'element/getRecords',
        {
          elementName: 'bomlist',
          query,
        },
        { root: true },
      );
      if (lineList.length > 0) {
        bomlist = bomlist.map((bom) => ({
          ...bom,
          line: lineList.filter((line) => line.id === bom.lineid)[0]
          && lineList.filter((line) => line.id === bom.lineid)[0].name,
        }));
      }
      commit('setBomList', bomlist);
    },
    getBomDetailsListRecords: async ({ dispatch, commit }, query) => {
      const lineList = await dispatch(
        'element/getRecords',
        { elementName: 'line' },
        { root: true },
      );
      const subLineList = await dispatch(
        'element/getRecords',
        { elementName: 'subline' },
        { root: true },
      );
      const stationList = await dispatch(
        'element/getRecords',
        { elementName: 'station' },
        { root: true },
      );
      const sunStationList = await dispatch(
        'element/getRecords',
        { elementName: 'substation' },
        { root: true },
      );
      const bomdetails = await dispatch(
        'element/getRecords',
        {
          elementName: 'bomdetails',
          query,
        },
        { root: true },
      );
      bomdetails.forEach(async (item) => {
        if (lineList.length) {
          item.line = lineList.filter((line) => Number(line.id) === item.lineid)[0].name;
        }
        if (subLineList.length) {
          item.subline = subLineList
            .filter((subline) => subline.id === item.sublineid)[0].name;
        }
        if (stationList.length) {
          item.station = stationList
            .filter((station) => station.id === item.stationid)[0].name;
        }
        if (sunStationList.length) {
          item.substation = sunStationList
            .filter((substation) => substation.id === item.substationid)[0].name;
        }
      });
      let bomDetailsList = [];
      if (bomdetails && bomdetails.length) {
        bomDetailsList = bomdetails.map((l) => ({
          ...l,
          componentStatusList: [],
        }));
      }
      commit('setBomDetailsList', bomDetailsList);
      return bomdetails;
    },
    getDefaultList: async ({ dispatch, commit }) => {
      const lineList = await dispatch(
        'element/getRecords',
        { elementName: 'line' },
        { root: true },
      );
      const categoryList = await dispatch(
        'element/getRecords',
        { elementName: 'category' },
        { root: true },
      );
      commit('setLineList', lineList);
      commit('setCategoryList', categoryList);
    },
    getSublineList: async ({ commit, dispatch }, query) => {
      const sublineList = await dispatch(
        'element/getRecords',
        { elementName: 'subline', query },
        { root: true },
      );
      if (sublineList) {
        commit('setSublineList', sublineList);
      }
    },
    getSubStationList: async ({ commit, dispatch }, query) => {
      const list = [];
      const obj = {
        name: '-',
        stationid: '-',
      };
      list.push(obj);
      const substationList = await dispatch(
        'element/getRecords',
        { elementName: 'substation', query },
        { root: true },
      );
      substationList.forEach((f) => {
        list.push(f);
      });
      commit('setSubstationList', list);
    },
    getParameterList: async ({ dispatch }, query) => {
      const parameterList = await dispatch(
        'element/getRecords',
        {
          elementName: 'parameters',
          query,
        },
        { root: true },
      );
      return parameterList;
    },
    createBom: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'bomlist',
          payload,
        },
        { root: true },
      );
      return created;
    },
    updateBom: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'bomlist',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteBom: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'bomlist',
          queryParam: `?query=id==${id}`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    deleteAllBomDetails: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'bomdetails',
          queryParam: `?query=bomid==${id}`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    createBomdetailList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'bomdetails',
          payload,
        },
        { root: true },
      );
      return created;
    },
    updateBomDetail: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'bomdetails',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    updateRecordById: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'bomdetails',
          id: payload.id,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteBomDetail: async ({ dispatch }, id) => {
      const deleteBomdetail = await dispatch(
        'element/deleteRecordById',
        {
          elementName: 'bomdetails',
          id,
        },
        { root: true },
      );
      return deleteBomdetail;
    },
  },
});
