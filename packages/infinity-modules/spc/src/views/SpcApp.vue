<template>
  <!-- eslint-disable max-len -->
  <v-container id="spc" fluid class="py-0">
    <v-row id="form">
      <v-col cols="11" md="11" lg="11">
        <v-toolbar flat dense class="stick" :color="$vuetify.theme.dark ? '#121212' : ''" id="toolbar">
          <v-autocomplete clearable class="mt-6 mr-4" label="Select Line" return-object item-text="name" :items="lineList" v-model="selectedLine" @change="handleLineClick">
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete clearable class="mt-6 mr-4" label="Select Subline" return-object item-text="name" :items="sublineList" v-model="selectedSubLine" @change="handleSubLineClick">
            <template v-slot:item="{ item }">
              <v-list-item-content>
               <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete clearable class="mt-6 mr-4" label="Select Station" return-object item-text="name" :items="stationList" v-model="selectedStation" @change="handleStationClick">
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete clearable class="mt-6 mr-4" label="Select SubStation" return-object item-text="name" :items="substationList" v-model="selectedSubStation" @change="handleSubStationClick">
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete clearable class="mt-6 mr-4" label="Select Parameter" return-object item-text="parametername" :items="parameteranalysisList" v-model="selectedParameter">
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.parametername"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field class="mt-6" type="datetime-local" label="From date" v-model="fromdate"></v-text-field>
          <v-text-field class="mt-6 ml-6" type="datetime-local" label="To date" v-model="todate"></v-text-field>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-col>
      <v-col cols="1" md="1" lg="1">
        <v-btn color="primary" @click="search" :disabled="!selectedParameter || !fromdate || !todate">Plot</v-btn>
      </v-col>
    </v-row>
    <div id="chart">
      <div>
        <v-tabs dense center-active v-model="chartView">
          <v-tab class="text-none"> Cpk </v-tab>
          <v-tab class="text-none"> Ppk </v-tab>
        </v-tabs>
        <template>
          <v-fade-transition mode="out-in">
            <highcharts :options="options" style="height: calc(100% - 48px)" ref="chart" v-if="chartView === 0"></highcharts>
          </v-fade-transition>
        </template>
      </div>
      <div>
        <v-list>
          <v-subheader>Reference</v-subheader>
          <v-list-item-group>
            <v-list-item color="red"> Station: <v-spacer></v-spacer> {{ selectedSubStation ? selectedSubStation.name : '' }} </v-list-item>
            <v-list-item color="red"> USL: <v-spacer></v-spacer> {{ selectedParameter ? selectedParameter.usl : '' }} </v-list-item>
            <v-list-item> LSL: <v-spacer></v-spacer> {{ selectedParameter ? selectedParameter.lsl : '' }} </v-list-item>
            <v-list-item> TARGET: <v-spacer></v-spacer> {{ selectedParameter ? selectedParameter.target : '' }} </v-list-item>
            <v-list-item> MAX: <v-spacer></v-spacer> {{ selectedParameter ? selectedParameter.max : '' }} </v-list-item>
            <v-list-item> MIN: <v-spacer></v-spacer> {{ selectedParameter ? selectedParameter.min : '' }} </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </div>
    <div id="grid">
      <v-data-table :headers="header" dense :items-per-page="5" :items="desserts" height="80%" width="100%" calculate-widths> </v-data-table>
      <v-btn color="primary" id="export" @click="exportData" :disabled="desserts.length <= 0">Export</v-btn>
    </div>
    <v-overlay id="loading" v-model="loading" width="100" absolute light>
      <v-card light width="200" height="200" align-self="center">
        <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background: new 0 0 50 50" xml:space="preserve">
          <path
            fill="#FF6700"
            d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,
          18.683h4.068c0-8.071
          ,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
          >
            <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
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
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import chunk from 'lodash.chunk';
/* eslint-disable */
import sortBy from 'lodash.sortby';
import compact from 'lodash.compact';
import Element from '@shopworx/services/api/element.service';
import moment from 'moment';

