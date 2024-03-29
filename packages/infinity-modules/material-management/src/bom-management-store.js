// import HourService from '@shopworx/services/api/hour.service';
import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    subStations: [],
    bomList: [],
    onboarded: false,
    addBomDialog: false,
    lineList: [],
    sublineList: [],
    stationList: [],
    substationList: [],
    categoryList: [],
    bomViewState: 0,
    filter: false,
    lineValue: '',
    sublineValue: '',
    bomValue: '',
    bomNumValue: '',
    bomDetails: '',
    parameterList: '',
    subStationListForConfig: [],
    bomDetailsConfigList: [],
    bomNameInState: [],
    bomNumInState: [],
  },
  mutations: {
    setSubStations: set('subStations'),
    setOnboarded: set('onboarded'),
    setBomList: set('bomList'),
    setaddBomDialog: set('addBomDialog'),
    setLineList: set('lineList'),
    setSublineList: set('sublineList'),
    setStationList: set('stationList'),
    setCategoryList: set('categoryList'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setbomViewState: set('bomViewState'),
    setLineValue: set('lineValue'),
    setSublineValue: set('sublineValue'),
    setBomDetailsList: set('bomDetailsList'),
    setParameterList: set('parameterList'),
    setSubstationList: set('substationList'),
    setSubStationListForConfig: set('subStationListForConfig'),
    setBomDetailsConfigList: set('bomDetailsConfigList'),
    setBomNameInState: set('bomNameInState'),
    seBomNumberInState: set('bomNumInState'),
    setBomValue: set('bomValue'),
    setBomNumValue: set('bomNumValue'),
  },
  actions: {
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
    getSubLines: async ({ dispatch, commit }, query) => {
      const subline = await dispatch(
        'element/getRecords',
        {
          elementName: 'subline',
          query,
        },
        { root: true },
      );
      commit('setSubLineList', subline);
      return subline;
    },
    getStations: async ({ dispatch, commit }, query) => {
      const station = await dispatch(
        'element/getRecords',
        {
          elementName: 'station',
          query,
        },
        { root: true },
      );
      commit('setStationList', station);
      return station;
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
      commit('setSubStations', list);
      return true;
    },
    getBomListRecords: async ({ dispatch, commit, state }, query) => {
      const { lineList } = state;
      let bomlist = await dispatch(
        'element/getRecords',
        {
          elementName: 'bomlist',
          query,
        },
        { root: true },
      );
      if (lineList.length > 0) {
        bomlist = bomlist.map((bom) => ({
          ...bom,
          line: lineList.filter((line) => line.id === bom.lineid)[0]
          && lineList.filter((line) => line.id === bom.lineid)[0].name,
        }));
      }
      commit('setBomList', bomlist);
    },
    getBomDetailsListRecords: async ({ dispatch, commit }, query) => {
      const lineList = await dispatch(
        'element/getRecords',
        { elementName: 'line' },
        { root: true },
      );
      const subLineList = await dispatch(
        'element/getRecords',
        { elementName: 'subline' },
        { root: true },
      );
      const stationList = await dispatch(
        'element/getRecords',
        { elementName: 'station' },
        { root: true },
      );
      const sunStationList = await dispatch(
        'element/getRecords',
        { elementName: 'substation' },
        { root: true },
      );
      const bomdetails = await dispatch(
        'element/getRecords',
        {
          elementName: 'bomdetails',
          query,
        },
        { root: true },
      );
      bomdetails.forEach(async (item) => {
        if (lineList.length) {
          item.line = lineList.filter((line) => Number(line.id) === item.lineid)[0].name;
        }
        if (subLineList.length) {
          item.subline = subLineList
            .filter((subline) => subline.id === item.sublineid)[0].name;
        }
        if (stationList.length) {
          item.station = stationList
            .filter((station) => station.id === item.stationid)[0].name;
        }
        if (sunStationList.length) {
          item.substation = sunStationList
            .filter((substation) => substation.id === item.substationid)[0].name;
        }
      });
      let bomDetailsList = [];
      if (bomdetails && bomdetails.length) {
        bomDetailsList = bomdetails.map((l) => ({
          ...l,
          componentStatusList: [],
          qualitystatus: false,
          savedata: false,
          componentstatus: '',
          configstatus: [{
            text: 'Update quality',
            name: 'qualitystatus',
          }, {
            text: 'Save ID',
            name: 'savedata',
          }, {
            text: 'Component Status',
            name: 'componentstatus',
          }],
        }));
      }
      commit('setBomDetailsList', bomDetailsList);
      return bomDetailsList;
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
    getSubStationListForConfigScreen: async ({ commit, dispatch }, request) => {
      let list = [];
      // const query = '';
      const substationList = await dispatch(
        'element/getRecords',
        { elementName: 'substation', query: `?query=lineid==${request.lineid}` },
        { root: true },
      );
      if (substationList && substationList.length) {
        list = substationList.map((l) => ({
          ...l,
          componentStatusList: [],
          parameterlist: [],
          substationid: '',
          bomid: request.bomid,
          configstatus: [{
            text: 'Update quality',
            name: 'qualitystatus',
          }, {
            text: 'Save ID',
            name: 'savedata',
          }, {
            text: 'Component Status',
            name: 'componentstatus',
          }],
        }));
      }
      const parameters = await dispatch(
        'element/getRecords',
        {
          elementName: 'parameters', // 21, 24, 26 21 also
          query: '?query=parametercategory=="21"%7C%7Cparametercategory=="24"%7C%7Cparametercategory=="26"',
        },
        { root: true },
      );
      const finalParameterList = [];
      parameters.forEach((para) => {
        if (finalParameterList.filter((p) => p.name === para.name).length === 0) {
          const object = {
            name: para.name,
            parametercategory: para.parametercategory,
            id: para.id,
          };
          finalParameterList.push(object);
        }
      });
      // name, category , parameter id
      await Promise.all(list.map(async (f) => {
        delete f._id;
        parameters.forEach((element) => {
          f.configstatus.forEach((status) => {
            if (status.name === 'componentstatus') {
              f[`${status.name}_component_${element.name}`] = '';
            } else {
              f[`${status.name}_component_${element.name}`] = false;
            }
          });
        });
        const componentStatusList = await dispatch(
          'element/getRecords',
          {
            elementName: 'parameters', // 21, 24, 26
            query: `?query=substationid=="${f.id}"%26%26parametercategory=="46"`,
          },
          { root: true },
        );
        const clist = [{
          name: '-',
        }];
        clist.push(...componentStatusList);
        f.componentStatusList = clist;
        f.parameterlist = finalParameterList;
        f.substationid = f.id;
      }));
      commit('setSubStationListForConfig', list);
      return list;
    },
    getSubStationList: async ({ commit, dispatch }, query) => {
      const list = [];
      const obj = {
        name: '-',
        stationid: '-',
      };
      list.push(obj);
      const substationList = await dispatch(
        'element/getRecords',
        { elementName: 'substation', query },
        { root: true },
      );
      substationList.forEach((f) => {
        list.push(f);
      });
      commit('setSubstationList', list);
    },
    getParameterList: async ({ dispatch }, query) => {
      const parameterList = await dispatch(
        'element/getRecords',
        {
          elementName: 'parameters',
          query,
        },
        { root: true },
      );
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
    getBomDetailsConfigList: async ({ commit, dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'bomdetailsconfig', query },
        { root: true },
      );
      if (list) {
        commit('setBomDetailsConfigList', list);
      }
    },
    createBomDetailConfigList: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'bomdetailsconfig',
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
    updateDetailsConfigByQuery: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'bomdetailsconfig',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    updateDeatilsById: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'bomdetails',
          id: payload.id,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    updateRecordById: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'bomdetailsconfig',
          id: payload.id,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    updateMaterialRecordById: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'bomdetails',
          id: payload.id,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    updateBoundSublineRecordById: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'bomdetails',
          id: payload.id,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteBomDetail: async ({ dispatch }, id) => {
      const deleteBomdetail = await dispatch(
        'element/deleteRecordById',
        {
          elementName: 'bomdetails',
          id,
        },
        { root: true },
      );
      return deleteBomdetail;
    },
  },
});
