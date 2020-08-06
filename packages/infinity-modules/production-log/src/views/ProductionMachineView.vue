<template>
  <div>
    <template v-if="loading">
      Loading...
    </template>
    <dashboard-toolbar-extension/>
    <production-log-production-view/>
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
    };
  },
  async created() {
    await this.fetchBusinessHours();
    await this.fetchRejectionReasons();
    const machines = await this.fetchMachines();
    if (machines) {
      this.setExtendedHeader(true);
    }
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
