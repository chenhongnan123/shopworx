<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        :small="small"
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
    small: {
      type: Boolean,
      default: false,
    },
    listType: {
      type: String,
      default: 'all',
    },
  },
  methods: {
    ...mapActions('productionPlanning', ['deletePlanByPlanId']),
    async deletePlan() {
      if (await this.$root.$confirm.open(
        'Delete plan',
        `Are you you want to delete ${this.planId}?`,
      )) {
        const deleted = await this.deletePlanByPlanId({
          planId: this.planId,
          listType: this.listType,
        });
        if (this.$route.name === 'productionPlanDetails' && deleted) {
          this.$router.go(-1);
        }
      }
    },
  },
};
</script>
