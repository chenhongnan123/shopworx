import { set, toggle } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

export default {
  namespaced: true,
  state: {
    assets: {},
    filter: false,
    isApply: false,
    lineList: [],
    sublineList: [],
    machineList: [],
    lineValue: '',
    sublineValue: '',
    // sparepart
    positionList: [],
    sparepartList: [],
    sparepartbindposition: [],
    // operator
    operatorList: [],
    operatorbindmachine: [],
    // document
    documentList: [],
    // dialogs
    addMachineDialog: false,
    addMachinePositionDialog: false,
    bindSparepartDialog: false,
    bindOperatorDialog: false,
    addDocumentDialog: false,
    // tab
    tab: null,
  },
  mutations: {
    setAssets: set('assets'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setApply: set('isApply'),
    setLineList: set('lineList'),
    setSublineList: set('sublineList'),
    setMachineList: set('machineList'),
    setLineValue: set('lineValue'),
    setSublineValue: set('sublineValue'),
    // sparepart
    setPositionList: set('positionList'),
    setSparepartList: set('sparepartList'),
    setSparepartbindposition: set('sparepartbindposition'),
    // operator
    setOperatorList: set('operatorList'),
    setOperatorbindmachine: set('operatorbindmachine'),
    // document
    setDocumentList: set('documentList'),
    // Dialogs
    setAddMachineDialog: set('addMachineDialog'),
    setAddMachinePositionDialog: set('addMachinePositionDialog'),
    setBindSparepartDialog: set('bindSparepartDialog'),
    setBindOperatorDialog: set('bindOperatorDialog'),
    setAddDocumentDialog: set('addDocumentDialog'),
    // tab
    setTab: set('tab'),
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
    deleteRecord: async ({ dispatch }, { id, name }) => {
      const deleteBomdetail = await dispatch(
        'element/deleteRecordById',
        {
          elementName: name,
          id,
        },
        { root: true },
      );
      return deleteBomdetail;
    },
    createRecord: async ({ dispatch }, { payload, element }) => {
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
    updateMachine: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'machine',
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteMachine: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'machine',
          queryParam: `?query=id=="${id}"`,
        },
        { root: true },
      );
      return deleteParameter;
    },
    createMachine: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'machine',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createMachinePosition: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'machineposition',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createMachineDocument: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'machinedocument',
          payload,
        },
        { root: true },
      );
      return created;
    },
    createMachineList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'machine',
          payload,
        },
        { root: true },
      );
      return created;
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
    getSublines: async ({ dispatch, commit }, query) => {
      const subline = await dispatch(
        'element/getRecords',
        {
          elementName: 'subline',
          query,
        },
        { root: true },
      );
      commit('setSublineList', subline);
      return subline;
    },
    getRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'machine',
          query,
        },
        { root: true },
      );
      let machine = [];
      if (list && list.length) {
        machine = sortArray(list, 'machinename').map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setMachineList', machine);
      return machine;
    },
    getPositionRecords: async ({ dispatch, commit }, query) => {
      commit('setPositionList', []);
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'machineposition',
          query,
        },
        { root: true },
      );
      let machineposition = [];
      if (list && list.length) {
        machineposition = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setPositionList', machineposition);
      return machineposition;
    },
    getDocumentRecords: async ({ dispatch, commit }, query) => {
      commit('setDocumentList', []);
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'machinedocument',
          query,
        },
        { root: true },
      );
      let machinedocument = [];
      if (list && list.length) {
        machinedocument = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setDocumentList', machinedocument);
      return machinedocument;
    },
    getSparepartRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'sparepart',
          query,
        },
        { root: true },
      );
      let sparepartList = [];
      if (list && list.length) {
        sparepartList = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setSparepartList', sparepartList);
      return sparepartList;
    },
    getSparepartbindpositionRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'sparepartbindmachineposition',
          query,
        },
        { root: true },
      );
      let sparepartbindposition = [];
      if (list && list.length) {
        sparepartbindposition = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setSparepartbindposition', sparepartbindposition);
      return sparepartbindposition;
    },
    getOperatorRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'operator',
          query,
        },
        { root: true },
      );
      let operatorList = [];
      if (list && list.length) {
        operatorList = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setOperatorList', operatorList);
      return operatorList;
    },
    getOperatorbindmachineRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'operatorbindmachine',
          query,
        },
        { root: true },
      );
      let operatorbindmachine = [];
      if (list && list.length) {
        operatorbindmachine = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setOperatorbindmachine', operatorbindmachine);
      return operatorbindmachine;
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
