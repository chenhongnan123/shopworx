<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Production Planning</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            small
            v-on="on"
            v-bind="attrs"
            class="ml-2 mb-1"
            @click="refreshProductionPlans"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        Last refreshed at: <strong>{{ lastRefreshedAt }}</strong>
      </v-tooltip>
    </portal>
    <planning-toolbar />
    <planning-drawer />
    <v-progress-linear
      :indeterminate="true"
      v-if="loading"
    ></v-progress-linear>
    <component :is="component" />
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';
import PlanningToolbar from '../components/PlanningToolbar.vue';
import PlanningDrawer from '../components/PlanningDrawer.vue';
import PlanningList from '../components/views/PlanningList.vue';
import PlanningCalendar from '../components/views/PlanningCalendar.vue';

export default {
  name: 'ProductionPlanning',
  components: {
    PlanningToolbar,
    PlanningDrawer,
    PlanningList,
    PlanningCalendar,
  },
  computed: {
    ...mapState('productionPlanning', ['loading', 'lastRefreshedAt']),
    ...mapGetters('productionPlanning', ['isCalendarView']),
    component() {
      return this.isCalendarView
        ? 'planning-calendar'
        : 'planning-list';
    },
  },
  created() {
    this.setExtendedHeader(true);
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('productionPlanning', ['fetchPlanningList']),
    refreshProductionPlans() {
      this.fetchPlanningList();
    },
  },
};
</script>
