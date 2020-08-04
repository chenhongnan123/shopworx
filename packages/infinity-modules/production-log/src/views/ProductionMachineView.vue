<template>
  <div>
    <template v-if="loading">
      Loading...
    </template>
    <!-- <portal to="app-extension">
      <v-tabs
        dense
        center-active
        v-model="logView"
      >
        <v-tab class="text-none">
          Production
        </v-tab>
        <v-tab class="text-none">
          Downtime
        </v-tab>
        <v-tab class="text-none">
          Operators
        </v-tab>
      </v-tabs>
    </portal> -->
    <dashboard-toolbar-extension/>
    <production-log-production-view/>
    <!-- <production-log-downtime-view v-else-if="logView === 1" /> -->
    <!-- <production-log-operator-view v-if="logView === 2" /> -->
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import DashboardToolbarExtension from '../components/core/DashboardToolbarExtension.vue';
import ProductionLogProductionView from '../components/ProductionLogProductionView.vue';


export default {
  name: 'ProductionMachineView',
  components: {
    ProductionLogProductionView,
    DashboardToolbarExtension,
  },
  data() {
    return {
      loading: false,
      // logView: 0,
    };
  },
  async created() {
    // const view = localStorage.getItem('logView');
    // this.logView = view ? JSON.parse(view) : 0;
    await this.fetchBusinessHours();
    await this.fetchRejectionReasons();
    const machines = await this.fetchMachines();
    if (machines) {
      this.setExtendedHeader(true);
    }
    // await this.getProductionReport();
    this.loading = false;
  },
  watch: {
    logView(val) {
      localStorage.setItem('logView', val);
    },
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('productionLog', ['fetchMachines', 'fetchBusinessHours', 'fetchRejectionReasons']),
  },
};
</script>
