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
  },
  actions: {
    getBomListRecords: async ({ dispatch, commit }, query) => {
      const bomlist = await dispatch(
        'element/getRecords',
        {
          elementName: 'bomlist',
          query,
        },
        { root: true },
      );
      commit('setBomList', bomlist);
    },
    getBomDetailsListRecords: async ({ dispatch, commit }, query) => {
      const bomdetails = await dispatch(
        'element/getRecords',
        {
          elementName: 'bomdetails',
          query,
        },
        { root: true },
      );
      commit('setBomDetailsList', bomdetails);
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
    getParameterList: async ({ dispatch, commit }, query) => {
      const parameterList = await dispatch(
        'element/getRecords',
        {
          elementName: 'parameters',
          query,
        },
        { root: true },
      );
      commit('setParameterList', parameterList.filter((parameter) => parameter.parametercategory === '3' || parameter.parametercategory === '4'));
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
    deleteBomDetail: async ({ dispatch }, id) => {
      const deleteBomdetail = await dispatch(
        'element/deleteRecord',
        {
          elementName: 'bomdetails',
          id,
        },
        { root: true },
      );
      console.log(deleteBomdetail, 'deleteBomdetail');
      return deleteBomdetail;
    },
  },
});
