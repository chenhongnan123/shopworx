<template>
  <v-app>
    <infinity-snackbar />
    <infinity-invalidate-session />
    <infinity-confirm ref="confirm" />
    <infinity-loading v-if="infinityLoading" />
    <router-view v-else />
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ApiService from '@shopworx/services/api/api.service';
import InfinitySnackbar from '@/components/core/InfinitySnackbar.vue';
import InfinityInvalidateSession from '@/components/core/InfinityInvalidateSession.vue';
import InfinityConfirm from '@/components/core/InfinityConfirm.vue';
import InfinityLoading from '@/components/core/InfinityLoading.vue';

export default {
  components: {
    InfinitySnackbar,
    InfinityInvalidateSession,
    InfinityConfirm,
    InfinityLoading,
  },
  computed: {
    ...mapState('helper', ['isDark', 'infinityLoading', 'avatars', 'currentAvatar']),
    ...mapState('auth', ['sessionId']),
  },
  async created() {
    const dark = localStorage.getItem('dark');
    const avatar = localStorage.getItem('avatar');
    this.setIsDark(dark ? JSON.parse(dark) : false);
    this.setCurrentAvatar(avatar || this.avatars[0]);
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
    }, (error) => {
      this.$router.push({ name: '500' });
      return Promise.reject(error);
    });
  },
  watch: {
    isDark() {
      this.$vuetify.theme.dark = this.isDark;
      localStorage.setItem('dark', this.isDark);
    },
    currentAvatar() {
      localStorage.setItem('avatar', this.currentAvatar);
    },
  },
  methods: {
    ...mapActions('auth', ['initAuth']),
    ...mapMutations('helper', [
      'setIsDark',
      'setCurrentAvatar',
      'setIsSessionValid',
    ]),
  },
};
</script>
