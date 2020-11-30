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
        <calendar-date-selection v-if="isCalendarView" />
        <date-selection v-else />
        <machine-selection />
        <part-selection />
        <status-selection />
        <group-selection v-if="!isCalendarView" />
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import CalendarDateSelection from './filters/CalendarDateSelection.vue';
import DateSelection from './filters/DateSelection.vue';
import MachineSelection from './filters/MachineSelection.vue';
import PartSelection from './filters/PartSelection.vue';
import StatusSelection from './filters/StatusSelection.vue';
import GroupSelection from './filters/GroupSelection.vue';

export default {
  name: 'PlanningDrawer',
  components: {
    CalendarDateSelection,
    DateSelection,
    MachineSelection,
    PartSelection,
    StatusSelection,
    GroupSelection,
  },
  computed: {
    ...mapState('productionPlanning', ['drawer']),
    ...mapGetters('productionPlanning', ['isCalendarView']),
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
