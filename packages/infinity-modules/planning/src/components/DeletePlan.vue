<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-btn
        icon
        v-on="on"
        color="error"
        @click="deletePlans"
      >
        <v-icon v-text="'$delete'"></v-icon>
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
            // eslint-disable-next-line
            this.deletePlan(plan._id);
          }),
        ]);
        this.$emit('on-delete');
      }
    },
  },
};
</script>
