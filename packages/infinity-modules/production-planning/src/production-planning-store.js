import { set, toggle } from '@shopworx/services/util/store.helper';
import { sortAlphaNum, sortArray } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    masterData: [],
    drawer: false,
    onboarded: true,
    machines: [],
    parts: [],
    shifts: [],
    planningList: [],
    loading: false,
    error: false,
    planningCount: 0,
    toggleSelection: false,
  },
  mutations: {
    setMasterData: set('masterData'),
    setToggleSelection: set('toggleSelection'),
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
    setOnboarded: set('onboarded'),
    setMachines: set('machines'),
    setParts: set('parts'),
    setShifts: set('shifts'),
    setLoading: set('loading'),
    setError: set('error'),
    setPlanningCount: set('planningCount'),
    setPlanningList: set('planningList'),
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

    fetchParts: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'part',
        },
        { root: true },
      );
      if (records && records.length) {
        commit('setParts', records);
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

    fetchPlanningList: async ({
      commit, dispatch, getters, rootGetters,
    }) => {
      const filters = rootGetters['webApp/filters'];
      let [min, max] = filters.date.value;
      [min, max] = getters.getDateRange([min, max]);
      commit('setLoading', true);
      commit('setPlanningList', []);
      commit('setError', false);
      const completedOrAbortedPlans = `(actualstart<${max}%26%26actualend>${min})`;
      const inProgressPlans = `(status=="inProgress"%26%26actualstart<${max})`;
      const newPlans = `(status=="notStarted"%26%26scheduledstart<${max})`;
      const or = '%7C%7C';
      const data = await dispatch(
        'element/getRecordsWithCount',
        {
          elementName: 'planning',
          query: `?query=${completedOrAbortedPlans}${or}${inProgressPlans}${or}${newPlans}`,
        },
        { root: true },
      );
      if (data && data.results) {
        const plans = data.results.map((plan) => {
          const equipmentname = plan.moldname || plan.toolname;
          return {
            ...plan,
            equipmentname,
          };
        });
        commit('setPlanningList', plans);
        commit('setPlanningCount', data.totalCount);
        commit('setError', false);
      } else {
        commit('setPlanningList', []);
        commit('setPlanningCount', 0);
        commit('setError', true);
      }
      commit('setLoading', false);
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

    partList: ({ parts }) => {
      let partList = [];
      if (parts && parts.length) {
        partList = parts
          .map((mac) => mac.partname)
          .sort(sortAlphaNum);
        partList = ['All Parts', ...partList];
      }
      return partList;
    },

    planStatus: () => (status) => {
      let result = { text: 'New', color: 'info' };
      if (status === 'inProgress') {
        result = { text: 'Operational', color: 'success' };
      } else if (status === 'complete') {
        result = { text: 'Complete', color: 'accent' };
      } else if (status === 'abort') {
        result = { text: 'Aborted', color: 'error' };
      }
      return result;
    },

    getDateRange: ({ shifts }) => ([start, end]) => {
      const [shift] = shifts.sort((a, b) => a.sortindex - b.sortindex);
      const [hr, min] = shift.starttime.split(':');
      const [sYear, sMonth, sDay] = start.split('-');
      const [eYear, eMonth, eDay] = end.split('-');
      const oneDayInMs = 86400000;
      return [
        new Date(
          sYear,
          sMonth - 1,
          sDay,
          parseInt(hr, 10),
          parseInt(min, 10),
          0,
        ).getTime(),
        new Date(
          eYear,
          eMonth - 1,
          eDay,
          parseInt(hr, 10),
          parseInt(min, 10),
          0,
        ).getTime() + oneDayInMs,
      ];
    },

    planning: ({ planningList }, getters, rootState, rootGetters) => {
      let planning = null;
      if (planningList && planningList.length) {
        const group = rootGetters['webApp/group'];
        console.log(group);
        planning = rootGetters['webApp/filteredRecords'](planningList);
        planning = rootGetters['webApp/sortedRecords'](planning);
        group.forEach((key) => {
          planning = sortArray(planning, key);
        });
        planning = rootGetters['webApp/groupedRecords'](planning);
      }
      if (!planning || !Object.keys(planning).length) {
        planning = null;
      }
      return planning;
    },
  },
});
