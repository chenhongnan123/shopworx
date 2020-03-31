<template>
  <v-card
    flat
    class="transparent"
  >
    <v-card-title>
        {{ $t('setup.steps.counter', { current: step, total: steps.length }) }}
      <v-progress-linear :value="progress"></v-progress-linear>
    </v-card-title>
    <v-card-title class="primary--text display-1 font-weight-medium">
      {{ $t(`setup.steps.${steps[step - 1].title}`) }}
    </v-card-title>
    <v-card-text>
      <v-fade-transition mode="out-in">
        <import-master-data
          v-if="step === 1"
          @update-step="updateStep"
        />
        <onboard-calendar
          v-else-if="step === 2"
          @update-step="updateStep"
        />
        <invite-users
          v-else-if="step === 3"
          @update-step="updateStep"
        />
        <complete-setup
          v-else-if="step === 4"
          @update-step="updateStep"
        />
      </v-fade-transition>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import ImportMasterData from './import/ImportMasterData.vue';
import OnboardCalendar from './calendar/OnboardCalendar.vue';
import InviteUsers from './invite/InviteUsers.vue';
import CompleteSetup from './CompleteSetup.vue';

export default {
  name: 'Onboarding',
  components: {
    ImportMasterData,
    OnboardCalendar,
    InviteUsers,
    CompleteSetup,
  },
  data() {
    return {
      step: 1,
      steps: [
        {
          title: 'importMaster',
        },
        {
          title: 'onboardCalendar',
        },
        {
          title: 'inviteUsers',
        },
        {
          title: 'complete',
        },
      ],
    };
  },
  created() {
    if (this.isOnboardingComplete) {
      this.step = 4;
    } else {
      const step = localStorage.getItem('step');
      this.step = step ? JSON.parse(step) : this.step;
    }
  },
  computed: {
    ...mapGetters('user', ['isOnboardingComplete']),
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
