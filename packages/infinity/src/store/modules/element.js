import ElementService from '@shopworx/services/api/element.service';

export default ({
  actions: {
    getElement: async (_, elementName) => {
      try {
        const { data, status } = await ElementService.getElement(elementName);
        if (status === 200) {
          return data.results.element.id;
        }
      } catch (e) {
        console.error(e);
      }
      return null;
    },

    createElement: async ({ dispatch }, payload) => {
      try {
        const { data, status } = await ElementService.createElement(payload);
        if (status === 201) {
          return data.elementId;
        }
      } catch (e) {
        if (e.response.status === 409) {
          const elementId = await dispatch('getElement', payload.elementName);
          return elementId;
        }
      }
      return null;
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
