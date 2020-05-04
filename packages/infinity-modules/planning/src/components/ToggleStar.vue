<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        v-on="on"
        @click="updatePlans"
      >
        <v-icon
          v-if="!starred"
        >
          mdi-star-outline
        </v-icon>
        <v-icon
          v-else
        >
          mdi-star-off
        </v-icon>
      </v-btn>
    </template>
    <span>{{ starred ? 'Remove star' : 'Add star' }}</span>
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ToggleStar',
  props: {
    planIds: {
      type: Array,
      required: true,
    },
    starred: {
      typr: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions('planning', ['updatePlan', 'getStarredPlans']),
    async updatePlans() {
      await Promise.all([
        this.planIds.forEach((id) => {
          this.updatePlan({
            id,
            payload: {
              starred: !this.starred,
            },
          });
        }),
      ]);
      this.$emit('on-update');
      await this.getStarredPlans();
    },
  },
};
</script>
