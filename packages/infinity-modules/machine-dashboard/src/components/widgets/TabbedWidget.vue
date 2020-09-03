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
        <v-card-title class="py-0">
          <v-item-group
            mandatory
            v-model="currentTab"
            style="width: 100%"
          >
            <v-row>
              <v-col
                cols="3"
                :key="index"
                v-for="(tab, index) in tabs"
              >
                <v-item #default="{ active, toggle }">
                  <v-card
                    flat
                    @click="toggle"
                    :style="active ? 'border-top: 4px solid var(--v-primary-base)' : ''"
                  >
                    <div
                      class="body-1 font-weight-regular"
                      v-text="tab.name"
                    ></div>
                    <div
                      class="subheading mt-1"
                      v-text="`${tab.value} %`"
                    ></div>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
        </v-card-title>
        <v-card-text>
          <highcharts
            ref="spline"
            :options="tabs[currentTab].options"
          ></highcharts>
        </v-card-text>
      </v-card>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TabbedWidget',
  data() {
    return {
      currentTab: 0,
      chart: null,
      tabs: [
        {
          value: '-',
          name: 'Availability',
          options: {
            chart: {
              type: 'spline',
              height: 200,
            },
            title: {
              text: null,
            },
            xAxis: {
              type: 'datetime',
              tickPixelInterval: 150,
              maxZoom: 20 * 1000,
              title: {
                text: null,
              },
            },
            yAxis: {
              title: {
                text: null,
              },
            },
            series: [{
              name: 'Availability',
              data: [],
              color: '#354493',
              showInLegend: false,
            }],
          },
        },
        {
          value: '-',
          name: 'Performance',
          options: {
            chart: {
              type: 'spline',
              height: 200,
            },
            title: {
              text: null,
            },
            xAxis: {
              type: 'datetime',
              tickPixelInterval: 150,
              maxZoom: 20 * 1000,
              title: {
                text: null,
              },
            },
            yAxis: {
              title: {
                text: null,
              },
            },
            series: [{
              name: 'Performance',
              data: [],
              color: '#354493',
              showInLegend: false,
            }],
          },
        },
        {
          value: '-',
          name: 'Quality',
          options: {
            chart: {
              type: 'spline',
              height: 200,
            },
            title: {
              text: null,
            },
            xAxis: {
              type: 'datetime',
              tickPixelInterval: 150,
              maxZoom: 20 * 1000,
              title: {
                text: null,
              },
            },
            yAxis: {
              title: {
                text: null,
              },
            },
            series: [{
              name: 'Quality',
              data: [],
              color: '#354493',
              showInLegend: false,
            }],
          },
        },
        {
          value: '-',
          name: 'Oee',
          options: {
            chart: {
              type: 'spline',
              height: 200,
            },
            title: {
              text: null,
            },
            xAxis: {
              type: 'datetime',
              tickPixelInterval: 150,
              maxZoom: 20 * 1000,
              title: {
                text: null,
              },
            },
            yAxis: {
              title: {
                text: null,
              },
            },
            series: [{
              name: 'Oee',
              data: [],
              color: '#354493',
              showInLegend: false,
            }],
          },
        },
      ],
    };
  },
  mounted() {
    this.chart = this.$refs.spline.chart;
  },
  computed: {
    ...mapState('helper', ['isDark']),
    title() {
      return this.widget && this.widget.definition.title;
    },
    key() {
      return this.tabs[this.currentTab].key;
    },
    machine() {
      return this.$route.params.id;
    },
    ...mapState('machineDashboard', ['assetData']),
    assetState() {
      return this.assetData && this.assetData[this.machine];
    },
  },
  async created() {
    this.updateSeriesColor(this.isDark);
  },
  watch: {
    isDark(val) {
      this.updateSeriesColor(val);
    },
    assetState(val) {
      this.addNewData(val);
    },
  },
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
  methods: {
    addNewData(val) {
      this.tabs[0].value = val.availability;
      this.tabs[1].value = val.performance;
      this.tabs[2].value = val.quality;
      this.tabs[3].value = val.oee;
      const shift = this.chart.series[0].data.length > 20;
      const x = new Date().getTime();
      this.chart.series[0].addPoint([x, this.tabs[this.currentTab].value], true, shift);
    },
    updateSeriesColor(val) {
      this.tabs.forEach((tab) => {
        tab.options.series.forEach((s) => {
          if (val) {
            s.color = '#21C77C';
          } else {
            s.color = '#354493';
          }
        });
      });
    },
    getType(status) {
      switch (status) {
        case 'UP':
          return {
            color: 'success',
            icon: 'mdi-arrow-up',
          };
        case 'DOWN':
          return {
            color: 'error',
            icon: 'mdi-arrow-down',
          };
        case 'NEUTRAL':
          return {
            color: 'warning',
            icon: 'mdi-cached',
          };
        default:
          return {
            color: '',
            icon: 'mdi-minus',
          };
      }
    },
  },
};
</script>
