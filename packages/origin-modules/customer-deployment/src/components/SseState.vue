<template>
  <div style="display: none;"></div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'SseState',
  data() {
    return {
      sseClient: null,
      timeout: null,
      readyState: 0,
      states: [
        { text: 'Connecting', color: 'warning' },
        { text: 'Open', color: 'success' },
        { text: 'Closed', color: 'error' },
      ],
    };
  },
  beforeMount() {
    this.sseInit();
  },
  beforeDestroy() {
    this.sseClient.close();
    clearTimeout(this.timeout);
  },
  computed: {
    ...mapState('customerDeployment', [
      'nodebots',
      'devices',
      'mappedDevices',
      'deploymentOrders',
      'mappedOrders',
      'selectedDevice',
    ]),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('customerDeployment', [
      'setReactiveDevice',
      'setReactiveMappedDevice',
      'setReactiveDeploymentOrder',
      'setReactiveMappedOrder',
      'setReactiveNodebot',
      'setSelectedDevice',
    ]),
    mapDevices(eventData) {
      if (eventData.ispasswordless) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PASSWORDLESS_ENABLED',
          options: {
            device: eventData.lineid,
          },
        });
      }
      this.setSelectedDevice({
        ...this.selectedDevice,
        ispasswordless: eventData.ispasswordless,
      });
      // update device list
      for (let i = 0; i < this.devices.length; i += 1) {
        if (eventData.lineid === this.devices[i].id) {
          this.setReactiveDevice({
            index: i,
            payload: {
              ...this.devices[i],
              ispasswordless: eventData.ispasswordless,
            },
          });
          break;
        }
      }
      // update mapped device list
      for (let i = 0; i < this.mappedDevices.length; i += 1) {
        if (eventData.lineid === this.mappedDevices[i].id) {
          this.setReactiveMappedDevice({
            index: i,
            payload: {
              ...this.mappedDevices[i],
              ispasswordless: eventData.ispasswordless,
            },
          });
          break;
        }
      }
    },
    mapNodebots(eventData) {
      if (eventData.isinstalled) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'DEBIAN_INSTALLED',
          options: {
            nodebot: eventData.nodebotmasterid,
            service: eventData.deploymentserviceid,
          },
        });
      }
      if (this.selectedDevice) {
        const updatedInstances = this.selectedDevice.instances.map((instance) => {
          const { nodebot } = instance;
          let { isinstalled } = nodebot;
          if (eventData.nodebotmasterid === instance.nodebot.id) {
            ({ isinstalled } = eventData);
          }
          return {
            ...instance,
            nodebot: {
              ...nodebot,
              isinstalled,
            },
          };
        });
        this.setSelectedDevice({
          ...this.selectedDevice,
          instances: updatedInstances,
        });
      }
      // update nodebot list
      for (let i = 0; i < this.nodebots.length; i += 1) {
        if (eventData.nodebotmasterid === this.nodebots[i].id) {
          this.setReactiveNodebot({
            index: i,
            payload: {
              ...this.nodebots[i],
              isinstalled: eventData.isinstalled,
            },
          });
          break;
        }
      }
      // update nodebot in mapped device
      for (let i = 0; i < this.mappedDevices.length; i += 1) {
        if (eventData.lineid === this.mappedDevices[i].id) {
          this.setReactiveMappedDevice({
            index: i,
            payload: {
              ...this.mappedDevices[i],
              instances: this.mappedDevices[i].instances.map((instance) => {
                const { nodebot } = instance;
                let { isinstalled } = nodebot;
                if (eventData.nodebotmasterid === instance.nodebot.id) {
                  ({ isinstalled } = eventData);
                }
                return {
                  ...instance,
                  nodebot: {
                    ...nodebot,
                    isinstalled,
                  },
                };
              }),
            },
          });
        }
      }
    },
    mapInstances(eventData) {
      if (eventData.isdeployed) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'INSTANCE_DEPLOYED',
          options: {
            instance: eventData.instanceid,
            device: eventData.lineid,
          },
        });
      }
      if (eventData.isreconfigured) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'INSTANCE_RECONFIGURED',
          options: {
            instance: eventData.instanceid,
          },
        });
      }
      const updatedInstances = this.selectedDevice.instances.map((instance) => {
        let { isdeployed, isdeploying, isreconfigured } = instance;
        if (eventData.instanceid === instance.id) {
          ({ isdeployed, isdeploying, isreconfigured } = eventData);
        }
        return {
          ...instance,
          isdeployed,
          isdeploying,
          isreconfigured,
        };
      });
      this.setSelectedDevice({
        ...this.selectedDevice,
        instances: updatedInstances,
      });
      // update instance list in mapped device
      for (let i = 0; i < this.mappedDevices.length; i += 1) {
        if (eventData.lineid === this.mappedDevices[i].id) {
          this.setReactiveMappedDevice({
            index: i,
            payload: {
              ...this.mappedDevices[i],
              instances: this.mappedDevices[i].instances.map((instance) => {
                let { isdeployed, isdeploying, isreconfigured } = instance;
                if (eventData.instanceid === instance.id) {
                  ({ isdeployed, isdeploying, isreconfigured } = eventData);
                }
                return {
                  ...instance,
                  isdeployed,
                  isdeploying,
                  isreconfigured,
                };
              }),
            },
          });
        }
      }
      // update instance list in mapped nodebot
      for (let i = 0; i < this.nodebots.length; i += 1) {
        if (eventData.nodebotmasterid === this.nodebots[i].id) {
          this.setReactiveNodebot({
            index: i,
            payload: {
              ...this.nodebots[i],
              instances: this.nodebots[i].instances.map((instance) => {
                let { isdeployed, isdeploying, isreconfigured } = instance;
                if (eventData.instanceid === instance.id) {
                  ({ isdeployed, isdeploying, isreconfigured } = eventData);
                }
                return {
                  ...instance,
                  isdeployed,
                  isdeploying,
                  isreconfigured,
                };
              }),
            },
          });
        }
      }
    },
    sseInit() {
      this.sseClient = new EventSource('/sse/alert');
      this.readyState = this.sseClient.readyState;
      this.sseClient.onopen = () => {
        if (this.timeout != null) {
          clearTimeout(this.timeout);
        }
      };
      this.sseClient.addEventListener('deployinstance', (e) => {
        this.readyState = e.target.readyState;
        const eventData = JSON.parse(JSON.parse(e.data));
        const hasPasswordlessKey = Object.prototype.hasOwnProperty
          .call(eventData, 'ispasswordless');
        const hasInstalledKey = Object.prototype.hasOwnProperty
          .call(eventData, 'isinstalled');
        const hasDeployedKey = Object.prototype.hasOwnProperty
          .call(eventData, 'isdeployed');
        const hasDeployingKey = Object.prototype.hasOwnProperty
          .call(eventData, 'isdeploying');
        const hasReconfiguredKey = Object.prototype.hasOwnProperty
          .call(eventData, 'isreconfigured');
        if (hasPasswordlessKey) {
          this.mapDevices(eventData);
        }
        if (hasInstalledKey) {
          this.mapNodebots(eventData);
        }
        if (hasDeployedKey || hasDeployingKey || hasReconfiguredKey) {
          this.mapInstances(eventData);
        }
        // update deployment order list
        for (let i = 0; i < this.deploymentOrders.length; i += 1) {
          // eslint-disable-next-line
          if (eventData.instancedeploymentorderid === this.deploymentOrders[i]._id) {
            this.setReactiveDeploymentOrder({
              index: i,
              payload: {
                ...this.deploymentOrders[i],
                status: eventData.status,
                modifiedtimestamp: eventData.modifiedtimestamp,
              },
            });
            break;
          }
        }
        // update mapped deployment order list
        for (let i = 0; i < this.mappedOrders.length; i += 1) {
          // eslint-disable-next-line
          if (eventData.instancedeploymentorderid === this.mappedOrders[i]._id) {
            this.setReactiveMappedOrder({
              index: i,
              payload: {
                ...this.mappedOrders[i],
                status: eventData.status,
                modifiedtimestamp: eventData.modifiedtimestamp,
              },
            });
            break;
          }
        }
      });
      this.sseClient.onerror = (event) => {
        this.readyState = event.target.readyState;
        this.sseClient.close();
        this.reconnectSse();
      };
    },
    reconnectSse() {
      let sseOK = false;
      if (this.sseClient === null) {
        sseOK = false;
      } else {
        sseOK = (this.sseClient.readyState !== EventSource.CLOSED);
      }
      this.readyState = this.sseClient.readyState;
      if (!sseOK) {
        this.sseInit();
      }
    },
  },
};
</script>
