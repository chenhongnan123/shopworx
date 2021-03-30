<template>
  <ag-grid-vue
    :rowData="[]"
    class="ag-theme-balham"
    :columnDefs="[]"
    :gridOptions="gridOptions"
    :defaultColDef="defaultColDef"
    :suppressDragLeaveHidesColumns="true"
    style="width: 100%; height: 100%;"
  />
</template>

<script>
/* eslint-disable */
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
      gridApi: null,
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.defaultColDef = {
      filter: true,
      sortable: true,
      resizable: true,
      enableValue: true,
      enablePivot: true,
      floatingFilter: true,
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
};
</script>
