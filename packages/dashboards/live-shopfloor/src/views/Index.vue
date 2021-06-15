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

const SSE_CHANNELS = {
  hour: 'hourly',
  shift: 'shift',
};

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
      serverTime: null,
      workingTime: null,
      states: [
        { text: 'Connecting', color: 'warning' },
        { text: 'Open', color: 'success' },
        { text: 'Closed', color: 'error' },
      ],
    };
  },
  async created() {
    this.setLoading(true);
    this.setShowHeaderButtons(true);
    const self = this;
    await this.getShifts();
    await this.getBusinessTime();
    this.serverTime = this.currentTime;
    this.timeInterval = setInterval(async () => {
      await self.getBusinessTime();
    }, 60000);
    this.workingTime = await this.getAvailableTime();
    this.setQueryParams();
  },
  beforeMount() {
    this.sseInit();
  },
  beforeDestroy() {
    this.setSelectedView('');
    if (this.sseClient) {
      this.sseClient.close();
    }
    clearTimeout(this.timeout);
    clearInterval(this.timeInterval);
  },
  watch: {
    // eslint-disable-next-line
    '$route'() {
      this.setQueryParams();
    },
    async selectedView() {
      this.setLoading(true);
      await this.getBusinessTime();
      await this.getMachines();
      if (this.sseClient) {
        this.sseClient.close();
      }
      this.sseInit();
      this.setLoading(false);
    },
    selectedTheme(val) {
      this.$vuetify.theme.dark = (val === 'dark');
    },
  },
  computed: {
    ...mapState('shopfloor', [
      'loading',
      'selectedView',
      'selectedTheme',
      'machines',
      'currentDate',
      'currentShift',
      'currentHour',
      'currentTime',
      'themes',
      'views',
    ]),
  },
  methods: {
    ...mapMutations('shopfloor', [
      'setLoading',
      'setMachine',
      'setSelectedView',
      'setSelectedTheme',
    ]),
    ...mapMutations('helper', [
      'setShowHeaderButtons',
    ]),
    ...mapActions('shopfloor', [
      'getBusinessTime',
      'getMachines',
      'getShifts',
      'getAvailableTime',
    ]),
    setQueryParams() {
      const { query } = this.$route;
      let { theme, view } = query;
      const isValidTheme = theme && this.themes.includes(theme);
      const isValidView = view && this.views.includes(view);
      if (!isValidTheme) {
        [theme] = this.themes;
      }
      if (!isValidView) {
        [view] = this.views;
      }
      const payload = {
        theme,
        view,
      };
      this.$router.replace({ query: payload }).catch(() => {});
      this.setSelectedTheme(theme);
      this.setSelectedView(view);
    },
    sseInit() {
      this.sseClient = new EventSource('/sse/asm');
      this.readyState = this.sseClient.readyState;
      this.sseClient.onopen = () => {
        if (this.timeout != null) {
          clearTimeout(this.timeout);
        }
      };
      this.sseClient.addEventListener(SSE_CHANNELS[this.selectedView], (e) => {
        this.readyState = e.target.readyState;
        const eventData = JSON.parse(JSON.parse(e.data));
        this.setEventData(eventData);
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
    async setEventData(data) {
      const {
        elementName,
        shift,
        shiftName,
        date,
        hour,
      } = data;
      let canSetData = false;
      if (this.selectedView === 'shift') {
        canSetData = (this.currentShift === shift || this.currentShift === shiftName)
        && this.currentDate === date;
      } else if (this.selectedView === 'hour') {
        canSetData = this.currentHour === hour && this.currentDate === date;
      }
      if (canSetData) {
        if (this.currentTime > this.serverTime) {
          this.serverTime = this.currentTime;
          this.workingTime = await this.getAvailableTime();
        }
        const payload = {
          ...data,
          workingTime: this.workingTime,
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
          if (this.selectedView === 'shift') {
            timeTarget = Math.floor((shiftAvailableTime / sctm) * activecavity);
          } else if (this.selectedView === 'hour') {
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
        downtimeend,
        downtimestart,
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
              updatedAt: this.currentTime,
              downsince: actualdowntimestart,
              downtimestart,
              downreason: reasonname || '',
            };
          } else if (status === 'complete' && downtimeend > this.machines[i].downtimestart) {
            payload = {
              ...this.machines[i],
              machinestatus: 'UP',
              updatedAt: this.currentTime,
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
            updatedAt: this.currentTime,
            quality,
          };
          this.setMachine({ index: i, payload });
        }
      }
    },
  },
};
</script>
