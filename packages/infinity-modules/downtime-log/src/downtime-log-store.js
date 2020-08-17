import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    onboarded: true,
    machines: [],
    shifts: [],
    selectedMachine: null,
    selectedShift: null,
    selectedDate: null,
    selectedDuration: null,
    downtimeList: [],
    loading: false,
    error: false,
    downtimeReasons: [],
    downtimeCount: 0,
    pageNumber: 1,
    pageSize: 10,
  },
  mutations: {
    setOnboarded: set('onboarded'),
    setMachines: set('machines'),
    setShifts: set('shifts'),
    setSelectedMachine: set('selectedMachine'),
    setSelectedShift: set('selectedShift'),
    setSelectedDate: set('selectedDate'),
    setSelectedDuration: set('selectedDuration'),
    setLoading: set('loading'),
    setError: set('error'),
    setDowntimeReasons: set('downtimeReasons'),
    setDowntimeCount: set('downtimeCount'),
    resetPageNumber: (state) => {
      state.pageNumber = 1;
    },
    incrementPageNumber: (state) => {
      state.pageNumber += 1;
    },
    setDowntimeList: (state, payload) => {
      if (payload && payload.length) {
        state.downtimeList = [...state.downtimeList, ...payload];
      } else {
        state.downtimeList = [];
      }
    },
  },
  actions: {
    fetchMachines: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'machine' },
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

    fetchDowntimeReasons: async ({ commit, dispatch }) => {
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

    fetchDowntimeList: async ({ commit, dispatch, state }) => {
      const {
        selectedMachine,
        selectedDate,
        selectedShift,
        selectedDuration,
        pageNumber,
        pageSize,
      } = state;
      const date = parseInt(selectedDate.replace(/-/g, ''), 10);
      const duration = parseInt(selectedDuration && selectedDuration.value, 10);
      let query = `date==${date}`;
      if (selectedMachine && selectedMachine !== 'All Machines') {
        query += `%26%26machinename=="${selectedMachine}"`;
      }
      if (selectedShift && selectedShift !== 'All Shifts') {
        query += `%26%26shiftName=="${selectedShift}"`;
      }
      if (duration) {
        query += `%26%26downtimeduration%3E${duration}`;
      }
      const paginatedQuery = `pagenumber=${pageNumber}&pagesize=${pageSize}`;
      if (pageNumber === 1) {
        commit('setDowntimeList', []);
        commit('setLoading', true);
        commit('setError', false);
      }
      const data = await dispatch(
        'element/getRecordsWithCount',
        {
          elementName: 'downtime',
          query: `?query=${query}&${paginatedQuery}`,
        },
        { root: true },
      );
      if (data && data.results) {
        commit('setDowntimeList', data.results);
        commit('setDowntimeCount', data.totalCount);
        commit('setError', false);
      } else {
        commit('setDowntimeList', []);
        commit('setDowntimeCount', 0);
        commit('setError', true);
      }
      commit('setLoading', false);
    },

    updateReason: async ({ dispatch, commit, state }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'downtime',
          id,
          payload,
        },
        { root: true },
      );
      if (updated) {
        let { downtimeList } = state;
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
        commit('setDowntimeList', []);
        commit('setDowntimeList', downtimeList);
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
        machineList = machines.map((mac) => mac.machinename);
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
  },
});
