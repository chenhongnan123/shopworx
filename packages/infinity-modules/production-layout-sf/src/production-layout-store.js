import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    lines: [],
    sublines: [],
    machines: [],
    addSublineDialog: false,
    addMachineDialog: false,
    updateSublineDialog: false,
    updateMachineDialog: false,
    allSublines: [],
    allMachines: [],
    machinesbylines: [],
    selectedLine: {},
    runningOrderList: [],
    roadMapDetailsRecord: [],
    parametersList: [],
    assets: {},
    filter: false,
    sublineByline: [],
    machineBySubline: [],
  },
  mutations: {
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setSelectedLine: set('selectedLine'),
    setLines: set('lines'),
    setSublines: set('sublines'),
    setMachines: set('machines'),
    setAddSublineDialog: set('addSublineDialog'),
    setUpdateSublineDialog: set('updateSublineDialog'),
    setUpdateMachineDialog: set('updateMachineDialog'),
    setAllSublines: set('allSublines'),
    setAllMachines: set('allMachines'),
    setSublinesbyline: set('sublineByline'),
    setMachinebySubLines: set('machineBySubline'),
    setMachinesbyline: set('machinesbylines'),
    setrunningOrderList: set('runningOrderList'),
    setRoadMapDetailsRecord: set('roadMapDetailsRecord'),
    setParametersList: set('parametersList'),
    setAssets: set('assets'),
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
    inactiveElement: async ({ dispatch }, object) => {
      const results = await dispatch(
        'element/changeElementStatusById',
        {
          payload: object,
          elementId: object.elementId,
        },
        { root: true },
      );
      if (results) {
        return results;
      }
      return false;
    },
    getParameterList: async ({ dispatch, commit }) => {
      const parameterRecords = await dispatch(
        'element/getRecords',
        {
          elementName: 'parameters',
        },
        { root: true },
      );
      commit('setParametersList', parameterRecords);
    },
    getRunningOrder: async ({ dispatch, commit }, query) => {
      query = '?query=orderstatus=="Running"';
      const runningOrderList = await dispatch(
        'element/getRecords',
        {
          elementName: 'order',
          query,
        },
        { root: true },
      );
      commit('setrunningOrderList', runningOrderList);
      return true;
    },
    getRoadMapDetailsRecord: async ({ dispatch, commit }) => {
      const roadMapDetailsRecord = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmapdetails',
        },
        { root: true },
      );
      commit('setRoadMapDetailsRecord', roadMapDetailsRecord);
    },
    getLines: async ({ dispatch, commit }, query) => {
      const lineList = await dispatch(
        'element/getRecords',
        {
          elementName: 'line',
          query,
        },
        { root: true },
      );
      commit('setLines', lineList);
      return true;
    },
    getSublines: async ({ dispatch, commit }, query) => {
      const sublines = await dispatch(
        'element/getRecords',
        {
          elementName: 'subline',
          query,
        },
        { root: true },
      );
      commit('setSublines', sublines);
    },
    getMachines: async ({ dispatch, commit }, query) => {
      const machines = await dispatch(
        'element/getRecords',
        {
          elementName: 'machine',
          query,
        },
        { root: true },
      );
      commit('setMachines', machines);
      return true;
    },
    getfilteredSubline: async ({ dispatch, commit }, query) => {
      const sublinebyLines = await dispatch(
        'element/getRecords',
        {
          elementName: 'subline',
          query,
        },
        { root: true },
      );
      commit('setSublinesbyline', sublinebyLines);
      return true;
    },
    getfilteredMachine: async ({ dispatch, commit }, query) => {
      const machinebySubLines = await dispatch(
        'element/getRecords',
        {
          elementName: 'machine',
          query,
        },
        { root: true },
      );
      commit('setMachinebySubLines', machinebySubLines);
      return true;
    },
    getMachinebyline: async ({ dispatch, commit }, query) => {
      const machinesbylines = await dispatch(
        'element/getRecords',
        {
          elementName: 'machine',
          query,
        },
        { root: true },
      );
      commit('setMachinesbyline', machinesbylines);
      return true;
    },
    getAllSublines: async ({ dispatch, commit }, query) => {
      const allSublines = await dispatch(
        'element/getRecords',
        {
          elementName: 'subline',
          query,
        },
        { root: true },
      );
      commit('setAllSublines', allSublines);
      return true;
    },
    getAllMachines: async ({ dispatch, commit }, query) => {
      const allMachines = await dispatch(
        'element/getRecords',
        {
          elementName: 'machine',
          query,
        },
        { root: true },
      );
      commit('setAllMachines', allMachines);
      return true;
    },
    createElement: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/createElement',
        payload,
        { root: true },
      );
      return created;
    },
    createSubline: async ({ dispatch, commit }, payload) => {
      let list = [];
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'subline',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = `?query=lineid==${payload.lineid}`;
        const sublines = await dispatch(
          'element/getRecords',
          {
            elementName: 'subline',
            query,
          },
          { root: true },
        );
        if (sublines) {
          commit('setSublines', []);
          list = sublines;
          commit('setSublines', list);
        }
      }
    },
    createMachine: async ({ dispatch, commit }, payload) => {
      let list = [];
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'machine',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = `?query=lineid==${payload.lineid}`;
        const machines = await dispatch(
          'element/getRecords',
          {
            elementName: 'machine',
            query,
          },
          { root: true },
        );
        if (machines) {
          list = machines;
          list = list.sort((a, b) => a.indexno - b.indexno);
          commit('setMachines', list);
          return machines;
        }
      }
      return created;
    },
    createLine: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'line',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const processes = await dispatch(
          'element/getRecords',
          {
            elementName: 'line',
            query,
          },
          { root: true },
        );
        commit('setLines', processes);
        return processes;
      }
      return created;
    },
    updateLine: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'line',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      return created;
    },
    updateSubline: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'subline',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        const query = `?query=lineid==${payload.lineid}`;
        const sublines = await dispatch(
          'element/getRecords',
          {
            elementName: 'subline',
            query,
          },
          { root: true },
        );
        if (sublines) {
          commit('setSublines', sublines);
        }
      }
    },
    updateMachine: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'machine',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const machines = await dispatch(
          'element/getRecords',
          {
            elementName: 'machine',
            query,
          },
          { root: true },
        );
        if (machines) {
          commit('setMachines', machines);
          return machines;
        }
      }
      return created;
    },
    updateIpAddressForParameters: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'parameters',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      return created;
    },
    deleteSubline: async ({ dispatch, commit }, object) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'subline',
          queryParam: `?query=id=="${object.id}"`,
        },
        { root: true },
      );
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'machine',
            queryParam: `?query=sublineid=="${object.id}"`,
          },
          { root: true },
        );
      }
      if (deleted) {
        const query = `?query=lineid==${object.lineid}`;
        const sublines = await dispatch(
          'element/getRecords',
          {
            elementName: 'subline',
            query,
          },
          { root: true },
        );
        if (sublines) {
          commit('setSublines', sublines);
          return sublines;
        }
      }
      return deleted;
    },
    deleteMachine: async ({ dispatch, commit }, object) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'machine',
          queryParam: `?query=id=="${object.id}"`,
        },
        { root: true },
      );
      if (deleted) {
        const query = '';
        const machines = await dispatch(
          'element/getRecords',
          {
            elementName: 'machine',
            query,
          },
          { root: true },
        );
        if (machines) {
          commit('setMachines', machines);
          return machines;
        }
      }
      return deleted;
    },
  },
});
