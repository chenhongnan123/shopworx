<template>
  <v-container fluid class="pa-0 ma-0" style="height:100%">
    <v-row
      align="center"
      justify="center"
      style="height:100%"
    >
      <v-col v-if="$vuetify.breakpoint.mdAndUp" md="6" xl="5">
        <v-img
          :src="require(`@shopworx/assets/illustrations/${planningIllustration}.svg`)"
          contain
        />
      </v-col>
      <v-col cols="12" md="6" lg="5" xl="4">
        <plan-onboarding />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlanOnboarding from '../components/onboarding/PlanOnboarding.vue';

export default {
  name: 'PlanSetup',
  components: {
    PlanOnboarding,
  },
  computed: {
    planningIllustration() {
      return this.$vuetify.theme.dark
        ? 'planning-dark'
        : 'planning-light';
    },
  },
};
</script>
