import { set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    loading: false,
    productionLoading: false,
    downtimeLoading: false,
    lastRefreshedAt: null,
    thisShift: null,
    thisDate: null,
    previousShift: null,
    previousDate: null,
    currentShift: null,
    currentDate: null,
    shifts: [],
    machines: [],
    operators: [],
    rejectionReasons: [],
    downtimeReasons: [],
    thisShiftSummary: null,
    previousShiftSummary: null,
    productionList: [],
    downtimeList: [],
  },
  mutations: {
    setLoading: set('loading'),
    setProductionLoading: set('productionLoading'),
    setDowntimeLoading: set('downtimeLoading'),
    setLastRefreshedAt: set('lastRefreshedAt'),
    setThisShift: set('thisShift'),
    setThisDate: set('thisDate'),
    setPreviousShift: set('previousShift'),
    setPreviousDate: set('previousDate'),
    setCurrentShift: set('currentShift'),
    setCurrentDate: set('currentDate'),
    setShifts: set('shifts'),
    setMachines: set('machines'),
    setOperators: set('operators'),
    setRejectionReasons: set('rejectionReasons'),
    setDowntimeReasons: set('downtimeReasons'),
    setThisShiftSummary: set('thisShiftSummary'),
    setPreviousShiftSummary: set('previousShiftSummary'),
    setProductionList: set('productionList'),
    setDowntimeList: set('downtimeList'),
  },
  actions: {
    getShifts: async ({ commit, dispatch }) => {
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

    getMachines: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'machine' },
        { root: true },
      );
      if (records) {
        const machines = sortArray(records, 'machinename');
        commit('setMachines', machines);
        return true;
      }
      return false;
    },

    getOperators: async ({ commit, dispatch }) => {
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

    getRejectionReasons: async ({ commit, dispatch }) => {
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

    getDowntimeReasons: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'downtimereasons' },
        { root: true },
      );
      if (records) {
        commit('setDowntimeReasons', records);
        return true;
      }
      return false;
    },

    getBusinessTime: async ({ commit, dispatch }) => {
      const data = await dispatch(
        'calendar/getBusinessTime',
        null,
        { root: true },
      );
      if (data) {
        commit('setCurrentShift', data.shiftName);
        commit('setCurrentDate', +data.date);
        return true;
      }
      return false;
    },

    getDashboardData: async ({ commit, dispatch }) => {
      commit('setLoading', true);
      await Promise.all([
        dispatch('getThisShfitSummary'),
        dispatch('getPreviousShfitSummary'),
        dispatch('getShiftProduction'),
        dispatch('getShiftDowntime'),
      ]);
      commit('setLastRefreshedAt', new Date().toLocaleTimeString('en-GB'));
      commit('setLoading', false);
    },

    getShiftProduction: async ({
      commit,
      dispatch,
      state,
      rootState,
    }, loading = true) => {
      if (loading) {
        commit('setProductionLoading', true);
      }
      const { activeSite } = rootState.user;
      const { thisDate, thisShift } = state;
      const date = parseInt(thisDate.replace(/-/g, ''), 10);
      const data = await dispatch(
        'report/executeReport',
        {
          reportName: 'shiftwiseproductionlog',
          payload: {
            siteid: activeSite,
            dateVal: date,
            shiftVal: thisShift,
          },
        },
        { root: true },
      );
      if (data) {
        const { production } = JSON.parse(data);
        commit('setProductionList', production);
      } else {
        commit('setProductionList', []);
      }
      if (loading) {
        commit('setProductionLoading', false);
      }
    },

    getShiftDowntime: async ({ commit, dispatch, state }) => {
      commit('setDowntimeLoading', true);
      const { thisDate, thisShift } = state;
      const date = parseInt(thisDate.replace(/-/g, ''), 10);
      const data = await dispatch(
        'element/getRecordsWithCount',
        {
          elementName: 'downtime',
          query: `?query=date==${date}%26%26shiftName=="${thisShift}"`,
        },
        { root: true },
      );
      if (data && data.results) {
        commit('setDowntimeList', data.results);
      } else {
        commit('setDowntimeList', []);
      }
      commit('setDowntimeLoading', false);
    },

    updateDowntimeReason: async ({ dispatch, commit, state }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'downtime',
          id,
          payload,
        },
        { root: true },
      );
      let { downtimeList } = state;
      if (updated) {
        downtimeList = downtimeList.map((dt) => {
          // eslint-disable-next-line
          if (dt._id === id) {
            return {
              ...dt,
              ...payload,
            };
          }
          return dt;
        });
        commit('setDowntimeList', downtimeList);
        commit('helper/setAlert', {
          show: true,
          type: 'success',
          message: 'DOWNTIME_UPDATE',
        }, {
          root: true,
        });
      } else {
        commit('setDowntimeList', downtimeList);
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: 'DOWNTIME_UPDATE',
        }, {
          root: true,
        });
      }
    },

    fetchHourlyProduction: async ({ dispatch, state, rootState }, {
      part,
      shift,
      planId,
    }) => {
      const { activeSite } = rootState.user;
      const { thisDate } = state;
      const date = parseInt(thisDate.replace(/-/g, ''), 10);
      const data = await dispatch(
        'report/executeReport',
        {
          reportName: 'hourlyproductionlog',
          payload: {
            siteid: activeSite,
            dateVal: date,
            shiftFilter: `{${shift}}`,
            planFilter: `{${planId}}`,
            partFilter: `{${part}}`,
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

    updateOperator: async ({
      dispatch,
      commit,
      state,
    }, { payload, shift, machine }) => {
      const { thisDate } = state;
      const date = parseInt(thisDate.replace(/-/g, ''), 10);
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
    shiftList: ({ shifts }) => {
      let shiftList = [];
      if (shifts && shifts.length) {
        const allShifts = shifts.filter((rec) => rec.type === 'shift');
        shiftList = [...new Set(allShifts.map((item) => item.name))];
      }
      return shiftList;
    },

    getShiftStart: ({ shifts, thisDate }) => (shiftName) => {
      const currentShift = shifts
        .sort((a, b) => a.sortindex - b.sortindex)
        .find((s) => s.shift === shiftName);
      const [hr, min] = currentShift.starttime.split(':');
      const [year, month, day] = thisDate.split('-');
      return new Date(year, month - 1, day, parseInt(hr, 10), parseInt(min, 10), 0).getTime();
    },

    getHourStart: (
      { thisDate },
    ) => (displayHour) => {
      const [start] = displayHour.split('-');
      const [hr, min] = start.split(':');
      const [year, month, day] = thisDate.split('-');
      return new Date(year, month - 1, day, parseInt(hr, 10), parseInt(min, 10), 0).getTime();
    },

    production: ({ productionList }) => {
      let production = null;
      if (productionList && productionList.length) {
        production = productionList.reduce((result, currentValue) => {
          const {
            machinename,
            operatorname,
            operatorcode,
          } = currentValue;
          if (!result[machinename]) {
            // eslint-disable-next-line
            result[machinename] = {
              operatorcode: operatorcode === '-' ? null : operatorcode,
              operatorname: operatorname === '-' ? null : operatorname,
              production: [],
            };
          }
          // eslint-disable-next-line
          result[machinename].production = [
            ...result[machinename].production,
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

    downtime: ({ downtimeList }) => {
      let downtime = null;
      if (downtimeList && downtimeList.length) {
        downtime = downtimeList
          .reduce((result, currentValue) => {
            const key = currentValue.machinename;
            if (!result[key]) {
              // eslint-disable-next-line
              result[key] = {};
              // eslint-disable-next-line
              result[key].values = [];
            }
            // eslint-disable-next-line
            result[key].values = [
              ...result[key].values,
              currentValue,
            ];
            return result;
          }, {});
      }
      if (!downtime || !Object.keys(downtime).length) {
        downtime = null;
      }
      return downtime;
    },
  },
});
