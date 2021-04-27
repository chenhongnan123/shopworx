<template>
  <v-container fluid>
    <portal to="app-header">
      {{ $t('userDashboard') }}
    </portal>
    <component :is="component" />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminDashboard from '../components/AdminDashboard.vue';
import PlanHeadDashboard from '../components/PlanHeadDashboard.vue';
import ProductionPlannerDashboard from '../components/ProductionPlannerDashboard.vue';
import ProductionSupervisorDashboard from '../components/ProductionSupervisorDashboard.vue';

export default {
  name: 'UserDashboard',
  components: {
    AdminDashboard,
    PlanHeadDashboard,
    ProductionPlannerDashboard,
    ProductionSupervisorDashboard,
  },
  computed: {
    ...mapGetters('user', ['roleName']),
    component() {
      switch (this.roleName) {
        case 'planthead':
          return 'production-supervisor-dashboard';
        case 'planner':
          return 'production-planner-dashboard';
        case 'supervisor':
          return 'production-supervisor-dashboard';
        default:
          return 'production-supervisor-dashboard';
      }
    },
  },
};
</script>
