import ElementService from '@shopworx/services/api/element.service';
import { set } from '@shopworx/services/util/store.service';

export default ({
  namespaced: true,
  state: {
    elements: [],
  },
  mutations: {
    setElements: set('elements'),
  },
  actions: {
    getElements: async ({ commit, rootState }) => {
      const { activeSite } = rootState.user;
      const { data, status } = await ElementService.getElementsBySite(activeSite);
      if (status === 200) {
        console.log(data.results);
        commit('setElements', data.results);
      }
    },
  },
  getters: {
    formattedElements: ({ elements }) => {
      let list = [];
      if (elements && elements.length) {
        const elems = elements
          .map((elem) => elem.element)
          .filter((elem) => elem.elementType.toUpperCase().trim() === 'PROVISIONING')
          .reduce((acc, cur) => {
            acc[cur.categoryType] = [...acc[cur.categoryType] || [], cur];
            return acc;
          }, {});
        console.log(elems);
        list = [];
      }
      return list;
    },
  },
});
