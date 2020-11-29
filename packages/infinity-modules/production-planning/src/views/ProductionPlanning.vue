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
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refreshProductionPlans"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <planning-toolbar />
    <planning-drawer />
    <planning-list />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import PlanningToolbar from '../components/PlanningToolbar.vue';
import PlanningDrawer from '../components/PlanningDrawer.vue';
import PlanningList from '../components/PlanningList.vue';

export default {
  name: 'ProductionPlanning',
  components: {
    PlanningToolbar,
    PlanningDrawer,
    PlanningList,
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
