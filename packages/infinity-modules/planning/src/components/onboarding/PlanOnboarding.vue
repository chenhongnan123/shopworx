<template>
  <v-card
    flat
    class="transparent"
  >
    <v-card-title>
        {{ $t('planning.setup.counter', { current: step, total: steps.length }) }}
      <v-progress-linear :value="progress"></v-progress-linear>
    </v-card-title>
    <v-card-title class="primary--text display-1 font-weight-medium">
      {{ $t(`planning.setup.${steps[step - 1].title}.title`) }}
    </v-card-title>
    <v-card-text>
      <v-fade-transition mode="out-in">
        <import-part-matrix
          v-if="step === 1"
          @update-step="updateStep"
        />
        <complete-onboarding
          v-else-if="step === 2"
        />
      </v-fade-transition>
    </v-card-text>
  </v-card>
</template>

<script>
import ImportPartMatrix from './ImportPartMatrix.vue';
import CompleteOnboarding from './CompleteOnboarding.vue';

export default {
  name: 'Onboarding',
  components: {
    ImportPartMatrix,
    CompleteOnboarding,
  },
  data() {
    return {
      step: 1,
      steps: [
        {
          title: 'importMaster',
        },
        {
          title: 'complete',
        },
      ],
    };
  },
  created() {
    const step = localStorage.getItem('planStep');
    this.step = step ? JSON.parse(step) : this.step;
  },
  computed: {
    progress() {
      return (this.step / this.steps.length) * 100;
    },
  },
  methods: {
    updateStep() {
      this.step += 1;
      localStorage.setItem('planStep', this.step);
    },
  },
};
</script>
