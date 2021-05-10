import { set, toggle } from '@shopworx/services/util/store.helper';

export default {
  namespaced: true,
  state: {
    assets: {},
    filter: false,
    isApply: false,
    solutiontypeList: [],
    solutiondetailgroupList: [],
    solutionList: [],
    solutiontypeValue: '',
    solutiondetailList: [],
    // dialog
    addSolutionDialog: false,
    addSolutionDetailDialog: false,
  },
  mutations: {
    setAssets: set('assets'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setApply: set('isApply'),
    setSolutiontypeList: set('solutiontypeList'),
    setSolutiondetailgroupList: set('solutiondetailgroupList'),
    setSolutionList: set('solutionList'),
    setSolutiontypeValue: set('solutiontypeValue'),
    setSolutiondetailList: set('solutiondetailList'),
    // dialog
    setAddSolutionDialog: set('addSolutionDialog'),
    setAddSolutionDetailDialog: set('addSolutionDetailDialog'),
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
    updateSolution: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'solution',
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteSolution: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'solution',
          queryParam: `?query=id=="${id}"`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    createSolution: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'solution',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createSolutionList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'solution',
          payload,
        },
        { root: true },
      );
      return created;
    },
    getSolutiontypes: async ({ dispatch, commit }, query) => {
      const solutiontype = await dispatch(
        'element/getRecords',
        {
          elementName: 'solutiontype',
          query,
        },
        { root: true },
      );
      commit('setSolutiontypeList', solutiontype);
      return solutiontype;
    },
    getSolutiondetailgroups: async ({ dispatch, commit }, query) => {
      const solutiondetailgroup = await dispatch(
        'element/getRecords',
        {
          elementName: 'solutiondetailgroup',
          query,
        },
        { root: true },
      );
      commit('setSolutiondetailgroupList', solutiondetailgroup);
      return solutiondetailgroup;
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
    getRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'solution',
          query,
        },
        { root: true },
      );
      let solution = [];
      if (list && list.length) {
        solution = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setSolutionList', solution);
      return solution;
    },
    getSolutionDetailRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'solutiondetail',
          query,
        },
        { root: true },
      );
      let solutiondetail = [];
      if (list && list.length) {
        solutiondetail = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setSolutiondetailList', solutiondetail);
      return solutiondetail;
    },
    createSolutionDetail: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'solutiondetail',
          payload,
        },
        { root: true },
      );
      return created;
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
    updateSolutionDetail: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'solutiondetail',
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    getDownloadLink: async ({ dispatch }, query) => {
      const link = await dispatch(
        'element/getRecords',
        {
          elementName: 'files',
          query,
        },
        { root: true },
      );
      return link;
    },
  },
};
