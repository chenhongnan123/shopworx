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
    logs: [],
  },
  mutations: {
    setDeploymentServices: set('deploymentServices'),
    setDevices: set('devices'),
    setMappedDevices: set('mappedDevices'),
    setSelectedService: set('selectedService'),
    setSelectedDevice: set('selectedDevice'),
    setReactiveService: reactiveSetArray('deploymentServices'),
    setReactiveMappedDevice: reactiveSetArray('mappedDevices'),
    setReactiveDevice: reactiveSetArray('devices'),
    setReactiveMappedOrder: reactiveSetArray('mappedOrders'),
    setReactiveDeploymentOrder: reactiveSetArray('deploymentOrders'),
    setReactiveNodebot: reactiveSetArray('nodebots'),
    setNodebots: set('nodebots'),
    setDeploymentOrders: set('deploymentOrders'),
    setMappedOrders: set('mappedOrders'),
    setLogs: set('logs'),
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
        query = `deploymentserviceid==${deploymentServiceId}`;
      }
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: elementMap.DEVICE,
          query: `?query=${query}`,
        },
        { root: true },
      );
      if (deploymentServiceId && records && records.length) {
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

    fetchNodebots: async ({ dispatch, commit }, deploymentServiceId = null) => {
      let query = '';
      if (deploymentServiceId) {
        query = `deploymentserviceid==${deploymentServiceId}`;
      }
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: elementMap.NODEBOT,
          query: `?query=${query}`,
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

    fetchDeploymentOrders: async ({ dispatch, commit }, {
      pagenumber = 1,
      pagesize = 10,
      deviceId = null,
    }) => {
      let query = '';
      if (deviceId) {
        query = `query=lineid==${deviceId}&`;
      }
      const records = await dispatch(
        'element/getRecordsWithCount',
        {
          elementName: elementMap.DEPLOYMENT,
          query: `?${query}pagenumber=${pagenumber}&pagesize=${pagesize}`,
        },
        { root: true },
      );
      if (deviceId) {
        commit('setMappedOrders', records.results);
      } else {
        commit('setDeploymentOrders', records.results);
      }
      if (records && records.results && records.results.length) {
        return records;
      }
      return false;
    },

    fetchLogs: async ({ dispatch, commit }, deploymentOrderId) => {
      commit('setLogs', []);
      const query = `instancedeploymentorderid=="${deploymentOrderId}"`;
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: elementMap.LOGS,
          query: `?query=${query}&sortquery=modifiedtimestamp==-1`,
        },
        { root: true },
      );
      commit('setLogs', records);
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
        const device = { ...createdDevice, instances: [] };
        commit('setSelectedDevice', device);
        return device;
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

    updateDevice: async ({ state, dispatch, commit }, { id, payload }) => {
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
        const { mappedDevices } = state;
        for (let i = 0; i < mappedDevices.length; i += 1) {
          if (updatedDevice.id === mappedDevices[i].id) {
            commit('setSelectedDevice', {
              ...mappedDevices[i],
              ...updatedDevice,
            });
          }
        }
        return updatedDevice;
      }
      return false;
    },

    updateNodebot: async ({ dispatch }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: elementMap.NODEBOT,
          id,
          payload,
        },
        { root: true },
      );
      return updated;
    },

    updateNodebotInstances: async ({ dispatch }, { nodebotmasterid, payload }) => {
      const updated = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: elementMap.INSTANCE,
          queryParam: `?query=nodebotmasterid==${nodebotmasterid}`,
          payload,
        },
        { root: true },
      );
      return updated;
    },

    deleteInstance: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordById',
        {
          elementName: elementMap.INSTANCE,
          id,
        },
        { root: true },
      );
      return deleted;
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

    deleteNodebotFile: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'file/deleteFile',
        {
          elementName: elementMap.NODEBOT_FILE,
          id,
        },
        { root: true },
      );
      return deleted;
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
