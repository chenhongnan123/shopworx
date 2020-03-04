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
      try {
        const { status } = await ElementService.createElementTags(payload);
        if (status === 200) {
          return true;
        }
      } catch (e) {
        console.error(e);
      }
      return false;
    },

    postBulkRecords: async ({ commit }, { elementName, payload }) => {
      try {
        const { data } = await ElementService.postBulkRecords(elementName, payload);
        if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        console.error(e);
        return false;
      }
      return true;
    },

    postRecord: async ({ commit }, { elementName, payload }) => {
      try {
        const { data } = await ElementService.postRecords(elementName, payload);
        if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        console.error(e);
        return false;
      }
      return true;
    },
  },
});
