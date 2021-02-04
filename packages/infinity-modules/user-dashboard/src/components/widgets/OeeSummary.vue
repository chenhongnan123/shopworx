<template>
  <v-card>
    <v-card-title primary-title>
      Shift OEE
    </v-card-title>
    <v-card-text class="text-center">
      <v-progress-circular
        size="180"
        :value="88"
        button
        width="15"
        color="primary"
        rotate="-90"
      >
        <span class="display-1">
          85%
          <v-icon small color="success" class="mt-1">mdi-arrow-up</v-icon>
          <span class="caption">21.4%</span>
        </span>
      </v-progress-circular>
      <div class="headline mt-2">
        OEE
      </div>
      <v-tabs
        grow
        center-active
        class="mt-4"
        v-model="tab"
        icons-and-text
      >
        <v-tab class="text-none">
          Availability
          <span class="headline font-weight-medium">
            90%
            <v-icon small color="success" class="mt-1">mdi-arrow-up</v-icon>
            <span class="caption">11.1%</span>
          </span>
        </v-tab>
        <v-tab class="text-none">
          Performance
          <span class="headline font-weight-medium">
            95%
            <v-icon small color="success" class="mt-1">mdi-arrow-up</v-icon>
            <span class="caption">5.5%</span>
          </span>
        </v-tab>
        <v-tab class="text-none">
          Quality
          <span class="headline font-weight-medium">
            99%
            <v-icon small color="success" class="mt-1">mdi-arrow-up</v-icon>
            <span class="caption">3.1%</span>
          </span>
        </v-tab>
      </v-tabs>
      <v-row v-if="tab === 0">
        <v-col cols="12" xl="6" v-if="downtimeByMachine">
          <highcharts class="mt-4" :options="downtimeByMachine"></highcharts>
        </v-col>
        <v-col cols="12" xl="6" v-if="downtimeByReason">
          <highcharts class="mt-4" :options="downtimeByReason"></highcharts>
        </v-col>
      </v-row>
      <v-row v-else-if="tab === 1">
        <v-col cols="12" v-if="performanceByMachine">
          <highcharts class="mt-4" :options="performanceByMachine"></highcharts>
        </v-col>
      </v-row>
      <v-row v-if="tab === 2">
        <v-col cols="12" xl="6" v-if="rejectionByMachine">
          <highcharts class="mt-4" :options="rejectionByMachine"></highcharts>
        </v-col>
        <v-col cols="12" xl="6" v-if="rejectionByReason">
          <highcharts class="mt-4" :options="rejectionByReason"></highcharts>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'OeeSummary',
  data() {
    return {
      tab: 0,
    };
  },
  computed: {
    ...mapState('userDashboard', [
      'downtimeByMachine',
      'downtimeByReason',
      'performanceByMachine',
      'rejectionByMachine',
      'rejectionByReason',
    ]),
  },
};
</script>
