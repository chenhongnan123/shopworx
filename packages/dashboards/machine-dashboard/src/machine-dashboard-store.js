import { set, toggle, reactiveSet } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';
import HourService from '@shopworx/services/api/hour.service';

export default ({
  namespaced: true,
  state: {
    page: 0,
    autorun: false,
    machines: [],
    shifts: [],
    currentShift: null,
    currentDate: null,
    selectedCell: null,
    selectedTime: 1,
    customizeMode: false,
    allWidgets: [
      {
        component: 'tabbed-widget',
        title: 'Machine performance',
        maxCount: 1,
        minWidth: 6,
        minHeight: 8,
        maxWidth: 8,
        maxHeight: 14,
        config: null,
        configured: true,
      },
      {
        component: 'stats-widget',
        title: 'Machine production',
        maxCount: 1,
        minWidth: 3,
        minHeight: 5,
        maxWidth: 4,
        maxHeight: 10,
        config: null,
        configured: true,
      },
      {
        component: 'status-widget',
        title: 'Machine status',
        maxCount: 1,
        minWidth: 3,
        minHeight: 3,
        maxWidth: 4,
        maxHeight: 5,
        config: null,
        configured: true,
      },
      {
        component: 'timeline-widget',
        title: 'Machine timeline',
        maxCount: 1,
        minWidth: 6,
        minHeight: 8,
        maxWidth: 8,
        maxHeight: 14,
        config: null,
        configured: true,
      },
    ],
    widgets: [
      {
        x: 0,
        y: 0,
        w: 4,
        h: 10,
        i: 0,
        definition: {
          component: 'stats-widget',
          title: 'Machine production',
          maxCount: 1,
          minWidth: 3,
          minHeight: 5,
          maxWidth: 4,
          maxHeight: 10,
          config: null,
          configured: true,
        },
        moved: false,
      },
      {
        x: 8,
        y: 10,
        w: 4,
        h: 5,
        i: 2,
        definition: {
          component: 'status-widget',
          title: 'Machine status',
          maxCount: 1,
          minWidth: 3,
          minHeight: 3,
          maxWidth: 4,
          maxHeight: 5,
          config: null,
          configured: true,
        },
        moved: false,
      },
      {
        x: 4,
        y: 0,
        w: 8,
        h: 10,
        i: 5,
        definition: {
          component: 'timeline-widget',
          title: 'Machine timeline',
          maxCount: 1,
          minWidth: 6,
          minHeight: 8,
          maxWidth: 8,
          maxHeight: 14,
          config: null,
          configured: true,
        },
        moved: false,
      },
      {
        x: 0,
        y: 10,
        w: 8,
        h: 8,
        i: 6,
        definition: {
          component: 'tabbed-widget',
          title: 'Machine performance',
          maxCount: 1,
          minWidth: 6,
          minHeight: 8,
          maxWidth: 8,
          maxHeight: 14,
          config: null,
          configured: true,
        },
        moved: false,
      },
    ],
    assetData: {},
  },
  mutations: {
    setPage: set('page'),
    toggleAutorun: toggle('autorun'),
    setMachines: set('machines'),
    setShifts: set('shifts'),
    setCurrentShift: set('currentShift'),
    setCurrentDate: set('currentDate'),
    setSelectedCell: set('selectedCell'),
    setSelectedTime: set('selectedTime'),
    setCustomizeMode: set('customizeMode'),
    toggleCustomizeMode: toggle('customizeMode'),
    setAllWidgets: set('allWidgets'),
    setWidgets: set('widgets'),
    setAssetData: reactiveSet('assetData'),
  },
  actions: {
    getMachines: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'machine' },
        { root: true },
      );
      if (records) {
        const machines = sortArray(records, 'machinename');
        commit('setMachines', machines);
        return true;
      }
      return false;
    },

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
        const year = data.date.substring(0, 4);
        const month = data.date.substring(6, 4);
        const day = data.date.substring(8, 6);
        commit('setCurrentShift', data.shiftName);
        commit('setCurrentDate', `${year}-${month}-${day}`);
        return true;
      }
      return false;
    },

    getAvailableTime: async ({ getters }) => {
      const start = getters.shiftStartTime;
      const end = new Date().getTime();
      const { data } = await HourService.getNonWorkingTime(start, end);
      const nonWorkingTime = data.results;
      const totalTime = end - start;
      return totalTime - nonWorkingTime;
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

    filteredMachines: ({ machines, selectedCell }) => {
      let filteredMachines = machines;
      if (selectedCell && selectedCell.value && machines && machines.length) {
        filteredMachines = machines.filter((m) => m.machinecell === selectedCell.value);
      }
      return filteredMachines;
    },

    shiftStartTime: ({ shifts, currentShift, currentDate }) => {
      const shift = shifts.find((s) => s.shift === currentShift);
      const [hr, min] = shift.starttime.split(':');
      const [year, month, day] = currentDate.split('-');
      return new Date(year, month - 1, day, parseInt(hr, 10), parseInt(min, 10), 0).getTime();
    },

    realTimeValue: ({ assetData }) => (machinename) => Object.keys(assetData)
      .filter((key) => key.includes(machinename))
      .reduce((obj, key) => {
        const k = key.split('__');
        // eslint-disable-next-line
        obj[k[1]] = assetData[key];
        return obj;
      }, {}),
  },
});
