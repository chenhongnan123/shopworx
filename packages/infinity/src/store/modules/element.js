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
      try {
        const { status } = await ElementService.createElementTags(payload);
        if (status === 200) {
          return true;
        }
      } catch (e) {
        console.log(e.response);
      }
      return false;
    },

    postElementRecords: async (_, { elementName, payload }) => {
      try {
        const { status } = await ElementService.postElementRecords(elementName, payload);
        if (status === 200) {
          return true;
        }
      } catch (e) {
        console.log(e.response);
      }
      return false;
    },
  },
});
