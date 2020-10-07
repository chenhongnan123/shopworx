<template>
    <div v-if="widget" style="height:100%">
      <span
        class="title font-weight-regular"
        v-if="title"
        v-text="title"
      ></span>
      <span class="float-right">
        <v-btn
          small
          color="error"
          icon
          v-if="customizeMode"
          @click="$emit('remove-widget', widget.i)"
        >
          <v-icon>mdi-minus-circle</v-icon>
        </v-btn>
      </span>
      <v-card :class="title === null ? 'mt-8' : ''">
        <v-card-text>
          <highcharts
            ref="timelineChart"
            :options="options"
          ></highcharts>
        </v-card-text>
        <v-card-text class="py-0">
          <v-row>
            <v-col cols="4">
              <div>
                DOWNTIME
              </div>
              <div class="headline">
                {{ downtime }}
              </div>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
              <div>
                Maintenance
              </div>
              <div class="headline">
                -
              </div>
              <div>
                No work
              </div>
              <div class="headline">
                -
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TimelineWidget',
  props: {
    widget: {
      type: Object,
      default: null,
    },
    customizeMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chart: null,
      interval: null,
      options: {
        chart: {
          type: 'xrange',
          height: 200,
        },
        title: {
          text: null,
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: null,
          },
          labels: {
            enabled: false,
          },
        },
        yAxis: {
          categories: ['Uptime', 'Downtime'],
          reversed: true,
          title: {
            text: null,
          },
        },
        plotOptions: {
          series: {
            stacking: 'normal',
          },
        },
        series: [{
          name: 'Timeline',
          data: [],
          showInLegend: false,
        }],
      },
    };
  },
  mounted() {
    this.chart = this.$refs.timelineChart.chart;
    this.interval = setInterval(() => {
      this.updateTime();
    }, 3000);
    this.updateTime();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  computed: {
    title() {
      return this.widget && this.widget.definition.title;
    },
    machine() {
      return this.$route.params.id;
    },
    ...mapGetters('machineDashboard', ['realTimeValue']),
    assetState() {
      const val = this.realTimeValue(this.machine);
      if (Object.keys(val).length > 0) {
        const key = Object.keys(val)[0];
        return val[key];
      }
      return null;
    },
    running() {
      return this.assetState && this.assetState.status !== 'inProgress';
    },
    downtime() {
      if (this.assetState && this.assetState.downtimeinterval) {
        const d = Number(this.assetState.downtimeinterval / 1000);
        const h = Math.floor(d / 3600);
        const m = Math.floor((d % 3600) / 60);
        const s = Math.floor((d % 3600) % 60);
        return `${h}:${m}:${s}`;
      }
      return '00:00:00';
    },
  },
  methods: {
    updateTime() {
      const series = this.chart.series[0];
      let point = {
        x: new Date().getTime(),
        x2: new Date().getTime() + 3000,
        y: 0,
        color: '#4CAF50',
      };
      if (!this.running) {
        point = {
          x: new Date().getTime(),
          x2: new Date().getTime() + 3000,
          y: 1,
          color: '#FF5252',
        };
      }
      series.addPoint(point);
    },
  },
};
</script>
