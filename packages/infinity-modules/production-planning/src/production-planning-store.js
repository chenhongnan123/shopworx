import { set, toggle } from '@shopworx/services/util/store.helper';
import { sortAlphaNum, sortArray } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    calendarRef: null,
    calendarFocus: '',
    today: new Date().toISOString().substr(0, 10),
    masterData: [],
    drawer: false,
    onboarded: true,
    view: 'default',
    machines: [],
    parts: [],
    shifts: [],
    planningList: [],
    reorderPlanList: [],
    loading: false,
    error: false,
    planningCount: 0,
    toggleSelection: false,
    lastRefreshedAt: null,
    lastRefreshedReorder: null,
  },
  mutations: {
    setCalendarRef: set('calendarRef'),
    setCalendarFocus: set('calendarFocus'),
    setMasterData: set('masterData'),
    setToggleSelection: set('toggleSelection'),
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
    setOnboarded: set('onboarded'),
    setView: set('view'),
    setMachines: set('machines'),
    setParts: set('parts'),
    setShifts: set('shifts'),
    setLoading: set('loading'),
    setError: set('error'),
    setPlanningCount: set('planningCount'),
    setPlanningList: set('planningList'),
    setReorderPlanList: set('reorderPlanList'),
    setLastRefreshedAt: set('lastRefreshedAt'),
    setLastRefreshedReorder: set('lastRefreshedReorder'),
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
      const newPlans = `(status=="notStarted"%26%26scheduledstart>${min}%26%26scheduledend<${max})`;
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
        commit('setLastRefreshedAt', new Date().toLocaleTimeString('en-GB'));
      } else {
        commit('setPlanningList', []);
        commit('setPlanningCount', 0);
        commit('setError', true);
      }
      commit('setLoading', false);
    },

    fetchReorderPlanList: async ({ commit, dispatch }) => {
      commit('setLoading', true);
      commit('setReorderPlanList', []);
      commit('setError', false);
      const data = await dispatch(
        'element/getRecordsWithCount',
        {
          elementName: 'planning',
          query: '?query=status=="notStarted"',
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
        commit('setReorderPlanList', plans);
        commit('setError', false);
        commit('setLastRefreshedReorder', new Date().toLocaleTimeString('en-GB'));
      } else {
        commit('setReorderPlanList', []);
        commit('setError', true);
      }
      commit('setLoading', false);
    },

    fetchPartMatrix: async ({ dispatch }, { partname }) => {
      const payload = {
        elementName: 'partmatrix',
        query: `?query=partname=="${encodeURIComponent(partname)}"`,
      };
      const partMatrixRecords = await dispatch(
        'element/getRecords',
        payload,
        { root: true },
      );
      if (partMatrixRecords && partMatrixRecords.length) {
        return partMatrixRecords;
      }
      return [];
    },
  },
  getters: {
    isCalendarView: ({ view }) => view !== 'default',

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

    planning: (
      { planningList },
      { isCalendarView },
      rootState,
      rootGetters,
    ) => {
      let planning = null;
      if (planningList && planningList.length) {
        const [group] = rootGetters['webApp/group'];
        planning = rootGetters['webApp/filteredRecords'](planningList);
        if (!isCalendarView) {
          planning = rootGetters['webApp/sortedRecords'](planning);
          planning = sortArray(planning, group);
          planning = rootGetters['webApp/groupedRecords'](planning);
        }
      }
      if (!planning || !Object.keys(planning).length) {
        planning = null;
      }
      return planning;
    },

    notStartedPlans: ({ reorderPlanList }) => {
      let planning = null;
      if (reorderPlanList && reorderPlanList.length) {
        planning = reorderPlanList.sort((a, b) => a.sortindex - b.sortindex);
        planning = sortArray(planning, 'machinename');
        planning = planning.reduce((result, currentValue) => {
          const key = currentValue.machinename;
          if (!result[key]) {
            result[key] = {};
            result[key].values = [];
          }
          result[key].values = [
            ...result[key].values,
            currentValue,
          ];
          return result;
        }, {});
      }
      if (!planning || !Object.keys(planning).length) {
        planning = null;
      }
      return planning;
    },
  },
});
