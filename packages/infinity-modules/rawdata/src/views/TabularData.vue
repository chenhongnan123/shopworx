<template>
  <div style="height: 100%">
    <portal to="app-header">
      Data Visualizer
    </portal>
    <v-toolbar
      flat
      dense
      class="stick"
      :color="$vuetify.theme.dark ? '#121212' : ''"
    >
      <v-responsive :max-width="340">
        <v-autocomplete
          :items="masterItems"
          filled
          dense
          hide-details
          name="name"
          label="Select Element"
          item-text="title"
          single-line
          return-object
          @change="onElementSelect"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-responsive>
      <!-- <v-responsive :max-width="340">
        <v-autocomplete
          :items="paramList"
          class="ml-2"
          filled
          dense
          multiple
          chips
          deletable-chips
          hide-details
          label="Select Parameters"
          single-line
          return-object
          v-model="selectedParameters"
        >
        </v-autocomplete>
      </v-responsive> -->
      <v-spacer></v-spacer>
      <v-btn
        small
        outlined
        v-on="on"
        color="primary"
        class="text-none ml-2 mr-2"
        @click="btnRefresh"
      >
        Load Data
      </v-btn>
      <v-text-field
          class="mt-8"
          type="datetime-local"
          v-model="fromdate"
          :label="$t('From date')"
          @change="setDatefunction"
      ></v-text-field>
      <v-text-field
          class="mt-8 ml-4"
          type="datetime-local"
          v-model="todate"
          :label="$t('To date')"
          @change="setDatefunction"
      ></v-text-field>
      <!-- <report-date-picker /> -->
      <export-report @on-export="onExport" />
    </v-toolbar>
    <template>
      <v-container fluid class="py-0">
      <ag-grid-vue
        :sideBar="true"
        multiSortKey="ctrl"
        rowGroupPanelShow="always"
        rowSelection="multiple"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
        :defaultColDef="defaultColDef"
        :suppressRowClickSelection="true"
        style="width: 100%; height: 550px;"
        @sort-changed="onStateChange"
        @filter-changed="onStateChange"
        @column-pinned="onStateChange"
        @column-visible="onStateChangeVisible"
        @column-resized="onStateChange"
        @column-moved="onStateChange"
        @column-row-group-changed="onStateChange"
        @column-pivot-changed="onStateChange"
        @column-value-changed="onStateChange"
        :pagination="true"
        rowModelType="serverSide"
        :paginationPageSize="pagesize"
        :cacheBlockSize="pagesize"
      ></ag-grid-vue>
      <!-- <v-row justify="center" class="mt-2">
        <v-col cols="12" xl="10" class="py-0">
          <report-chart />
        </v-col>
      </v-row> -->
    </v-container>
  </template>
</div>
</template>

<script>
import {
  mapActions, mapGetters, mapState, mapMutations,
} from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
// import ReportChart from '../components/ReportChart.vue';
// import ReportDatePicker from '../components/toolbar/ReportDatePicker.vue';
// import ReportChartType from '../components/toolbar/ReportChartType.vue';
import ExportReport from '../components/toolbar/ExportReport.vue';

