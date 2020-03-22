<template>
  <v-card
    flat
    class="transparent"
  >
    <v-card-title>
        Step {{ step + 1 }} of {{ steps.length }}
      <v-progress-linear :value="progress"></v-progress-linear>
    </v-card-title>
    <v-card-title class="primary--text display-1 font-weight-medium">
      {{ steps[step].title }}
    </v-card-title>
    <v-card-text>
      <v-fade-transition mode="out-in">
        <import-master-data
          v-if="step === 0"
          @update-step="step = 1"
        />
        <onboard-calendar v-else-if="step === 1" />
        <invite-users v-else />
      </v-fade-transition>
    </v-card-text>
  </v-card>
</template>

<script>
import ImportMasterData from '@/components/onboarding/import/ImportMasterData.vue';
import OnboardCalendar from '@/components/onboarding/calendar/OnboardCalendar.vue';
import InviteUsers from '@/components/onboarding/invite/InviteUsers.vue';

export default {
  name: 'Onboarding',
  components: {
    ImportMasterData,
    OnboardCalendar,
    InviteUsers,
  },
  data() {
    return {
      step: 0,
      steps: [
        {
          title: 'Import master data',
        },
        {
          title: 'Onboard calendar',
        },
        {
          title: 'Invite users',
        },
      ],
    };
  },
  computed: {
    progress() {
      return ((this.step + 1) / this.steps.length) * 100;
    },
  },
};
</script>
