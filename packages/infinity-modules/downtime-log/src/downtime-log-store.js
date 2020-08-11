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
  },
  mutations: {
    setOnboarded: set('onboarded'),
    setMachines: set('machines'),
    setShifts: set('shifts'),
    setSelectedMachine: set('selectedMachine'),
    setSelectedShift: set('selectedShift'),
    setSelectedDate: set('selectedDate'),
    setSelectedDuration: set('selectedDuration'),
    setDowntimeList: set('downtimeList'),
    setLoading: set('loading'),
    setError: set('error'),
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

    fetchDowntimeList: async ({ commit, dispatch, state }) => {
      const {
        selectedMachine,
        selectedDate,
        selectedShift,
        selectedDuration,
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
      commit('setLoading', true);
      commit('setError', false);
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'downtime',
          query: `?query=${query}`,
        },
        { root: true },
      );
      if (records) {
        commit('setDowntimeList', records);
        commit('setError', false);
      } else {
        commit('setDowntimeList', []);
        commit('setError', true);
      }
      commit('setLoading', false);
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
