<template>
  <component :is="component" />
</template>

<script>
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
    component() {
      return 'production-supervisor-dashboard';
    },
  },
};
</script>
