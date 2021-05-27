import { set, toggle } from '@shopworx/services/util/store.helper';

export default {
  namespaced: true,
  state: {
    assets: {},
    isApply: false,
    planList: [],
    lineList: [],
    sublineList: [],
    machineList: [],
    solutionList: [],
    solutiondetailList: [],
    taskList: [],
    calendartaskList: [],
    operatorList: [],
    taskOperatorList: [],
    sparepartList: [],
    sparepartinplanningList: [],
    taskdetailList: [],
    replacementList: [],
    listfilter: false,
    listlineValue: '',
    listsublineValue: '',
    listmachineValue: '',
    listtypeValue: '',
    listmonthValue: '',
    liststatusValue: '',
    startdateValue: '',
    enddateValue: '',
    calendarfilter: false,
    calendarlineValue: '',
    calendarsublineValue: '',
    calendarmachineValue: '',
    calendartypeValue: '',
    monthValue: '',
    calendarstatusValue: '',
    // dialog
    addTaskDialog: false,
    bindOperatorDialog: false,
  },
  mutations: {
    setAssets: set('assets'),
    setApply: set('isApply'),
    setPlanList: set('planList'),
    setLineList: set('lineList'),
    setSublineList: set('sublineList'),
    setMachineList: set('machineList'),
    setSolutionList: set('solutionList'),
    setSolutiondetailList: set('solutiondetailList'),
    setSparepartinplanningList: set('sparepartinplanningList'),
    setSparepartList: set('sparepartList'),
    setTaskList: set('taskList'),
    setCalendarTaskList: set('calendartaskList'),
    setOperatorList: set('operatorList'),
    setTaskOperatorList: set('taskOperatorList'),
    setTaskdetailList: set('taskdetailList'),
    setReplacementList: set('replacementList'),
    // listfilter
    toggleListFilter: toggle('listfilter'),
    setListFilter: set('listfilter'),
    setListLineValue: set('listlineValue'),
    setListSublineValue: set('listsublineValue'),
    setListMachineValue: set('listmachineValue'),
    setListTypeValue: set('listtypeValue'),
    setListMonthValue: set('listmonthValue'),
    setListStatusValue: set('liststatusValue'),
    setStartdateValue: set('startdateValue'),
    setEnddateValue: set('enddateValue'),
    // calendarfilter
    toggleCalendarFilter: toggle('calendarfilter'),
    setCalendarFilter: set('calendarfilter'),
    setCalendarLineValue: set('calendarineValue'),
    setCalendarSublineValue: set('calendarsublineValue'),
    setCalendarMachineValue: set('calendarmachineValue'),
    setCalendarTypeValue: set('calendartypeValue'),
    setMonthValue: set('monthValue'),
    setCalendarStatusValue: set('calendarstatusValue'),
    // dialog
    setAddTaskDialog: set('addTaskDialog'),
    setBindOperatorDialog: set('bindOperatorDialog'),
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
    updateTask: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'task',
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteTask: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'task',
          queryParam: `?query=id=="${id}"`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    createTask: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'task',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createTaskList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'task',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createTaskDetailList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'taskdetail',
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
          elementName: 'task',
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
      commit('setTaskList', plan);
      return plan;
    },
    getTaskList: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'task',
          query,
        },
        { root: true },
      );
      return list;
    },
    getCalendarRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'task',
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
      commit('setCalendarTaskList', plan);
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
    getOperatorList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'operator',
          query,
        },
        { root: true },
      );
      commit('setOperatorList', list);
      return list;
    },
    getOperatorBindMachineList: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'operatorbindmachine',
          query,
        },
        { root: true },
      );
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
    getSolutionDetailRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'solutiondetail',
          query,
        },
        { root: true },
      );
      commit('setSolutiondetailList', list);
      return list;
    },
    getSparepartinplanningRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'sparepartsinplanning',
          query,
        },
        { root: true },
      );
      commit('setSparepartinplanningList', list);
      return list;
    },
    getSparepartRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'sparepartbindmachineposition',
          query,
        },
        { root: true },
      );
      let sparepart = [];
      if (list && list.length) {
        sparepart = list.map((l, index) => ({
          ...l,
          numberIndex: index + 1,
          text: `${l.machinepositionname} - ${l.sparepartname}`,
        }));
      }
      commit('setSparepartList', sparepart);
      return sparepart;
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
    getTaskDetailList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'taskdetail',
          query,
        },
        { root: true },
      );
      commit('setTaskdetailList', list);
      return list;
    },
    getReplacementList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'replacement',
          query,
        },
        { root: true },
      );
      commit('setReplacementList', list);
      return list;
    },
    createOperatorList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'taskoperator',
          payload,
        },
        { root: true },
      );
      return created;
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
    postSystemMessage: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'systemmessage',
          payload,
        },
        { root: true },
      );
      return created;
    },
    updateRecordById: async ({ dispatch }, postData) => {
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
    updateRecordByQuery: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: payload.element,
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    createReplacement: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'replacement',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createRepair: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'repair',
          payload,
        },
        { root: true },
      );
      return created;
    },
  },
};
