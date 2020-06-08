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
                02:34:00
              </div>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
              <div>
                Maintenance
              </div>
              <div class="headline">
                02:00:00
              </div>
              <div>
                No work
              </div>
              <div class="headline">
                00:34:00
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
</template>

<script>
export default {
  name: 'TimelineWidget',
  data() {
    return {
      options: {
        chart: {
          type: 'bar',
          height: 200,
        },
        title: {
          text: null,
        },
        xAxis: {
          title: {
            text: null,
          },
          labels: {
            enabled: false,
          },
        },
        yAxis: {
          categories: [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00',
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
          ],
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
          name: 'Running',
          data: [94],
          color: '#4CAF50',
          showInLegend: false,
        }, {
          name: 'Down',
          data: [91],
          color: '#FF5252',
          showInLegend: false,
        }],
      },
    };
  },
  computed: {
    title() {
      return this.widget && this.widget.definition.title;
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
};
</script>
