import { set, reactiveSetArray } from '@shopworx/services/util/store.helper';
import { elementsAndTags, elementMap } from './data/elements';

export default ({
  namespaced: true,
  state: {
    deploymentServices: [],
    devices: [],
    mappedDevices: [],
    selectedService: null,
    selectedDevice: null,
    nodebots: [],
    deploymentOrders: [],
    mappedOrders: [],
  },
  mutations: {
    setDeploymentServices: set('deploymentServices'),
    setDevices: set('devices'),
    setMappedDevices: set('mappedDevices'),
    setSelectedService: set('selectedService'),
    setSelectedDevice: set('selectedDevice'),
    setReactiveService: reactiveSetArray('deploymentServices'),
    setReactiveMappedDevice: reactiveSetArray('mappedDevices'),
    setNodebots: set('nodebots'),
    setDeploymentOrders: set('deploymentOrders'),
    setMappedOrders: set('mappedOrders'),
  },
  actions: {
    initElements: async ({ dispatch }) => {
      const createElements = elementsAndTags.map(async (m) => {
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

    fetchDeploymentServices: async ({ dispatch, commit }, all = false) => {
      let query = 'isactive==true';
      if (all) {
        query = '';
      }
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: elementMap.DEPLOYMENT_SERVICE,
          query: `?query=${query}`,
        },
        { root: true },
      );
      commit('setDeploymentServices', records);
      if (records && records.length) {
        return true;
      }
      return false;
    },

    fetchDeploymentServiceById: async ({ dispatch }, id) => {
      const record = await dispatch(
        'element/getRecordById',
        {
          elementName: elementMap.DEPLOYMENT_SERVICE,
          id,
        },
        { root: true },
      );
      return record;
    },

    fetchDeviceById: async ({ dispatch }, id) => {
      const record = await dispatch(
        'element/getRecordById',
        {
          elementName: elementMap.DEVICE,
          id,
        },
        { root: true },
      );
      return record;
    },

    fetchNodebotById: async ({ dispatch }, id) => {
      const record = await dispatch(
        'element/getRecordById',
        {
          elementName: elementMap.NODEBOT,
          id,
        },
        { root: true },
      );
      return record;
    },

    fetchDeploymentOrderById: async ({ dispatch }, id) => {
      const record = await dispatch(
        'element/getRecordById',
        {
          elementName: elementMap.DEPLOYMENT,
          id,
        },
        { root: true },
      );
      return record;
    },

    fetchDevices: async ({ dispatch, commit }, deploymentServiceId = null) => {
      let query = '';
      if (deploymentServiceId) {
        query = `deploymentserviceid==${deploymentServiceId}%26%26ispasswordless==true`;
      }
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: elementMap.DEVICE,
          query: `?query=${query}`,
        },
        { root: true },
      );
      if (deploymentServiceId) {
        const result = await Promise.all(
          records.map(async (rec) => {
            const instances = await dispatch(
              'fetchInstances',
              rec.id,
            );
            return {
              ...rec,
              instances,
            };
          }),
        );
        commit('setMappedDevices', result);
      } else {
        commit('setDevices', records);
      }
      if (records && records.length) {
        return true;
      }
      return false;
    },

    fetchInstances: async ({ dispatch }, deviceId) => {
      const query = `lineid==${deviceId}`;
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: elementMap.INSTANCE,
          query: `?query=${query}`,
        },
        { root: true },
      );
      const result = await Promise.all(
        records.map(async (rec) => {
          const nodebot = await dispatch(
            'element/getRecords',
            {
              elementName: elementMap.NODEBOT,
              query: `?query=id==${rec.nodebotmasterid}`,
            },
            { root: true },
          );
          if (nodebot && nodebot.length === 1) {
            return {
              ...rec,
              nodebot: nodebot[0],
            };
          }
          return {
            ...rec,
            nodebot: null,
          };
        }),
      );
      return result || [];
    },

    fetchNodebots: async ({ dispatch, commit }) => {
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: elementMap.NODEBOT,
        },
        { root: true },
      );
      commit('setNodebots', []);
      if (records && records.length) {
        const result = await Promise.all(
          records.map(async (rec) => {
            const file = await dispatch(
              'element/getRecords',
              {
                elementName: elementMap.NODEBOT_FILE,
                query: `?query=nodebotmasterid==${rec.id}`,
              },
              { root: true },
            );
            const instances = await dispatch(
              'element/getRecords',
              {
                elementName: elementMap.INSTANCE,
                query: `?query=nodebotmasterid==${rec.id}`,
              },
              { root: true },
            );
            if (file && file.length === 1) {
              return {
                ...rec,
                file: file[0],
                instances,
              };
            }
            return {
              ...rec,
              file: null,
              instances,
            };
          }),
        );
        commit('setNodebots', result);
        return true;
      }
      return false;
    },

    fetchDeploymentOrders: async ({ dispatch, commit }, deviceId = null) => {
      let query = '';
      if (deviceId) {
        query = `lineid==${deviceId}`;
      }
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: elementMap.DEPLOYMENT,
          query: `?query=${query}`,
        },
        { root: true },
      );
      const result = await Promise.all(
        records.map(async (rec) => {
          const logs = await dispatch(
            'element/getRecords',
            {
              elementName: elementMap.LOGS,
              query: `?query=deploymentorderid==${rec.id}`,
            },
            { root: true },
          );
          return {
            ...rec,
            logs,
          };
        }),
      );
      if (deviceId) {
        commit('setMappedOrders', result);
      } else {
        commit('setDeploymentOrders', result);
      }
      if (records && records.length) {
        return true;
      }
      return false;
    },

    createService: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: elementMap.DEPLOYMENT_SERVICE,
          payload,
        },
        { root: true },
      );
      if (created && created.id) {
        const createdService = await dispatch('fetchDeploymentServiceById', created.id);
        commit('setSelectedService', createdService);
        return createdService;
      }
      return false;
    },

    createDevice: async ({ dispatch, commit }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: elementMap.DEVICE,
          payload,
        },
        { root: true },
      );
      if (created && created.id) {
        const createdDevice = await dispatch('fetchDeviceById', created.id);
        commit('setSelectedDevice', createdDevice);
        return createdDevice;
      }
      return false;
    },

    createNodebot: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: elementMap.NODEBOT,
          payload,
        },
        { root: true },
      );
      if (created && created.id) {
        const createdNodebot = await dispatch('fetchNodebotById', created.id);
        return createdNodebot;
      }
      return false;
    },

    createInstance: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: elementMap.INSTANCE,
          payload,
        },
        { root: true },
      );
      return created;
    },

    createDeploymentOrder: async ({ dispatch, commit, state }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: elementMap.DEPLOYMENT,
          payload,
        },
        { root: true },
      );
      if (created && created.id) {
        const createdOrder = await dispatch('fetchDeploymentOrderById', created.id);
        const { mappedOrders } = state;
        commit('setMappedOrders', [createdOrder, ...mappedOrders]);
        return createdOrder;
      }
      return false;
    },

    updateDevice: async ({ dispatch, commit }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: elementMap.DEVICE,
          id,
          payload,
        },
        { root: true },
      );
      if (updated && updated.id) {
        const updatedDevice = await dispatch('fetchDeviceById', updated.id);
        commit('setSelectedDevice', updatedDevice);
        return updatedDevice;
      }
      return false;
    },

    updateNodebotFile: async ({ dispatch }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: elementMap.NODEBOT_FILE,
          id,
          payload,
        },
        { root: true },
      );
      return updated;
    },

    updateService: async ({ dispatch, commit }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: elementMap.DEPLOYMENT_SERVICE,
          id,
          payload,
        },
        { root: true },
      );
      if (updated && updated.id) {
        const updatedService = await dispatch('fetchDeploymentServiceById', updated.id);
        commit('setSelectedService', updatedService);
        return updatedService;
      }
      return false;
    },
  },
});
