<template>
  <v-app>
    <dashboard-loading v-if="dashboardLoading" />
    <router-view v-else />
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ApiService from '@shopworx/services/api/api.service';
import DashboardLoading from './components/DashboardLoading.vue';

export default {
  components: {
    DashboardLoading,
  },
  computed: {
    ...mapState('helper', ['isDark', 'dashboardLoading', 'userAgent']),
    ...mapState('auth', ['sessionId']),
  },
  async created() {
    const dark = localStorage.getItem('dark');
    this.setIsDark(dark ? JSON.parse(dark) : false);
    if (!this.sessionId) {
      this.initAuth();
    }
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
  },
  methods: {
    ...mapActions('auth', ['initAuth']),
    ...mapMutations('helper', [
      'setIsDark',
      'setIsSessionValid',
    ]),
  },
};
</script>
