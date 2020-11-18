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
      <status-selection />
      <duration-selection />
      <sort-selection />
      <toggle-selection />
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
import StatusSelection from './toolbar/StatusSelection.vue';
import ToggleSelection from './toolbar/ToggleSelection.vue';

export default {
  name: 'DowntimeDrawer',
  components: {
    DateSelection,
    ShiftSelection,
    MachineSelection,
    TypeSelection,
    DurationSelection,
    SortSelection,
    StatusSelection,
    ToggleSelection,
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
