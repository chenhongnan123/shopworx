<template>
  <v-container fluid class="py-0">
    <template v-if="loading">
      Loading...
    </template>
    <v-row v-else>
      <dashboard-toolbar-extension />
      <template v-if="filteredMachines && filteredMachines.length">
          <v-col
            xl="3"
            sm="6"
            md="4"
            cols="12"
            :key="machine._id"
            v-for="machine in filteredMachines"
          >
            <machine-widget :name="machine.machinename" />
          </v-col>
      </template>
      <template v-else>
        No machines...
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import DashboardToolbarExtension from '../components/core/DashboardToolbarExtension.vue';
import MachineWidget from '../components/core/MachineWidget.vue';

export default {
  name: 'ProductionDashboard',
  components: {
    DashboardToolbarExtension,
    MachineWidget,
  },
  data() {
    return {
      loading: false,
    };
  },
  created() {
    this.loading = true;
    const machines = this.fetchMachines();
    if (machines) {
      this.setExtendedHeader(true);
    }
    this.loading = false;
  },
  computed: {
    ...mapGetters('productionLog', ['filteredMachines']),
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('productionLog', ['fetchMachines']),
  },
};
</script>
