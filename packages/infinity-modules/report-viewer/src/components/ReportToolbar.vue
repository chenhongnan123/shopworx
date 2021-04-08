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
    <!-- <report-chart-type /> -->
  </v-toolbar>
</template>

<script>
import ReportTitle from './toolbar/ReportTitle.vue';
import ReportDatePicker from './toolbar/ReportDatePicker.vue';
import ReportMappings from './toolbar/ReportMappings.vue';
// import ReportChartType from './toolbar/ReportChartType.vue';

export default {
  name: 'ReportToolbar',
  components: {
    ReportTitle,
    ReportDatePicker,
    ReportMappings,
    // ReportChartType,
  },
};
</script>
