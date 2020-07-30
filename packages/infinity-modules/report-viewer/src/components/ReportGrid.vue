<template>
  <ag-grid-vue
    :sideBar="true"
    :rowData="rowData"
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
import { mapState, mapMutations, mapGetters } from 'vuex';

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
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  computed: {
    ...mapState('reports', ['report']),
    ...mapGetters('reports', ['isBaseReport', 'gridObject']),
  },
  watch: {
    report(val) {
      if (val && val.cols) {
        this.columnDefs = val.cols.map((col) => ({
          headerName: col.description,
          field: col.name,
          colId: col.name,
          filter: col.type === 'long' || col.type === 'number'
            ? 'agNumberColumnFilter'
            : undefined,
        }));
      }
      if (val && val.reportData) {
        this.rowData = val.reportData;
      }
    },
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
        const state = JSON.parse(this.gridObject);
        this.setState(state);
      } else {
        this.resetState();
      }
    },
    setState(state) {
      this.gridColumnApi.setColumnState(state.colState);
      this.gridColumnApi.setColumnGroupState(state.groupState);
      this.gridApi.setSortModel(state.sortState);
      this.gridApi.setFilterModel(state.filterState);
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
