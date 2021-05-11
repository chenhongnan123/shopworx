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
    <report-date-picker />
    <report-mappings />
    <report-chart-toggle />
  </v-toolbar>
</template>

<script>
import ReportTitle from './toolbar/ReportTitle.vue';
import ReportDatePicker from './toolbar/ReportDatePicker.vue';
import ReportMappings from './toolbar/ReportMappings.vue';
import ReportChartToggle from './toolbar/ReportChartToggle.vue';

export default {
  name: 'ReportToolbar',
  components: {
    ReportTitle,
    ReportDatePicker,
    ReportMappings,
    ReportChartToggle,
  },
};
</script>
