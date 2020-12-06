<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-btn
        icon
        v-on="on"
        color="info"
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
    ...mapActions('planning', ['updatePlanById']),
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
            this.updatePlanById({
              // eslint-disable-next-line
              id: plan._id,
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
