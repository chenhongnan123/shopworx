<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        v-on="on"
        @click="updatePlans"
      >
        <v-icon>
          mdi-close-octagon-outline
        </v-icon>
      </v-btn>
    </template>
    <span>Abort plan</span>
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex';
import { now } from '@shopworx/services/util/date.service';

export default {
  name: 'AbortPlan',
  props: {
    plans: {
      type: Array,
      required: true,
    },
  },
  methods: {
    ...mapActions('planning', ['updatePlan']),
    async updatePlans() {
      if (await this.$root.$confirm.open(
        'Abort plans',
        'Are you you want to abort the plans?',
      )) {
        await Promise.all([
          this.plans.forEach((plan) => {
            let payload = {
              status: 'abort',
              actualend: now(),
            };
            if (plan.status === 'notStarted') {
              payload = { ...payload, actualstart: now() };
            }
            this.updatePlan({
              id: plan.planid,
              payload,
            });
          }),
        ]);
        this.$emit('on-abort');
      }
    },
  },
};
</script>
