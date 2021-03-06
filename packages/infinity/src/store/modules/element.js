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

    getElementsBySite: async (_, siteId) => {
      try {
        const { data } = await ElementService.getElementsBySite(siteId);
        if (data && data.results) {
          return data.results;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    getRecordsByTags: async (_, { payload }) => {
      try {
        const { data } = await ElementService.getRecordsByTags(payload);
        if (data && data.results) {
          return data;
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
          return data.results;
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

    upsertRecordWithElement: async ({ dispatch }, {
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
                dispatch('deleteRecordById', {
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

    upsertBulkRecordsWithElement: async ({ dispatch }, {
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
                dispatch('deleteRecordById', {
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

    upsertRecord: async ({ dispatch }, { elementName, record, assetId = 0 }) => {
      let upsert = false;
      try {
        const payload = {
          ...record,
          assetid: assetId,
        };
        const rec = await dispatch('getRecords', { elementName });
        if (rec && rec.length) {
          await Promise.all([rec.forEach((r) => {
            dispatch('deleteRecordById', {
              elementName,
              id: r._id,
            });
          })]);
        }
        upsert = await dispatch('postRecord', {
          elementName,
          payload,
        });
      } catch (e) {
        return false;
      }
      return upsert;
    },

    upsertRecordByQuery: async ({ dispatch }, {
      elementName,
      record,
      query,
      assetId = 0,
    }) => {
      let upsert = false;
      try {
        const payload = {
          ...record,
          assetid: assetId,
        };
        const rec = await dispatch('getRecords', { elementName, query });
        if (rec && rec.length) {
          await dispatch('deleteRecordByQuery', {
            elementName,
            queryParam: query,
          });
        }
        upsert = await dispatch('postRecord', {
          elementName,
          payload,
        });
      } catch (e) {
        return false;
      }
      return upsert;
    },

    upsertBulkRecords: async ({ dispatch }, { elementName, records, assetId = 0 }) => {
      let upsert = false;
      try {
        const payload = records.map((record) => ({
          ...record,
          assetid: assetId,
        }));
        const rec = await dispatch('getRecords', { elementName });
        if (rec && rec.length) {
          await Promise.all([rec.forEach((r) => {
            dispatch('deleteRecordById', {
              elementName,
              id: r._id,
            });
          })]);
        }
        upsert = await dispatch('postBulkRecords', {
          elementName,
          payload,
        });
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
        return data;
      } catch (e) {
        return false;
      }
    },

    createWebhook: async (_, { payload }) => {
      try {
        const { data } = await ElementService.createWebhook(payload);
        if (data && data.errors) {
          return false;
        }
        return data;
      } catch (e) {
        return false;
      }
    },

    sendTestModel: async (_, { payload }) => {
      try {
        const { data } = await ElementService.sendTestModel(payload);
        if (data && data.errors) {
          return data;
        }
        return data;
      } catch (e) {
        return false;
      }
    },

    getRecords: async (_, { elementName, query = '' }) => {
      try {
        const { data } = await ElementService.getRecords(elementName, query);
        if (data && data.results) {
          return data.results;
        }
        return false;
      } catch (e) {
        return false;
      }
    },

    getRecordById: async (_, { elementName, id }) => {
      try {
        const { data } = await ElementService.getRecordById(elementName, id);
        if (data && data._id) {
          return data;
        }
        return false;
      } catch (e) {
        return false;
      }
    },

    getRecordsWithCount: async (_, { elementName, query = '' }) => {
      try {
        const { data } = await ElementService.getRecords(elementName, query);
        if (data && data.results) {
          return data;
        }
        return false;
      } catch (e) {
        return false;
      }
    },

    deleteRecordById: async (_, { elementName, id }) => {
      try {
        const { data } = await ElementService.deleteRecordById(elementName, id);
        if (data && data.id) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    deleteRecordByQuery: async (_, { elementName, queryParam }) => {
      try {
        const { data } = await ElementService.deleteRecordByQuery(
          elementName,
          queryParam,
        );
        if (data && data.deleted) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    updateRecordById: async (_, { elementName, id, payload }) => {
      try {
        const { data } = await ElementService.updateRecordById(elementName, id, payload);
        if (data && data.id) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    uploadFiles: async (_, { elementName, payload }) => {
      try {
        const { data } = await ElementService.uploadFiles(elementName, payload);
        if (data && data.errors) {
          return data;
        }
        return data;
      } catch (e) {
        return false;
      }
    },
    updateRecordByQuery: async (_, { elementName, queryParam, payload }) => {
      try {
        const { data } = await ElementService.updateRecordByQuery(
          elementName,
          queryParam,
          payload,
        );
        if (data && data.updated) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    postSocket: async (_, { functionName, payload }) => {
      try {
        const { data } = await ElementService.postSocket(functionName, payload);
        if (data && data.errors) {
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },
    updateTagById: async (_, { payload }) => {
      try {
        const { data } = await ElementService.updateTagById(payload);
        if (data && data.id) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    changeElementStatusById: async (_, { payload, elementId }) => {
      try {
        const { data } = await ElementService.changeElementStatusById(payload, elementId);
        if (data && data.id) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    updateElementStatusById: async (_, { payload, id }) => {
      try {
        const { data } = await ElementService.updateElementStatusById(id, payload);
        if (data && data.updated) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
  },
});
