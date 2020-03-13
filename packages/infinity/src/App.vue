<template>
  <v-app>
    <swx-snackbar />
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
      const user = await this.getMe();
      if (user) {
        await this.getMySolutions();
      }
    }
  },
};
</script>

<style lang="scss">
// html, body {
//   width: 100%;
//   height: 100%;
//   ::-webkit-scrollbar {
//     display: none;  /* Chrome Safari */
//   }
//   scrollbar-width: none; /* Firefox */
//   -ms-overflow-style: none;  /* IE 10+ */
//   overflow:hidden;
// }
.toolbar-padding .v-toolbar__content {
  padding-left: 2px;
  padding-right: 2px;
}
</style>
