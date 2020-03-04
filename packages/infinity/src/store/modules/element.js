import ElementService from '@shopworx/services/api/element.service';

export default ({
  actions: {
    getElement: async ({ commit }, elementName) => {
      try {
        const { data } = await ElementService.getElement(elementName);
        if (data && data.results) {
          return data.results.element.id;
        }
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: data.errors.errorCode,
        }, {
          root: true,
        });
      } catch (e) {
        console.error(e);
      }
      return null;
    },

    createElement: async ({ dispatch }, payload) => {
      try {
        const { data } = await ElementService.createElement(payload);
        if (data && data.results) {
          return data.elementId;
        }
        const elementId = await dispatch('getElement', payload.elementName);
        return elementId;
      } catch (e) {
        console.error(e);
        return null;
      }
    },

    createElementTags: async (_, payload) => {
      const { status } = await ElementService.createElementTags(payload);
      if (status === 200) {
        return true;
      }
      return false;
    },

    postBulkRecords: async (_, { elementName, payload }) => {
      const { data } = await ElementService.postBulkRecords(elementName, payload);
      return data;
    },

    postRecord: async (_, { elementName, payload }) => {
      const { data } = await ElementService.postRecords(elementName, payload);
      return data;
    },
  },
});
