<template>
  <v-card
    flat
    height="100%"
    rounded="lg"
  >
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
          88.4%
          <v-icon small color="error" class="mt-1">mdi-arrow-down</v-icon>
          <span class="caption">8%</span>
        </span>
      </v-progress-circular>
      <div class="headline mt-2">
        OEE
      </div>
      <v-tabs
        grow
        center-active
        class="mt-4"
        icons-and-text
      >
        <v-tab class="text-none">
          Availability
          <span class="headline font-weight-medium">
            88%
            <v-icon small color="error" class="mt-1">mdi-arrow-down</v-icon>
            <span class="caption">2.5%</span>
          </span>
        </v-tab>
        <v-tab class="text-none">
          Performance
          <span class="headline font-weight-medium">
            100%
            <v-icon small color="success" class="mt-1">mdi-arrow-up</v-icon>
            <span class="caption">50%</span>
          </span>
        </v-tab>
        <v-tab class="text-none">
          Quality
          <span class="headline font-weight-medium">
            100%
            <v-icon small color="success" class="mt-1">mdi-arrow-up</v-icon>
            <span class="caption">50%</span>
          </span>
        </v-tab>
      </v-tabs>
      <highcharts class="mt-4" :options="options"></highcharts>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'OeeSummary',
  data() {
    return {
      options: {
        chart: {
          renderTo: 'container',
          type: 'column',
        },
        title: {
          text: null,
        },
        tooltip: {
          shared: true,
        },
        xAxis: {
          categories: [
            'Overpriced',
            'Small portions',
            'Wait time',
            'Food is tasteless',
            'No atmosphere',
            'Not clean',
            'Too noisy',
            'Unfriendly staff',
          ],
          crosshair: true,
        },
        yAxis: [{
          title: {
            text: '',
          },
        }, {
          title: {
            text: '',
          },
          minPadding: 0,
          maxPadding: 0,
          max: 100,
          min: 0,
          opposite: true,
          labels: {
            format: '{value}%',
          },
        }],
        series: [{
          type: 'pareto',
          name: 'Pareto',
          yAxis: 1,
          zIndex: 10,
          baseSeries: 1,
          tooltip: {
            valueDecimals: 2,
            valueSuffix: '%',
          },
        }, {
          name: 'Complaints',
          type: 'column',
          zIndex: 2,
          data: [755, 222, 151, 86, 72, 51, 36, 10],
        }],
      },
    };
  },
};
</script>
