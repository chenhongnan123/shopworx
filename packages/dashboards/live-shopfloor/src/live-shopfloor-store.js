import { reactiveSetArray, set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    loading: false,
    currentShift: null,
    currentHour: null,
    currentDate: null,
    selectedView: null,
    selectedDisplay: null,
    selectedTheme: null,
    machines: [],
  },
  mutations: {
    setLoading: set('loading'),
    setCurrentShift: set('currentShift'),
    setCurrentHour: set('currentHour'),
    setCurrentDate: set('currentDate'),
    setSelectedView: set('selectedView'),
    setSelectedDisplay: set('selectedDisplay'),
    setSelectedTheme: set('selectedTheme'),
    setDashboardType: set('dashboardType'),
    setMachines: set('machines'),
    setMachine: reactiveSetArray('machines'),
  },
  actions: {
    getBusinessTime: async ({ commit, dispatch }) => {
      const data = await dispatch(
        'calendar/getBusinessTime',
        null,
        { root: true },
      );
      if (data) {
        commit('setCurrentShift', data.shiftName);
        commit('setCurrentHour', data.hour);
        commit('setCurrentDate', data.date);
        return true;
      }
      return false;
    },

    getMachines: async ({
      state, commit, dispatch, rootState,
    }) => {
      const { selectedView, currentDate, currentShift } = state;
      const { activeSite } = rootState.user;
      const data = await dispatch(
        'report/executeReport',
        {
          reportName: selectedView.reportName,
          payload: {
            siteid: activeSite,
            dateVal: +currentDate,
            shiftVal: currentShift,
          },
        },
        { root: true },
      );
      if (data) {
        const { machines } = JSON.parse(data);
        const mappedMachines = machines.map((m) => {
          const payload = {
            planid: '',
            updatedat: '',
            runtime: 0,
            stdcycletime: 0,
          };
          if (m.production.length) {
            const {
              planid,
              runtime,
              stdcycletime,
              updatedat,
            } = m.production[0];
            payload.planid = planid;
            payload.updatedat = updatedat;
            payload.runtime = runtime;
            payload.stdcycletime = stdcycletime;
          }
          return {
            ...m,
            ...payload,
          };
        });
        commit('setMachines', sortArray(mappedMachines, 'machinename'));
      } else {
        commit('setMachines', []);
      }
    },
  },
  getters: {
  },
});
