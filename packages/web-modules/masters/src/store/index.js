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
    getElements: async ({ commit, rootState, dispatch }) => {
      const { activeSite } = rootState.user;
      const elements = await dispatch(
        'element/getElementsBySite',
        activeSite,
        { root: true },
      );
      if (elements && elements.length) {
        commit('setElements', elements);
      }
    },
  },
  getters: {
    formattedElements: ({ elements }) => {
      let list = [];
      if (elements && elements.length) {
        const provisioningElements = elements
          .map((elem) => elem.element)
          .filter((elem) => elem.elementType.toUpperCase().trim() === 'PROVISIONING');
        const groupedElements = provisioningElements
          .reduce((acc, cur) => {
            acc[cur.categoryType] = [...acc[cur.categoryType] || [], cur];
            return acc;
          }, {});
        const groups = Object.keys(groupedElements);
        list = groups
          .map((group) => {
            const header = { header: group.toLowerCase() };
            const items = provisioningElements
              .map((elem) => {
                if (elem.categoryType === group) {
                  return {
                    title: elem.elementName,
                    to: elem.elementName,
                    icon: `$${elem.elementName}`,
                  };
                }
                return null;
              })
              .filter((e) => e !== null);
            return [header, ...items];
          })
          .flat();
      }
      return list;
    },
  },
});
