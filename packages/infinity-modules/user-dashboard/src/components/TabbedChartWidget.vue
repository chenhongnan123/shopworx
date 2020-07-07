<template>
    <div>
      <span
        class="title font-weight-regular"
        v-if="title"
        v-text="title"
      ></span>
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
                      v-text="tab.value"
                    ></div>
                    <div :class="`${getType(tab.comparision.type).color}--text`">
                      <v-icon
                        small
                        :color="getType(tab.comparision.type).color"
                        v-text="getType(tab.comparision.type).icon"
                      ></v-icon>
                      <span
                        class="body-2"
                        v-text="tab.comparision.value"
                      ></span>
                    </div>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
        </v-card-title>
        <v-card-text>
          <highcharts :options="tabs[currentTab].options" ref="tabbedChart"></highcharts>
        </v-card-text>
        <v-divider v-if="action !== null"></v-divider>
        <v-card-actions class="pa-0">
          <v-select
            solo
            flat
            dense
            single-line
            v-model="filter"
            hide-details
            v-if="showDateFilter"
            :items="['Today', 'Yesterday', 'Last 7 days']"
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            class="text-none"
            v-if="action !== null"
            @click="$router.push(action.route)"
          >
            <span v-text="action.text"></span>
            <v-icon right>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TabbedChartWidget',
  data() {
    return {
      currentTab: 0,
      filter: 'Last 7 days',
      tabs: [
        {
          name: 'Availability',
          value: '92%',
          comparision: {
            type: 'DOWN',
            value: '5.2%',
          },
          options: {
            chart: {
              type: 'line',
              height: '50%',
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['28/01', '29/01', '30/01', '31/01', '01/02', '02/02', '03/02'],
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
              data: [94, 93.4, 96, 92, 97, 88, 91],
              color: '#354493',
              showInLegend: false,
            }, {
              name: 'Availability',
              dashStyle: 'Dash',
              data: [91, 88.6, 96, 92, 93, 90, 89.5],
              color: '#354493',
              showInLegend: false,
            }],
          },
        },
        {
          name: 'Performance',
          value: '88%',
          comparision: {
            type: 'UP',
            value: '3%',
          },
          options: {
            chart: {
              type: 'line',
              height: '50%',
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['28/01', '29/01', '30/01', '31/01', '01/02', '02/02', '03/02'],
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
              data: [82, 87, 86, 92.3, 91.7, 88.4, 88],
              color: '#354493',
              showInLegend: false,
            }, {
              name: 'Performance',
              dashStyle: 'Dash',
              data: [91, 88.6, 96, 92, 93, 90, 89.5],
              color: '#354493',
              showInLegend: false,
            }],
          },
        },
        {
          name: 'Quality',
          value: '93.4%',
          comparision: {
            type: 'NEUTRAL',
            value: '0%',
          },
          options: {
            chart: {
              type: 'line',
              height: '50%',
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['28/01', '29/01', '30/01', '31/01', '01/02', '02/02', '03/02'],
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
              data: [84, 83.4, 86, 82, 87, 88, 91],
              color: '#354493',
              showInLegend: false,
            }, {
              name: 'Quality',
              dashStyle: 'Dash',
              data: [91, 88.6, 96, 92, 93, 90, 89.5],
              color: '#354493',
              showInLegend: false,
            }],
          },
        },
        {
          name: 'Oee',
          value: '98%',
          comparision: {
            type: 'DOWN',
            value: '8.3%',
          },
          options: {
            chart: {
              type: 'line',
              height: '50%',
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['28/01', '29/01', '30/01', '31/01', '01/02', '02/02', '03/02'],
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
              data: [88, 93.4, 96.4, 92.2, 91, 88, 91],
              color: '#354493',
              showInLegend: false,
            }, {
              name: 'Oee',
              dashStyle: 'Dash',
              data: [91, 88.6, 96, 92, 93, 90, 89.5],
              color: '#354493',
              showInLegend: false,
            }],
          },
        },
      ],
    };
  },
  computed: {
    ...mapState('helper', ['isDark']),
  },
  created() {
    this.updateSeriesColor(this.isDark);
  },
  watch: {
    isDark(val) {
      this.updateSeriesColor(val);
    },
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    action: {
      type: Object,
      default: null,
    },
    showDateFilter: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
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
