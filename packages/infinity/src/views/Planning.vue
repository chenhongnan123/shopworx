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
import PlanningToolbar from '@/components/planning/PlanningToolbar.vue';
import PlanningOnboarding from '@/components/planning/onboarding/PlanningOnboarding.vue';

export default {
  name: 'Planning',
  components: {
    PlanningToolbar,
    PlanningOnboarding,
  },
};
</script>
