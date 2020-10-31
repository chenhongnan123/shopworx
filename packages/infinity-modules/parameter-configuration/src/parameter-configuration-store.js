import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    addParameterDialog: false,
    parameterList: [],
    directionList: [],
    categoryList: [],
    datatypeList: [],
    lineList: [],
    sublineList: [],
    stationList: [],
    substationList: [],
    lineValue: '',
    sublineValue: '',
    stationValue: '',
    substationValue: '',
    filter: false,
    isApply: false,
    dataTypeList: [],
    categoryDataList: [],
    selectedParameterName: '',
    selectedParameterDirection: '',
    selectedParameterCategory: '',
    selectedParameterDatatype: '',
    subStationElementDeatils: [],
    createElementResponse: [],
  },
  mutations: {
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setApply: set('isApply'),
    setAddParameterDialog: set('addParameterDialog'),
    setParameterList: set('parameterList'),
    setDirectionList: set('directionList'),
    setCategoryList: set('categoryList'),
    setDatatypeList: set('datatypeList'),
    setLineList: set('lineList'),
    setSublineList: set('sublineList'),
    setStationList: set('stationList'),
    setSubstationList: set('substationList'),
    setLineValue: set('lineValue'),
    setSublineValue: set('sublineValue'),
    setStationValue: set('stationValue'),
    setSubstationValue: set('substationValue'),
    setDatatypes: set('dataTypeList'),
    setCategoryData: set('categoryDataList'),
    setSelectedParameterName: set('selectedParameterName'),
    setSelectedParameterDirection: set('selectedParameterDirection'),
    setSelectedParameterCategory: set('selectedParameterCategory'),
    setSelectedParameterDatatype: set('selectedParameterDatatype'),
    setSubStationIdDeatils: set('subStationElementDeatils'),
    setCreateElementResponse: set('createElementResponse'),
  },
  actions: {
    createTagElement: async ({ commit, dispatch }, payload) => {
      const element = await dispatch(
        'element/createElementTags',
        payload,
        { root: true },
      );
      if (element) {
        commit('setCreateElementResponse', element);
      }
    },
    getSubStationIdElement: async ({ commit, dispatch }, elementName) => {
      const element = await dispatch(
        'element/getElement',
        elementName,
        { root: true },
      );
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
      const directionList = await dispatch(
        'element/getRecords',
        { elementName: 'directions' },
        { root: true },
      );
      const categoryList = await dispatch(
        'element/getRecords',
        { elementName: 'category' },
        { root: true },
      );
      const datatypeList = await dispatch(
        'element/getRecords',
        { elementName: 'datatypes' },
        { root: true },
      );
      const lineList = await dispatch(
        'element/getRecords',
        { elementName: 'line' },
        { root: true },
      );
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
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'datatypes', query },
        { root: true },
      );
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
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'category', query },
        { root: true },
      );
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
    getLineList: async ({ commit, dispatch }, query) => {
      const lineList = await dispatch(
        'element/getRecords',
        { elementName: 'line', query },
        { root: true },
      );
      if (lineList) {
        commit('setLineList', lineList);
      }
      return lineList;
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
      return sublineList;
    },
    getStationList: async ({ commit, dispatch }, query) => {
      const stationList = await dispatch(
        'element/getRecords',
        { elementName: 'station', query },
        { root: true },
      );
      if (stationList) {
        commit('setStationList', stationList);
      }
      return stationList;
    },
    getSubstationList: async ({ commit, dispatch }, query) => {
      const substationList = await dispatch(
        'element/getRecords',
        { elementName: 'substation', query },
        { root: true },
      );
      if (substationList) {
        commit('setSubstationList', substationList);
      }
      return substationList;
    },
    createParameter: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'parameters',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createParameterList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'parameters',
          payload,
        },
        { root: true },
      );
      return created;
    },
    getParameterListRecords: async ({ dispatch, commit }, query, socketData) => {
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
      // console.log(lineList, 'lineList');
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
        item.parametercategory = Number(item.parametercategory);
        if (socketData && item.name === socketData[item.name]) {
          item.monitorvalue = socketData.monitorvalue;
        }
      });
      commit('setParameterList', parameterList);
      return parameterList;
    },
    updateParameter: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'parameters',
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteParameter: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'parameters',
          queryParam: `?query=id=="${id}"`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    deleteDatatype: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'datatypes',
          queryParam: `?query=id==${id}`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    deleteCategory: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'category',
          queryParam: `?query=id==${id}`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    updateDataType: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'datatypes',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    updateCategory: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'category',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    downloadToPLC: async ({ dispatch }, payload) => {
      const orders = await dispatch(
        'element/postSocket',
        {
          functionName: 'parameterupload',
          payload,
        },
        { root: true },
      );
      return orders;
    },
  },
  getters: {
  },
});
