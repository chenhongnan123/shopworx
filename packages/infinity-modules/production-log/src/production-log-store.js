import { set, toggle } from '@shopworx/services/util/store.helper';
import { sortAlphaNum } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    drawer: false,
    onboarded: true,
    machines: [],
    shifts: [],
    filters: {},
    sort: {},
    selectedMachine: null,
    selectedShift: null,
    selectedDate: null,
    selectedDuration: null,
    selectedType: null,
    selectedSort: null,
    productionList: [],
    loading: false,
    error: false,
    productionReasons: [],
    productionCount: 0,
    toggleSelection: false,
    selectedProductions: [],
  },
  mutations: {
    setSelectedProductions: (state, payload) => {
      if (payload.selected) {
        state.selectedProductions.push(payload);
      } else {
        // eslint-disable-next-line
        const index = state.selectedProductions.findIndex((item) => item._id === payload.id);
        state.selectedProductions.splice(index, 1);
      }
    },
    clearCheckedItems: (state) => {
      state.selectedProductions = [];
    },
    setToggleSelection: set('toggleSelection'),
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
    setOnboarded: set('onboarded'),
    setMachines: set('machines'),
    setShifts: set('shifts'),
    setSelectedMachine: set('selectedMachine'),
    setSelectedShift: set('selectedShift'),
    setSelectedDate: set('selectedDate'),
    setSelectedDuration: set('selectedDuration'),
    setSelectedType: set('selectedType'),
    setSelectedSort: set('selectedSort'),
    setLoading: set('loading'),
    setError: set('error'),
    setProductionReasons: set('productionReasons'),
    setProductionCount: set('productionCount'),
    setFilters: set('filters'),
    setSort: set('sort'),
    setProductionList: set('productionList'),
  },
  actions: {
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

    fetchProductionReasons: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'productionreasons' },
        { root: true },
      );
      if (records) {
        commit('setProductionReasons', records);
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

    production: ({ productionList }) => {
      let production = null;
      if (productionList && productionList.length) {
        production = productionList.reduce((acc, cur) => {
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
      return production;
    },
  },
});
