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

    createElementAndTags: async ({ dispatch }, {
      element,
      tags,
    }) => {
      let tagsCreated = false;
      try {
        const elementId = await dispatch('createElement', element);
        if (elementId) {
          const tagsToProvision = tags.map((tag) => ({
            ...tag,
            elementId,
          }));
          tagsCreated = await dispatch('createElementTags', tagsToProvision);
        }
      } catch (e) {
        return false;
      }
      return tagsCreated;
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

    upsertRecord: async ({ dispatch }, {
      element,
      tags,
      record,
      assetId = 0,
    }) => {
      let upsert = false;
      try {
        const elementId = await dispatch('createElement', element);
        if (elementId) {
          const tagsToProvision = tags.map((tag) => ({
            ...tag,
            elementId,
          }));
          const tagsCreated = await dispatch('createElementTags', tagsToProvision);
          if (tagsCreated) {
            const payload = {
              ...record,
              assetid: assetId,
            };
            const rec = await dispatch('getRecords', { elementName: element.elementName });
            if (rec && rec.length) {
              await Promise.all([rec.forEach((r) => {
                dispatch('deleteRecord', {
                  elementName: element.elementName,
                  id: r._id,
                });
              })]);
            }
            upsert = await dispatch('postRecord', {
              elementName: element.elementName,
              payload,
            });
          }
        }
      } catch (e) {
        return false;
      }
      return upsert;
    },

    upsertBulkRecords: async ({ dispatch }, {
      element,
      tags,
      records,
      assetId = 0,
    }) => {
      let upsert = false;
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
            const rec = await dispatch('getRecords', { elementName: element.elementName });
            if (rec && rec.length) {
              await Promise.all([rec.forEach((r) => {
                dispatch('deleteRecord', {
                  elementName: element.elementName,
                  id: r._id,
                });
              })]);
            }
            upsert = await dispatch('postBulkRecords', {
              elementName: element.elementName,
              payload,
            });
          }
        }
      } catch (e) {
        return false;
      }
      return upsert;
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

    postRecord: async (_, { elementName, payload }) => {
      try {
        const { data } = await ElementService.postRecord(elementName, payload);
        if (data && data.errors) {
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },

    getRecords: async (_, { elementName, assetId = 0, query = '' }) => {
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

    deleteRecord: async (_, { elementName, id }) => {
      try {
        const { data } = await ElementService.deleteRecord(elementName, id);
        if (data && data.id) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
  },
});
