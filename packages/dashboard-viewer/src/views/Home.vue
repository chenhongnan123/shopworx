<template>
  <v-app v-if="!dashboardLoading">
    <v-app-bar
      app
      flat
      :color="$vuetify.theme.dark ? '#121212' : 'white'"
    >
      <img
        :src="require(`@shopworx/assets/logo/${shopworxLogo}.png`)"
        contain
        class="mb-3"
        height="38"
      />
      <v-toolbar-title
        :class="$vuetify.breakpoint.mdAndUp
          ? 'headline font-weight-medium ml-4'
          : 'title pl-0'"
      >
        Dashboard viewer
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="text-none mr-2"
        v-for="link in links"
        :key="link.to"
        exact
        color="primary"
        :to="{ name: link.to }"
        :outlined="$route.name !== link.to"
      >
        {{ link.name }}
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fill-height>
        <v-row
          align="center"
          justify="center"
          :no-gutters="$vuetify.breakpoint.smAndDown"
        >
          <v-col v-if="$vuetify.breakpoint.mdAndUp" md="6" xl="5">
            <v-img
              :src="require(`@shopworx/assets/illustrations/${illustration}.svg`)"
              id="dashboard_illustration"
              contain
            />
          </v-col>
          <v-col cols="12" md="6" lg="5" xl="4" class="text-justify">
            <v-fade-transition mode="out-in">
              <router-view />
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      links: [
        {
          name: 'Dashboards',
          to: 'home',
        },
        {
          name: 'TVs',
          to: 'tv',
        },
      ],
    };
  },
  async created() {
    this.setDashboardLoading(true);
    if (!this.me) {
      await this.getMe();
    }
    if (this.me && !this.isOnboardingComplete) {
      this.$router.replace({ name: 'onboarding' });
    }
    this.setDashboardLoading(false);
  },
  computed: {
    ...mapState('helper', ['dashboardLoading']),
    ...mapState('user', ['me']),
    ...mapGetters('user', ['myDashboards', 'isOnboardingComplete']),
    shopworxLogo() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
    illustration() {
      return this.$vuetify.theme.dark
        ? 'dashboard-dark'
        : 'dashboard-light';
    },
  },
  methods: {
    ...mapMutations('helper', ['setDashboardLoading']),
    ...mapActions('user', ['getMe']),
  },
};
</script>
