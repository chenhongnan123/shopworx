<template>
  <ag-grid-vue
    :sideBar="sideBar"
    :animateRows="true"
    :enableCharts="true"
    class="ag-theme-balham"
    :columnDefs="columnDefs"
    :gridOptions="gridOptions"
    :enableRangeSelection="true"
    :defaultColDef="defaultColDef"
    :suppressDragLeaveHidesColumns="true"
    style="width: 100%; height: 100%;"
    :pagination="true"
    rowModelType="serverSide"
    serverSideStoreType="partial"
    :paginationAutoPageSize="true"
    :cacheBlockSize="pageSize"
  />
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
  },
  computed: {
    ...mapState('dataVisualizer', ['columns']),
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
