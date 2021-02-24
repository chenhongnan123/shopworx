<template>
  <v-app>
    <origin-snackbar />
    <origin-invalidate-session />
    <origin-confirm ref="confirm" />
    <origin-loading v-if="infinityLoading" />
    <router-view v-else />
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ApiService from '@shopworx/services/api/api.service';
import OriginSnackbar from '@/components/core/OriginSnackbar.vue';
import OriginInvalidateSession from '@/components/core/OriginInvalidateSession.vue';
import OriginConfirm from '@/components/core/OriginConfirm.vue';
import OriginLoading from '@/components/core/OriginLoading.vue';

export default {
  components: {
    OriginSnackbar,
    OriginInvalidateSession,
    OriginConfirm,
    OriginLoading,
  },
  computed: {
    ...mapState('helper', ['isDark', 'infinityLoading']),
    ...mapState('auth', ['sessionId']),
  },
  async created() {
    const dark = localStorage.getItem('dark');
    this.setIsDark(dark ? JSON.parse(dark) : false);
    if (!this.sessionId) {
      this.initAuth();
    }
    await this.getMe();
  },
  mounted() {
    this.$root.$confirm = this.$refs.confirm;
    const instance = ApiService.getAxiosInstance();
    instance.interceptors.response.use((res) => {
      if (res.status === 202 && res.data.errors.errorCode === 'INVALID_SESSION') {
        this.setIsSessionValid(false);
      }
      return res;
    }, (error) => {
      throw new Error(error);
      // this.$router.push({ name: '500' });
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
    ...mapActions('user', ['getMe']),
    ...mapMutations('helper', [
      'setIsDark',
      'setIsSessionValid',
    ]),
  },
};
</script>
