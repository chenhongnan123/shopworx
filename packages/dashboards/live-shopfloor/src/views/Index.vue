<template>
  <div style="height: 100%">
    <shopfloor-loading v-if="loading" />
    <template v-else>
      <config-drawer />
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import ConfigDrawer from '../components/ConfigDrawer.vue';
import ShopfloorLoading from '../components/ShopfloorLoading.vue';

export default {
  name: 'Index',
  components: {
    ConfigDrawer,
    ShopfloorLoading,
  },
  data() {
    return {
      sseClient: null,
      timeout: null,
      timeInterval: null,
      readyState: 0,
      states: [
        { text: 'Connecting', color: 'warning' },
        { text: 'Open', color: 'success' },
        { text: 'Closed', color: 'error' },
      ],
    };
  },
  async created() {
    const self = this;
    this.setLoading(true);
    await this.getShifts();
    await this.getBusinessTime();
    this.timeInterval = setInterval(async () => {
      await self.getBusinessTime();
    }, 60000);
    if (this.isLoaded) {
      await this.getMachines();
    }
    this.setLoading(false);
  },
  beforeMount() {
    this.sseInit();
  },
  beforeDestroy() {
    this.sseClient.close();
    clearTimeout(this.timeout);
    clearInterval(this.timeInterval);
  },
  watch: {
    async isLoaded(loaded) {
      if (loaded) {
        this.setLoading(true);
        await this.getMachines();
        this.setLoading(false);
      }
    },
    selectedView() {
      if (this.sseClient) {
        this.sseClient.close();
      }
      this.sseInit();
    },
  },
  computed: {
    ...mapState('shopfloor', [
      'loading',
      'selectedView',
      'selectedDisplay',
      'selectedTheme',
      'machines',
      'currentDate',
      'currentShift',
    ]),
    isLoaded() {
      const isViewSelected = this.selectedView !== null;
      const isThemeSelected = this.selectedTheme !== null;
      return isViewSelected && isThemeSelected;
    },
  },
  methods: {
    ...mapMutations('shopfloor', [
      'setLoading',
      'setMachine',
    ]),
    ...mapActions('shopfloor', [
      'getBusinessTime',
      'getMachines',
      'getShifts',
      'getAvailableTime',
    ]),
    sseInit() {
      if (this.selectedView) {
        this.sseClient = new EventSource('/sse/asm');
        this.readyState = this.sseClient.readyState;
        this.sseClient.onopen = () => {
          if (this.timeout != null) {
            clearTimeout(this.timeout);
          }
        };
        this.sseClient.addEventListener(this.selectedView.value, (e) => {
          this.readyState = e.target.readyState;
          const eventData = JSON.parse(JSON.parse(e.data));
          this.setEventData(eventData);
        });
        this.sseClient.onerror = (event) => {
          this.readyState = event.target.readyState;
          this.sseClient.close();
          this.reconnectSse();
        };
      }
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
    async setEventData(data) {
      const {
        elementName,
        shift,
        shiftName,
        date,
      } = data;
      if ((this.currentShift === shift || this.currentShift === shiftName)
        && this.currentDate === date) {
        const workingTime = await this.getAvailableTime();
        const payload = {
          ...data,
          workingTime,
        };
        if (elementName === 'cycletime') {
          this.setProduction(payload);
        } else if (elementName === 'downtime') {
          this.setDowntime(payload);
        } else if (elementName === 'rejection') {
          this.setRejection(payload);
        }
      }
    },
    setProduction(data) {
      const {
        machinename,
        planid,
        partname,
        qty,
        activecavity,
        updatedAtTimestamp: updatedAt,
        runtime,
        shiftAvailableTime,
        hourlyAvailableTime,
        workingTime,
        sctm,
        performance,
        quality,
      } = data;
      this.machines.forEach((m, index) => {
        if (m.machinename === machinename) {
          const payload = {
            ...m,
            machinestatus: 'UP',
            updatedAt,
            runtime,
            performance,
            quality,
            workingTime,
          };
          let timeTarget = 0;
          if (this.selectedView.value === 'shift') {
            timeTarget = Math.floor((shiftAvailableTime / sctm) * activecavity);
          } else if (this.selectedView.value === 'hourly') {
            timeTarget = Math.floor((hourlyAvailableTime / sctm) * activecavity);
          }
          if (planid === m.planid) {
            let productions = [...m.production];
            const partIndex = m.production.findIndex((prod) => prod.partname === partname);
            if (partIndex > -1) {
              productions[partIndex].produced = qty;
              productions[partIndex].timeTarget = timeTarget;
            } else {
              productions = [...productions, {
                partname,
                planid,
                produced: qty,
                timeTarget,
              }];
            }
            payload.production = productions;
          } else {
            payload.planid = planid;
            payload.production = [{
              partname,
              planid,
              produced: qty,
              timeTarget,
            }];
          }
          this.setMachine({ index, payload });
        }
      });
    },
    setDowntime(data) {
      const {
        machinename,
        actualdowntimestart,
        reasonname,
        status,
      } = data;
      for (let i = 0; i < this.machines.length; i += 1) {
        if (this.machines[i].machinename === machinename) {
          let payload = {};
          if (status === 'inProgress') {
            payload = {
              ...this.machines[i],
              machinestatus: 'DOWN',
              updatedAt: new Date().getTime(),
              downsince: actualdowntimestart,
              downreason: reasonname || '',
            };
          } else if (status === 'complete') {
            payload = {
              ...this.machines[i],
              machinestatus: 'UP',
              updatedAt: new Date().getTime(),
            };
          }
          this.setMachine({ index: i, payload });
        }
      }
    },
    setRejection(data) {
      const {
        machinename,
        quality,
      } = data;
      for (let i = 0; i < this.machines.length; i += 1) {
        if (this.machines[i].machinename === machinename) {
          const payload = {
            ...this.machines[i],
            updatedAt: new Date().getTime(),
            quality,
          };
          this.setMachine({ index: i, payload });
        }
      }
    },
  },
};
</script>
