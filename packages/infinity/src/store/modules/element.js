import ElementService from '@shopworx/services/api/element.service';

export default ({
  actions: {
    getElement: async (_, elementName) => {
      try {
        const { data } = await ElementService.getElement(elementName);
        if (data && data.results) {
          return data.results;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    createElement: async ({ dispatch }, element) => {
      try {
        const { data } = await ElementService.createElement(element);
        if (data && data.results) {
          return data.elementId;
        }
        const elem = await dispatch('getElement', element.elementName);
        return elem.element.id;
      } catch (e) {
        return false;
      }
    },

    createElementTags: async (_, payload) => {
      try {
        const { data } = await ElementService.createElementTags(payload);
        if (data && data.results) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    createBulkRecords: async ({ dispatch }, {
      element,
      tags,
      records,
      assetId,
    }) => {
      let recordsCreated = false;
      try {
        const elementId = await dispatch('createElement', element);
        if (elementId) {
          const tagsToProvision = tags.map((tag) => ({
            ...tag,
            elementId,
          }));
          const tagsCreated = await dispatch('createElementTags', tagsToProvision);
          if (tagsCreated) {
            const payload = records.map((record) => ({
              ...record,
              assetid: assetId,
            }));
            recordsCreated = await dispatch('postBulkRecords', {
              elementName: element.elementName,
              payload,
            });
          }
        }
      } catch (e) {
        return false;
      }
      return recordsCreated;
    },

    postBulkRecords: async (_, { elementName, payload }) => {
      try {
        const { data } = await ElementService.postBulkRecords(elementName, payload);
        if (data && data.errors) {
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },

    getRecords: async (_, { elementName, assetId, query = '' }) => {
      try {
        const { data } = await ElementService.getRecords(elementName, query);
        if (data && data.results) {
          return data.results.filter((rec) => rec.assetid === assetId);
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  },
});
