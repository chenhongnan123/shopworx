<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="error"
      >
        <v-icon>mdi-close-octagon-outline</v-icon>
      </v-btn>
    </template>
    Abort plan
  </v-tooltip>
</template>

<script>
export default {
  name: 'AbortPlan',
  props: {
    planId: {
      type: String,
      required: true,
    },
  },
  methods: {
    abort() {},
  },
};
</script>
