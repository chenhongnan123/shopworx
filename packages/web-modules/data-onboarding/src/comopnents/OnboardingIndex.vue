<template>
  <v-stepper
    v-model="currentStep"
    :vertical="isMobileScreen"
    class="elevation-0 transparent"
  >
    <desktop-onboarding
      v-if="!isMobileScreen"
      :items="onboardingItems"
    />
    <mobile-onboarding
      v-else
      :items="onboardingItems"
    />
  </v-stepper>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DesktopOnboarding from './DesktopOnboarding.vue';
import MobileOnboarding from './MobileOnboarding.vue';

export default {
  name: 'OnboardingIndex',
  components: {
    DesktopOnboarding,
    MobileOnboarding,
  },
  computed: {
    ...mapState('onboarding', ['step', 'onboardingItems']),
    isMobileScreen() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentStep: {
      get() {
        return this.step;
      },
      set(val) {
        this.setStep(val);
      },
    },
  },
  methods: {
    ...mapMutations('onboarding', ['setStep']),
  },
};
</script>
