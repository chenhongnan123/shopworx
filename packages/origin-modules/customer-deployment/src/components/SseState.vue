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
      'devices',
      'mappedDevices',
      'deploymentOrders',
      'mappedOrders',
    ]),
  },
  methods: {
    ...mapMutations('customerDeployment', [
      'setReactiveDevice',
      'setReactiveMappedDevice',
      'setReactiveDeploymentOrder',
      'setReactiveMappedOrder',
    ]),
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
          .call(eventData, 'isPasswordless');
        if (hasPasswordlessKey) {
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
        }
        // update deployment order list
        for (let i = 0; i < this.deploymentOrders.length; i += 1) {
          if (eventData.instancedelpoymentorderid === this.deploymentOrders[i].id) {
            this.setReactiveDeploymentOrder({
              index: i,
              payload: {
                ...this.deploymentOrders[i],
                status: eventData.status,
                logs: [eventData, ...this.deploymentOrders[i].logs],
              },
            });
            break;
          }
        }
        // update mapped deployment order list
        for (let i = 0; i < this.mappedDevices.length; i += 1) {
          if (eventData.instancedelpoymentorderid === this.mappedDevices[i].id) {
            this.setReactiveMappedOrder({
              index: i,
              payload: {
                ...this.mappedDevices[i],
                status: eventData.status,
                logs: [eventData, ...this.deploymentOrders[i].logs],
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
