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
        <div class="headline">
          In God we trust. All others must bring data.
        </div>
        <div class="title">
          Loading app configurations
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DowntimeLogLoading',
};
</script>
