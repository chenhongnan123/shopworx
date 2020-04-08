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
        <update-plan-settings
          v-else-if="step === 2"
          @update-step="updateStep"
        />
      </v-fade-transition>
    </v-card-text>
  </v-card>
</template>

<script>
import ImportPartMatrix from './ImportPartMatrix.vue';
import UpdatePlanSettings from './UpdatePlanSettings.vue';

export default {
  name: 'Onboarding',
  components: {
    ImportPartMatrix,
    UpdatePlanSettings,
  },
  data() {
    return {
      step: 1,
      steps: [
        {
          title: 'importMaster',
        },
        {
          title: 'selectPlanParameters',
        },
      ],
    };
  },
  computed: {
    progress() {
      return (this.step / this.steps.length) * 100;
    },
  },
  methods: {
    updateStep() {
      this.step += 1;
      localStorage.setItem('step', this.step);
    },
  },
};
</script>
