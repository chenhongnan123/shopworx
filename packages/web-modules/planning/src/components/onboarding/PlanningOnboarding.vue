<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-window v-model="step">
        <v-window-item :value="1">
          <planning-welcome />
        </v-window-item>
        <v-window-item :value="2">
          <planning-schema />
        </v-window-item>
      </v-window>
      <v-card-actions>
        <v-btn
          @click="next"
          color="primary"
          class="text-none"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          v-text="$t('infinity.planning.onboarding.buttons.next')"
        ></v-btn>
        <v-btn
          text
          @click="back"
          color="primary"
          class="text-none"
          v-if="step !== 1"
          v-text="$t('infinity.planning.onboarding.buttons.back')"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import PlanningWelcome from './PlanningWelcome.vue';
import PlanningSchema from './PlanningSchema.vue';

export default {
  name: 'PlanningOnboarding',
  components: {
    PlanningWelcome,
    PlanningSchema,
  },
  data() {
    return {
      dialog: false,
      step: 1,
    };
  },
  computed: {
    ...mapGetters('planning', ['isOnboardingComplete']),
  },
  methods: {
    next() {
      this.step += 1;
    },
    back() {
      this.step -= 1;
    },
  },
};
</script>
