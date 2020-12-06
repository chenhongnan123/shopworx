<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="error"
        @click="deletePlan"
      >
        <v-icon v-text="'$delete'"></v-icon>
      </v-btn>
    </template>
    Delete plan
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'DeletePlan',
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
    ...mapActions('productionPlanning', ['deletePlanByPlanId']),
    async deletePlan() {
      if (await this.$root.$confirm.open(
        'Delete plan',
        `Are you you want to delete ${this.planId}?`,
      )) {
        await this.deletePlanByPlanId({
          planId: this.planId,
          reOrderList: this.reOrderList,
        });
      }
    },
  },
};
</script>
