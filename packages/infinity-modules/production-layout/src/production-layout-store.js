import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    lines: [],
    sublines: [],
    stations: [],
    subStations: [],
    processes: [],
    addSublineDialog: false,
    addStationDialog: false,
    addSubstationDialog: false,
    addProcessDialog: false,
    updateSublineDialog: false,
    updateSubstationDialog: false,
    updateStationDialog: false,
    updateProcessDialog: false,
    allSublines: [],
    allStations: [],
  },
  mutations: {
    setLines: set('lines'),
    setSublines: set('sublines'),
    setStations: set('stations'),
    setSubStations: set('subStations'),
    setProcesses: set('processes'),
    setAddSublineDialog: set('addSublineDialog'),
    // setAddStationDialog: set('addStationDialog'),
    setAddSubstationDialog: set('addSubstationDialog'),
    setAddProcessDialog: set('addProcessDialog'),
    setUpdateSublineDialog: set('updateSublineDialog'),
    setUpdateStationDialog: set('updateStationDialog'),
    setUpdateSubstationDialog: set('updateSubstationDialog'),
    setUpdateProcessDialog: set('updateProcessDialog'),
    setAllSublines: set('allSublines'),
    setAllStations: set('allStations'),
  },
  actions: {
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
      // if (sublines.length) {
      //   sublines.forEach((subline) => {
      //     dispatch('getStations', `?query=sublineid==${subline.id}`);
      //   });
      // }
      // // return true;
    },
    getStations: async ({ dispatch, commit, state }, query) => {
      const { stations } = state;
      const localStations = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      // if (localStations && localStations.length) {
      //   localStations.forEach((station) => {
      //     dispatch('getSubStations', `?query=stationid=="${station.id}"`);
      //   });
      // }
      stations.push(...localStations);
      commit('setStations', stations);
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
    getAllStations: async ({ dispatch, commit }, query) => {
      const allStations = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      commit('setAllStations', allStations);
      return true;
    },
    getSubStations: async ({ dispatch, commit }, query) => {
      const subStations = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setSubStations', subStations);
      return true;
    },
    getProcesses: async ({ dispatch, commit, state }, query) => {
      const { processes } = state;
      const localProcesses = await dispatch(
        'element/getRecords',
        {
          elementName: 'process',
          query,
        },
        { root: true },
      );
      commit('setProcesses', localProcesses);
      return processes;
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
          // return sublines;
        }
      }
      // return created;
    },
    createStation: async ({ dispatch, commit }, payload) => {
      let list = [];
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'station',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const stations = await dispatch(
          'element/getRecords',
          {
            elementName: 'station',
            query,
          },
          { root: true },
        );
        if (stations) {
          list = stations;
          list = list.sort((a, b) => a.indexno - b.indexno);
          commit('setStations', list);
          return stations;
        }
      }
      return created;
    },
    createSubstation: async ({ dispatch, commit }, payload) => {
      let list = [];
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'substation',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const substations = await dispatch(
          'element/getRecords',
          {
            elementName: 'substation',
            query,
          },
          { root: true },
        );
        if (substations) {
          list = substations;
          list = list.sort((a, b) => a.indexno - b.indexno);
          commit('setSubStations', list);
          return substations;
        }
      }
      return created;
    },
    createProcess: async ({ dispatch, commit }, payload) => {
      let list = [];
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'process',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const processes = await dispatch(
          'element/getRecords',
          {
            elementName: 'process',
            query,
          },
          { root: true },
        );
        if (processes) {
          list = processes;
          list = list.sort((a, b) => a.indexno - b.indexno);
          commit('setProcesses', list);
          return processes;
        }
      }
      return created;
    },
    updateLine: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'line',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        const query = `?query=id==${payload.id}`;
        const lines = await dispatch(
          'element/getRecords',
          {
            elementName: 'line',
            query,
          },
          { root: true },
        );
        if (lines) {
          commit('setLines', lines);
          // return sublines;
        }
      }
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
          // return sublines;
        }
      }
      // return created;
    },
    updateProcess: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'process',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const processes = await dispatch(
          'element/getRecords',
          {
            elementName: 'process',
            query,
          },
          { root: true },
        );
        if (processes) {
          commit('setProcesses', processes);
          // return processes;
        }
      }
      // return created;
    },
    updateSubstation: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'substation',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const substations = await dispatch(
          'element/getRecords',
          {
            elementName: 'substation',
            query,
          },
          { root: true },
        );
        if (substations) {
          commit('setSubStations', substations);
          return substations;
        }
      }
      return created;
    },
    updateStation: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'station',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const stations = await dispatch(
          'element/getRecords',
          {
            elementName: 'station',
            query,
          },
          { root: true },
        );
        if (stations) {
          commit('setStations', stations);
          return stations;
        }
      }
      return created;
    },
    deleteProcess: async ({ dispatch, commit }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'process',
          queryParam: `?query=id=="${id}"`,
        },
        { root: true },
      );
      if (deleted) {
        const query = '';
        const processes = await dispatch(
          'element/getRecords',
          {
            elementName: 'process',
            query,
          },
          { root: true },
        );
        if (processes) {
          commit('setProcesses', processes);
          return processes;
        }
      }
      return deleted;
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
            elementName: 'station',
            queryParam: `?query=sublineid=="${object.id}"`,
          },
          { root: true },
        );
      }
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'substation',
            queryParam: `?query=sublineid=="${object.id}"`,
          },
          { root: true },
        );
      }
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'process',
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
    deleteStation: async ({ dispatch, commit }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'station',
          queryParam: `?query=id=="${id}"`,
        },
        { root: true },
      );
      if (deleted) {
        const query = '';
        const stations = await dispatch(
          'element/getRecords',
          {
            elementName: 'station',
            query,
          },
          { root: true },
        );
        if (stations) {
          commit('setStations', stations);
          return stations;
        }
      }
      return deleted;
    },
    deleteSubstation: async ({ dispatch, commit }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'substation',
          queryParam: `?query=id=="${id}"`,
        },
        { root: true },
      );
      if (deleted) {
        const query = '';
        const substations = await dispatch(
          'element/getRecords',
          {
            elementName: 'substation',
            query,
          },
          { root: true },
        );
        if (substations) {
          commit('setSubStations', substations);
          return substations;
        }
      }
      return deleted;
    },
  },
});
