<template>
  <v-navigation-drawer
    app
    right
    clipped
    v-model="model"
  >
    <div class="mt-4 mx-2" >
      <date-selection />
      <shift-selection />
      <machine-selection />
      <type-selection />
      <duration-selection />
      <sort-selection />
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DateSelection from './toolbar/DateSelection.vue';
import ShiftSelection from './toolbar/ShiftSelection.vue';
import MachineSelection from './toolbar/MachineSelection.vue';
import TypeSelection from './toolbar/TypeSelection.vue';
import DurationSelection from './toolbar/DurationSelection.vue';
import SortSelection from './toolbar/SortSelection.vue';

export default {
  name: 'DowntimeDrawer',
  components: {
    DateSelection,
    ShiftSelection,
    MachineSelection,
    TypeSelection,
    DurationSelection,
    SortSelection,
  },
  computed: {
    ...mapState('downtimeLog', ['drawer']),
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
    ...mapMutations('downtimeLog', ['setDrawer']),
  },
};
</script>
