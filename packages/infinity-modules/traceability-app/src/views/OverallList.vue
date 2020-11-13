<template>
  <div style="height:50%">
    <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <ag-grid-vue
          :sideBar="true"
          v-model="componentList"
          multiSortKey="ctrl"
          :animateRows="true"
          :enableCharts="true"
          pivotPanelShow="always"
          :columnDefs="headers"
          rowGroupPanelShow="always"
          :gridOptions="gridOptions"
          :enableRangeSelection="false"
          class="ag-theme-balham mt-2"
          :defaultColDef="defaultColDef"
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
          @cell-clicked = "onCellClicked"
          :pagination="true"
        ></ag-grid-vue>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue';

export default {
  name: 'Planning',
  components: {
    AgGridVue,
  },
  data() {
    return {
      fromdate: null,
      todate: null,
      rowData: [],
      searchMainID: null,
      selectedSubLine: null,
      dates: [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
      menu: false,
      selectedSubStation: null,
      loading: false,
      isFullScreen: false,
      processParametersheader: [],
      headers: [
        {
          headerName: 'Created Date',
          field: 'createdTimestamp',
          resizable: true,
        },
        {
          headerName: 'Main ID',
          field: 'mainid',
          rowGroup: true,
          resizable: true,
        },
        {
          headerName: 'Sub station',
          field: 'substationid',
          resizable: true,
        },
        {
          headerName: 'Component name',
          field: 'componentname',
          resizable: true,
        },
        {
          headerName: 'Component value',
          field: 'componentvalue',
          resizable: true,
        },
        {
          headerName: 'Bound status',
          field: 'boundstatus',
          resizable: true,
        },
        {
          headerName: 'Rework status',
          field: 'reworkstatus',
          resizable: true,
        },
        {
          headerName: 'Quality status',
          field: 'qualitystatus',
          resizable: true,
        },
      ],
      prevDisabled: false,
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
      'componentList',
      'partStatusList',
      'componentData',
      'trecibilityState']),
  },
  async created() {
    if (this.trecibilityState.selectedSubLine) {
      await this.btnSearchCheckOut();
    }
  },
  beforeMount() {
    this.componentList = null;
    this.partStatusList = null;
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
    this.restoreState();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('traceabilityApp', ['setTrecibilityState']),
    ...mapMutations('traceabilityApp',
      ['setCheckOutList',
        'setPartStatusList',
        'setRecipeViewState',
        'setSubStationInfo',
      ]),
    ...mapActions('element', ['getRecords']),
    ...mapActions('traceabilityApp',
      ['getLines',
        'getSubLines',
        'getStations',
        'getSubStations',
        'getComponentList',
        'getProcessElement',
        'getProcessParameters',
        'getPartStatus',
        'getComponentData']),
    async handleSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getSubStations(query);
    },
    restoreState() {
      if (!this.isBaseReport) {
        const state = JSON.parse(this.gridObject);
        this.gridColumnApi.setColumnState(state.colState);
        this.gridColumnApi.setColumnGroupState(state.groupState);
        this.gridApi.setSortModel(state.sortState);
        this.gridApi.setFilterModel(state.filterState);
      }
    },
    async fetchRecords() {
      const records = await this.getRecords({
        elementName: 'businesshours',
      });
      const subline = this.subLineList;
      const firstSubline = subline[0].id;
      const time = records[0].starttime;
      const splitTime = time.slice(0, 2);
      const day = new Date();
      const now = day.setHours(splitTime);
      const toDate = new Date().getTime();
      await this.getComponentList(`?datefrom=${now}&dateto=${toDate}&sublineid="${firstSubline}"&pagenumber=1&pagesize=20`);
      this.gridApi = this.gridOptions.api;
      this.gridApi.expandAll();
    },
    onStateChange() {
      const colState = this.gridColumnApi.getColumnState();
      const groupState = this.gridColumnApi.getColumnGroupState();
      const sortState = this.gridApi.getSortModel();
      const filterState = this.gridApi.getFilterModel();
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
      }
      this.$refs.menu.save(this.dates);
    },
    async btnSearchCheckOut() {
      let cFlag = 0;
      const fromDate = new Date(this.trecibilityState.fromdate).getTime();
      const toDate = new Date(this.trecibilityState.todate).getTime();
      let param = '';
      if (!this.trecibilityState.searchMainID && !this.trecibilityState.selectedSubLine
         && (fromDate || toDate)) {
        cFlag = 3;
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
        cFlag = 4;
      }
      if (this.trecibilityState.selectedSubLine) {
        param += `sublineid=="${this.trecibilityState.selectedSubLine.id}"&`;
        cFlag = 2;
      }
      if (fromDate) {
        param += `datefrom=${fromDate}&`;
      }
      if (toDate) {
        param += `dateto=${toDate}`;
      }
      await this.getComponentList(param);
      this.componentList.forEach((e) => {
        if (this.subStationList.filter((s) => s.id === e.substationid).length > 0) {
          e.substationid = this.subStationList.filter((s) => s.id === e.substationid)[0].name;
          this.gridOptions.api.refreshCells();
        }
      });
      this.gridApi = this.gridOptions.api;
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
          type: 'success',
          message: 'GET_RECORDS_BY_SUBLINEID',
        });
      } else if (cFlag === 3) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'GET_RECORDS_DATE_RANGE',
        });
      } else if (cFlag === 4) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'NOT_VALID_INPUT',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'GET_RECORDS',
        });
      }
    },
    async nextSearch() {
      const pagenumber = this.pageNumber;
      const fromDate = new Date(this.trecibilityState.fromdate).getTime();
      const toDate = new Date(this.trecibilityState.todate).getTime();
      let param = '';
      if (!this.trecibilityState.searchMainID && !this.trecibilityState.selectedSubLine
         && (fromDate || toDate)) {
        param = '?';
      } else {
        param = '?query=';
      }
      if (this.trecibilityState.searchMainID) {
        param += `mainid=="${this.trecibilityState.searchMainID}"||`;
        param += `productid=="${this.trecibilityState.searchMainID}"||`;
        param += `carrierid=="${this.trecibilityState.searchMainID}"||`;
        param += `packagebatchid=="${this.trecibilityState.searchMainID}"||`;
        param += `completedproductid=="${this.trecibilityState.searchMainID}"&`;
      }
      if (this.trecibilityState.selectedSubLine) {
        param += `sublineid=="${this.trecibilityState.selectedSubLine.id}"&`;
      }
      if (fromDate) {
        param += `datefrom=${fromDate}&`;
      }
      if (toDate) {
        param += `dateto=${toDate}&`;
      }
      param += `pagenumber=${pagenumber}&pagesize=20`;
      await this.getComponentList(param);
      param += '&sortquery=modifiedtimestamp==-1';
      await this.getPartStatus(param);
      this.componentList.forEach((e) => {
        if (this.subStationList.filter((s) => s.id === e.substationid).length > 0) {
          e.substationid = this.subStationList.filter((s) => s.id === e.substationid)[0].name;
          this.gridOptions.api.refreshCells();
        }
      });
      this.partStatusList.forEach((e) => {
        if (this.subStationList.filter((s) => s.id === e.substationid).length > 0) {
          e.substationid = this.subStationList.filter((s) => s.id === e.substationid)[0].name;
          this.gridOptionsPart.api.refreshCells();
        }
      });
      this.gridApi = this.gridOptions.api;
      this.gridApi.expandAll();
      this.gridApi = this.gridOptionsPart.api;
      this.gridApi.expandAll();
      this.setAlert({
        show: true,
        type: 'success',
        message: 'Next',
      });
    },
    async prevSearch() {
      const pagenumber = this.pageNumber;
      if (pagenumber <= 1) {
        this.prevDisabled = true;
        const fromDate = new Date(this.trecibilityState.fromdate).getTime();
        const toDate = new Date(this.trecibilityState.todate).getTime();
        let param = '';
        if (!this.trecibilityState.searchMainID && !this.trecibilityState.selectedSubLine
           && (fromDate || toDate)) {
          param = '?';
        } else {
          param = '?query=';
        }
        if (this.searchMainID) {
          param += `mainid=="${this.trecibilityState.searchMainID}"||`;
          param += `productid=="${this.trecibilityState.searchMainID}"||`;
          param += `carrierid=="${this.trecibilityState.searchMainID}"||`;
          param += `packagebatchid=="${this.trecibilityState.searchMainID}"||`;
          param += `completedproductid=="${this.trecibilityState.searchMainID}"&`;
        }
        if (this.trecibilityState.selectedSubLine) {
          param += `sublineid=="${this.trecibilityState.selectedSubLine.id}"&`;
        }
        if (fromDate) {
          param += `datefrom=${fromDate}&`;
        }
        if (toDate) {
          param += `dateto=${toDate}&`;
        }
        param += `pagenumber=${pagenumber}&pagesize=20`;
        await this.getComponentList(param);
        param += '&sortquery=modifiedtimestamp==-1';
        await this.getPartStatus(param);
        this.componentList.forEach((e) => {
          if (this.subStationList.filter((s) => s.id === e.substationid).length > 0) {
            e.substationid = this.subStationList.filter((s) => s.id === e.substationid)[0].name;
            this.gridOptions.api.refreshCells();
          }
        });
        this.partStatusList.forEach((e) => {
          if (this.subStationList.filter((s) => s.id === e.substationid).length > 0) {
            e.substationid = this.subStationList.filter((s) => s.id === e.substationid)[0].name;
            this.gridOptionsPart.api.refreshCells();
          }
        });
        this.gridApi = this.gridOptions.api;
        this.gridApi.expandAll();
        this.gridApi = this.gridOptionsPart.api;
        this.gridApi.expandAll();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'Prev',
        });
      }
    },
    onCellClicked(node) {
      if (node.colDef.field === 'substationid') {
        const data = {
          ...node.data,
          fromdate: this.fromdate,
          todate: this.todate,
        };
        this.setRecipeViewState(0);
        this.setSubStationInfo(data);
      }
    },
  },
};
</script>
