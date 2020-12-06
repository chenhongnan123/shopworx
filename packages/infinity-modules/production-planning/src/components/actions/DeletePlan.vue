<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="error"
      >
        <v-icon v-text="'$delete'"></v-icon>
      </v-btn>
    </template>
    Delete plan
  </v-tooltip>
</template>

<script>
export default {
  name: 'DeletePlan',
  props: {
    planId: {
      type: String,
      required: true,
    },
  },
  methods: {
    delete() {},
  },
};
</script>