export default {
  name: 'ProductionLog',
  components: {
    AgGridVue,
    // ReportChart,
    // ReportDatePicker,
    // ReportChartType,
    ExportReport,
  },
  data() {
    return {
      parametersChanged: false,
      rowData: null,
      columnDefs: [],
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      id: null,
      gridApi: null,
      pagenumber: 0,
      pagesize: 100,
      selectedParameters: [],
      fromdate: null,
      todate: null,
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.defaultColDef = {
      filter: true,
      editable: true,
      resizable: true,
      floatingFilter: true,
      checkboxSelection: this.isFirstColumn,
      headerCheckboxSelection: this.isFirstColumn,
      headerCheckboxSelectionFilteredOnly: this.isFirstColumn,
    };
    this.setColumnDefs();
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.gridApi.sizeColumnsToFit();
  },
  computed: {
    ...mapState('rawdata', ['records', 'dateRange', 'report', 'paramList', 'categoryList']),
    ...mapGetters('rawdata', ['masterItems', 'getTags']),
    tags() {
      return this.getTags(this.id, 4);
    },
  },
  async created() {
    await this.getElements();
  },
  watch: {
    dateRange() {
      this.fetchDateRecords();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('rawdata', ['setReport', 'setGridState', 'setDateRange']),
    ...mapActions('rawdata', ['getRecords', 'getElements', 'getAssets', 'getParameters', 'getParameterCatgory', 'getRecordsByTagData']),
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
    setDatefunction() {
      if (this.fromdate && this.todate) {
        this.setDateRange([this.fromdate, this.todate]);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_BOTH_DATES',
        });
      }
    },
    onStateChangeVisible() {
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
      this.parametersChanged = true;
      // this.tags.forEach((element) => {
      //   const data = colState.find((f) => f.colId === element.tagName);
      //   if (data) {
      //     element.hide = data.hide;
      //   }
      // });
      // const data = {
      //   cols: this.tags,
      //   reportData: this.rowData ? this.rowData.results : [],
      // };
      // this.setReport(data);
      this.setGridState(JSON.stringify(state));
      this.setAlert({
        show: true,
        type: 'success',
        message: 'LOAD_DATA',
      });
    },
    async btnRefresh() {
      await this.setRowData();
    },
    onExport(e) {
      this.exportReport(e);
    },
    exportReport(type) {
      if (type === 'gridCSV') {
        this.exportGridCSV();
      } else if (type === 'gridExcel') {
        this.exportGridExcel();
      }
    },
    exportGridCSV() {
      const params = {
        fileName: `${this.id}-${new Date().toLocaleString()}`,
      };
      this.gridApi.exportDataAsCsv(params);
    },
    exportGridExcel() {
      const params = {
        fileName: `${this.id}-${new Date().toLocaleString()}`,
      };
      this.gridApi.exportDataAsExcel(params);
    },
    async fetchDateRecords() {
      this.pagenumber = 0;
      await this.setRowData();
    },
    async fetchRecords() {
      this.pagenumber += 1;
      this.loading = true;
      const today = new Date(this.dateRange[1]).getTime();
      const yesterday = new Date(this.dateRange[0]).getTime();
      if ((this.id.includes('real_') || this.id.includes('process_')) && this.parametersChanged === false) {
        const element = this.id.split('_');
        await this.getParameterCatgory({ payload: '?query=flagforrawdata==true', substation: element[1] });
        const changeTags = this.tags;
        await changeTags.forEach((f) => {
          const checkTag = this.paramList.filter((p) => p === f.tagName);
          f.hide = true;
          if (checkTag.length > 0) {
            f.hide = false;
          }
        });
        this.columnDefs = [];
        this.columnDefs = changeTags.map((tag) => ({
          headerName: `${tag.tagDescription}${tag.required ? '*' : ''}`,
          field: tag.tagName,
          hide: tag.hide,
        }));
        this.columnDefs.push({
          headerName: 'Created Timestamp',
          field: 'createdTimestamp',
          hide: false,
        });
        this.rowData = await this.getRecordsByTagData({
          elementName: this.id,
          queryParam: `?datefrom=${yesterday}&dateto=${today}&pagenumber=${this.pagenumber}&pagesize=${this.pagesize}`,
          request: {
            tags: this.paramList,
          },
        });
      } else if ((this.id.includes('real_') || this.id.includes('process_')) && this.parametersChanged === true) {
        const colState = this.gridColumnApi.getColumnState();
        const tagList = [];
        colState.forEach((f) => {
          if (f.hide === false) {
            if (f.colId.includes('_1')) {
              const data = f.colId.split('_1');
              tagList.push(data[0]);
            } else {
              tagList.push(f.colId);
            }
          }
        });
        this.rowData = await this.getRecordsByTagData({
          elementName: this.id,
          queryParam: `?datefrom=${yesterday}&dateto=${today}&pagenumber=${this.pagenumber}&pagesize=${this.pagesize}`,
          request: {
            tags: tagList,
          },
        });
      } else {
        this.rowData = await this.getRecords({
          elementName: this.id,
          request: `?datefrom=${yesterday}&dateto=${today}&pagenumber=${this.pagenumber}&pagesize=${this.pagesize}`,
        });
      }
      this.loading = false;
      return this.rowData;
    },
    async onElementSelect(item) {
      this.parametersChanged = false;
      this.pagenumber = 0;
      this.id = item.to;
      await this.setColumnDefs();
      await this.setRowData();
      const reportData = {
        cols: this.tags,
        reportData: this.rowData ? this.rowData.results : [],
      };
      this.setReport(reportData);
    },
    setRowData() {
      const datasource = new window.ServerSideDatasource(this.fetchRecords);
      this.gridApi.setServerSideDatasource(datasource);
    },
    setColumnDefs() {
      if (this.parametersChanged === false) {
        this.columnDefs = this.tags.map((tag) => ({
          headerName: `${tag.tagDescription}${tag.required ? '*' : ''}`,
          field: tag.tagName,
          hide: true,
        }));
        if (this.id.includes('real_') || this.id.includes('process_')) {
          this.columnDefs.push({
            headerName: 'Created Timestamp',
            field: 'createdTimestamp',
            hide: false,
          });
        }
      }
    },
  },
};

window.ServerSideDatasource = (fetchRecords) => ({
  getRows: async (params) => {
    const data = await fetchRecords();
    const { startRow, endRow } = params.request;
    const pagesize = endRow - startRow;
    const pagenumber = (endRow / pagesize);
    if (data) {
      const response = {
        rows: data.results,
        lastRow: pagenumber * pagesize >= data.totalCount
          ? data.totalCount
          : -1,
      };
      params.successCallback(response.rows, response.lastRow);
    } else {
      params.failCallback();
    }
  },
});

</script>
