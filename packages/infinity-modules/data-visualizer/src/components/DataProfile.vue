<template>
  <div style="height:100%">
    <v-btn
      small
      color="primary"
      class="text-none"
      @click="visualizeData"
      :disabled="!totalCount"
    >
      Visualize data
    </v-btn>
    <ag-grid-vue
      :sideBar="sideBar"
      :animateRows="true"
      :enableCharts="true"
      class="ag-theme-balham mt-2"
      :columnDefs="columnDefs"
      :gridOptions="gridOptions"
      :enableRangeSelection="true"
      :defaultColDef="defaultColDef"
      :suppressDragLeaveHidesColumns="true"
      style="width: 100%; height: calc(100% - 38px);"
      :pagination="true"
      rowModelType="serverSide"
      serverSideStoreType="partial"
      :paginationAutoPageSize="true"
      :cacheBlockSize="pageSize"
      :popupParent="popupParent"
    />
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export default {
  name: 'DataProfile',
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [],
      gridApi: null,
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      sideBar: null,
      statusBar: null,
      pageNumber: 0,
      pageSize: 100,
      payload: null,
      popupParent: null,
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.defaultColDef = {
      filter: false,
      sortable: false,
      resizable: true,
    };
    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            syncLayoutWithGrid: true,
          },
        },
      ],
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    console.log(document.getElementById('app-container'));
    this.popupParent = document.getElementById('app-container');
  },
  computed: {
    ...mapState('dataVisualizer', ['columns', 'totalCount']),
  },
  methods: {
    ...mapActions('dataVisualizer', ['getRecords']),
    getColumnFilter(dataType) {
      const type = dataType.toLowerCase();
      switch (type) {
        case 'long':
          return 'agNumberColumnFilter';
        case 'double':
          return 'agNumberColumnFilter';
        case 'number':
          return 'agNumberColumnFilter';
        case 'integer':
          return 'agNumberColumnFilter';
        default:
          return 'agTextColumnFilter';
      }
    },
    enableColumnValue(dataType) {
      const type = dataType.toLowerCase();
      switch (type) {
        case 'long':
          return true;
        case 'double':
          return true;
        case 'number':
          return true;
        case 'integer':
          return true;
        default:
          return false;
      }
    },
    fetchRecords() {
      this.pageNumber += 1;
      const { pageNumber, pageSize } = this;
      return this.getRecords({
        ...this.payload,
        pageNumber,
        pageSize,
      });
    },
    setRowData(payload) {
      this.pageNumber = 0;
      this.payload = payload;
      const datasource = new window.ServerSideDatasource(this.fetchRecords);
      this.gridApi.setServerSideDatasource(datasource);
    },
    setColumnDefs() {
      this.columnDefs = this.columns.map((c) => ({
        headerName: c.description,
        field: c.name,
        colId: c.name,
        filter: this.getColumnFilter(c.dataType),
        enableValue: this.enableColumnValue(c.dataType),
      }));
    },
    visualizeData() {
      var params = {
        cellRange: {
          columns: this.payload.tags,
        },
        chartType: 'line',
        chartThemeOverrides: {
          common: {
            title: {
              enabled: false,
            },
            legend: { enabled: false },
            navigator: { enabled: true },
          },
        },
        unlinkChart: true,
      };
      this.gridApi.createRangeChart(params);
    },
  },
  watch: {
    columns() {
      this.setColumnDefs();
    },
  },
};

window.ServerSideDatasource = (fetchRecords) => ({
  getRows: async (params) => {
    const { startRow, endRow } = params.request;
    const data = await fetchRecords();
    if (data) {
      const currentLastRow = startRow + data.results.length;
      const lastRow = currentLastRow < endRow ? currentLastRow : undefined;
      const response = {
        rowData: data.results,
        rowCount: lastRow,
      };
      params.success(response);
    } else {
      params.fail();
    }
  },
});
</script>
