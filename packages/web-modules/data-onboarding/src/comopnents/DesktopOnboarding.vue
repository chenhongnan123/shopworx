<template>
  <div>
    <v-stepper-header class="elevation-0">
      <template v-for="item in items">
        <onboarding-step
          :item="item"
          :key="`h-${item.step}`"
        ></onboarding-step>
        <v-divider
          v-if="item.step !== items.length"
          :key="item.step"
        ></v-divider>
      </template>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content
        :key="`c-${item.step}`"
        v-for="item in items"
        :step="item.step"
        class="pa-0"
      >
        <onboarding-content :item="item" />
      </v-stepper-content>
    </v-stepper-items>
  </div>
</template>

<script>
import OnboardingStep from './OnboardnigStep.vue';
import OnboardingContent from './OnboardingContent.vue';

export default {
  name: 'DesktopOnboarding',
  components: {
    OnboardingStep,
    OnboardingContent,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
