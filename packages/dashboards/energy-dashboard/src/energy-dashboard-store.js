import { reactiveSetArray, set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';
import HourService from '@shopworx/services/api/hour.service';

const REPORTS = {
  hour: 'hourlyenergydashboard',
  shift: 'shiftenergydashboard',
};

export default ({
  namespaced: true,
  state: {
    loading: false,
    currentTime: null,
    currentShift: null,
    currentHour: null,
    displayHour: null,
    currentDate: null,
    selectedView: null,
    selectedDisplay: null,
    selectedTheme: null,
    meters: [],
    shifts: [],
    themes: [
      'light',
      'dark',
    ],
    views: [
      'shift',
      'hour',
    ],
    rows: 0,
    cols: 0,
  },
  mutations: {
    setLoading: set('loading'),
    setCurrentTime: set('currentTime'),
    setCurrentShift: set('currentShift'),
    setCurrentHour: set('currentHour'),
    setDisplayHour: set('displayHour'),
    setCurrentDate: set('currentDate'),
    setSelectedView: set('selectedView'),
    setSelectedDisplay: set('selectedDisplay'),
    setSelectedTheme: set('selectedTheme'),
    setDashboardType: set('dashboardType'),
    setMeters: set('meters'),
    setShifts: set('shifts'),
    setMeter: reactiveSetArray('meters'),
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

    getServerTime: async ({ commit }) => {
      const { data } = await HourService.getCurrentTime();
      if (data && data.results) {
        commit('setCurrentTime', data.results);
        return data.results;
      }
      return null;
    },

    getBusinessTime: async ({ commit, dispatch }) => {
      const serverTime = await dispatch('getServerTime');
      if (serverTime) {
        const data = await dispatch(
          'calendar/getBusinessTime',
          serverTime,
          { root: true },
        );
        if (data) {
          commit('setCurrentShift', data.shiftName);
          commit('setCurrentHour', data.hour);
          commit('setDisplayHour', data.displayHour);
          commit('setCurrentDate', +data.date);
          return true;
        }
      }
      return false;
    },

    getMeters: async ({
      state, commit, dispatch, rootState,
    }) => {
      const {
        selectedView,
        currentDate,
        currentShift,
        currentHour,
        currentTime,
      } = state;
      const { activeSite } = rootState.user;
      let payload = {};
      if (selectedView === 'shift') {
        payload = {
          siteid: activeSite,
          dateVal: currentDate,
          shiftVal: currentShift,
        };
      } else if (selectedView === 'hour') {
        payload = {
          siteid: activeSite,
          dateVal: currentDate,
          hourVal: currentHour,
        };
      }
      const data = await dispatch(
        'report/executeReport',
        {
          reportName: REPORTS[selectedView],
          payload,
        },
        { root: true },
      );
      if (data) {
        const { meters } = JSON.parse(data);
        const mappedMeters = meters.map((m) => {
          const machinePayload = {
            updatedAt: m.updatedAt || currentTime,
          };
          return {
            ...m,
            ...machinePayload,
          };
        });
        commit('setMeters', sortArray(mappedMeters, 'metername'));
      } else {
        commit('setMeters', []);
      }
    },
  },
  getters: {
    totalMeters: ({ meters }) => meters.length,

    connectedMeters: ({ meters }) => meters
      .filter((m) => m.meterstatus === 0).length,

    disconnectedMeters: ({ meters }) => meters
      .filter((m) => m.meterstatus === 1).length,

    totalConsumption: ({ meters }) => meters
      .reduce((acc, cur) => {
        const { consumption } = cur;
        // eslint-disable-next-line
        acc += consumption || 0;
        return acc;
      }, 0),

    shiftStartTime: ({ shifts, currentShift, currentDate }) => {
      const shift = shifts.find((s) => s.shift === currentShift);
      const [hr, min] = shift.starttime.split(':');
      const date = currentDate.toString();
      const year = date.substring(0, 4);
      const month = date.substring(6, 4);
      const day = date.substring(8, 6);
      return new Date(year, month - 1, day, parseInt(hr, 10), parseInt(min, 10), 0).getTime();
    },

    hourStartTime: ({ displayHour, currentDate }) => {
      const [start] = displayHour.split('-');
      const [hr, min] = start.split(':');
      const date = currentDate.toString();
      const year = date.substring(0, 4);
      const month = date.substring(6, 4);
      const day = date.substring(8, 6);
      return new Date(year, month - 1, day, parseInt(hr, 10), parseInt(min, 10), 0).getTime();
    },

    screens: (
      { meters, rows, cols },
      /* rootState,
      rootGetters, */
    ) => {
      let screens = null;
      if (meters && meters.length) {
        const cardsPerScreen = rows * cols;
        if (cardsPerScreen) {
          const nonce = Math.ceil(meters.length / cardsPerScreen);
          const screenArray = [];
          for (let i = 0; i < nonce; i += 1) {
            screenArray.push(i);
          }
          screens = screenArray
            .reduce((result, current) => {
              // eslint-disable-next-line
              result[current] = {
                title: 'Shift-wise energy consumption',
                rows,
                cols,
                meters: meters.filter((_, index) => (
                  index >= cardsPerScreen * current
                  && index < (cardsPerScreen * (current + 1))
                )),
              };
              return result;
            }, {});
        }
        /* const [group] = rootGetters['webApp/group'];
        meters = rootGetters['webApp/filteredRecords'](meters);
        meters = rootGetters['webApp/sortedRecords'](meters);
        meters = sortArray(meters, group);
        meters = rootGetters['webApp/groupedRecords'](meters); */
      }
      if (!screens || !Object.keys(screens).length) {
        screens = null;
      }
      return screens;
    },
  },
});
