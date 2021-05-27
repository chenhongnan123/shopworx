import { set, toggle } from '@shopworx/services/util/store.helper';

export default {
  namespaced: true,
  state: {
    assets: {},
    filter: false,
    isApply: false,
    planList: [],
    lineList: [],
    sublineList: [],
    machineList: [],
    solutionList: [],
    taskList: [],
    taskOperatorList: [],
    lineValue: '',
    sublineValue: '',
    machineValue: '',
    typeValue: '',
    sparepartList: [],
    cronList: [],
    // dialog
    addPlanDialog: false,
    addSparepartDialog: false,
    editSparepartDialog: false,
  },
  mutations: {
    setAssets: set('assets'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setApply: set('isApply'),
    setPlanList: set('planList'),
    setLineList: set('lineList'),
    setSublineList: set('sublineList'),
    setMachineList: set('machineList'),
    setSolutionList: set('solutionList'),
    setTaskList: set('taskList'),
    setTaskOperatorList: set('taskOperatorList'),
    setLineValue: set('lineValue'),
    setSublineValue: set('sublineValue'),
    setMachineValue: set('machineValue'),
    setTypeValue: set('typeValue'),
    setCronList: set('cronList'),
    setSparepartList: set('sparepartList'),
    // dialog
    setAddPlanDialog: set('addPlanDialog'),
    setAddSparepartDialog: set('addSparepartDialog'),
    setEditSparepartDialog: set('editSparepartDialog'),
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
    updatePlan: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'maintenanceplan',
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deletePlan: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'maintenanceplan',
          queryParam: `?query=planid=="${id}"`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    createPlan: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'maintenanceplan',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createSparepartInPlanning: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'sparepartsinplanning',
          payload,
        },
        { root: true },
      );
      return created;
    },
    updateSparepartInPlanning: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const puted = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'sparepartsinplanning',
          id,
          payload,
        },
        { root: true },
      );
      return puted;
    },
    deleteSparepartInPlanning: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'sparepartsinplanning',
          queryParam: `?query=_id=="${id}"`,
        },
        { root: true },
      );
      return deleted;
    },
    getSparepartInPlanning: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'sparepartsinplanning',
          query,
        },
        { root: true },
      );
      commit('setSparepartList', list);
      return list;
    },
    createPlanList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'maintenanceplan',
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
          elementName: 'maintenanceplan',
          query,
        },
        { root: true },
      );
      let plan = [];
      if (list && list.length) {
        plan = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setPlanList', plan);
      return plan;
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
    getMachineList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'machine',
          query,
        },
        { root: true },
      );
      commit('setMachineList', list);
      return list;
    },
    getSolutionRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'solution',
          query,
        },
        { root: true },
      );
      commit('setSolutionList', list);
      return list;
    },
    getTaskList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'task',
          query,
        },
        { root: true },
      );
      commit('setTaskList', list);
      return list;
    },
    getTaskOperatorList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'taskoperator',
          query,
        },
        { root: true },
      );
      commit('setTaskOperatorList', list);
      return list;
    },
    getCronRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'cron',
          query,
        },
        { root: true },
      );
      commit('setCronList', list);
      return list;
    },
  },
};
