<template>
  <ag-grid-vue
    :sideBar="true"
    v-model="rowData"
    multiSortKey="ctrl"
    :animateRows="true"
    :enableCharts="true"
    pivotPanelShow="always"
    :columnDefs="columnDefs"
    rowGroupPanelShow="always"
    :gridOptions="gridOptions"
    :enableRangeSelection="true"
    class="ag-theme-balham mt-2"
    :defaultColDef="defaultColDef"
    style="width: 100%; height: 450px;"
    @sort-changed="onStateChange"
    @filter-changed="onStateChange"
    @column-pinned="onStateChange"
    @column-visible="onStateChange"
    @column-resized="onStateChange"
    @column-moved="onStateChange"
    @column-row-group-changed="onStateChange"
    @column-pivot-changed="onStateChange"
    @column-value-changed="onStateChange"
  ></ag-grid-vue>
</template>

<script>
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'ReportGrid',
  components: {
    AgGridVue,
  },
  data() {
    return {
      rowData: [],
      gridApi: null,
      columnDefs: [],
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      rowGroupPanelShow: null,
    };
  },
  created() {
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
  beforeMount() {
    this.columnDefs = [
      { headerName: 'Make', field: 'make' },
      { headerName: 'Model', field: 'model' },
      { headerName: 'Price', field: 'price', filter: 'agNumberColumnFilter' },
    ];
    this.rowData = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 },
    ];
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.restoreState();
  },
  computed: {
    ...mapGetters('reports', ['isBaseReport', 'gridObject']),
  },
  methods: {
    ...mapMutations('reports', ['setGridState']),
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
    restoreState() {
      if (!this.isBaseReport) {
        this.setGridState(this.gridObject);
        const state = JSON.parse(this.gridObject);
        this.gridColumnApi.setColumnState(state.colState);
        this.gridColumnApi.setColumnGroupState(state.groupState);
        this.gridApi.setSortModel(state.sortState);
        this.gridApi.setFilterModel(state.filterState);
      } else {
        this.resetState();
      }
    },
    resetState() {
      this.gridColumnApi.resetColumnState();
      this.gridColumnApi.resetColumnGroupState();
      this.gridApi.setSortModel(null);
      this.gridApi.setFilterModel(null);
    },
  },
};
</script>
