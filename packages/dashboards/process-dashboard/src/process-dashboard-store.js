import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    loading: false,
    currentShift: null,
    currentHour: null,
    displayHour: null,
    currentDate: null,
    selectedTheme: null,
    shifts: [],
    allWidgets: [
      {
        component: 'model-info',
        title: 'Model details',
        maxCount: 1,
        minWidth: 5,
        minHeight: 7,
        maxWidth: 6,
        maxHeight: 7,
        config: null,
        configured: true,
      },
      {
        component: 'model-output',
        title: 'Model output',
        maxCount: 1,
        minWidth: 6,
        minHeight: 18,
        maxWidth: 7,
        maxHeight: 18,
        config: null,
        configured: true,
      },
      {
        component: 'model-warnings',
        title: 'Alerts',
        maxCount: 1,
        minWidth: 5,
        minHeight: 10,
        maxWidth: 6,
        maxHeight: 10,
        config: null,
        configured: true,
      },
    ],
    widgets: [
      {
        x: 0,
        y: 0,
        w: 5,
        h: 7,
        i: 0,
        definition: {
          component: 'model-info',
          title: 'Model details',
          maxCount: 1,
          minWidth: 5,
          minHeight: 7,
          maxWidth: 6,
          maxHeight: 7,
          config: null,
          configured: true,
        },
        moved: false,
      },
      {
        x: 5,
        y: 0,
        w: 7,
        h: 18,
        i: 1,
        definition: {
          component: 'model-output',
          title: 'Model output',
          maxCount: 1,
          minWidth: 6,
          minHeight: 18,
          maxWidth: 7,
          maxHeight: 18,
          config: null,
          configured: true,
        },
        moved: false,
      },
      {
        x: 0,
        y: 7,
        w: 5,
        h: 10,
        i: 2,
        definition: {
          component: 'model-warnings',
          title: 'Alerts',
          maxCount: 1,
          minWidth: 5,
          minHeight: 10,
          maxWidth: 6,
          maxHeight: 10,
          config: null,
          configured: true,
        },
        moved: false,
      },
    ],
    parameters: {
      x: null,
      c: 0,
      p: 0,
      v: 0,
      s: 0,
      m: 0,
    },
  },
  mutations: {
    setLoading: set('loading'),
    setCurrentShift: set('currentShift'),
    setCurrentHour: set('currentHour'),
    setDisplayHour: set('displayHour'),
    setCurrentDate: set('currentDate'),
    setSelectedTheme: set('selectedTheme'),
    setShifts: set('shifts'),
    setAllWidgets: set('allWidgets'),
    setWidgets: set('widgets'),
    setParameters: set('parameters'),
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
        commit('setCurrentDate', +data.date);
        return true;
      }
      return false;
    },
  },
  getters: {
    getRandomNumber: () => ({ min, max }) => Math
      .floor(Math.random() * (max * 100 - min * 100) + min * 100) / (min * 100),
  },
});
