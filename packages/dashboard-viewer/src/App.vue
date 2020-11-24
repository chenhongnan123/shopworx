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
    ...mapState('dashboard', ['readyState']),
    ...mapGetters('helper', ['isTV']),
  },
  async created() {
    const dark = localStorage.getItem('dark');
    this.setIsDark(dark ? JSON.parse(dark) : false);
    if (!this.sessionId) {
      this.initAuth();
    }
  },
  beforeMount() {
    this.sseInit();
  },
  beforeDestroy() {
    this.sseClient.close();
  },
  mounted() {
    this.$root.$confirm = this.$refs.confirm;
    const instance = ApiService.getAxiosInstance();
    instance.interceptors.response.use((res) => {
      if (res.status === 202 && res.data.errors.errorCode === 'INVALID_SESSION') {
        this.setIsSessionValid(false);
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
        const isDashboardUrl = val.fullPath.includes('/d');
        console.log(isDashboardUrl);
        if (this.isTV && !isDashboardUrl) {
          this.$router.replace({ name: 'cast' });
        }
      },
    },
  },
  methods: {
    ...mapActions('auth', ['initAuth']),
    ...mapMutations('dashboard', ['setReadyState']),
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
      this.sseClient.addEventListener('123ABC', (e) => {
        this.setReadyState(e.target.readyState);
        const eventData = JSON.parse(JSON.parse(e.data));
        this.timeout = setTimeout(() => {
          this.setDashboard(eventData);
        }, 2000);
        console.log(eventData);
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
