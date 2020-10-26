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
    downtimeList: [],
    loading: false,
    error: false,
    downtimeReasons: [],
    downtimeCount: 0,
    pageNumber: 1,
    pageSize: 10,
    toggleSelection: false,
    selectedDowntimes: [],
  },
  mutations: {
    setSelectedDowntimes: (state, payload) => {
      if (payload.selected) {
        state.selectedDowntimes.push(payload);
      } else {
        // eslint-disable-next-line
        const index = state.selectedDowntimes.findIndex((item) => item._id === payload.id);
        state.selectedDowntimes.splice(index, 1);
      }
    },
    clearCheckedItems: (state) => {
      state.selectedDowntimes = [];
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
    setDowntimeReasons: set('downtimeReasons'),
    setDowntimeCount: set('downtimeCount'),
    setFilters: set('filters'),
    setSort: set('sort'),
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
        selectedType,
        selectedSort,
        pageNumber,
        pageSize,
      } = state;
      if (selectedSort) {
        const date = parseInt(selectedDate.replace(/-/g, ''), 10);
        const duration = parseInt(selectedDuration && selectedDuration.value, 10);
        let query = `date==${date}%26%26status!="inProgress"`;
        if (selectedMachine && selectedMachine !== 'All Machines') {
          query += `%26%26machinename=="${selectedMachine}"`;
        }
        if (selectedShift && selectedShift !== 'All Shifts') {
          query += `%26%26shiftName=="${selectedShift}"`;
        }
        if (duration) {
          query += `%26%26downtimeduration%3E${duration}`;
        }
        if (selectedType && selectedType.value) {
          if (selectedType.value === 'reason') {
            query += '%26%26exists%20reasonname';
          } else {
            query += '%26%26notexists%20reasonname';
          }
        }
        const sortQuery = selectedSort.value;
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
            query: `?query=${query}&sortquery=${sortQuery}&${paginatedQuery}`,
          },
          { root: true },
        );
        if (data && data.results) {
          const downtimes = data.results.map((dt) => ({
            ...dt,
            selected: false,
          }));
          commit('setDowntimeList', downtimes);
          commit('setDowntimeCount', data.totalCount);
          commit('setError', false);
        } else {
          commit('setDowntimeList', []);
          commit('setDowntimeCount', 0);
          commit('setError', true);
        }
        commit('setLoading', false);
      }
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
  },
});
