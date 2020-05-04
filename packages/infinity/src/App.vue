<template>
  <v-app>
    <infinity-snackbar />
    <infinity-confirm ref="confirm" />
    <infinity-loading v-if="infinityLoading" />
    <router-view v-else />
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import InfinitySnackbar from '@/components/core/InfinitySnackbar.vue';
import InfinityConfirm from '@/components/core/InfinityConfirm.vue';
import InfinityLoading from '@/components/core/InfinityLoading.vue';

export default {
  components: {
    InfinitySnackbar,
    InfinityConfirm,
    InfinityLoading,
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
  },
  mounted() {
    this.$root.$confirm = this.$refs.confirm;
  },
  watch: {
    isDark() {
      this.$vuetify.theme.dark = this.isDark;
      localStorage.setItem('dark', this.isDark);
    },
  },
  methods: {
    ...mapActions('auth', ['initAuth']),
    ...mapMutations('helper', ['setIsDark']),
  },
};
</script>
