<template>
  <div>
    <planning-toolbar />
    <planning-onboarding />
    <v-fade-transition mode="out-in">
      <router-view></router-view>
    </v-fade-transition>
  </div>
</template>

<script>
import PlanningToolbar from '../components/PlanningToolbar.vue';
import PlanningOnboarding from '../components/onboarding/PlanningOnboarding.vue';

export default {
  name: 'PlanningContainer',
  components: {
    PlanningToolbar,
    PlanningOnboarding,
  },
};
</script>
