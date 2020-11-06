import { set, toggle } from '@shopworx/services/util/store.helper';
import { sortAlphaNum, sortArray } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    masterData: [],
    masterElements: [],
    drawer: false,
    unavailableDataElements: [],
    unavailableElements: [],
    dataOnboarded: false,
    elementOnboarded: false,
    machines: [],
    shifts: [],
    filters: {},
    sort: {},
    selectedMachine: null,
    selectedShift: null,
    selectedDate: null,
    selectedSort: null,
    productionList: [],
    loading: false,
    error: false,
    productionCount: 0,
    operators: [],
  },
  mutations: {
    setMasterData: set('masterData'),
    setMasterElements: set('masterElements'),
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
    setDataOnboarded: set('dataOnboarded'),
    setElementOnboarded: set('elementOnboarded'),
    setMachines: set('machines'),
    setShifts: set('shifts'),
    setSelectedMachine: set('selectedMachine'),
    setSelectedShift: set('selectedShift'),
    setSelectedDate: set('selectedDate'),
    setSelectedSort: set('selectedSort'),
    setLoading: set('loading'),
    setError: set('error'),
    setProductionCount: set('productionCount'),
    setFilters: set('filters'),
    setSort: set('sort'),
    setProductionList: set('productionList'),
    setOperators: set('operators'),
    setUnavailableDataElements: set('unavailableDataElements'),
    setUnavailableElements: set('unavailableElements'),
  },
  actions: {
    getDataOnboardingState: async ({ commit, dispatch }) => {
      commit('setUnavailableDataElements', []);
      const isRejectionAvailable = await dispatch('getRejectionReasonsElement');
      const isScrapAvailable = await dispatch('getScrapReasonsElement');
      const isReworkAvailable = await dispatch('getReworkReasonsElement');
      const isOperatorAvailable = await dispatch('getOperatorElement');
      const unavailableElements = [];
      if (!isRejectionAvailable) {
        unavailableElements.push('rejectionreasons');
      }
      if (!isScrapAvailable) {
        unavailableElements.push('scrapreasons');
      }
      if (!isReworkAvailable) {
        unavailableElements.push('reworkreasons');
      }
      if (!isOperatorAvailable) {
        unavailableElements.push('operator');
      }
      commit('setUnavailableDataElements', unavailableElements);
      if (unavailableElements.length) {
        commit('setDataOnboarded', false);
      } else {
        commit('setDataOnboarded', true);
      }
    },

    getElementOnboardingState: async ({ commit, dispatch }) => {
      commit('setUnavailableElements', []);
      const isRejectionAvailable = await dispatch('getRejectionElement');
      const isScrapAvailable = await dispatch('getScrapElement');
      const isReworkAvailable = await dispatch('getReworkElement');
      const isOperatorLogAvailable = await dispatch('getOperatorLogElement');
      const unavailableElements = [];
      if (!isRejectionAvailable) {
        unavailableElements.push('rejection');
      }
      if (!isScrapAvailable) {
        unavailableElements.push('scrap');
      }
      if (!isReworkAvailable) {
        unavailableElements.push('rework');
      }
      if (!isOperatorLogAvailable) {
        unavailableElements.push('operatorlog');
      }
      commit('setUnavailableElements', unavailableElements);
      if (unavailableElements.length) {
        commit('setElementOnboarded', false);
      } else {
        commit('setElementOnboarded', true);
      }
    },

    getMasterData: async ({
      commit,
      dispatch,
      state,
      rootGetters,
    }) => {
      const licensedAssets = rootGetters['user/licensedAssets'];
      const masterElements = await dispatch(
        'industry/getMasterElements',
        null,
        { root: true },
      );
      const masterAssets = await dispatch(
        'industry/getAssets',
        null,
        { root: true },
      );
      const { unavailableDataElements } = state;
      if (masterElements && masterElements.length) {
        const filteredMasterElements = masterElements
          .filter((elem) => unavailableDataElements.includes(elem.masterElement.elementName))
          .map((elem) => {
            if (elem.masterElement.assetBased) {
              if (masterAssets && masterAssets.length) {
                const availableAssets = elem.masterTags.map((tag) => tag.assetId);
                const provisionedAssets = [...new Set(availableAssets)];
                return provisionedAssets
                  .filter((asset) => licensedAssets.includes(asset))
                  .map((provisionedAsset) => {
                    const tags = elem.masterTags.filter((tag) => tag.assetId === provisionedAsset);
                    const { assetName, assetDescription } = masterAssets
                      .find((asset) => asset.id === provisionedAsset);
                    return {
                      tags: tags.filter((t) => !t.hide),
                      hiddenTags: tags.filter((t) => t.hide),
                      success: false,
                      loading: false,
                      assetId: provisionedAsset,
                      element: elem.masterElement,
                      title: `${elem.masterElement.elementDescription} - ${assetDescription}`,
                      expectedFileName: `${elem.masterElement.elementName}-${assetName}.csv`,
                    };
                  });
              }
            }
            return {
              assetId: 0,
              success: false,
              loading: false,
              hiddenTags: elem.masterTags.filter((t) => t.hide),
              tags: elem.masterTags.filter((t) => !t.hide),
              element: elem.masterElement,
              title: elem.masterElement.elementDescription,
              expectedFileName: `${elem.masterElement.elementName}.csv`,
            };
          });
        commit('setMasterData', filteredMasterElements.flat());
        return true;
      }
      return false;
    },

    getMasterElements: async ({ commit, dispatch, state }) => {
      const masterElements = await dispatch(
        'industry/getMasterElements',
        null,
        { root: true },
      );
      if (masterElements && masterElements.length) {
        const { unavailableElements } = state;
        const elements = masterElements
          .filter((elem) => unavailableElements.includes(elem.masterElement.elementName));
        commit('setMasterElements', elements);
        return true;
      }
      return false;
    },

    createElements: async ({ state, dispatch }) => {
      const planningElem = await dispatch(
        'element/getElement',
        'planning',
        { root: true },
      );
      if (planningElem) {
        const { masterElements, unavailableElements } = state;
        const createElements = unavailableElements.map(async (elem) => {
          const masterElem = masterElements.find((e) => e.masterElement.elementName === elem);
          const tags = [
            ...planningElem.tags.filter((tag) => !tag.hide),
            ...masterElem.masterTags,
          ];
          const payload = {
            element: masterElem.masterElement,
            tags,
          };
          await dispatch(
            'element/createElementAndTags',
            payload,
            { root: true },
          );
        });
        await Promise.all(createElements);
        return true;
      }
      return false;
    },

    getRejectionReasonsElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'rejectionreasons',
        { root: true },
      );
      return element;
    },

    getScrapReasonsElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'scrapreasons',
        { root: true },
      );
      return element;
    },

    getReworkReasonsElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'reworkreasons',
        { root: true },
      );
      return element;
    },

    getOperatorElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'operator',
        { root: true },
      );
      return element;
    },

    getRejectionElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'rejection',
        { root: true },
      );
      return element;
    },

    getScrapElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'scrap',
        { root: true },
      );
      return element;
    },

    getReworkElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'rework',
        { root: true },
      );
      return element;
    },

    getOperatorLogElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'operatorlog',
        { root: true },
      );
      return element;
    },

    fetchMachines: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'machine',
        },
        { root: true },
      );
      if (records && records.length) {
        commit('setMachines', records);
        return true;
      }
      return false;
    },

    fetchShifts: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'businesshours',
          query: '?sortquery=sortindex==1',
        },
        { root: true },
      );
      if (records && records.length) {
        const allShifts = records.filter((rec) => rec.type === 'shift');
        const shiftList = [...new Set(allShifts.map((item) => item.name))];
        commit('setShifts', shiftList);
        return true;
      }
      return false;
    },

    fetchOperators: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'operator' },
        { root: true },
      );
      if (records) {
        const operators = sortArray(records, 'operatorcode');
        commit('setOperators', operators);
        return true;
      }
      return false;
    },

    fetchProductionList: async ({
      commit,
      dispatch,
      state,
      rootState,
    }) => {
      const { selectedDate } = state;
      const { activeSite } = rootState.user;
      const date = parseInt(selectedDate.replace(/-/g, ''), 10);
      commit('setLoading', true);
      commit('setProductionList', []);
      commit('setError', false);
      const data = await dispatch(
        'report/executeReport',
        {
          reportName: 'shiftwiseproductionlog',
          payload: {
            siteid: activeSite,
            dateVal: date,
          },
        },
        { root: true },
      );
      if (data) {
        const { production, records } = JSON.parse(data);
        commit('setProductionList', production);
        commit('setProductionCount', records);
        commit('setError', false);
      } else {
        commit('setProductionList', []);
        commit('setProductionCount', 0);
        commit('setError', true);
      }
      commit('setLoading', false);
    },

    fetchHourlyProduction: async ({ dispatch, state, rootState }, {
      machine,
      part,
      shift,
    }) => {
      const { selectedDate } = state;
      const { activeSite } = rootState.user;
      const date = parseInt(selectedDate.replace(/-/g, ''), 10);
      const data = await dispatch(
        'report/executeReport',
        {
          reportName: 'hourlyproductionlog',
          payload: {
            siteid: activeSite,
            dateVal: date,
            shiftFilter: `{${shift}}`,
            machineFilter: `{${machine}}`,
            partFilter: `{${part}}`,
          },
        },
        { root: true },
      );
      if (data) {
        const { production } = JSON.parse(data);
        return production;
      }
      return false;
    },

    updateReason: async ({ dispatch, commit, state }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'production',
          id,
          payload,
        },
        { root: true },
      );
      if (updated) {
        let { productionList } = state;
        productionList = productionList.map((dt) => {
          // eslint-disable-next-line
          if (dt._id === id) {
            return {
              ...dt,
              ...payload,
            };
          }
          return dt;
        });
        commit('setProductionList', []);
        commit('setProductionList', productionList);
        commit('helper/setAlert', {
          show: true,
          type: 'success',
          message: 'DOWNTIME_UPDATE_SUCCESS',
        }, {
          root: true,
        });
      } else {
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: 'DOWNTIME_UPDATE_ERROR',
        }, {
          root: true,
        });
      }
    },
  },
  getters: {
    machineList: ({ machines }) => {
      let machineList = [];
      if (machines && machines.length) {
        machineList = machines
          .map((mac) => mac.machinename)
          .sort(sortAlphaNum);
        machineList = ['All Machines', ...machineList];
      }
      return machineList;
    },

    shiftList: ({ shifts }) => {
      let shiftList = [];
      if (shifts && shifts.length) {
        shiftList = ['All Shifts', ...shifts];
      }
      return shiftList;
    },

    production: ({
      productionList,
      selectedShift,
      selectedMachine,
      selectedSort,
    }) => {
      let production = null;
      if (productionList && productionList.length) {
        production = productionList
          .filter((prod) => {
            if (selectedShift !== 'All Shifts' && selectedMachine !== 'All Machines') {
              return (prod.shift === selectedShift && prod.machinename === selectedMachine);
            }
            if (selectedShift !== 'All Shifts' && selectedMachine === 'All Machines') {
              return prod.shift === selectedShift;
            }
            if (selectedShift === 'All Shifts' && selectedMachine !== 'All Machines') {
              return prod.machinename === selectedMachine;
            }
            return prod;
          })
          .sort((a, b) => {
            if (selectedSort.value === 'new') {
              return b.firstcycle - a.firstcycle;
            }
            return a.firstcycle - b.firstcycle;
          })
          .reduce((acc, cur) => {
            const { shift, machinename } = cur;
            if (!acc[shift]) {
              acc[shift] = {};
              acc[shift][machinename] = [];
            } else if (acc[shift] && !acc[machinename]) {
              acc[shift][machinename] = [];
            }
            acc[shift][machinename].push(cur);
            return acc;
          }, {});
      }
      if (Object.keys(production).length === 0) {
        production = null;
      }
      return production;
    },
  },
});
