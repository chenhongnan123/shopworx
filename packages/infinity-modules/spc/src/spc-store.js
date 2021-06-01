import { set, toggle } from '@shopworx/services/util/store.helper';

export default {
  namespaced: true,
  state: {
    addParameterDialog: false,
    settingDialog: false,
    elementList: [],
    elementValue: '',
    filter: false,
    isApply: false,
    subStationElementDeatils: [],
    spcconfigurationList: [],
    spcSetting: null,
  },
  mutations: {
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setApply: set('isApply'),
    setElementList: set('elementList'),
    setParameterList: set('parameterList'),
    setElementValue: set('elementValue'),
    setSubStationIdDeatils: set('subStationElementDeatils'),
    setSpcconfigurationList: set('spcconfigurationList'),
    setAddParameterDialog: set('addParameterDialog'),
    setSettingDialog: set('settingDialog'),
    setSpcSetting: set('spcSetting'),
  },
  actions: {
    initSetting: async ({ commit }) => {
      const setting = localStorage.getItem('spcSetting');
      if (setting) {
        commit('setSpcSetting', JSON.parse(setting));
      } else {
        commit('setSettingDialog', true);
      }
    },
    getRecords: async ({ dispatch }, { query, element }) => {
      const record = await dispatch(
        'element/getRecords',
        {
          elementName: element,
          query,
        },
        { root: true },
      );
      return record;
    },
    updateSpcconfiguration: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'spcconfiguration',
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteSpcconfiguration: async ({ dispatch }, _id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordById',
        {
          elementName: 'spcconfiguration',
          id: _id,
        },
        { root: true },
      );
      return deleteParameter;
    },
    createSpcconfiguration: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'spcconfiguration',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createSpcconfigurationList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'spcconfiguration',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createTagElement: async ({ commit, dispatch }, payload) => {
      const element = await dispatch('element/createElementTags', payload, { root: true });
      if (element) {
        commit('setSubStationIdDeatils', element);
      }
    },
    getSubStationIdElement: async ({ commit, dispatch }, elementName) => {
      const element = await dispatch('element/getElement', elementName, { root: true });
      if (element) {
        commit('setSubStationIdDeatils', element);
      }
    },
    updateTagStatus: async ({ dispatch }, request) => {
      const putTagstatus = await dispatch(
        'element/updateTagById',
        {
          payload: request,
        },
        { root: true },
      );
      return putTagstatus;
    },
    getPageDataList: async ({ commit, dispatch }) => {
      const directionList = await dispatch('element/getRecords', { elementName: 'directions' }, { root: true });
      const categoryList = await dispatch('element/getRecords', { elementName: 'category' }, { root: true });
      const datatypeList = await dispatch('element/getRecords', { elementName: 'datatypes' }, { root: true });
      const lineList = await dispatch('element/getRecords', { elementName: 'line' }, { root: true });
      if (directionList && directionList.length) {
        commit('setDirectionList', directionList);
      }
      if (categoryList && categoryList.length) {
        commit('setCategoryList', categoryList);
      }
      if (datatypeList && datatypeList.length) {
        commit('setDatatypeList', datatypeList);
      }
      if (lineList) {
        commit('setLineList', lineList);
      }
    },
    getDataTypes: async ({ commit, dispatch }, query) => {
      const list = await dispatch('element/getRecords', { elementName: 'datatypes', query }, { root: true });
      let datatypes = [];
      if (list && list.length) {
        datatypes = list.map((l) => ({
          ...l,
          plc: 'Siemens',
          protocol: 'SNAP7',
        }));
      }
      commit('setDatatypes', datatypes);
    },
    getCategory: async ({ commit, dispatch }, query) => {
      const list = await dispatch('element/getRecords', { elementName: 'category', query }, { root: true });
      let category = [];
      if (list && list.length) {
        category = list.map((l) => ({
          ...l,
          plc: 'Siemens',
          protocol: 'SNAP7',
        }));
      }
      commit('setCategoryData', category);
    },
    addDataType: async ({ dispatch }, payload) => {
      const list = await dispatch(
        'element/postRecord',
        {
          elementName: 'datatypes',
          payload,
        },
        { root: true },
      );
      if (list) {
        dispatch('getDataTypes');
        return true;
      }
      return false;
    },
    addCategory: async ({ dispatch }, payload) => {
      const list = await dispatch(
        'element/postRecord',
        {
          elementName: 'category',
          payload,
        },
        { root: true },
      );
      if (list) {
        dispatch('getCategory');
        return true;
      }
      return false;
    },
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
    getParameters: async ({ dispatch, commit }, query) => {
      const station = await dispatch(
        'element/getRecords',
        {
          elementName: 'parameters',
          query,
        },
        { root: true },
      );
      commit('setParameterList', station);
      return station;
    },
    getLineList: async ({ commit, dispatch }, query) => {
      const lineList = await dispatch('element/getRecords', { elementName: 'line', query }, { root: true });
      if (lineList) {
        commit('setLineList', lineList);
      }
      return lineList;
    },
    getSublineList: async ({ commit, dispatch }, query) => {
      const sublineList = await dispatch('element/getRecords', { elementName: 'subline', query }, { root: true });
      if (sublineList) {
        commit('setSublineList', sublineList);
      }
      return sublineList;
    },
    getStationList: async ({ commit, dispatch }, query) => {
      const stationList = await dispatch('element/getRecords', { elementName: 'station', query }, { root: true });
      if (stationList) {
        commit('setStationList', stationList);
      }
      return stationList;
    },
    getSubstationList: async ({ commit, dispatch }, query) => {
      const substationList = await dispatch('element/getRecords', { elementName: 'substation', query }, { root: true });
      if (substationList) {
        commit('setSubstationList', substationList);
      }
      return substationList;
    },
    getParameterListRecords: async ({ dispatch, commit }, query, socketData) => {
      const lineList = await dispatch('element/getRecords', { elementName: 'line' }, { root: true });
      const subLineList = await dispatch('element/getRecords', { elementName: 'subline' }, { root: true });
      const stationList = await dispatch('element/getRecords', { elementName: 'station' }, { root: true });
      const subStationList = await dispatch('element/getRecords', { elementName: 'substation' }, { root: true });
      const parameterList = await dispatch(
        'element/getRecords',
        {
          elementName: 'parameters',
          query,
        },
        { root: true },
      );
      parameterList.forEach(async (item, key) => {
        item.number = key + 1;
        item.datatype = Number(item.datatype);
        if (lineList.length) {
          item.line = lineList.filter((line) => Number(line.id) === item.lineid)[0].name;
        }
        if (subLineList.length) {
          item.subline = subLineList.filter((subline) => subline.id === item.sublineid)[0].name;
        }
        if (stationList.length) {
          item.station = stationList.filter((station) => station.id === item.stationid)[0].name;
        }
        if (subStationList.length) {
          // eslint-disable-next-line max-len
          item.substation = subStationList.filter((substation) => substation.id === item.substationid)[0].name;
        }
        item.parametercategory = Number(item.parametercategory);
        if (socketData && item.name === socketData[item.name]) {
          item.monitorvalue = socketData.monitorvalue;
        }
      });
      commit('setParameterList', parameterList);
      return parameterList;
    },
    getSpcconfigurationListRecords: async ({ dispatch, commit }, query) => {
      const spcconfigurationList = await dispatch(
        'element/getRecords',
        {
          elementName: 'spcconfiguration',
          query,
        },
        { root: true },
      );
      spcconfigurationList.forEach(async (item, key) => {
        item.number = key + 1;
      });
      commit('setSpcconfigurationList', spcconfigurationList);
      return spcconfigurationList;
    },
  },
  getters: {},
};
