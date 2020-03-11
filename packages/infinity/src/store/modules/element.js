import ElementService from '@shopworx/services/api/element.service';

export default ({
  actions: {
    getElement: async ({ commit }, elementName) => {
      try {
        const { data } = await ElementService.getElement(elementName);
        if (data && data.results) {
          return data.results;
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

    getElementsBySite: async ({ commit }, siteId) => {
      try {
        const { data } = await ElementService.getElementsBySite(siteId);
        if (data && data.results) {
          return data.results;
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
        const result = await dispatch('getElement', payload.elementName);
        const elementId = result.element.id;
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

    createRecord: async ({ commit, dispatch }, {
      element,
      tags,
      record,
      assetId = 0,
    }) => {
      let recordCreated = false;
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
              assetId,
            };
            recordCreated = await dispatch('postRecord', {
              elementName: element.elementName,
              payload,
            });
          }
        }
      } catch (e) {
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: 'RECORDS_NOT_CREATED',
        }, {
          root: true,
        });
        console.error(e);
      }
      return recordCreated;
    },

    createBulkRecords: async ({ commit, dispatch }, {
      element,
      tags,
      records,
      assetId = 0,
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
              assetId,
            }));
            recordsCreated = await dispatch('postBulkRecords', {
              elementName: element.elementName,
              payload,
            });
          }
        }
      } catch (e) {
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: 'RECORDS_NOT_CREATED',
        }, {
          root: true,
        });
        console.error(e);
      }
      return recordsCreated;
    },

    upsertRecord: async ({ commit, dispatch }, {
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
              assetId,
            };
            const rec = await dispatch('getRecords', element.elementName);
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
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: 'RECORDS_NOT_CREATED',
        }, {
          root: true,
        });
        console.error(e);
      }
      return upsert;
    },

    upsertBulkRecords: async ({ commit, dispatch }, {
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
              assetId,
            }));
            const rec = await dispatch('getRecords', element.elementName);
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
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: 'RECORDS_NOT_CREATED',
        }, {
          root: true,
        });
        console.error(e);
      }
      return upsert;
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

    getRecords: async ({ commit }, elementName) => {
      try {
        const { data } = await ElementService.getRecords(elementName);
        if (data && data.results) {
          return data.results;
        }
        if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
        }
      } catch (e) {
        console.error(e);
      }
      return false;
    },

    deleteRecord: async ({ commit }, { elementName, id }) => {
      try {
        const { data } = await ElementService.deleteRecord(elementName, id);
        if (data && data.id) {
          return true;
        }
        if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
        }
      } catch (e) {
        console.error(e);
      }
      return false;
    },
  },
});
