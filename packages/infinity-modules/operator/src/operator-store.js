import { set, toggle } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

export default {
  namespaced: true,
  state: {
    assets: {},
    filter: false,
    addOperatorDialog: false,
    authDialog: false,
    isApply: false,
    departmentList: [],
    positionList: [],
    operatorList: [],
    authcodeList: [],
    positionauthList: [],
    departmentValue: '',
    positionValue: '',
    selectedPosition: {},
  },
  mutations: {
    setAssets: set('assets'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setApply: set('isApply'),
    setAddOperatorDialog: set('addOperatorDialog'),
    setAuthDialog: set('authDialog'),
    setDepartmentList: set('departmentList'),
    setPositionList: set('positionList'),
    setPositionAuthList: set('positionauthList'),
    setAuthCodeList: set('authcodeList'),
    setOperatorList: set('operatorList'),
    setDepartmentValue: set('departmentValue'),
    setPositionValue: set('positionValue'),
    setSelectedPosition: set('selectedPosition'),
  },
  actions: {
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
    postBulkRecords: async ({ dispatch }, { payload, name }) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: name,
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    updateRecord: async ({ dispatch }, postData) => {
      const { id, payload, element } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: element,
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteRecord: async ({ dispatch }, postData) => {
      const { id, element } = postData;
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: element,
          queryParam: `?query=id=="${id}"`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    deleteRecordById: async ({ dispatch }, postData) => {
      const { id, element } = postData;
      const deleteParameter = await dispatch(
        'element/deleteRecordById',
        {
          elementName: element,
          id,
        },
        { root: true },
      );
      return deleteParameter;
    },
    createRecord: async ({ dispatch }, postData) => {
      const { payload, element } = postData;
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: element,
          payload,
        },
        { root: true },
      );
      return created;
    },
    updateOperator: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'operator',
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteOperator: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'operator',
          queryParam: `?query=id=="${id}"`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    createOperator: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'operator',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createOperatorList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'operator',
          payload,
        },
        { root: true },
      );
      return created;
    },
    getDepartments: async ({ dispatch, commit }, query) => {
      const department = await dispatch(
        'element/getRecords',
        {
          elementName: 'department',
          query,
        },
        { root: true },
      );
      commit('setDepartmentList', department);
      return department;
    },
    getPositions: async ({ dispatch, commit }, query) => {
      const position = await dispatch(
        'element/getRecords',
        {
          elementName: 'position',
          query,
        },
        { root: true },
      );
      commit('setPositionList', position);
      return position;
    },
    getPositionAuths: async ({ dispatch, commit }, query) => {
      const auth = await dispatch(
        'element/getRecords',
        {
          elementName: 'positionauth',
          query,
        },
        { root: true },
      );
      commit('setPositionAuthList', auth);
      return auth;
    },
    getAuthCodes: async ({ dispatch, commit }, query) => {
      const auth = await dispatch(
        'element/getRecords',
        {
          elementName: 'authcode',
          query,
        },
        { root: true },
      );
      commit('setAuthCodeList', auth);
      return auth;
    },
    getRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'operator',
          query,
        },
        { root: true },
      );
      let operator = [];
      if (list && list.length) {
        operator = sortArray(list, 'operatorcode').map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setOperatorList', operator);
      return operator;
    },
  },
};
