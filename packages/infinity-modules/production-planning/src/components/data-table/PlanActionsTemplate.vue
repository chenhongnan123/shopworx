<template>
  <div>
    <v-btn icon color="warning">
      <v-icon>mdi-star-outline</v-icon>
    </v-btn>
    <v-btn icon color="primary">
      <v-icon>mdi-content-copy</v-icon>
    </v-btn>
    <v-btn icon color="error" v-if="plan.status === 'inProgress'">
      <v-icon>mdi-close-octagon-outline</v-icon>
    </v-btn>
    <v-btn icon color="error" v-else-if="plan.status === 'notStarted'">
      <v-icon v-text="'$delete'"></v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'PlanActionsTemplate',
  props: {
    plan: {
      type: Object,
      required: true,
    },
  },
};
</script>
