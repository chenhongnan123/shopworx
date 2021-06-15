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
      await this.getMeters();
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
    ...mapState('energyDashboard', [
      'loading',
      'selectedView',
      'selectedDisplay',
      'selectedTheme',
      'meters',
      'currentDate',
      'currentShift',
      'currentHour',
      'currentTime',
      'themes',
      'views',
    ]),
  },
  methods: {
    ...mapMutations('energyDashboard', [
      'setLoading',
      'setMeter',
      'setSelectedView',
      'setSelectedTheme',
    ]),
    ...mapMutations('helper', [
      'setShowHeaderButtons',
    ]),
    ...mapActions('energyDashboard', [
      'getBusinessTime',
      'getMeters',
      'getShifts',
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
        }
        if (elementName === 'utility') {
          this.setEnergy(data);
        }
      }
    },
    setEnergy(data) {
      const {
        metername,
        updatedAtTimestamp: updatedAt,
        current,
        vll,
        vln,
        pf,
        kwh,
        kvah,
        meterstatus,
        kwh_sum: consumption,
      } = data;
      this.meters.forEach((m, index) => {
        if (m.metername === metername) {
          const payload = {
            ...m,
            meterstatus,
            updatedAt,
            current,
            vll,
            vln,
            pf,
            kwh,
            kvah,
            consumption,
          };
          this.setMeter({ index, payload });
        }
      });
    },
  },
};
</script>
