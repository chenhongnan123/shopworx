<template>
  <div style="height:50%">
    <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <ag-grid-vue
          :sideBar="true"
          :rowData="checkOutList"
          multiSortKey="ctrl"
          :animateRows="true"
          :enableCharts="true"
          pivotPanelShow="always"
          :columnDefs="headers"
          rowGroupPanelShow="always"
          :gridOptions="gridOptionsCheckOut"
          :enableRangeSelection="true"
          class="ag-theme-balham mt-2"
          :defaultColDef="defaultColDefCheckOut"
          style="width: 100%; height: 350px;"
          @sort-changed="onStateChange"
          @filter-changed="onStateChange"
          @column-pinned="onStateChange"
          @column-visible="onStateChange"
          @column-resized="onStateChange"
          @column-moved="onStateChange"
          @column-row-group-changed="onStateChange"
          @column-pivot-changed="onStateChange"
          @column-value-changed="onStateChange"
          :pagination="true"
        ></ag-grid-vue>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState, mapMutations } from 'vuex';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue';

export default {
  name: 'QualityHistoryView',
  components: {
    AgGridVue,
  },
  data() {
    return {
      fromdate: null,
      todate: null,
      dates: [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
      menu: false,
      processParametersList: [],
      selectedSubStation: {},
      finalCheckOutList: [],
      loading: false,
      isFullScreen: false,
      headers: [
        {
          headerName: this.$t('Created Date'),
          field: 'createdTimestamp',
          resizable: true,
        },
        {
          headerName: this.$t('Main Id'),
          field: 'mainid',
          rowGroup: true,
          resizable: true,
        },
        {
          headerName: this.$t('Sub station'),
          field: 'substationname',
          resizable: true,
        },
        {
          headerName: this.$t('Completed Product ID'),
          field: 'completedproductid',
          resizable: true,
        },
        {
          headerName: this.$t('Recipe name'),
          field: 'recipename',
          resizable: true,
        },
        {
          headerName: this.$t('Substation result'),
          field: 'substationresult',
          resizable: true,
        },
        {
          headerName: this.$t('Order name'),
          field: 'ordername',
          resizable: true,
        },
      ],
    };
  },
  props: {
    pageNumber: {
      type: Number,
      required: true,
    },
  },
  computed: {
    dateRangeText() {
      return this.dates.join(' to ');
    },
    ...mapState('traceabilityApp', [
      'lineList',
      'subLineList',
      'stationList',
      'subStationList',
      'checkOutList',
      'partStatusList',
      'subStationInfo',
      'trecibilityState']),
  },
  async created() {
    await this.getSubStations();
    const {
      substationid,
      mainid,
      fromdate,
      todate,
    } = this.subStationInfo;
    const subStation = this.subStationList.filter((i) => i.name === substationid)[0];
    this.selectedSubStation = subStation;
    this.searchMainID = mainid;
    this.fromdate = fromdate;
    this.todate = todate;
    if (substationid || mainid || fromdate || todate) {
      this.btnSearchProcessParameters();
    } else {
      await this.btnSearchProcessParameters();
      // await this.fetchRecords();
    }
  },
  beforeMount() {
    this.gridOptionsCheckOut = {};
    this.defaultColDefCheckOut = {
      filter: true,
      sortable: true,
      resizable: true,
      enableValue: true,
      enablePivot: true,
      enableRowGroup: true,
      floatingFilter: true,
    };
  },
  mounted() {
    // this.restoreState();
    this.gridApi = this.gridOptionsCheckOut.api;
    this.gridColumnApi = this.gridOptionsCheckOut.columnApi;
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    // this.btnSearchProcessParameters();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('element', ['getRecords']),
    ...mapMutations('traceabilityApp', ['setTrecibilityState']),
    ...mapActions('traceabilityApp',
      ['getLines',
        'getSubLines',
        'getStations',
        'getSubStations',
        'getCheckOutLists',
        'getProcessElement',
        'getProcessParameters',
        'getPartStatus']),
    async handleLineClick(item) {
      const query = `?query=lineid==${item.id}`;
      await this.getSubLines(query);
    },
    restoreState() {
      if (!this.isBaseReport) {
        this.setGridState(this.gridObject);
        const state = JSON.parse(this.gridObject);
        this.gridColumnApi.setColumnState(state.colState);
        this.gridColumnApi.setColumnGroupState(state.groupState);
        this.gridApi.setSortModel(state.sortState);
        this.gridApi.setFilterModel(state.filterState);
      } else {
        // this.resetState();
      }
    },
    async fetchRecords() {
      const records = await this.getRecords({
        elementName: 'businesshours',
      });
      // console.log(records);
      const time = records[0].starttime;
      const splitTime = time.slice(0, 2);
      const day = new Date();
      const now = day.setHours(splitTime);
      const toDate = new Date().getTime();
      // console.log(now);
      // console.log(toDate);
      this.fromdate = now;
      this.todate = toDate;
      this.btnSearchProcessParameters();
    },
    onStateChange() {
      const colState = this.gridColumnApi.getColumnState();
      const groupState = this.gridColumnApi.getColumnGroupState();
      const sortState = this.gridApi.getSortModel();
      const filterState = this.gridApi.getFilterModel();
      /* console.log('***********************');
      console.log('colState: ', colState);
      console.log('groupState: ', groupState);
      console.log('sortState: ', sortState);
      console.log('filterState: ', filterState);
      console.log('***********************'); */
      const state = {
        colState,
        groupState,
        sortState,
        filterState,
      };
      this.setGridState(JSON.stringify(state));
    },
    saveDateRange() {
      if (this.dates && this.dates.length === 2) {
        let [start, end] = this.dates;
        if (new Date(end).getTime() < new Date(start).getTime()) {
          const temp = start;
          start = end;
          end = temp;
          this.dates = [start, end];
        }
        // this.setDateRange([start, end]);
      }
      this.$refs.menu.save(this.dates);
    },
    async handleSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getStations(query);
    },
    async handleStationClick(item) {
      console.log(item);
      // const query = `?query=stationid=="${item.id}"`;
      // await this.getSubStations(query);
    },
    async btnSearchProcessParameters() {
      this.processParametersList = [];
      const fromDate = new Date(this.trecibilityState.fromdate).getTime();
      const toDate = new Date(this.trecibilityState.todate).getTime();
      let cFlag = 0;
      let param = '';
      if (!this.trecibilityState.searchMainID && !this.trecibilityState.selectedSubStation
         && (fromDate || toDate)) {
        cFlag = 4;
        param = '?';
      } else {
        param = '?query=';
      }
      if (this.trecibilityState.searchMainID) {
        param += `mainid=="${this.trecibilityState.searchMainID}"||`;
        param += `carrierid=="${this.trecibilityState.searchMainID}"||`;
        param += `packagebatchid=="${this.trecibilityState.searchMainID}"||`;
        param += `componentvalue=="${this.trecibilityState.searchMainID}"||`;
        param += `completedproductid=="${this.trecibilityState.searchMainID}"&`;
        cFlag = 1;
      }
      if (this.trecibilityState.selectedSubStation) {
        param += `substationid=="${this.trecibilityState.selectedSubStation.id}"&`;
        cFlag = 3;
      }
      if (fromDate) {
        param += `datefrom=${fromDate}&`;
      }
      if (toDate) {
        param += `dateto=${toDate}`;
      }
      // param += 'pagenumber=1&pagesize=20';
      await this.getCheckOutLists(param);
      this.gridApi = this.gridOptionsCheckOut.api;
      this.gridApi.expandAll();
      if (cFlag === 1) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'GET_RECORDS_BY_MAINID',
        });
      } else if (cFlag === 2) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'NOT_VALID_INPUT_SUB',
        });
      } else if (cFlag === 3) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'GET_RECORDS_BY_SUBSTATION',
        });
      } else if (cFlag === 4) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'GET_RECORDS_DATE_RANGE',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'GET_RECORDS',
        });
      }
    },
    async exportGridCSV() {
      const name = 'quality_data';
      const params = {
        fileName: `${name}-${new Date().toLocaleString()}`,
      };
      await this.gridApi.exportDataAsCsv(params);
    },
    exportGridExcel() {
      const name = 'quality_data';
      const params = {
        fileName: `${name}-${new Date().toLocaleString()}`,
      };
      this.gridApi.exportDataAsExcel(params);
    },
  },
};
</script>
