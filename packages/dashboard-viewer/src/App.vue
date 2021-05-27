<template>
  <v-app>
    <dashboard-loading v-if="dashboardLoading" />
    <router-view v-else />
  </v-app>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import ApiService from '@shopworx/services/api/api.service';
import SessionService from '@shopworx/services/util/session.service';
import DashboardLoading from './components/DashboardLoading.vue';
import { getDeviceId } from './dashboardLoader';

export default {
  components: {
    DashboardLoading,
  },
  data() {
    return {
      sseClient: null,
    };
  },
  computed: {
    ...mapState('helper', ['isDark', 'dashboardLoading', 'userAgent']),
    ...mapState('auth', ['sessionId']),
    ...mapState('dashboard', ['readyState', 'deviceId']),
    ...mapGetters('helper', ['isTV', 'isAndroid']),
  },
  async created() {
    const dark = localStorage.getItem('dark');
    this.setIsDark(dark ? JSON.parse(dark) : false);
    if (!this.sessionId) {
      this.initAuth();
    }
  },
  beforeMount() {
    if (this.isAndroid) {
      const deviceId = getDeviceId();
      this.setDeviceId(deviceId);
      this.sseInit();
    }
  },
  beforeDestroy() {
    if (this.sseClient) {
      this.sseClient.close();
    }
  },
  mounted() {
    this.$root.$confirm = this.$refs.confirm;
    const instance = ApiService.getAxiosInstance();
    instance.interceptors.response.use(async (res) => {
      if (res.status === 202 && res.data.errors.errorCode === 'INVALID_SESSION') {
        this.setIsSessionValid(false);
        await this.logoutUser();
        if (this.isTV) {
          this.$router.replace({ name: 'cast' });
        } else {
          this.$router.replace({ name: 'login' });
        }
      }
      return res;
    });
  },
  watch: {
    isDark() {
      this.$vuetify.theme.dark = this.isDark;
      localStorage.setItem('dark', this.isDark);
    },
    $route: {
      immediate: true,
      handler(val) {
        const isCastUrl = val.name === 'cast';
        const isDashboardUrl = val.fullPath.includes('/d');
        if (this.isAndroid && !isDashboardUrl) {
          this.$router.replace({ name: 'cast' });
        }
        if (!this.isTV && isCastUrl) {
          this.$router.replace({ name: 'home' });
        }
      },
    },
  },
  methods: {
    ...mapActions('auth', ['initAuth', 'logoutUser']),
    ...mapMutations('dashboard', ['setReadyState', 'setDeviceId']),
    ...mapMutations('helper', [
      'setIsDark',
      'setIsSessionValid',
    ]),
    sseInit() {
      this.sseClient = new EventSource('/sse/device');
      this.setReadyState(this.sseClient.readyState);
      this.sseClient.onopen = () => {
        if (this.timeout != null) {
          clearTimeout(this.timeout);
        }
      };
      this.sseClient.addEventListener(this.deviceId, (e) => {
        this.setReadyState(e.target.readyState);
        const eventData = JSON.parse(JSON.parse(e.data));
        if (eventData.status === 'CAST') {
          this.timeout = setTimeout(() => {
            this.setDashboard(eventData);
          }, 2000);
        }
      });
      this.sseClient.onerror = (event) => {
        this.setReadyState(event.target.readyState);
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
      this.setReadyState(this.sseClient.readyState);
      if (!sseOK) {
        this.sseInit();
      }
    },
    setDashboard(data) {
      SessionService.setSession(data.sessionid);
      this.initAuth();
      this.$router.replace({ path: data.dashboardurl });
    },
  },
};
</script>
