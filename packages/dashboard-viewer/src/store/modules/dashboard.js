import { set } from '@shopworx/services/util/store.helper';

const ELEMENTS = {
  DEVICES: 'devices',
};

export default ({
  state: {
    readyState: 0,
    deviceId: '',
    isDeviceElemAvailable: false,
  },
  mutations: {
    setReadyState: set('readyState'),
    setDeviceId: set('deviceId'),
    setIsDeviceElemAvailable: set('isDeviceElemAvailable'),
  },
  actions: {
    getDeviceElement: async ({ commit, dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        ELEMENTS.DEVICES,
        { root: true },
      );
      if (!element) {
        const deviceMaster = await dispatch('getDeviceMaster');
        if (deviceMaster) {
          const elementId = await dispatch('createDeviceElement', deviceMaster);
          if (elementId) {
            commit('setIsDeviceElemAvailable', true);
            return true;
          }
        }
        commit('setIsDeviceElemAvailable', false);
        return false;
      }
      commit('setIsDeviceElemAvailable', true);
      return true;
    },

    getDeviceMaster: async ({ dispatch }) => {
      const masterElements = await dispatch(
        'industry/getMasterElements',
        null,
        { root: true },
      );
      return masterElements
        .find((elem) => elem.masterElement.elementName === ELEMENTS.DEVICES);
    },

    createDeviceElement: async ({ dispatch }, deviceMaster) => {
      const element = deviceMaster.masterElement;
      const tags = deviceMaster.masterTags;
      const payload = {
        element,
        tags,
      };
      const elementId = await dispatch(
        'element/createElementAndTags',
        payload,
        { root: true },
      );
      return elementId;
    },

    createTV: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'devices',
          payload,
        },
        { root: true },
      );
      return created;
    },

    updateTV: async ({ dispatch }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'devices',
          id,
          payload,
        },
        { root: true },
      );
      return updated;
    },
  },
});
