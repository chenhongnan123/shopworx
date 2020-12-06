<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="error"
        @click="updatePlan"
      >
        <v-icon>mdi-close-octagon-outline</v-icon>
      </v-btn>
    </template>
    Abort plan
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AbortPlan',
  props: {
    planId: {
      type: String,
      required: true,
    },
    reOrderList: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions('productionPlanning', ['updatePlanByPlanId']),
    async updatePlan() {
      if (await this.$root.$confirm.open(
        'Abort plan',
        `Are you you want to abort ${this.planId}?`,
      )) {
        await this.updatePlanByPlanId({
          planId: this.planId,
          payload: {
            status: 'abort',
            actualend: new Date().getTime(),
          },
          reOrderList: this.reOrderList,
        });
      }
    },
  },
};
</script>
