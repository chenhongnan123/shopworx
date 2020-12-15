import { reactiveSetArray, set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';
import HourService from '@shopworx/services/api/hour.service';

const parseDate = (datetime) => {
  const [date, hr, min, sec] = datetime.split(':');
  const [day, month, year] = date.split('-');
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
    displayHour: null,
    currentDate: null,
    selectedView: null,
    selectedDisplay: null,
    selectedTheme: null,
    machines: [],
    shifts: [],
    rows: 0,
    cols: 0,
  },
  mutations: {
    setLoading: set('loading'),
    setCurrentShift: set('currentShift'),
    setCurrentHour: set('currentHour'),
    setDisplayHour: set('displayHour'),
    setCurrentDate: set('currentDate'),
    setSelectedView: set('selectedView'),
    setSelectedDisplay: set('selectedDisplay'),
    setSelectedTheme: set('selectedTheme'),
    setDashboardType: set('dashboardType'),
    setMachines: set('machines'),
    setShifts: set('shifts'),
    setMachine: reactiveSetArray('machines'),
    setRows: set('rows'),
    setCols: set('cols'),
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

    getBusinessTime: async ({ commit, dispatch }) => {
      const data = await dispatch(
        'calendar/getBusinessTime',
        null,
        { root: true },
      );
      if (data) {
        commit('setCurrentShift', data.shiftName);
        commit('setCurrentHour', data.hour);
        commit('setDisplayHour', data.displayHour);
        commit('setCurrentDate', data.date);
        return true;
      }
      return false;
    },

    getShiftAvailableTime: async ({ getters }) => {
      const { shiftStartTime } = getters;
      const now = new Date().getTime();
      const { data } = await HourService.getNonWorkingTime(shiftStartTime, now);
      if (data) {
        return now - shiftStartTime - data.results;
      }
      return now - shiftStartTime;
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
        const shiftWorkingTime = await dispatch('getShiftAvailableTime');
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
            shiftWorkingTime,
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

    shiftStartTime: ({ shifts, currentShift, currentDate }) => {
      const shift = shifts.find((s) => s.shift === currentShift);
      const [hr, min] = shift.starttime.split(':');
      const year = currentDate.substring(0, 4);
      const month = currentDate.substring(6, 4);
      const day = currentDate.substring(8, 6);
      return new Date(year, month - 1, day, parseInt(hr, 10), parseInt(min, 10), 0).getTime();
    },

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
