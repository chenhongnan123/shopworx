import { set, toggle } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

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
    productionList: [],
    loading: false,
    error: false,
    productionCount: 0,
    operators: [],
    rejectionReasons: [],
    reworkReasons: [],
    scrapReasons: [],
    lastRefreshedAt: null,
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
    setLoading: set('loading'),
    setError: set('error'),
    setProductionCount: set('productionCount'),
    setProductionList: set('productionList'),
    setOperators: set('operators'),
    setRejectionReasons: set('rejectionReasons'),
    setReworkReasons: set('reworkReasons'),
    setScrapReasons: set('scrapReasons'),
    setUnavailableDataElements: set('unavailableDataElements'),
    setUnavailableElements: set('unavailableElements'),
    setLastRefreshedAt: set('lastRefreshedAt'),
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
        commit('setShifts', records);
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

    fetchRejectionReasons: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'rejectionreasons' },
        { root: true },
      );
      if (records) {
        let reasons = sortArray(records, 'reasonname');
        reasons = reasons.map(({
          category,
          department,
          reasoncode,
          reasonname,
        }) => ({
          category,
          department,
          reasoncode,
          reasonname,
        }));
        commit('setRejectionReasons', reasons);
        return true;
      }
      return false;
    },

    fetchReworkReasons: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'reworkreasons' },
        { root: true },
      );
      if (records) {
        let reasons = sortArray(records, 'reasonname');
        reasons = reasons.map(({
          reasoncode,
          reasonname,
        }) => ({
          reasoncode,
          reasonname,
        }));
        commit('setReworkReasons', reasons);
        return true;
      }
      return false;
    },

    fetchScrapReasons: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'scrapreasons' },
        { root: true },
      );
      if (records) {
        let reasons = sortArray(records, 'reasonname');
        reasons = reasons.map(({
          reasoncode,
          reasonname,
        }) => ({
          reasoncode,
          reasonname,
        }));
        commit('setScrapReasons', reasons);
        return true;
      }
      return false;
    },

    fetchProductionList: async ({
      commit,
      dispatch,
      rootGetters,
      rootState,
    }) => {
      const filters = rootGetters['webApp/filters'];
      const { activeSite } = rootState.user;
      const date = parseInt(filters.date.value.replace(/-/g, ''), 10);
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
        commit('setLastRefreshedAt', new Date().toLocaleTimeString('en-GB'));
      } else {
        commit('setProductionList', []);
        commit('setProductionCount', 0);
        commit('setError', true);
      }
      commit('setLoading', false);
    },

    reFetchProductionList: async ({
      commit,
      dispatch,
      rootGetters,
      rootState,
    }) => {
      const filters = rootGetters['webApp/filters'];
      const { activeSite } = rootState.user;
      const date = parseInt(filters.date.value.replace(/-/g, ''), 10);
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
        commit('setLastRefreshedAt', new Date().toLocaleTimeString('en-GB'));
      }
    },

    fetchHourlyProduction: async ({ dispatch, rootGetters, rootState }, {
      part,
      shift,
      planId,
    }) => {
      const filters = rootGetters['webApp/filters'];
      const { activeSite } = rootState.user;
      const date = parseInt(filters.date.value.replace(/-/g, ''), 10);
      const data = await dispatch(
        'report/executeReport',
        {
          reportName: 'hourlyproductionlog',
          payload: {
            siteid: activeSite,
            dateVal: date,
            shiftVal: shift,
            planVal: planId,
            partVal: part,
          },
        },
        { root: true },
      );
      if (data) {
        const { production } = JSON.parse(data);
        const computedProduction = await Promise.all(production.map(async (prod) => {
          let rejections = await dispatch('fetchRejections', {
            planId,
            part,
            date,
            hour: prod.hour,
          });
          rejections = rejections.map((rej) => ({
            ...rej,
            edit: false,
          }));
          const rejected = rejections.reduce((a, b) => a + (b.quantity || 0), 0);
          return {
            ...prod,
            rejected,
            accepted: parseInt(prod.produced, 10) - rejected,
            rejections,
            newRejection: {
              qty: '',
              reason: '',
              remark: '',
            },
          };
        }));
        return computedProduction;
      }
      return false;
    },

    fetchRejections: async ({ dispatch }, {
      planId,
      part,
      date,
      hour,
    }) => {
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'rejection',
          query: `?query=planid=="${planId}"%26%26partname=="${part}"%26%26date==${date}%26%26hour==${hour}`,
        },
        { root: true },
      );
      return records;
    },

    fetchRework: async ({ rootGetters, dispatch }, { planId, part, shift }) => {
      const filters = rootGetters['webApp/filters'];
      const date = parseInt(filters.date.value.replace(/-/g, ''), 10);
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'rework',
          query: `?query=planid=="${planId}"%26%26partname=="${part}"%26%26date==${date}%26%26shiftName=="${shift}"`,
        },
        { root: true },
      );
      return records;
    },

    fetchScrap: async ({ rootGetters, dispatch }, { planId, part, shift }) => {
      const filters = rootGetters['webApp/filters'];
      const date = parseInt(filters.date.value.replace(/-/g, ''), 10);
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'scrap',
          query: `?query=planid=="${planId}"%26%26partname=="${part}"%26%26date==${date}%26%26shiftName=="${shift}"`,
        },
        { root: true },
      );
      return records;
    },

    addRejection: async ({ dispatch }, payload) => {
      const record = await dispatch(
        'element/postRecord',
        {
          elementName: 'rejection',
          payload,
        },
        { root: true },
      );
      // eslint-disable-next-line
      return record && record.id;
    },

    addRework: async ({ dispatch }, payload) => {
      const record = await dispatch(
        'element/postRecord',
        {
          elementName: 'rework',
          payload,
        },
        { root: true },
      );
      // eslint-disable-next-line
      return record && record.id;
    },

    addScrap: async ({ dispatch }, payload) => {
      const record = await dispatch(
        'element/postRecord',
        {
          elementName: 'scrap',
          payload,
        },
        { root: true },
      );
      // eslint-disable-next-line
      return record && record.id;
    },

    updateOperator: async ({
      dispatch,
      commit,
      state,
      rootGetters,
    }, { payload, shift, machine }) => {
      const filters = rootGetters['webApp/filters'];
      const date = parseInt(filters.date.value.replace(/-/g, ''), 10);
      const updated = await dispatch(
        'element/upsertRecordByQuery',
        {
          elementName: 'operatorlog',
          record: payload,
          query: `?query=date==${date}%26%26shiftName=="${shift}"%26%26machinename=="${machine}"`,
        },
        { root: true },
      );
      if (updated) {
        let { productionList } = state;
        productionList = productionList.map((prod) => {
          if (prod.shift === shift && prod.machinename === machine) {
            return {
              ...prod,
              operatorcode: payload.operatorcode,
              operatorname: payload.operatorname,
            };
          }
          return prod;
        });
        commit('setProductionList', productionList);
        commit('helper/setAlert', {
          show: true,
          type: 'success',
          message: 'OPERATOR_UPDATE',
        }, {
          root: true,
        });
      } else {
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: 'OPERATOR_UPDATE',
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
        machineList = sortArray(machines, 'machinename').map(({ machinename }) => ({
          name: machinename,
          value: machinename,
        }));
      }
      return machineList;
    },

    shiftList: ({ shifts }) => {
      let shiftList = [];
      if (shifts && shifts.length) {
        const allShifts = shifts.filter((rec) => rec.type === 'shift');
        const list = [...new Set(allShifts.map((item) => item.name))];
        shiftList = list.map((s) => ({
          name: s,
          value: s,
        }));
      }
      return shiftList;
    },

    getShiftStart: (
      { shifts },
      getters,
      rootState,
      rootGetters,
    ) => (shiftName) => {
      const filters = rootGetters['webApp/filters'];
      const date = filters.date.value;
      const currentShift = shifts
        .sort((a, b) => a.sortindex - b.sortindex)
        .find((s) => s.shift === shiftName);
      const [hr, min] = currentShift.starttime.split(':');
      const [year, month, day] = date.split('-');
      return new Date(year, month - 1, day, parseInt(hr, 10), parseInt(min, 10), 0).getTime();
    },

    getHourStart: (
      state,
      getters,
      rootState,
      rootGetters,
    ) => (displayHour) => {
      const filters = rootGetters['webApp/filters'];
      const date = filters.date.value;
      const [start] = displayHour.split('-');
      const [hr, min] = start.split(':');
      const [year, month, day] = date.split('-');
      return new Date(year, month - 1, day, parseInt(hr, 10), parseInt(min, 10), 0).getTime();
    },

    production: ({ productionList }, getters, rootState, rootGetters) => {
      let production = null;
      if (productionList && productionList.length) {
        production = rootGetters['webApp/filteredRecords'](productionList);
        production = rootGetters['webApp/sortedRecords'](production);
        production = production.reduce((result, currentValue) => {
          const {
            shift,
            machinename,
            operatorname,
            operatorcode,
          } = currentValue;
          if (!result[shift]) {
            result[shift] = {};
            result[shift][machinename] = {
              operatorcode: operatorcode === '-' ? null : operatorcode,
              operatorname: operatorname === '-' ? null : operatorname,
              production: [],
            };
          }
          if (!result[shift][machinename]) {
            result[shift][machinename] = {
              operatorcode: operatorcode === '-' ? null : operatorcode,
              operatorname: operatorname === '-' ? null : operatorname,
              production: [],
            };
          }
          result[shift][machinename].production = [
            ...result[shift][machinename].production,
            currentValue,
          ];
          return result;
        }, {});
      }
      if (!production || !Object.keys(production).length) {
        production = null;
      }
      return production;
    },
  },
});
