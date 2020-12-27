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
  },
  mutations: {
    setDeploymentServices: set('deploymentServices'),
    setDevices: set('devices'),
    setMappedDevices: set('mappedDevices'),
    setSelectedService: set('selectedService'),
    setSelectedDevice: set('selectedDevice'),
    setReactiveService: reactiveSetArray('deploymentServices'),
    setReactiveMappedDevice: reactiveSetArray('mappedDevices'),
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
      if (records && records.length) {
        commit('setDeploymentServices', records);
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
      if (records && records.length) {
        if (deploymentServiceId) {
          commit('setMappedDevices', records);
        } else {
          commit('setDevices', records);
        }
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
