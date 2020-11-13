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
          <highcharts
            ref="tabbedChart"
            :options="tabs[currentTab].options"
          ></highcharts>
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
            item-text="text"
            item-value="value"
            v-if="showDateFilter"
            :items="timeFilters"
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
import { mapState, mapActions } from 'vuex';

export default {
  name: 'TabbedWidget',
  data() {
    return {
      currentTab: 0,
      showDateFilter: true,
      filter: 'today',
      action: {
        route: '',
        text: 'Performance overview',
      },
      chartReport: 'hourlymachineperformance',
      tabReport: 'dailymachineperformance',
      timeFilters: [{
        text: 'Today',
        value: 'today',
        timestamp: new Date().getTime(),
      }, {
        text: 'Yesterday',
        value: 'yesterday',
        timestamp: new Date().getTime() - 86400000,
      }],
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
              height: 200,
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['28/05', '29/05', '30/05', '31/05', '01/06', '02/06', '03/06'],
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
              height: 200,
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['28/05', '29/05', '30/05', '31/05', '01/06', '02/06', '03/06'],
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
              height: 200,
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['28/05', '29/05', '30/05', '31/05', '01/06', '02/06', '03/06'],
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
              height: 200,
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['28/05', '29/05', '30/05', '31/05', '01/06', '02/06', '03/06'],
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
    ...mapState('calendar', ['businessTime']),
    title() {
      return this.widget && this.widget.definition.title;
    },
  },
  watch: {
    isDark(val) {
      this.updateSeriesColor(val);
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
    ...mapActions('calendar', ['getBusinessTime']),
    ...mapActions('report', ['executeReport']),
    async getPayload(timestamp) {
      await this.getBusinessTime(timestamp);
      return {
        businessStartYear: this.businessTime.businessyear,
        businessEndYear: this.businessTime.businessyear,
        businessStartMonth: this.businessTime.businessmonth,
        businessEndMonth: this.businessTime.businessmonth,
        businessStartDay: this.businessTime.businessday,
        businessEndDay: this.businessTime.businessday,
        machineVal: `{${this.$route.params.id}}`,
      };
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
