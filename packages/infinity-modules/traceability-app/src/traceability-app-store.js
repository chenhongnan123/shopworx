import { set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    lineList: [],
    subLineList: [],
    stationList: [],
    subStationList: [],
    checkOutList: [],
    partStatusList: [],
    processParametersList: [],
    componentData: [],
    recipeViewState: 0,
    subStationInfo: {},
    componentList: [],
    trecibilityState: {},
    sortedSubStation: [],
    parametersList: [],
    runningOrder: [],
    bomDetailsList: [],
    subStationListData: [],
    elements: [],
  },
  mutations: {
    setLineList: set('lineList'),
    setSubLineList: set('subLineList'),
    setStationList: set('stationList'),
    setSubStationList: set('subStationList'),
    setCheckOutList: set('checkOutList'),
    setPartStatusList: set('partStatusList'),
    setProcessParametersList: set('processParametersList'),
    setComponentData: set('componentData'),
    setRecipeViewState: set('recipeViewState'),
    setSubStationInfo: set('subStationInfo'),
    setComponentList: set('componentList'),
    setTrecibilityState: set('trecibilityState'),
    setSortedSubStation: set('sortedSubStation'),
    setParametersList: set('parametersList'),
    setRunningOrderList: set('runningOrder'),
    setBOMDetailsList: set('bomDetailsList'),
    setSubStationListData: set('subStationListData'),
    setElements: set('elements'),
  },
  actions: {
    getElements: async ({ commit, rootState, dispatch }) => {
      const { activeSite } = rootState.user;
      const elements = await dispatch(
        'element/getElementsBySite',
        activeSite,
        { root: true },
      );
      if (elements && elements.length) {
        commit('setElements', elements);
      }
    },
    getRecordsData: async ({ dispatch }, payload) => {
      const data = await dispatch(
        'element/getRecords',
        {
          elementName: payload.elementname,
          query: payload.query,
        },
        { root: true },
      );
      return data;
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
    getBOMDetails: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'bomdetails',
          query,
        },
        { root: true },
      );
      commit('setBOMDetailsList', list);
      return true;
    },
    getPartStatus: async ({ dispatch, commit }, query) => {
      const part = await dispatch(
        'element/getRecords',
        {
          elementName: 'partstatus',
          query,
        },
        { root: true },
      );
      commit('setPartStatusList', part);
      return part;
    },
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
    getProcessParameters: async ({ dispatch, commit }, { elementname, payload }) => {
      const paramters = await dispatch(
        'element/getRecords',
        {
          elementName: elementname,
          query: payload,
        },
        { root: true },
      );
      commit('setProcessParametersList', paramters);
      return paramters;
    },
    getProcessElement: async ({ dispatch }, elementName) => {
      const element = await dispatch(
        'element/getElement',
        elementName,
        { root: true },
      );
      return element;
    },
    getComponentList: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'component',
          query,
        },
        { root: true },
      );
      // let checkout = [];
      // if (list && list.length) {
      //   checkout = list.map((l) => ({
      //     ...l,
      //     componentname: '',
      //     componentvalue: '',
      //   }));
      // }
      commit('setComponentList', list);
      return list;
    },
    getTraceabilityData: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'traceability',
          query,
        },
        { root: true },
      );
      return list;
    },
    getCheckOutLists: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'checkout',
          query,
        },
        { root: true },
      );
      commit('setCheckOutList', list);
      return list;
    },
    getComponentData: async ({ dispatch, commit }, query) => {
      const component = await dispatch(
        'element/getRecords',
        {
          elementName: 'component',
          query,
        },
        { root: true },
      );
      commit('setComponentData', component);
      return component;
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
      let list = [];
      const station = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      if (station) {
        list = station;
        list = list.sort((a, b) => a.name.localeCompare(b.name));
        console.log(list);
      }
      commit('setSubStationList', list);
      return station;
    },
    // new logic
    getSubStationElementsData: async ({ dispatch, commit }, payload) => {
      const station = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query: '',
        },
        { root: true },
      );
      if (station) {
        await Promise.all(station.map(async (element) => {
          const elementHeaders = await dispatch(
            'element/getElement',
            element.id,
            { root: true },
          );
          element[`headers_${element.id}`] = elementHeaders;
          const paramters = await dispatch(
            'element/getRecords',
            {
              elementName: element.id,
              query: payload,
            },
            { root: true },
          );
          element[`data_${element.id}`] = paramters;
        }));
      }
      commit('setSubStationListData', station);
      return station;
    },
    getSortedSubStations: async ({ dispatch, commit }, query) => {
      const sortedSubStation = await dispatch(
        'element/getRecords',
        {
          elementName: 'substation',
          query,
        },
        { root: true },
      );
      commit('setSortedSubStation', sortedSubStation);
      return sortedSubStation;
    },
  },
  getters: {
    masterItems: ({ elements }) => {
      let list = [];
      if (elements && elements.length) {
        const provisioningElements = elements
          .map((elem) => elem.element)
          .filter((elem) => (
            elem.elementType.toUpperCase().trim() !== 'PROVISIONING'
            && elem.categoryType.toUpperCase().trim() !== 'CALENDAR'
          ));
        const groupedElements = provisioningElements
          .reduce((acc, cur) => {
            acc[cur.categoryType] = [...acc[cur.categoryType] || [], cur];
            return acc;
          }, {});
        const groups = Object.keys(groupedElements);
        list = groups
          .map((group) => {
            const header = { header: group.toLowerCase() };
            const items = sortArray(provisioningElements, 'elementDescription')
              .map((elem) => {
                if (elem.categoryType === group) {
                  return {
                    title: elem.elementDescription,
                    to: elem.elementName,
                    icon: `$${elem.elementName}`,
                  };
                }
                return null;
              })
              .filter((e) => e !== null);
            return [header, ...items];
          })
          .flat();
      }
      return list;
    },
    getTags: ({ elements }) => (element) => {
      let tags = [];
      if (elements && elements.length) {
        const elem = elements.find((e) => e.element.elementName === element);
        if (elem) {
          ({ tags } = elem);
        }
      }
      return tags;
    },
  },
});
