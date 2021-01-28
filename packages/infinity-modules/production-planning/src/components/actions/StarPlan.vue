<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        :small="small"
        v-bind="attrs"
        color="warning"
        @click="toggleStar"
      >
        <v-icon v-if="starred">mdi-star</v-icon>
        <v-icon v-else>mdi-star-outline</v-icon>
      </v-btn>
    </template>
    <span v-if="starred">
      Unmark as star
    </span>
    <span v-else>
      Mark as star
    </span>
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'StarPlan',
  props: {
    planId: {
      type: String,
      required: true,
    },
    starred: {
      type: Boolean,
      default: false,
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
    ...mapActions('productionPlanning', ['updatePlanByPlanId']),
    async toggleStar() {
      await this.updatePlanByPlanId({
        planId: this.planId,
        payload: { starred: !this.starred },
        listType: this.listType,
      });
    },
  },
};
</script>
