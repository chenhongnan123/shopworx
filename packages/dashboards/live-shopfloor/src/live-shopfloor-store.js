import { reactiveSetArray, set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

const parseDate = (datetime) => {
  const [date, hr, min, sec] = datetime.split(':');
  const [year, month, day] = date.split('-');
  return new Date(
    year,
    month - 1,
    day,
    hr,
    min,
    sec,
  ).getTime();
};

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
    rows: 0,
    cols: 0,
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
    setRows: set('rows'),
    setCols: set('cols'),
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
            updatedAt: new Date().getTime(),
            runtime: 0,
            stdcycletime: 0,
          };
          if (m.production.length) {
            const {
              planid,
              runtime,
              stdcycletime,
              updatedAt,
            } = m.production[0];
            payload.planid = planid;
            payload.updatedAt = parseDate(updatedAt);
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
    totalMachines: ({ machines }) => machines.length,

    operatingMachines: ({ machines }) => machines
      .filter((m) => m.machinestatus === 'UP').length,

    stoppedMachines: ({ machines }) => machines
      .filter((m) => m.machinestatus === 'DOWN').length,

    idleMachines: ({ machines }) => machines
      .filter((m) => m.machinestatus === 'NOPLAN').length,

    screens: (
      { machines, rows, cols },
      /* rootState,
      rootGetters, */
    ) => {
      let screens = null;
      if (machines && machines.length) {
        const cardsPerScreen = rows * cols;
        if (cardsPerScreen) {
          const nonce = Math.ceil(machines.length / cardsPerScreen);
          const screenArray = [];
          for (let i = 0; i < nonce; i += 1) {
            screenArray.push(i);
          }
          screens = screenArray
            .reduce((result, current) => {
              // eslint-disable-next-line
              result[current] = {
                title: 'Shift-wise shopfloor dashboard',
                rows,
                cols,
                machines: machines.filter((_, index) => (
                  index >= cardsPerScreen * current
                  && index < (cardsPerScreen * (current + 1))
                )),
              };
              return result;
            }, {});
        }
        /* const [group] = rootGetters['webApp/group'];
        machines = rootGetters['webApp/filteredRecords'](machines);
        machines = rootGetters['webApp/sortedRecords'](machines);
        machines = sortArray(machines, group);
        machines = rootGetters['webApp/groupedRecords'](machines); */
      }
      if (!screens || !Object.keys(screens).length) {
        screens = null;
      }
      return screens;
    },
  },
});
