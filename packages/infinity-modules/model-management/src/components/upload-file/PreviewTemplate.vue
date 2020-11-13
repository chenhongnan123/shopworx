<template>
  <v-row no-gutters class="mx-2">
    <v-col cols="5">
      <span data-dz-name></span>
    </v-col>
    <v-col cols="2">
      <span data-dz-size></span>
    </v-col>
    <v-col cols="4">
      <v-sheet
        style="widht: 0%;border-radius:10px"
        data-dz-uploadprogress
        color="success"
        class="text-xs-center font-weight-bold white--text"
      >
        <span class="progress-text"></span>
      </v-sheet>
    </v-col>
    <v-col cols="1">
      <v-icon data-dz-remove>mdi-close</v-icon>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PreviewTemplate',
};
</script>
