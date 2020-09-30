import { set, toggle, reactiveSet } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    page: 0,
    autorun: false,
    machines: [],
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
        component: 'parameter-widget',
        title: 'Parameter visualization',
        maxCount: 10,
        minWidth: 5,
        minHeight: 6,
        maxWidth: 8,
        maxHeight: 7,
        config: {
          availableParameters: [
            {
              title: 'Horizontal Temperature (°C)',
              key: 'horizontaltemp',
              val: 0,
            },
            {
              title: 'Motor Speed',
              key: 'motorspeed',
              val: 1,
            },
            {
              title: 'Vertical Temperature (°C)',
              key: 'verticaltemp',
              val: 2,
            },
          ],
          selectedParameter: null,
        },
        configured: false,
      },
      {
        component: 'stream-widget',
        title: 'Text stream',
        maxCount: 10,
        minWidth: 3,
        minHeight: 3,
        maxWidth: 4,
        maxHeight: 5,
        config: {
          availableParameters: [
            {
              title: 'Alarms',
              values: [
                {
                  key: 'horztemplowalarm',
                  val: 'horizontaltemp',
                  text: 'Horizontal temp low: ##horizontaltemp##',
                },
                {
                  key: 'horztemphighalarm',
                  val: 'horizontaltemp',
                  text: 'Horizontal temp high: ##horizontaltemp##',
                },
                {
                  key: 'verttemplowalarm',
                  val: 'verticaltemp',
                  text: 'Vertical temp low: ##verticaltemp##',
                },
                {
                  key: 'verttemphighalarm',
                  val: 'verticaltemp',
                  text: 'Vertical temp high: ##verticaltemp##',
                },
                {
                  key: 'motoroverspeedalarm',
                  val: 'motorspeed',
                  text: 'Motor over-speed: ##motorspeed##',
                },
              ],
              val: 0,
            },
            {
              title: 'Maintenance',
              key: 'maintenance',
              val: 1,
            },
          ],
          selectedParameter: null,
        },
        configured: false,
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
        commit('setMachines', records);
        return true;
      }
      return false;
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
