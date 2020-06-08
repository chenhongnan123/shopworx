<template>
  <div v-if="widget">
    <span
      class="title font-weight-regular"
      v-if="title"
      v-text="title"
    ></span>
    <span class="float-right">
      <v-btn small icon v-if="config" @click="dialog = true">
        <v-icon small v-text="'$settings'"></v-icon>
      </v-btn>
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
    <v-card
      v-if="isConfigured"
      :class="title === null ? 'mt-8' : ''"
    >
      <v-card-text>
        <v-row>
          <v-col cols="9">
            <highcharts :options="tabs[currentParam].options"></highcharts>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col :class="`text-center ${tabs[currentParam].color}--text`" align-self="center">
            <div class="display-3">
              {{ tabs[currentParam].value }}
            </div>
            <div class="display-1">
              {{ tabs[currentParam].unit }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
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
          v-if="action"
          @click="$router.push(action.route)"
        >
          <span v-text="action.text"></span>
          <v-icon right>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-text class="text-center my-auto">
        <div>
          <v-icon x-large color="primary" v-text="'$settings'"></v-icon>
        </div>
        <v-btn
          outlined
          @click="dialog = true"
          color="primary"
          class="text-none mt-4"
        >
          Configure widget
        </v-btn>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Configure widget
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-select
            filled
            item-text="title"
            item-value="val"
            :items="allParameters"
            v-model="selectedParam"
            label="Select parameter to display"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="saveConfig"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ParameterWidget',
  data() {
    return {
      showDateFilter: true,
      dialog: false,
      action: null,
      selectedParam: null,
      filter: 'Today',
      tabs: [
        {
          value: '37.4',
          unit: '°C',
          color: 'success',
          options: {
            chart: {
              type: 'spline',
              height: 120,
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['08 am', '09 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm'],
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
              name: 'Horizontal Temperature',
              data: [42, 38.4, 46, 42, 47, 48, 45.3],
              color: '#354493',
              showInLegend: false,
            }],
          },
        },
        {
          value: '240',
          unit: 'PPM',
          color: 'warning',
          options: {
            chart: {
              type: 'spline',
              height: '20%',
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['08 am', '09 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm'],
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
              name: 'Machine Speed',
              data: [110, 140, 90, 92.3, 160, 145, 189],
              color: '#354493',
              showInLegend: false,
            }],
          },
        },
        {
          value: '45.3',
          unit: '°C',
          color: 'error',
          options: {
            chart: {
              type: 'spline',
              height: '20%',
            },
            title: {
              text: null,
            },
            xAxis: {
              categories: ['08 am', '09 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm'],
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
              name: 'Vertical Temperature',
              data: [42, 38.4, 46, 42, 47, 48, 45.3],
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
    config() {
      return this.widget && this.widget.definition.config;
    },
    isConfigured() {
      return this.widget && this.widget.definition.configured;
    },
    currentParam() {
      return this.config && this.config.selectedParameter;
    },
    allParameters() {
      return this.config && this.config.availableParameters;
    },
    title() {
      if (this.config) {
        if (this.isConfigured) {
          const param = this.config.availableParameters[this.config.selectedParameter];
          return param.title;
        }
        return this.widget.definition.title;
      }
      return null;
    },
  },
  created() {
    this.updateSeriesColor(this.isDark);
    this.selectedParam = this.currentParam;
  },
  watch: {
    isDark(val) {
      this.updateSeriesColor(val);
    },
    currentParam(val) {
      this.selectedParam = val;
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
    saveConfig() {
      const payload = {
        config: {
          availableParameters: this.allParameters,
          selectedParameter: this.selectedParam,
        },
        configured: true,
      };
      this.$emit('save-config', payload);
      this.dialog = false;
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
  },
};
</script>
