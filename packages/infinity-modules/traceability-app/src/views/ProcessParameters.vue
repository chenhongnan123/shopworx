<template>
  <div style="height:50%">
    <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <ag-grid-vue
          :sideBar="true"
          :rowData="processParametersList"
          multiSortKey="ctrl"
          :animateRows="true"
          :enableCharts="true"
          pivotPanelShow="always"
          :columnDefs="processParametersheader"
          rowGroupPanelShow="always"
          :gridOptions="gridOptions"
          :enableRangeSelection="true"
          :class="`${agGridTheme} mt-2`"
          :defaultColDef="defaultColDef"
          :localeText="agGridLocaleText"
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
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import { AgGridVue } from 'ag-grid-vue';

export default {
  name: 'ProcessParameters',
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
      loading: false,
      isFullScreen: false,
      processParametersheader: [],
      headerForCSV: [],
      headerForCSVChinese: [],
      language: null,
      headers: [
        {
          headerName: 'Created Date',
          field: 'createdTimestamp',
          resizable: true,
        },
        {
          headerName: 'Main ID',
          field: 'mainid',
          // rowGroup: true,
          resizable: true,
        },
        {
          headerName: 'Sub station',
          field: 'substationid',
          resizable: true,
        },
        {
          headerName: 'Recipe name',
          field: 'recipename',
          resizable: true,
        },
        {
          headerName: 'Substation result',
          field: 'substationresult',
          resizable: true,
        },
        {
          headerName: 'Order name',
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
    ...mapGetters('helper', ['agGridLocaleText', 'agGridTheme']),
    dateRangeText() {
      return this.dates.join(' to ');
    },
    ...mapState('helper', ['locales']),
    ...mapState('traceabilityApp', [
      'lineList',
      'subLineList',
      'stationList',
      'subStationList',
      'checkOutList',
      'partStatusList',
      'subStationInfo',
      'parametersList',
      'trecibilityState']),
    currentLocale: {
      get() {
        return this.$i18n.locale;
      },
    },
  },
  async created() {
    this.language = this.currentLocale;
    await this.getSubStations();
    // const {
    //   substationid,
    //   mainid,
    //   fromdate,
    //   todate,
    // } = this.subStationInfo;
    // const subStation = this.subStationList.filter((i) => i.name === substationid)[0];
    // this.selectedSubStation = subStation;
    // this.searchMainID = mainid;
    // this.fromdate = fromdate;
    // this.todate = todate;
    // if (substationid || mainid || fromdate || todate) {
    //   await this.btnSearchProcessParameters();
    // } else {
    //   await this.btnSearchProcessParameters();
    //   // await this.fetchRecords();
    // }
  },
  beforeMount() {
    this.gridOptions = {};
    this.defaultColDef = {
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
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    // this.restoreState();
  },
  watch: {
    processParametersList: {
      handler(val) {
        if (val.length > 0) {
          this.$root.$emit('dataLoded', true);
        }
      },
    },
  },
  beforeDestroy() {
    this.$root.$off('dataLoded', false);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('element', ['getRecords']),
    ...mapMutations('traceabilityApp', ['setTrecibilityState']),
    ...mapActions('traceabilityApp',
      ['getLines',
        'getSubLines',
        'getStations',
        'getComponentList',
        'getSubStations',
        'getCheckOutLists',
        'getProcessElement',
        'getProcessParameters',
        'getTraceabilityData',
        'getParametersList',
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
      const time = records[0].starttime;
      const splitTime = time.slice(0, 2);
      const day = new Date();
      const now = day.setHours(splitTime);
      const toDate = new Date().getTime();
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
      const query = `?query=stationid=="${item.id}"`;
      await this.getSubStations(query);
    },
    async exportGridExcel() {
      const name = 'process_data';
      const params = {
        fileName: `${name}-${new Date().toLocaleString()}`,
      };
      await this.gridApi.exportDataAsExcel(params);
    },
    async exportGridCSV() {
      const name = 'process_data';
      const params = {
        fileName: `${name}-${new Date().toLocaleString()}`,
      };
      await this.gridApi.exportDataAsCsv(params);
    },
    async btnSearchProcessParameters() {
      this.processParametersList = [];
      this.processParametersListFirst = [];
      const fromDate = new Date(this.trecibilityState.fromdate).getTime();
      const toDate = new Date(this.trecibilityState.todate).getTime();
      this.headerForCSV = [];
      this.headerForCSVChinese = [];
      this.headerForCSV.push('createdTimestamp', 'mainid', 'completedproductid');
      this.headerForCSVChinese.push('创建日期', '主条码', '成品码');
      this.processParametersheader = [];
      if (this.language === 'zhHans') {
        this.processParametersheader.push(
          {
            headerName: this.$t('Created Date'),
            field: 'createdTimestamp',
            resizable: true,
          },
          {
            headerName: this.$t('Completed Product ID'),
            field: 'completedproductid',
            resizable: true,
          },
        );
      } else {
        this.processParametersheader.push(
          {
            headerName: this.$t('Created Date'),
            field: 'createdTimestamp',
            resizable: true,
          },
          {
            headerName: this.$t('Completed Product ID'),
            field: 'completedproductid',
            resizable: true,
          },
        );
      }
      // let param = `?${(fromDate || toDate) ? '' : 'query='}`;
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
      // await this.getPartStatus(param);
      // get tags of traceability element
      console.log(cFlag);
      const elementDetails = await this.getProcessElement('traceability');
      if (this.language === 'zhHans') {
        await this.getSubStations(`?query=sublineid=="${this.trecibilityState.selectedSubLine.id}"`);
        await Promise.all(this.subStationList.map(async (s) => {
          const paramRecord = await this.getParametersList(`?query=substationid=="${s.id}"%26%26
            (parametercategory=="15"%7C%7Cparametercategory=="17"%7
            C%7Cparametercategory=="18")`);
          if (paramRecord.length > 0) {
            await Promise.all(paramRecord.map((p) => {
              this.processParametersheader.push(
                {
                  headerName: p.chinesedescription,
                  field: `${s.id}_${p.name}`,
                  resizable: true,
                },
              );
              return true;
            }));
          }
        }));
      } else {
        elementDetails.tags.forEach((element) => {
          this.processParametersheader.push(
            {
              headerName: element.tagDescription,
              field: element.tagName,
              resizable: true,
            },
          );
        });
      }
      // get traceability data
      this.processParametersList = await this.getTraceabilityData(param);
    },
  },
};
</script>
