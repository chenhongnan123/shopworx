<template>
  <portal to="app-extension">
    <v-toolbar
      flat
      dense
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <v-btn
        small
        class="text-none"
        color="primary"
        :to="{ name: 'addProductionPlan' }"
      >
        <v-icon left small>mdi-plus</v-icon>
        Add new plan
      </v-btn>
      <v-btn
        small
        outlined
        color="primary"
        :to="{ name: 'reorderPlans' }"
        class="text-none ml-2"
      >
        <v-icon left small>mdi-swap-vertical</v-icon>
        Re-order plans
      </v-btn>
      <v-spacer></v-spacer>
      <div class="mt-1">
        <span class="title">
          <span v-if="filterCount">
            {{ filterCount }} of {{ planningCount }} records
            <span v-if="$vuetify.breakpoint.smAndUp">|</span>
          </span>
          <span v-if="$vuetify.breakpoint.smAndUp">
            {{ machine }} | {{ date }}
          </span>
        </span>
      </div>
      <v-btn
        icon
        small
        outlined
        class="ml-2"
        @click="toggleDrawer(true)"
      >
        <v-icon small v-if="!drawer">mdi-pencil</v-icon>
        <v-icon small v-else>mdi-check</v-icon>
      </v-btn>
    </v-toolbar>
  </portal>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'PlanningToolbar',
  data() {
    return {
      edit: false,
    };
  },
  computed: {
    ...mapState('productionPlanning', [
      'drawer',
      'planningList',
      'planningCount',
    ]),
    ...mapGetters('webApp', ['filters', 'filteredRecords']),
    machine() {
      return this.filters && this.filters.machinename ? this.filters.machinename.value : '';
    },
    date() {
      let dateText = '';
      if (this.filters && this.filters.date && this.filters.date.value) {
        const start = formatDate(new Date(this.filters.date.value[0]), 'PP');
        dateText = start;
        let end = '';
        if (this.filters.date.value.length === 2) {
          end = formatDate(new Date(this.filters.date.value[1]), 'PP');
        }
        dateText = `${start} - ${end}`;
      }
      return dateText;
    },
    filterCount() {
      const planning = this.filteredRecords(this.planningList);
      return planning.length;
    },
  },
  methods: {
    ...mapMutations('productionPlanning', ['toggleDrawer']),
  },
};
</script>
