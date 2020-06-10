<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        v-on="on"
        @click="deletePlans"
      >
        <v-icon>
          mdi-delete-outline
        </v-icon>
      </v-btn>
    </template>
    <span>Delete plan</span>
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'DeletePlan',
  props: {
    plans: {
      type: Array,
      required: true,
    },
  },
  methods: {
    ...mapActions('planning', ['deletePlan']),
    async deletePlans() {
      if (await this.$root.$confirm.open(
        'Delete plans',
        'Are you you want to delete the plans?',
      )) {
        await Promise.all([
          this.plans.forEach((plan) => {
            this.deletePlan(plan.planid);
          }),
        ]);
        this.$emit('on-delete');
      }
    },
  },
};
</script>
