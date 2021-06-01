<template>
  <div style="height: 100%">
    <dashboard-loading v-if="loading" />
    <template v-else>
      <config-drawer />
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import {
  mapMutations,
  mapState,
} from 'vuex';

import ConfigDrawer from '../components/ConfigDrawer.vue';
import DashboardLoading from '../components/DashboardLoading.vue';

export default {
  name: 'Index',
  components: {
    ConfigDrawer,
    DashboardLoading,
  },
  data() {
    return {
      interval: null,
      timeInterval: null,
    };
  },
  async created() {
    this.setShowHeaderButtons(true);
    this.setLoading(true);
    // fetch data required to load the dashbaord here (mapActions)
    this.setLoading(false);
  },
  beforeDestroy() {
    clearInterval(this.interval);
    clearInterval(this.timeInterval);
  },
  computed: {
    ...mapState('poProductionDashboard', [
      'loading',
    ]),
  },
  methods: {
    ...mapMutations('poProductionDashboard', [
      'setLoading',
    ]),
    ...mapMutations('helper', [
      'setShowHeaderButtons',
    ]),
  },
};
</script>
