<template>
  <!-- eslint-disable max-len -->
  <v-container id="spc" fluid class="py-0 pl-10 pr-5">
    <v-row id="form">
      <v-col cols="9">
        <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212' : ''"
          id="toolbar"
        >
          <v-autocomplete
            :disabled="autorunning"
            class="mt-6 mr-4"
            label="Select Parameter"
            return-object
            item-text="tagdescription"
            :items="spcconfigurationList"
            v-model="selectedParameter"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.tagdescription"></v-list-item-title>
                <v-list-item-subtitle v-text="item.elementdescription"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-select
            :disabled="autorunning"
            class="mt-6 mr-4"
            :items="charts"
            label="Chart"
            v-model="selectedChart"
          ></v-select>
          <v-text-field
            :disabled="autorunning"
            class="mt-6"
            type="datetime-local"
            label="From date"
            v-model="fromdate"
          ></v-text-field>
          <v-text-field
            :disabled="autorunning"
            class="mt-6 ml-6"
            type="datetime-local"
            label="To date"
            v-model="todate"
          ></v-text-field>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-col>
      <v-col cols="1">
        <v-btn
          color="primary"
          @click="search"
          :disabled="!selectedParameter || !fromdate || !todate || autorunning"
          >Plot</v-btn
        >
      </v-col>
      <v-col cols="2">
        <v-switch
          class="mt-0"
          :disabled="!selectedParameter || !selectedChart"
          v-model="autorunning"
          :label="`Auto-Running: ${autorunning ? 'ON' : 'OFF'}`"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row id="" style="height: calc(100% - 80px);">
      <v-col cols="9" style="height: 100%;">
        <v-row style="height: calc(50% - 20px);">
           <v-card outlined style="height: 100%;width: 100%;">
            <v-card-title class="primary white--text">
              {{ title1 }}
            </v-card-title>
            <v-card-text style="height: calc(100% - 64px);">
              <highcharts
                class="hc"
                style="height: 100%"
                v-if="chart1"
                :options="chart1"
              ></highcharts>
            </v-card-text>
          </v-card>
        </v-row>
        <v-row class="mt-10" style="height: calc(50% - 20px);">
          <v-card outlined style="height: 100%;width: 100%;">
            <v-card-title class="primary white--text">
              {{ title2 }}
            </v-card-title>
            <v-card-text style="height: calc(100% - 64px);">
              <highcharts
                class="hc"
                style="height: 100%"
                v-if="chart2"
                :options="chart2"
              ></highcharts>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
      <v-col cols="3" class="pl-5" style="height: 100%;" id="xp">
        <v-card outlined style="height: 100%;">
          <v-card-title class="primary white--text">
            Capability Chart
          </v-card-title>
          <v-card-text class="mt-5" style="height: calc(100% - 64px);">
            <div style="height: 350px;border: 1px solid gray">
              <highcharts
                class="hc"
                style="height: 100%"
                v-if="histogram"
                :options="histogram"
              ></highcharts>
            </div>
            <v-list>
            <v-list-item class="mt-2">
              <v-list-item-title>Upper Tolerance</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ selectedParameter ? selectedParameter.ucl : '' }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mt-2">
              <v-list-item-title>Lower Tolerance</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ selectedParameter ? selectedParameter.lcl : '' }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mt-2">
              <v-list-item-title>Pp</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ xp.pp }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mt-2">
              <v-list-item-title>PpK</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ xp.ppk }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mt-2">
              <v-list-item-title>Cp</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ xp.cp }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mt-2">
              <v-list-item-title>CpK</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ xp.cpk }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-overlay id="loading" v-model="loading" width="100" absolute light>
      <v-card light width="200" height="200" align-self="center">
        <svg
          version="1.1"
          id="loader-1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="40px"
          height="40px"
          viewBox="0 0 50 50"
          style="enable-background: new 0 0 50 50"
          xml:space="preserve"
        >
          <path
            fill="#FF6700"
            d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,
          18.683h4.068c0-8.071
          ,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <p>loading</p>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script>
