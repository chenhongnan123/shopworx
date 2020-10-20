<template>
  <div style="height:100%">
    <dashboard-toolbar-extension/>
    <template v-if="loading">
      <production-loading />
    </template>
    <production-log-production-view v-else />
  </div>
</template>
<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import DashboardToolbarExtension from '../components/core/DashboardToolbarExtension.vue';
import ProductionLogProductionView from '../components/ProductionLogProductionView.vue';
import ProductionLoading from '../components/ProductionLoading.vue';

export default {
  name: 'ProductionMachineView',
  components: {
    ProductionLogProductionView,
    DashboardToolbarExtension,
    ProductionLoading,
  },
  computed: {
    ...mapState('productionLog', ['loading']),
  },
  async created() {
    await this.fetchBusinessHours();
    await this.fetchRejectionReasons();
    const machines = await this.fetchMachines();
    if (machines) {
      this.setExtendedHeader(true);
    }
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
