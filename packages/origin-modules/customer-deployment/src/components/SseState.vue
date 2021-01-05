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
    ]),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('customerDeployment', [
      'setReactiveDevice',
      'setReactiveMappedDevice',
      'setReactiveDeploymentOrder',
      'setReactiveMappedOrder',
    ]),
    mapDevices(eventData) {
      if (eventData.ispasswordless) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PASSWORDLESS_ENABLED',
        });
      }
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
          message: 'NODEBOT_INSTALLED',
        });
      }
      // update device list
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
      /* // update mapped instance list
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
      } */
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
        const hasUpgradedKey = Object.prototype.hasOwnProperty
          .call(eventData, 'isinstalled');
        if (hasPasswordlessKey) {
          this.mapDevices(eventData);
        }
        if (hasUpgradedKey) {
          this.mapNodebots(eventData);
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
