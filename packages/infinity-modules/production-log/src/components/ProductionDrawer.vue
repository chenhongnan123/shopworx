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
        <shift-selection />
        <machine-selection />
        <sort-selection />
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DateSelection from './toolbar/DateSelection.vue';
import ShiftSelection from './toolbar/ShiftSelection.vue';
import MachineSelection from './toolbar/MachineSelection.vue';
import SortSelection from './toolbar/SortSelection.vue';

export default {
  name: 'ProductionDrawer',
  components: {
    DateSelection,
    ShiftSelection,
    MachineSelection,
    SortSelection,
  },
  computed: {
    ...mapState('productionLog', ['drawer']),
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
    ...mapMutations('productionLog', ['setDrawer']),
  },
};
</script>
