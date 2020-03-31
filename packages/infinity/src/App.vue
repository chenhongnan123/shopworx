<template>
  <v-app>
    <snackbar />
    <router-view />
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import Snackbar from '@/components/Snackbar.vue';

export default {
  components: {
    Snackbar,
  },
  computed: {
    ...mapState('helper', ['isDark']),
    ...mapState('auth', ['sessionId']),
  },
  async created() {
    const dark = localStorage.getItem('dark');
    this.setIsDark(dark ? JSON.parse(dark) : false);
    this.initAuth();
  },
  watch: {
    isDark() {
      this.$vuetify.theme.dark = this.isDark;
      localStorage.setItem('dark', this.isDark);
    },
  },
  methods: {
    ...mapActions('user', ['getMe', 'getMySolutions']),
    ...mapActions('auth', ['initAuth']),
    ...mapMutations('helper', ['setIsDark']),
  },
};
</script>
