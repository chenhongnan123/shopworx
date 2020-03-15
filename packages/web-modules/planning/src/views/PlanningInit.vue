<template>
  <v-card flat class="transparent">
    <v-window v-model="window">
      <v-window-item :value="1">
        <planning-welcome @start-setup="window = 2" />
      </v-window-item>
      <v-window-item :value="2">
        <planning-onboarding />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import PlanningWelcome from './PlanningWelcome.vue';
import PlanningOnboarding from '../components/onboarding/PlanningOnboarding.vue';

export default {
  name: 'PlanningInit',
  components: {
    PlanningWelcome,
    PlanningOnboarding,
  },
  data() {
    return {
      window: 1,
    };
  },
  computed: {
    ...mapGetters('planning', ['isOnboardingComplete']),
  },
};
</script>
