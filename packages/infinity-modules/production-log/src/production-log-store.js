import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    isPlanningSet: false,
    onboarded: false,
    notStartedPlans: null,
    plansOnDate: null,
    machines: [],
    allShifts: [],
    shiftList: [],
    selectedMachine: null,
    selectedCell: null,
    selectedShift: null,
    selectedDate: null,
  },
  mutations: {
    setOnboarded: set('onboarded'),
    setIsPlanningSet: set('isPlanningSet'),
    setNotStartedPlans: set('notStartedPlans'),
    setPlansOnDate: set('plansOnDate'),
    setMachines: set('machines'),
    setShift: set('allShifts'),
    setShiftList: set('shiftList'),
    setSelectedCell: set('selectedCell'),
    setSelectedMachine: set('selectedMachine'),
    setSelectedShift: set('selectedShift'),
    setSelectedDate: set('selectedDate'),
  },
  actions: {
    getOnboardingState: async ({ commit, dispatch }) => {
      const planning = await dispatch('getPlanningElement');
      if (planning) {
        commit('setIsPlanningSet', true);
        const rejectionReason = await dispatch('getRejectionReasonElement');
        if (rejectionReason) {
          const downtimeReason = await dispatch('getDowntimeReasonElement');
          if (downtimeReason) {
            const operator = await dispatch('getOperatorElement');
            if (operator) {
              commit('setOnboarded', true);
            }
          }
        }
      }
    },

    getPlanningElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'planning',
        { root: true },
      );
      return !!element;
    },

    getRejectionReasonElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'rejectionreasons',
        { root: true },
      );
      return !!element;
    },

    getDowntimeReasonElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'downtimereasons',
        { root: true },
      );
      return !!element;
    },

    getOperatorElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'operator',
        { root: true },
      );
      return !!element;
    },
    fetchBusinessHours: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'businesshours', query: '?sortquery=sortindex==1' },
        { root: true },
      );
      if (records) {
        if (records.length) {
          const allShifts = records.filter((rec) => rec.type === 'shift');
          commit('setShift', allShifts);
          const shiftList = [...new Set(allShifts.map((item) => item.name))];
          commit('setShiftList', shiftList);
          return true;
        }
      }
      return false;
    },

    fetchMachines: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'machine' },
        { root: true },
      );
      if (records) {
        commit('setMachines', records);
        return true;
      }
      return false;
    },

    getRejections: async ({ commit, dispatch }) => {
      // const { selectedShift, selectedMachine, allShifts } = state;
      // TODO get start and end date (shift/day)
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'rejection',
          // query: `&query=datefrom==${}&dateto==${}`,
        },
        { root: true },
      );
      if (records) {
        commit('setRejections', records);
        return true;
      }
      return false;
    },
    addRejection: async ({ dispatch }, rejectionData) => {
      const records = await dispatch(
        'element/postRecord', {
          elementName: 'rejection',
          payload: rejectionData,
        }, {
          root: true,
        },
      );
      if (records) {
        //  TODO  - Success toast - append data to rejectionDetails(Display)
        return true;
      }
      return false;
    },
    updateRejection: async ({ dispatch }, rejectionData) => {
      const { id } = rejectionData;
      const records = await dispatch(
        'element/updateRecordById', {
          elementName: 'rejection',
          id,
          payload: rejectionData,
        }, {
          root: true,
        },
      );
      if (records) {
        //  TODO  - Success toast
        return true;
      }
      return false;
    },
    getProductionReport: async ({ state, commit, dispatch }) => {
      const { selectedMachine, selectedShift } = state;
      // TODO get report start and end date (shift/day)
      // const reportDate =
      const records = await dispatch(
        'report/executeReport', {
          reportName: 'productionbyshift',
          payload: {
            machineVal: selectedMachine,
            shiftVal: selectedShift,
            // startDate: starDate,
            // endDate: endDate
          },
        }, {
          root: true,
        },
      );
      if (records) {
        commit('setRejections', records);
        return true;
      }
      return false;
    },

    getPlansBetweenDateRange: async ({ commit, dispatch }, { min, max }) => {
      const plans = await dispatch(
        'planning/getPlanningRecords',
        `?query=(actualstart<${max}%26%26actualend>${min})%7C%7C((status=="inProgress"%7C%7Cstatus=="paused")%26%26actualstart<${max})%7C%7C(status=="notStarted"%26%26scheduledstart<${max})`,
        { root: true },
      );
      commit('setPlansOnDate', plans);
    },

    getNotStartedPlans: async ({ commit, dispatch }) => {
      const plans = await dispatch(
        'planning/getPlanningRecords',
        '?query=status=="notStarted"',
        { root: true },
      );
      commit('setNotStartedPlans', plans);
    },
  },
  getters: {
    cells: ({ machines }) => {
      let cells = [];
      if (machines && machines.length) {
        cells = [...new Set(machines.map((m) => (m.machinecell)))];
        cells = cells.map((cell) => ({
          name: cell,
          value: cell,
        }));
        cells = [{ name: 'All cells', value: null }, ...cells];
      }
      return cells;
    },
    machineList: ({ machines }) => {
      let machineList = [];
      if (machines && machines.length) {
        machineList = machines.map((mac) => mac.machinename);
        machineList = ['All Machines', ...machineList];
      }
      return machineList;
    },
    shifts: ({ shiftList }) => {
      let shifts = [];
      if (shiftList && shiftList.length) {
        shifts = ['All Shift', ...shiftList];
      }
      return shifts;
    },
    filteredMachines: ({ machines, selectedCell }) => {
      let filteredMachines = machines;
      if (selectedCell && selectedCell.value && machines && machines.length) {
        filteredMachines = machines.filter((m) => m.machinecell === selectedCell.value);
      }
      return filteredMachines;
    },
  },
});
