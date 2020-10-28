<template>
  <v-card
    flat
    class="transparent"
  >
    <v-card-title>
        {{ $t('rejectionReasons.setup.counter', { current: step, total: steps.length }) }}
      <v-progress-linear :value="progress"></v-progress-linear>
    </v-card-title>
    <v-card-title class="primary--text display-1 font-weight-medium">
      {{ $t(`rejectionReasons.setup.${steps[step - 1].title}.title`) }}
    </v-card-title>
    <v-card-text>
      <v-fade-transition mode="out-in">
        <import-reasons
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
import ImportReasons from './ImportReasons.vue';
import CompleteOnboarding from './CompleteOnboarding.vue';

export default {
  name: 'Onboarding',
  components: {
    ImportReasons,
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
    const step = localStorage.getItem('rejectionStep');
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
      localStorage.setItem('rejectionStep', this.step);
    },
  },
};
</script>
