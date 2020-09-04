<template>
  <v-container
    fluid
    class="py-0"
    :class="[
      $vuetify.theme.dark ? '#121212' : 'white',
    ]"
    id="machine-dashboard"
  >
    <template v-if="loading">
      Loading...
    </template>
    <template v-else-if="filteredMachines && filteredMachines.length">
      <dashboard-toolbar-extension />
      <machine-slides
        :row="currentDimension.row"
        :col="currentDimension.col"
        :len="currentDimension.len"
      />
    </template>
  </v-container>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import DashboardToolbarExtension from '../components/dashboard/DashboardToolbarExtension.vue';
import MachineSlides from '../components/dashboard/MachineSlides.vue';

export default {
  name: 'MachineDashboard',
  components: {
    DashboardToolbarExtension,
    MachineSlides,
  },
  data() {
    return {
      loading: false,
      dimensions: [{
        name: 'xl',
        row: 3,
        col: 3,
      }, {
        name: 'lg',
        row: 2,
        col: 3,
      }, {
        name: 'md',
        row: 2,
        col: 3,
      }, {
        name: 'sm',
        row: 4,
        col: 2,
      }, {
        name: 'xs',
        row: 3,
        col: 1,
      }],
    };
  },
  async created() {
    this.loading = true;
    const machines = await this.getMachines();
    if (machines) {
      this.setExtendedHeader(true);
    }
    this.loading = false;
  },
  computed: {
    ...mapGetters('machineDashboard', ['filteredMachines']),
    currentDimension() {
      const { row, col } = this.dimensions.find(
        (dimension) => dimension.name === this.$vuetify.breakpoint.name,
      );
      const totalMachines = this.filteredMachines.length;
      return {
        row,
        col,
        len: Math.ceil(totalMachines / (row * col)),
      };
    },
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('machineDashboard', ['getMachines']),
  },
};
</script>
