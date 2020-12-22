import masterElements from './data/elements';

export default ({
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    initElements: async ({ dispatch }) => {
      const createElements = masterElements.map(async (m) => {
        const { element, tags } = m;
        const e = await dispatch(
          'element/getElement',
          element.elementName,
          { root: true },
        );
        if (!e) {
          const payload = {
            element,
            tags,
          };
          await dispatch(
            'element/createElementAndTags',
            payload,
            { root: true },
          );
        }
      });
      await Promise.all(createElements);
    },
  },
});
