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

export default {
  name: 'AbortPlan',
  props: {
    planIds: {
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
          this.planIds.forEach((id) => {
            this.updatePlan({
              id,
              payload: {
                status: 'aborted',
              },
            });
          }),
        ]);
        this.$emit('on-abort');
      }
    },
  },
};
</script>
