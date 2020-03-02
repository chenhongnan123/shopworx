import ElementService from '@shopworx/services/api/element.service';
import { set, toggle } from '@shopworx/services/util/store.service';

export default ({
  namespaced: true,
  state: {
    view: 0,
    plans: [],
    filter: false,
    planningElement: null,
  },
  mutations: {
    setView: set('view'),
    setPlans: set('plans'),
    setFilter: set('filter'),
    toggleFilter: toggle('filter'),
    setPlanningElement: toggle('planningElement'),
  },
  actions: {
    getPlanningElement: async ({ commit }) => {
      const { data, status } = await ElementService.getElement('planning');
      if (status === 200) {
        commit('setPlanningElement', data.results);
      }
      return data;
    },

    getPlans: async ({ commit }) => {
      const { data, status } = await ElementService.getElementRecords(
        'planning',
      );
      if (status === 200) {
        commit('setPlans', data.results);
      }
      return data;
    },
  },
  getters: {
    isOnboardingComplete: ({ planningElement }) => {
      let complete = false;
      if (planningElement) {
        complete = true;
      }
      return complete;
    },
  },
});
