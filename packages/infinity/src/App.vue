<template>
  <v-app>
    <swx-snackbar ref="snackbar" />
    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import SessionService from '@shopworx/services/util/session.service';
import SwxSnackbar from '@shopworx/ui-components/core/SwxSnackbar.vue';

export default {
  metaInfo() {
    return {
      titleTemplate: (chunk) => (chunk
        ? `${chunk} | ShopWorx | Infinity`
        : 'ShopWorx | Infinity'),
    };
  },
  components: {
    SwxSnackbar,
  },
  computed: {
    ...mapState('helper', ['isDark']),
  },
  methods: {
    ...mapActions('user', ['getMe', 'getMySolutions']),
    ...mapActions('auth', ['initAuth']),
    ...mapMutations('helper', ['setIsDark']),
  },
  watch: {
    isDark() {
      this.$vuetify.theme.dark = this.isDark;
      localStorage.setItem('dark', this.isDark);
    },
  },
  async created() {
    const dark = localStorage.getItem('dark');
    this.setIsDark(dark ? JSON.parse(dark) : false);
    this.initAuth();
    if (SessionService.getSession()) {
      try {
        const data = await this.getMe();
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        } else {
          const response = await this.getMySolutions();
          if (response && response.errors) {
            this.$root.$snackbar.error(response.errors);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  },
  mounted() {
    this.$root.$snackbar = this.$refs.snackbar;
  },
};
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  ::-webkit-scrollbar {
    display: none;  /* Chrome Safari */
  }
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
  overflow:hidden;
}
.toolbar-padding .v-toolbar__content {
  padding-left: 2px;
  padding-right: 2px;
}
</style>
