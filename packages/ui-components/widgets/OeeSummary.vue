<template>
  <v-card
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
        v-model="tab"
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
            93%
            <v-icon small color="success" class="mt-1">mdi-arrow-up</v-icon>
            <span class="caption">5%</span>
          </span>
        </v-tab>
        <v-tab class="text-none">
          Quality
          <span class="headline font-weight-medium">
            91%
            <v-icon small color="success" class="mt-1">mdi-arrow-up</v-icon>
            <span class="caption">6%</span>
          </span>
        </v-tab>
      </v-tabs>
      <v-row v-if="tab === 0">
        <v-col cols="6">
          <highcharts class="mt-4" :options="dt1options"></highcharts>
        </v-col>
        <v-col cols="6">
          <highcharts class="mt-4" :options="dt2options"></highcharts>
        </v-col>
      </v-row>
      <v-row v-else-if="tab === 1">
        <v-col cols="6">
          Best performing machines
        </v-col>
        <v-col cols="6">
          Worst performing machines
        </v-col>
      </v-row>
      <v-row v-if="tab === 2">
        <v-col cols="6">
          <highcharts class="mt-4" :options="q1options"></highcharts>
        </v-col>
        <v-col cols="6">
          <highcharts class="mt-4" :options="q2options"></highcharts>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'OeeSummary',
  data() {
    return {
      tab: 0,
      dt1options: {
        title: {
          text: '',
        },
        chart: {
          type: 'column',
          height: 300,
        },
        tooltip: {
          shared: true,
        },
        yAxis: [
          {
            title: {
              text: '',
            },
          },
          {
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
          },
        ],
        xAxis: {
          categories: [
            'No reason',
            'Tea break',
            'Lunch break',
            'Dinner break',
            'Machine Communication Error',
          ],
          crosshair: true,
        },
        series: [
          {
            type: 'pareto',
            showInLegend: false,
            name: 'Pareto',
            yAxis: 1,
            zIndex: 10,
            baseSeries: 1,
            tooltip: {
              valueDecimals: 2,
              valueSuffix: '%',
            },
          },
          {
            name: 'Downtime (in mins)',
            type: 'column',
            showInLegend: false,
            zIndex: 2,
            data: [
              24312.72,
              5482.25,
              719.89,
              599.93,
              28.09,
            ],
          },
        ],
      },
      dt2options: {
        title: {
          text: '',
        },
        chart: {
          type: 'column',
          height: 300,
        },
        tooltip: {
          shared: true,
        },
        yAxis: [
          {
            title: {
              text: '',
            },
          },
          {
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
          },
        ],
        xAxis: {
          categories: [
            'SWX-1',
            'SWX-2',
            'SWX-5',
            'SWX-9',
            'SWX-15',
          ],
          crosshair: true,
        },
        series: [
          {
            type: 'pareto',
            showInLegend: false,
            name: 'Pareto',
            yAxis: 1,
            zIndex: 10,
            baseSeries: 1,
            tooltip: {
              valueDecimals: 2,
              valueSuffix: '%',
            },
          },
          {
            name: 'Downtime (in mins)',
            type: 'column',
            showInLegend: false,
            zIndex: 2,
            data: [
              15312.72,
              8482.25,
              919.89,
              399.93,
              78.09,
            ],
          },
        ],
      },
      q1options: {
        title: {
          text: '',
        },
        chart: {
          type: 'column',
          height: 300,
        },
        tooltip: {
          shared: true,
        },
        yAxis: [
          {
            title: {
              text: '',
            },
          },
          {
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
          },
        ],
        xAxis: {
          categories: [
            'Crack',
            'Material shortage',
            'Mold break',
            'Insufficient oil',
            'Handling',
          ],
          crosshair: true,
        },
        series: [
          {
            type: 'pareto',
            showInLegend: false,
            name: 'Pareto',
            yAxis: 1,
            zIndex: 10,
            baseSeries: 1,
            tooltip: {
              valueDecimals: 2,
              valueSuffix: '%',
            },
          },
          {
            name: 'Rejection (in pcs)',
            type: 'column',
            showInLegend: false,
            zIndex: 2,
            data: [
              70,
              33,
              21,
              12,
              5,
            ],
          },
        ],
      },
      q2options: {
        title: {
          text: '',
        },
        chart: {
          type: 'column',
          height: 300,
        },
        tooltip: {
          shared: true,
        },
        yAxis: [
          {
            title: {
              text: '',
            },
          },
          {
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
          },
        ],
        xAxis: {
          categories: [
            'SWX-1',
            'SWX-2',
            'SWX-5',
            'SWX-9',
            'SWX-15',
          ],
          crosshair: true,
        },
        series: [
          {
            type: 'pareto',
            showInLegend: false,
            name: 'Pareto',
            yAxis: 1,
            zIndex: 10,
            baseSeries: 1,
            tooltip: {
              valueDecimals: 2,
              valueSuffix: '%',
            },
          },
          {
            name: 'Rejection (in pcs)',
            type: 'column',
            showInLegend: false,
            zIndex: 2,
            data: [
              60,
              32,
              30,
              22,
              6,
            ],
          },
        ],
      },
    };
  },
};
</script>
