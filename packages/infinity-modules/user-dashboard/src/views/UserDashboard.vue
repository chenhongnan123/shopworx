<template>
  <component :is="component" />
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
          return 'plant-head-dashboard';
        case 'planner':
          return 'production-planner-dashboard';
        case 'supervisor':
          return 'production-supervisor-dashboard';
        default:
          return 'admin-dashboard';
      }
    },
  },
};
</script>
