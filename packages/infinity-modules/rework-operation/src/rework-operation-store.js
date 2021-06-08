import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    filter: false,
    lines: [],
    sublines: [],
    subStations: [],
    roadMaps: [],
    reworkList: [],
    ngCodeDetails: [],
    componantList: [],
    singlengcodeconfig: [],
    disableSave: false,
    runningOrderList: [],
    normalRoadMapDetails: [],
    reworkRoadMapDetails: [],
    partStatusList: [],
    roadmapList: [],
    roadmapDetailsList: [],
    selectedReworkRoadmap: {},
    parameterList: [],
  },
  mutations: {
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setLines: set('lines'),
    setSublines: set('sublines'),
    setSubStations: set('subStations'),
    setroadMapsList: set('roadMaps'),
    setReworkList: set('reworkList'),
    setNgCodeConfig: set('ngCodeDetails'),
    setComponentList: set('componantList'),
    setSingleNgCodeConfig: set('singlengcodeconfig'),
    setDisableSave: set('disableSave'),
    setRunningOrderList: set('runningOrderList'),
    setNormalRoadMapDetails: set('normalRoadMapDetails'),
    setReworkRoadMapDetails: set('reworkRoadMapDetails'),
    setPartStatusList: set('partStatusList'),
    setRoadmapList: set('roadmapList'),
    setRoadmapDetailsList: set('roadmapDetailsList'),
    setSelectedReworkRoadmap: set('selectedReworkRoadmap'),
    setParametersList: set('parameterList'),
  },
  actions: {
    getParametersList: async ({ dispatch, commit }, query) => {
      const part = await dispatch(
        'element/getRecords',
        {
          elementName: 'parameters',
          query,
        },
        { root: true },
      );
      commit('setParametersList', part);
      return part;
    },
    getReworkRoadmapDetails: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmapdetails',
          query,
        },
        { root: true },
      );
      commit('setRoadmapDetailsList', list);
      return true;
    },
    getRoadmapList: async ({ dispatch, commit }, query) => {
      let list = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmaplist',
          query,
        },
        { root: true },
      );
      if (list && list.length) {
        list = list.sort((a, b) => a.sequence - b.sequence);
        commit('setRoadmapList', list);
        return true;
      }
      return false;
    },
    getPartStatusLastEntry: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'partstatus',
          query,
        },
        { root: true },
      );
      commit('setPartStatusList', list);
      return true;
    },
    getRunningOrder: async ({ dispatch, commit }, query) => {
      const runningOrderList = await dispatch(
        'element/getRecords',
        {
          elementName: 'order',
          query,
        },
        { root: true },
      );
      commit('setRunningOrderList', runningOrderList);
      return true;
    },
    getNormalRoadMapDetails: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmapdetails',
          query,
        },
        { root: true },
      );
      commit('setNormalRoadMapDetails', list);
      return true;
    },
    getReworkRoadMapDetails: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmapdetails',
          query,
        },
        { root: true },
      );
      commit('setReworkRoadMapDetails', list);
      return true;
    },
    updateOverAllResult: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'rework',
          id: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    updateComponentById: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'component',
          id: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    updateRecordById: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'component',
          id: payload.id,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    updateOverAllResultPartStatus: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'partstatus',
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
    addPartStatusRecord: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'partstatus',
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    getComponentRecords: async ({ dispatch, commit }, query) => {
      let component = await dispatch(
        'element/getRecords',
        {
          elementName: 'component',
          query,
        },
        { root: true },
      );
      component = component.map((c) => {
        // let rework = false;
        // let quality = false;
        const checkquality = c.qualitystatus;
        // if (c.reworkstatus === 1) {
        //   rework = true;
        // }
        if (c.qualitystatus === 1) {
          c.qualitystatus = 4;
        }
        if (c.qualitystatus === 2) {
          c.qualitystatus = 4;
        }
        if (c.qualitystatus === 0) {
          c.qualitystatus = 4;
        }
        if (!c.isbind) {
          c.isbind = 1;
        }
        return {
          ...c,
          checkquality,
        };
      });
      commit('setComponentList', component);
      return true;
    },
    getNgCodeRecords: async ({ dispatch, commit }, query) => {
      const ngcodeconfig = await dispatch(
        'element/getRecords',
        {
          elementName: 'ngcodeconfig',
          query,
        },
        { root: true },
      );
      commit('setNgCodeConfig', ngcodeconfig);
      return true;
    },
    getSingleNgCodeDetail: async ({ dispatch, commit }, query) => {
      const singlengcodeconfig = await dispatch(
        'element/getRecords',
        {
          elementName: 'ngcodeconfig',
          query,
        },
        { root: true },
      );
      commit('setSingleNgCodeConfig', singlengcodeconfig);
      return singlengcodeconfig;
    },
    getReworkList: async ({ dispatch, commit }, query) => {
      const ngconfig = await dispatch(
        'element/getRecords',
        { elementName: 'ngcodeconfig' },
        { root: true },
      );
      const subStationList = await dispatch(
        'element/getRecords',
        { elementName: 'substation' },
        { root: true },
      );
      const reworklist = await dispatch(
        'element/getRecords',
        {
          elementName: 'rework',
          query,
        },
        { root: true },
      );
      reworklist.forEach(async (item) => {
        if (subStationList.length) {
          const substationname = subStationList
            .filter((substation) => substation.id === item.substationid);
          item.substationmatch = substationname[0].name;
        }
        if (ngconfig.length) {
          const ngcodedesc = ngconfig
            .filter((ng) => ng.ngcode === item.checkoutngcode);
          item.ngcodematch = ngcodedesc[0].ngdescription;
        }
      });
      let reworkList = [];
      if (reworklist && reworklist.length) {
        reworkList = reworklist.map((l) => ({
          ...l,
        }));
      }
      commit('setReworkList', reworkList);
      return true;
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
    getroadMapsList: async ({ dispatch, commit }, query) => {
      const roadMaps = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmaplist',
          query,
        },
        { root: true },
      );
      commit('setroadMapsList', roadMaps);
      return true;
    },
    createOrUpdateManidStore: async ({ dispatch }, { payload }) => {
      const created = await dispatch(
        'element/upsertRecordByQuery',
        {
          elementName: 'mainidstore',
          query: payload.query,
          record: payload.payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    deletePartStatus: async ({ dispatch }, mainid) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'partstatus',
          queryParam: `?query=mainid=="${mainid}"`,
        },
        { root: true },
      );
      return deleteParameter;
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
  },
});
