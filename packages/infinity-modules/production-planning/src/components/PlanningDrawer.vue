<template>
  <v-navigation-drawer
    app
    right
    clipped
    width="290"
    v-model="model"
  >
    <perfect-scrollbar style="height: 100%">
      <div class="mt-4 mx-2" >
        <date-selection />
        <machine-selection />
        <part-selection />
        <status-selection />
        <group-selection />
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DateSelection from './toolbar/DateSelection.vue';
import MachineSelection from './toolbar/MachineSelection.vue';
import PartSelection from './toolbar/PartSelection.vue';
import StatusSelection from './toolbar/StatusSelection.vue';
import GroupSelection from './toolbar/GroupSelection.vue';

export default {
  name: 'PlanningDrawer',
  components: {
    DateSelection,
    MachineSelection,
    PartSelection,
    StatusSelection,
    GroupSelection,
  },
  computed: {
    ...mapState('productionPlanning', ['drawer']),
    model: {
      get() {
        return this.drawer;
      },
      set(val) {
        this.setDrawer(val);
      },
    },
  },
  methods: {
    ...mapMutations('productionPlanning', ['setDrawer']),
  },
};
</script>