import {
  mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';
// import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import ApiService from '@shopworx/services/api/api.service';
// import moment from 'moment';

export default {
  name: 'SpcApp',
  data() {
    return {
      title1: 'I-Chart',
      title2: 'MR-Chart',
      chart1: null,
      chart2: null,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      xp: {
        pp: '',
        ppk: '',
        cp: '',
        cpk: '',
      },
      histogram: null,
      autorunning: false,
      fromdate: null,
      todate: null,
      selected: 0,
      scrolltop: 0,
      chartView: 0,
      selectedParameter: null,
      selectedChart: 'I-MR',
      charts: ['Xbar-S', 'Xbar-R', 'I-MR'],
      autotimer: null,
    };
  },
  watch: {
    selectedChart(val) {
      if (val === 'Xbar-S') {
        this.title1 = 'Xbar-Chart';
        this.title2 = 'S-Chart';
      } else if (val === 'Xbar-R') {
        this.title1 = 'Xbar-Chart';
        this.title2 = 'R-Chart';
      } else if (val === 'I-MR') {
        this.title1 = 'I-Chart';
        this.title2 = 'MR-Chart';
      }
    },
    autorunning(val) {
      if (val) {
        this.autotimer = setInterval(() => {
          this.search();
        }, this.spcSetting.refresh);
      } else {
        clearInterval(this.autotimer);
        this.autotimer = null;
      }
    },
  },
  async created() {
    this.zipService = ZipService;
    await this.getSpcconfigurationListRecords();
  },
  computed: {
    ...mapState('spc', ['spcconfigurationList', 'spcSetting']),
    loading() {
      return this.loading1 || this.loading2 || this.loading3 || this.loading4;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('spc', ['getSpcconfigurationListRecords', 'getRecords']),
    async search() {
      this.loading1 = true;
      this.loading2 = true;
      this.loading3 = true;
      this.loading4 = true;

      const {
        elementname,
        tagname,
        ucl,
        lcl,
      } = this.selectedParameter;
      const { fromdate, todate } = this;
      const {
        // refresh,
        cpksamplesize,
        ppksamplesize,
        isamplesize,
        mrsamplesize,
        xbarrgroupsize,
        xbarrsamplesize,
        xbarsgroupsize,
        xbarssamplesize,
      } = this.spcSetting;
      const pagesize = Math.max(
        cpksamplesize,
        ppksamplesize,
        isamplesize,
        mrsamplesize,
        xbarrsamplesize,
        xbarssamplesize,
      );
      let query = '';
      if (this.autorunning) {
        query = `?sortquery=createdTimestamp==-1&pagenumber=1&pagesize=${pagesize}`;
      } else {
        query = `?datefrom=${new Date(fromdate).getTime()}&dateto=${new Date(
          todate,
        ).getTime()}&sortquery=createdTimestamp==-1&pagenumber=1&pagesize=${pagesize}`;
      }
      const response = await this.getRecords({
        query,
        element: elementname,
      });
      if (response && response.length) {
        const data = response;
        const cpksample = data.slice(0, cpksamplesize).map((item) => item[tagname]);
        const ppksample = data.slice(0, ppksamplesize).map((item) => item[tagname]);
        this.histogram = this.setHistogram(lcl, ucl, ppksample);
        if (this.selectedChart === 'Xbar-S') {
          const xbarssample = data.slice(0, xbarssamplesize).map((item) => item[tagname]);
          this.getXbarSChart(xbarssample, xbarsgroupsize);
          // xbar-s
        } else if (this.selectedChart === 'Xbar-R') {
          const xbarrsample = data.slice(0, xbarrsamplesize).map((item) => item[tagname]);
          this.getXbarRChart(xbarrsample, xbarrgroupsize);
          // xbar-r
        } else if (this.selectedChart === 'I-MR') {
          // i-mr
          const isample = data.slice(0, isamplesize).map((item) => item[tagname]);
          const mrsample = data.slice(0, mrsamplesize).map((item) => item[tagname]);
          this.getIChart(isample);
          this.getMRChart(mrsample);
        }
        this.getCpChart(ucl, lcl, cpksample);
        this.getPpChart(ucl, lcl, ppksample);
        this.loading = false;
      } else {
        this.loading = false;
      }
    },
    checkDateRange() {
      const that = this;
      const starttime = new Date(`${that.startdate} ${that.starttime}`);
      const endtime = new Date(`${that.enddate} ${that.endtime}`);
      if (starttime >= endtime) {
        return false;
      }
      return true;
    },
    addToZip(file) {
      this.zipService.addFile(file);
    },
    setHistogram(lower, upper, points) {
      return {
        title: {
          text: '',
        },
        xAxis: [
          {
            title: { text: 'Data' },
            alignTicks: false,
          },
          {
            title: { text: 'Histogram' },
            alignTicks: false,
            opposite: true,
            plotLines: [
              {
                color: 'red',
                dashStyle: 'dash',
                value: lower,
                width: 2,
                label: {
                  text: lower,
                  verticalAlign: 'top',
                  rotation: 0,
                  x: -8,
                  y: -20,
                  style: {
                    fontWeight: 'bold',
                    fontSize: '16px',
                  },
                },
              },
              {
                color: 'red',
                dashStyle: 'dash',
                value: upper,
                width: 2,
                label: {
                  rotation: 0,
                  text: 88,
                  verticalAlign: 'top',
                  x: -8,
                  y: -20,
                  style: {
                    fontWeight: 'bold',
                    fontSize: '16px',
                  },
                },
              },
            ],
          },
        ],
        pane: {
          size: 0.8,
        },
        yAxis: [
          {
            title: { text: 'Data' },
          },
          {
            title: { text: 'Histogram' },
            opposite: true,
          },
        ],

        plotOptions: {
          histogram: {
            accessibility: {
              pointDescriptionFormatter(point) {
                const ix = point.index + 1;
                const x1 = point.x.toFixed(3);
                const x2 = point.x2.toFixed(3);
                const val = point.y;
                return `${ix}. ${x1} to ${x2}, ${val}.`;
              },
            },
          },
        },

        series: [
          {
            name: 'Histogram',
            type: 'histogram',
            xAxis: 1,
            yAxis: 1,
            baseSeries: 's1',
            zIndex: -1,
          },
          {
            name: 'Data',
            type: 'scatter',
            data: points,
            id: 's1',
            marker: {
              radius: 1.5,
            },
            visible: false,
          },
        ],
      };
    },
    getChartConfig(lower, mid, upper, points) {
      return {
        title: {
          text: '',
        },
        chart: {
          type: 'line',
          // width: '100% wide',
          marginBottom: 20,
          marginRight: 200,
        },
        xAxis: {
          categories: [],
          title: {
            text: null,
          },
        },
        yAxis: {
          title: {
            text: null,
          },
          plotLines: [
            {
              color: 'red',
              dashStyle: 'solid',
              value: lower,
              width: 2,
              label: {
                text: lower,
                align: 'right',
                textAlign: 'left',
                x: 30,
                y: 3,
                style: {
                  fontWeight: 'bold',
                  fontSize: '16px',
                },
              },
            },
            {
              color: 'red',
              dashStyle: 'solid',
              value: upper,
              width: 2,
              label: {
                text: upper,
                align: 'right',
                textAlign: 'left',
                x: 30,
                y: 3,
                style: {
                  fontWeight: 'bold',
                  fontSize: '16px',
                },
              },
            },
            {
              color: 'green',
              dashStyle: 'solid',
              value: mid,
              width: 2,
              label: {
                text: mid,
                align: 'right',
                textAlign: 'left',
                x: 30,
                y: 3,
                style: {
                  fontWeight: 'bold',
                  fontSize: '16px',
                },
              },
            },
          ],
          min: Math.min(...[lower, ...points]) - (mid - lower) / 2,
          max: Math.max(...[upper, ...points]) + (upper - mid) / 2,
        },
        series: [
          {
            data: points,
            color: '#354493',
            showInLegend: false,
          },
        ],
      };
    },
    async getIChart(data) {
      const response = await ApiService.post('/spc', { type: 1, data });
      if (response.status === 200) {
        if (response.data.status === 1) {
          const {
            iCL,
            iLCL,
            iUCL,
          } = response.data;
          this.chart1 = this.getChartConfig(iLCL, iCL, iUCL, data);
        }
      }
      this.loading1 = false;
    },
    async getMRChart(data) {
      const response = await ApiService.post('http://localhost:7005/spc', { type: 2, data });
      if (response.status === 200) {
        if (response.data.status === 1) {
          const {
            mr,
            mrCL,
            mrUCL,
            mrLCL,
          } = response.data;
          this.chart2 = this.getChartConfig(mrLCL, mrCL, mrUCL, mr);
        }
      }
      this.loading2 = false;
    },
    async getXbarSChart(data, groupSize) {
      const response = await ApiService.post('http://localhost:7005/spc', { type: 4, data, groupSize });
      if (response.status === 200) {
        if (response.data.status === 1) {
          const {
            s,
            sbar,
            sUCL,
            sLCL,
            x2bar,
            xbar,
            xUCL,
            xLCL,
          } = response.data;
          this.chart1 = this.getChartConfig(sLCL, sbar, sUCL, s);
          this.chart2 = this.getChartConfig(xLCL, x2bar, xUCL, xbar);
        }
      }
      this.loading1 = false;
      this.loading2 = false;
    },
    async getXbarRChart(data, groupSize) {
      const response = await ApiService.post('http://localhost:7005/spc', { type: 3, data, groupSize });
      if (response.status === 200) {
        if (response.data.status === 1) {
          const {
            r,
            rbar,
            rUCL,
            rLCL,
            x2bar,
            xbar,
            xUCL,
            xLCL,
          } = response.data;
          this.chart1 = this.getChartConfig(rLCL, rbar, rUCL, r);
          this.chart2 = this.getChartConfig(xLCL, x2bar, xUCL, xbar);
        }
      }
      this.loading1 = false;
      this.loading2 = false;
    },
    async getCpChart(usl, lsl, data) {
      const response = await ApiService.post('http://localhost:7005/spc', {
        type: 5,
        data,
        usl,
        lsl,
      });
      if (response.status === 200) {
        if (response.data.status === 1) {
          this.xp.cp = response.data.Xp;
          this.xp.cpk = response.data.Xpk;
        }
      }
      this.loading3 = false;
    },
    async getPpChart(usl, lsl, data) {
      const response = await ApiService.post('http://localhost:7005/spc', {
        type: 5,
        data,
        usl,
        lsl,
      });
      if (response.status === 200) {
        if (response.data.status === 1) {
          this.xp.pp = response.data.Xp;
          this.xp.ppk = response.data.Xpk;
        }
      }
      this.loading4 = false;
    },
  },
};
</script>
<style lang="sass" scoped>
#spc
  width: 100%
  height: 100%
  padding: 0 40px
  overflow: hidden
  background-color: #FAFAFB
  #form
    width: calc(100% - 0px)
  #grid
    height: 100%
    width: calc(100% - 0px)
    position: relative
    .v-data-table
      width: 100%
      height: 100%
    #export
      position: absolute
      bottom: 10px
      left: 0px
  #chart
    height: 100%
    width: calc(100% - 0px)
    display: grid
    grid-template-rows: 1fr
    grid-template-columns: 10fr 2fr
  #loading
    .v-card
      display: grid
      place-items: center
      grid-template-rows: 150px 50px
  #xp
    .v-list-item
      border: 3px solid #DFF0FE
      border-radius: 10px
</style>
