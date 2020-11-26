import { set, toggle } from '@shopworx/services/util/store.helper';

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
    stationsbylines: [],
    substationsbylines: [],
    selectedLine: {},
    subStationName: {},
    runningOrderList: [],
    roadMapDetailsRecord: [],
    parametersList: [],
    subStationsForIP: [],
    assets: {},
    filter: false,
    sublineByline: [],
    stationBySubline: [],
    subStationByStation: [],
  },
  mutations: {
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setSelectedLine: set('selectedLine'),
    setLines: set('lines'),
    setSublines: set('sublines'),
    setStations: set('stations'),
    setSubStations: set('subStations'),
    setProcesses: set('processes'),
    setAddSublineDialog: set('addSublineDialog'),
    setAddSubstationDialog: set('addSubstationDialog'),
    setAddProcessDialog: set('addProcessDialog'),
    setUpdateSublineDialog: set('updateSublineDialog'),
    setUpdateStationDialog: set('updateStationDialog'),
    setUpdateSubstationDialog: set('updateSubstationDialog'),
    setUpdateProcessDialog: set('updateProcessDialog'),
    setAllSublines: set('allSublines'),
    setAllStations: set('allStations'),
    setSublinesbyline: set('sublineByline'),
    setStationbySubLines: set('stationBySubline'),
    setSubStationbyStation: set('subStationByStation'),
    setStationsbyline: set('stationsbylines'),
    setSubStationsbyline: set('substationsbylines'),
    setSubStationName: set('subStationName'),
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
    getSubStationIdElement: async ({ dispatch }, elementName) => {
      const results = await dispatch(
        'element/getElement',
        elementName,
        { root: true },
      );
      if (results) {
        return results.element;
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
    downloadToPLC: async ({ dispatch }, payload) => {
      const substations = await dispatch(
        'element/postSocket',
        {
          functionName: 'parameterupload',
          payload,
        },
        { root: true },
      );
      return substations;
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
    getStations: async ({ dispatch, commit }, query) => {
      const stations = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      commit('setStations', stations);
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
    getfilteredStation: async ({ dispatch, commit }, query) => {
      const stationbySubLines = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      commit('setStationbySubLines', stationbySubLines);
      return true;
    },
    getfilteredSubStation: async ({ dispatch, commit }, query) => {
      const subStationbyStation = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setSubStationbyStation', subStationbyStation);
      return true;
    },
    getStationbyline: async ({ dispatch, commit }, query) => {
      const stationsbylines = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      commit('setStationsbyline', stationsbylines);
      return true;
    },
    getSubStationbyline: async ({ dispatch, commit }, query) => {
      const substationsbylines = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setSubStationsbyline', substationsbylines);
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
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      let subStations = [];
      if (list && list.length) {
        subStations = list.map((l) => ({
          ...l,
          stationcolor: 0,
        }));
      }
      commit('setSubStations', subStations);
      return true;
    },
    getSubStationName: async ({ dispatch, commit }, query) => {
      const subStations = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setSubStationName', subStations);
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
        const query = `?query=lineid==${payload.lineid}`;
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
        const query = `?query=lineid==${payload.lineid}&sortquery=createdTimestamp==-1`;
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
    updateMainLineFlagToSubStations: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'substation',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      return created;
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
        }
      }
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
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'roadmaplist',
            queryParam: `?query=id=="${object.roadmapid}"`,
          },
          { root: true },
        );
      }
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'roadmapdetails',
            queryParam: `?query=roadmapid=="${object.roadmapid}"`,
          },
          { root: true },
        );
      }
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'order',
            queryParam: `?query=roadmapid=="${object.roadmapid}"`,
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
    deleteStation: async ({ dispatch, commit }, object) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'station',
          queryParam: `?query=id=="${object.id}"`,
        },
        { root: true },
      );
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'substation',
            queryParam: `?query=stationid=="${object.id}"`,
          },
          { root: true },
        );
      }
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'process',
            queryParam: `?query=substationid=="${object.id}"`,
          },
          { root: true },
        );
      }
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'roadmaplist',
            queryParam: `?query=id=="${object.roadmapid}"`,
          },
          { root: true },
        );
      }
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'roadmapdetails',
            queryParam: `?query=roadmapid=="${object.roadmapid}"`,
          },
          { root: true },
        );
      }
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'order',
            queryParam: `?query=roadmapid=="${object.roadmapid}"`,
          },
          { root: true },
        );
      }
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
    deleteSubstation: async ({ dispatch, commit }, object) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'substation',
          queryParam: `?query=id=="${object.id}"`,
        },
        { root: true },
      );
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'process',
            queryParam: `?query=substationid=="${object.id}"`,
          },
          { root: true },
        );
      }
      if (deleted) {
        await dispatch(
          'element/changeElementStatusById',
          {
            payload: object,
            elementId: object.elementId,
          },
          { root: true },
        );
      }
      if (deleted) {
        await dispatch(
          'element/deleteRecordByQuery',
          {
            elementName: 'parameters',
            queryParam: `?query=substationid=="${object.id}"`,
          },
          { root: true },
        );
      }
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
