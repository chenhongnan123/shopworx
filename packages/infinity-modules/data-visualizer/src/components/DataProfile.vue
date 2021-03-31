<template>
  <ag-grid-vue
    :sideBar="sideBar"
    :animateRows="true"
    :enableCharts="true"
    :statusBar="statusBar"
    pivotPanelShow="always"
    class="ag-theme-balham"
    :columnDefs="columnDefs"
    rowGroupPanelShow="always"
    :gridOptions="gridOptions"
    :enableRangeSelection="true"
    :defaultColDef="defaultColDef"
    :suppressDragLeaveHidesColumns="true"
    style="width: 100%; height: 100%;"
  />
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
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
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.defaultColDef = {
      filter: true,
      sortable: true,
      resizable: true,
    };
    this.statusBar = {
      statusPanels: [
        {
          statusPanel: 'agTotalAndFilteredRowCountComponent',
          align: 'left',
        },
        { statusPanel: 'agAggregationComponent' },
      ],
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
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
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
    this.gridApi.setRowData([]);
  },
  computed: {
    ...mapState('dataVisualizer', [
      'records',
      'columns',
      'totalCount',
    ]),
  },
  methods: {
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
    setRowData() {
      this.gridApi.setRowData(null);
      this.gridApi.showLoadingOverlay();
      if (this.records) {
        this.gridApi.setRowData(this.records);
      }
    },
    setColumnDefs() {
      this.columnDefs = this.columns.map((c) => ({
        headerName: c.description,
        field: c.name,
        colId: c.name,
        filter: this.getColumnFilter(c.dataType),
        enableValue: this.enableColumnValue(c.dataType),
        enableRowGroup: c.name === 'mainid',
      }));
    },
  },
  watch: {
    columns() {
      this.setColumnDefs();
    },
    records() {
      this.setRowData();
    },
  },
};
</script>
