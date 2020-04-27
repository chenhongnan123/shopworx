<template>
  <v-toolbar
    flat
    dense
    class="stick"
    :color="$vuetify.theme.dark ? '#121212': ''"
  >
    <v-toolbar-title>
      <report-title />
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn small outlined color="primary" class="text-none">
      <v-icon small left>mdi-calendar-range-outline</v-icon>
      Date range
      <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
    </v-btn>
    <v-btn small color="primary" outlined class="text-none ml-2">
      Monthly
      <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
    </v-btn>
    <v-btn small color="primary" outlined class="text-none ml-2">
      <v-icon small left>mdi-chart-bar</v-icon>
      Bar
      <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import ReportTitle from './toolbar/ReportTitle.vue';

export default {
  name: 'ReportToolbar',
  components: {
    ReportTitle,
  },
};
</script>
