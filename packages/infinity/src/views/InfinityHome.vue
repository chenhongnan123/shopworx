<template>
  <swx-dashboard-layout
    sidebarIcon="$infinity"
    :sidebarItems="items"
    :sidebarAdminItems="adminItems"
  >
    <template slot="root">
      <infinity-insights />
    </template>
    <template slot="navbar">
      <infinity-search />
    </template>
    <template slot="navbarItems">
      <swx-toggle-fullscreen v-if="$vuetify.breakpoint.mdAndUp" />
      <swx-notification-menu />
      <infinity-insights-toggle />
      <infinity-account-menu />
    </template>
    <v-fade-transition mode="out-in">
      <router-view></router-view>
    </v-fade-transition>
  </swx-dashboard-layout>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import SwxDashboardLayout from '@shopworx/ui-components/core/SwxDashboardLayout.vue';
import SwxToggleFullscreen from '@shopworx/ui-components/navbar/SwxToggleFullscreen.vue';
import SwxNotificationMenu from '@shopworx/ui-components/navbar/SwxNotificationMenu.vue';
import InfinityInsights from '@/components/core/InfinityInsights.vue';
import InfinitySearch from '@/components/core/navbar/InfinitySearch.vue';
import InfinityInsightsToggle from '@/components/core/navbar/InfinityInsightsToggle.vue';
import InfinityAccountMenu from '@/components/core/navbar/InfinityAccountMenu.vue';

export default {
  name: 'Home',
  components: {
    SwxDashboardLayout,
    SwxToggleFullscreen,
    SwxNotificationMenu,
    InfinityInsights,
    InfinitySearch,
    InfinityInsightsToggle,
    InfinityAccountMenu,
  },
  computed: {
    ...mapState('user', ['me']),
    ...mapGetters('user', ['modules', 'isRegistrationComplete', 'isOnboardingComplete']),
    items() {
      return this.modules && this.modules.items
        ? this.modules.items
        : [];
    },
    adminItems() {
      return this.modules && this.modules.adminItems
        ? this.modules.adminItems
        : [];
    },
  },
  async created() {
    if (this.me) {
      if (!this.isRegistrationComplete) {
        this.$router.replace({ name: 'welcome' });
      } else if (!this.isOnboardingComplete) {
        this.$router.replace({ name: 'invite' });
      } else {
        try {
          const data = await this.getMySolutions();
          if (data && data.errors) {
            this.$root.$snackbar.error(data.errors);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  },
  methods: {
    ...mapActions('user', ['getMySolutions']),
  },
};
</script>
