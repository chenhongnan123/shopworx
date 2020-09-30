<template>
  <v-container fill-height>
    <v-row
      align="center"
      justify="center"
      :no-gutters="$vuetify.breakpoint.smAndDown"
    >
      <v-col cols="12" align="center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="72"
        ></v-progress-circular>
      </v-col>
      <v-col cols="12" align="center">
        <span class="headline">
          Fetching plan details...
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PlanLoading',
};
</script>
