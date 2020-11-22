<template>
  <v-app v-if="!dashboardLoading">
    <dashboard-header />
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
          <v-card flat class="transparent">
            <div class="display-1 mb-4 font-weight-medium text-center primary--text">
              Select a dashboard
            </div>
            <dashboard-list />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import DashboardHeader from '../components/DashboardHeader.vue';
import DashboardList from '../components/DashboardList.vue';

export default {
  name: 'Home',
  components: {
    DashboardHeader,
    DashboardList,
  },
  async created() {
    this.setDashboardLoading(true);
    if (!this.me) {
      await this.getMe();
    }
    if (this.me) {
      if (!this.isOnboardingComplete) {
        this.$router.replace({ name: 'onboarding' });
      } else if (!this.myDashboards.length) {
        await this.getMySolutions();
      }
    }
    /* if (this.myDashboards.length === 1) {
      this.redirect(this.$route.fullPath);
    } */
    this.setDashboardLoading(false);
  },
  /* watch: {
    $route(val) {
      this.redirect(val.fullPath);
    },
  }, */
  data() {
    return {
      drawer: null,
    };
  },
  computed: {
    ...mapState('helper', ['dashboardLoading']),
    ...mapState('user', ['me', 'myDashboards']),
    ...mapGetters('user', ['myDashboards', 'isOnboardingComplete']),
    illustration() {
      return this.$vuetify.theme.dark
        ? 'dashboard-dark'
        : 'dashboard-light';
    },
  },
  methods: {
    ...mapMutations('helper', ['setDashboardLoading']),
    ...mapActions('user', ['getMe', 'getMySolutions']),
    redirect(path) {
      if (path === '/') {
        this.$router.push({ name: this.myDashboards[0].title });
      }
    },
  },
};
</script>
