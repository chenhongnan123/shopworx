<template>
<div>
  <div id="chart" :class="agGridTheme" v-show="showChart"></div>
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
    :class="`${agGridTheme} mt-2`"
    :localeText="agGridLocaleText"
    :defaultColDef="defaultColDef"
    :style="`width: 100%; height: ${showChart ? '450' : '600'}px;`"
    @sort-changed="onStateChange"
    @filter-changed="onStateChange"
    @column-pinned="onStateChange"
    @column-visible="onStateChange"
    @column-resized="onStateChange"
    @column-moved="onStateChange"
    @column-pivot-mode-changed="onPivotModeChange"
    @column-pivot-changed="onStateChange"
    @column-row-group-changed="onStateChange"
    @column-value-changed="onStateChange"
    @first-data-rendered="visualizeData"
    :customChartThemes="customChartThemes"
    :chartThemes="chartThemes"
  ></ag-grid-vue>
</div>
</template>

<script>
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
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
      aggFunc: null,
      gridApi: null,
      columnDefs: [],
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      rowGroupPanelShow: null,
      chartThemes: null,
      customChartThemes: null,
    };
  },
  created() {
    this.gridOptions = {
      groupDefaultExpanded: -1,
    };
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
    this.customChartThemes = {
      shopworxTheme: {
        baseTheme: 'ag-pastel',
        palette: {
          fills: [
            '#354493',
            '#21C77C',
            '#2A2F36',
            '#01C1E2',
            '#0172CA',
            '#5C68A8',
            '#4CD195',
            '#3E4249',
          ],
          strokes: ['black'],
        },
      },
    };
    this.chartThemes = [
      'shopworxTheme',
      'ag-default',
      'ag-material',
      'ag-pastel',
      'ag-vivid',
      'ag-solar',
    ];
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  computed: {
    ...mapState('helper', ['isDark']),
    ...mapGetters('helper', ['agGridLocaleText', 'agGridTheme']),
    ...mapState('reports', ['report', 'reportMapping', 'showChart']),
    ...mapGetters('reports', ['isBaseReport', 'gridObject', 'reportTitle']),
    aggType() {
      return this.reportMapping ? this.$i18n.t(`${this.reportMapping.aggregationType}`) : '';
    },
  },
  watch: {
    report(val) {
      if (val) {
        this.aggFunc = val.aggFunc || null;
      }
      if (val && val.cols) {
        this.columnDefs = val.cols.map((col) => ({
          headerName: this.getHeaderName(col),
          field: col.name,
          colId: col.name,
          filter: this.getColumnFilter(col),
        }));
      }
      if (val && val.reportData) {
        this.rowData = val.reportData;
        this.visualizeData();
      }
    },
  },
  methods: {
    ...mapMutations('reports', ['setGridState']),
    getHeaderName(col) {
      switch (this.$i18n.locale) {
        case 'zhHans':
          return col.description_cn || col.description;
        case 'hi':
          return col.description_hi || col.description;
        case 'th':
          return col.description_th || col.description;
        case 'de':
          return col.description_de || col.description;
        default:
          return col.description;
      }
    },
    visualizeData() {
      const chartContainer = document.getElementById('chart');
      chartContainer.innerHTML = '';
      chartContainer.style.height = 0;
      if (this.gridColumnApi.isPivotMode()) {
        this.createPivotChart(chartContainer);
      } else {
        this.createRangeChart(chartContainer);
      }
      chartContainer.style.height = '350px';
    },
    createRangeChart(chartContainer) {
      const param = {
        chartType: 'groupedColumn',
        cellRange: {
          columns: this.columnDefs.map((c) => c.field),
        },
        aggFunc: this.aggFunc,
        chartThemeOverrides: {
          common: {
            background: {
              visible: false,
            },
            title: {
              enabled: false,
            },
            legend: { enabled: true },
            navigator: {
              enabled: true,
              height: 15,
            },
          },
        },
        chartContainer,
      };
      this.gridApi.createRangeChart(param);
    },
    createPivotChart(chartContainer) {
      const param = {
        chartType: 'groupedColumn',
        chartThemeOverrides: {
          common: {
            background: {
              visible: false,
            },
            title: {
              enabled: false,
            },
            legend: { enabled: true },
            navigator: {
              enabled: true,
              height: 15,
            },
          },
        },
        chartContainer,
      };
      this.gridApi.createPivotChart(param);
    },
    getColumnFilter(col) {
      const type = col && col.type.toLowerCase();
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
    onStateChange() {
      const colState = this.gridColumnApi.getColumnState();
      const groupState = this.gridColumnApi.getColumnGroupState();
      const filterState = this.gridApi.getFilterModel();
      const isPivotMode = this.gridColumnApi.isPivotMode();
      const state = {
        colState,
        groupState,
        filterState,
        isPivotMode,
      };
      this.setGridState(JSON.stringify(state));
    },
    onPivotModeChange() {
      this.visualizeData();
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
      this.gridApi.setFilterModel(state.filterState);
      this.gridColumnApi.setPivotMode(state.isPivotMode);
    },
    resetState() {
      this.gridColumnApi.resetColumnState();
      this.gridColumnApi.resetColumnGroupState();
      this.gridApi.setFilterModel(null);
      this.gridColumnApi.setPivotMode(false);
    },
    exportGridCSV() {
      const params = {
        fileName: `${this.reportTitle}_${this.aggType}-${new Date().toLocaleString()}`,
      };
      this.gridApi.exportDataAsCsv(params);
    },
    exportGridExcel() {
      const params = {
        fileName: `${this.reportTitle}_${this.aggType}-${new Date().toLocaleString()}`,
      };
      this.gridApi.exportDataAsExcel(params);
    },
  },
};
</script>