export default {
  name: 'SpcApp',
  data() {
    return {
      loading: false,
      fromdate: null,
      todate: null,
      selected: 0,
      scrolltop: 0,
      selectedLine: null,
      selectedSubLine: null,
      selectedStation: null,
      selectedSubStation: null,
      chartView: 0,
      selectedParameter: null,
      params: ['p1', 'p2', 'p3', 'p4', 'p5', 's1'],
      header: [
        { text: 'ROWID', value: 'rowid' },
        { text: 'Cpk', value: 'cpk' },
        { text: 'Ppk', value: 'fat' },
        { text: 'Mean', value: 'meanvalue' },
        { text: 'Stdev', value: 'stdevvalue' },
        { text: 'Time Range', value: 'timerange' },
      ],
      desserts: [],
      options: {
        chart: {
          type: 'line',
          // width: '100% wide',
        },
        title: {
          text: null,
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
              value: 88,
              width: 2,
            },
            {
              color: 'red',
              dashStyle: 'solid',
              value: 96,
              width: 2,
            },
            {
              color: 'green',
              dashStyle: 'solid',
              value: 92,
              width: 2,
            },
          ],
        },
        series: [
          {
            name: 'cpk',
            data: [],
            color: '#354493',
            showInLegend: false,
          },
        ],
      },
    };
  },
  async created() {
    this.zipService = ZipService;
    await this.getLines('');
  },
  computed: {
    ...mapState('spc', ['lineList', 'sublineList', 'stationList', 'substationList', 'parameterList', 'parameteranalysisList']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('spc', ['getLines', 'getSubLines', 'getStations', 'getSubStations', 'getParameters', 'getParameteranalysisListRecords']),
    async search() {
      const that = this;
      if (moment(that.todate).diff(moment(that.fromdate), 'day', true) > 7 || moment(that.todate).diff(moment(that.fromdate), 'day', true) < 0) {
        that.setAlert({
          show: true,
          type: 'error',
          message: 'Time Range must be less than 7 days',
        });
        return;
      }
      that.loading = true;
      const element = this.selectedSubStation.id;
      // eslint-disable-next-line max-len
      const queryParam = `?query=timestamp>=${new Date(this.fromdate).getTime()}%26%26timestamp<=${new Date(this.todate).getTime()}`;
      const response = await Element.getRecords(element, queryParam);

      if (response.status === 200 && response.data.totalCount > 0) {
        // eslint-disable-next-line max-len
        const params = response.data.results;
        const sorted = sortBy([...params], 'timestamp');
        const splitedArr = chunk([...sorted], 120);
        const tableData = splitedArr.map((item, index) => {
          const timeRange = `${moment(item[0].timestamp).format('YYYY-MM-DD HH:mm:ss')} - ${moment(item[item.length - 1].timestamp).format('YYYY-MM-DD HH:mm:ss')}`;
          // eslint-disable-next-line max-len
          const data = compact(item.map((i) => i[this.selectedParameter.parametername]));
          if (data.length <= 0) {
            return {
              cpk: 0,
              rowid: index + 1,
              timerange: timeRange,
              meanvalue: 0,
              stdevvalue: 0,
            };
          }
          const stdev = that.STDEV(data);
          const UTL = this.selectedParameter.usl;
          const LTL = this.selectedParameter.lsl;
          const mean = that.SUM(data) / data.length;
          const Cpk = (UTL - LTL) / (6 * stdev);
          return {
            cpk: Cpk,
            rowid: index + 1,
            timerange: timeRange,
            meanvalue: mean,
            stdevvalue: stdev,
          };
        });
        // eslint-disable-next-line max-len
        this.initCpk(
          tableData.map((item) => item.cpk),
          this.selectedParameter.max,
          this.selectedParameter.min,
          this.selectedParameter.target,
        );
        this.desserts = tableData;
        that.loading = false;
      }
    },
    calculate() {
      const that = this;
      const ifChecked = that.checkDateRange();
      if (ifChecked) {
        that.loading = true;
        // const reference = that.getReference()
        // const response = that.search()
        // response.then(res => {
        //   const data = res.data;
        //   const sorted = sortBy([...data], 'timestamp');
        //   const splitedArr = chunk([...sorted], 200);
        //   const tableData = splitedArr.map((item, index, arr) => {
        //     const timeRange = `${item[0].timestamp} - ${item[item.length - 1].timestamp}`;
        //     const stdev = that.STDEV(item);
        //     const UTL = 0;
        //     const LTL = 0;
        //     const Cpk = (UTL - LTL) / (6 * stdev);
        //     return {
        //       cpk: Cpk,
        //       rowid: index + 1,
        //       timerange: timeRange,
        //     };
        //   });
        // });
      } else {
        that.setAlert({
          show: true,
          type: 'error',
          message: 'EndDateTime Can Not Before StartDateTime ',
        });
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
    getReference() {
      // const that = this;
      const element = '';
      const queryParam = '?query=';
      return Element.getRecords(element, queryParam);
    },
    STDEV(arr) {
      const that = this;
      const mean = that.SUM(arr) / arr.length;
      const deviations = arr.map((item) => (item - mean) ** 2);
      const stdev = Math.sqrt(that.SUM(deviations) / (arr.length - 1));
      return Math.round(stdev.toFixed(4) * 1000) / 1000;
    },
    SUM(arr) {
      return arr.reduce((current, prev) => current + prev);
    },
    initCpk(data, utl, ltl, target) {
      const that = this;
      const options = {
        chart: {
          type: 'line',
        },
        title: {
          text: null,
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
          max: utl + 0.1,
          min: ltl - 0.1,
          plotLines: [
            {
              color: 'red',
              dashStyle: 'solid',
              value: utl,
              width: 2,
            },
            {
              color: 'red',
              dashStyle: 'solid',
              value: ltl,
              width: 2,
            },
            {
              color: 'green',
              dashStyle: 'solid',
              value: target,
              width: 2,
            },
          ],
        },
        series: [
          {
            name: 'Cpk',
            data: [...data],
            color: '#354493',
            showInLegend: false,
          },
        ],
      };
      that.options = options;
    },
    async handleLineClick(item) {
      const query = `?query=lineid==${item.id}`;
      await this.getSubLines(query);
      // this.subStationList.forEach((element) => {
      //   this.headers.push({
      //     headerName: element.name,
      //     field: `${element.id}result`,
      //   });
      // });
    },
    async handleSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getStations(query);
      // this.subStationList.forEach((element) => {
      //   this.headers.push({
      //     headerName: element.name,
      //     field: `${element.id}result`,
      //   });
      // });
    },
    async handleStationClick(item) {
      const query = `?query=stationid=="${item.id}"`;
      await this.getSubStations(query);
      // this.subStationList.forEach((element) => {
      //   this.headers.push({
      //     headerName: element.name,
      //     field: `${element.id}result`,
      //   });
      // });
    },
    async handleSubStationClick(item) {
      const query = `?query=substationid=="${item.id}"`;
      await this.getParameteranalysisListRecords(query);
      // this.subStationList.forEach((element) => {
      //   this.headers.push({
      //     headerName: element.name,
      //     field: `${element.id}result`,
      //   });
      // });
    },
    async exportData() {
      const fileName = `${this.selectedSubStation.name}_${this.selectedParameter.parametername}_${moment(this.fromdate).format('YYYY-MM-DD')}_to_${moment(this.todate).format('YYYY-MM-DD')}_spc`;
      // const csvContent = [];
      const column = ['cpk', 'ppk', 'meanvalue', 'stdevvalue', 'timerange'];

      const csvParser = new CSVParser();
      const content = csvParser.unparse({
        fields: column,
        data: this.desserts,
      });
      this.addToZip({
        fileName: `${fileName}.csv`,
        fileContent: content,
      });
      const zip = await this.zipService.generateZip();
      this.zipService.downloadFile(zip, `${fileName}.zip`);
      this.setAlert({
        show: true,
        type: 'success',
        message: 'export_spc_list',
      });
      return content;
    },
    addToZip(file) {
      this.zipService.addFile(file);
    },
  },
};
</script>
<style lang="sass" scoped>
#spc
  width: 100%
  height: 100%
  padding: 0 40px
  display: grid
  grid-template-rows: 60px 1fr 1fr
  grid-template-columns: 1fr
  overflow: hidden
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
</style>
