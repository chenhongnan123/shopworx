<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Raw Data</span>
    </portal>
    <v-toolbar
      flat
      dense
      class="stick"
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <v-col cols="2" md="2" lg="2">
        <!-- <v-select
          filled
          label="Select Element"
          :items="masterItems"
          item-text="title"
          hide-details
          single-line
          return-object
          v-model="selectedLine"
          @change="onElementSelect"
        >
        </v-select> -->
        <v-autocomplete
            :items="masterItems"
            outlined
            dense
            hide-details
            v-model="selectedProcess"
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
      </v-col>
      <v-spacer></v-spacer>
      <report-date-picker />
      <report-chart-type />
      <export-report @on-export="onExport"/>
    </v-toolbar>
    <template>
      <v-container fluid class="py-0">
      <ag-grid-vue
        :sideBar="true"
        v-model="rowData"
        multiSortKey="ctrl"
        rowGroupPanelShow="always"
        rowSelection="multiple"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
        :defaultColDef="defaultColDef"
        :suppressRowClickSelection="true"
        style="width: 100%; height: 450px;"
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
      ></ag-grid-vue>
      <v-row justify="center" class="mt-2">
        <v-col cols="12" xl="10" class="py-0">
          <report-chart />
        </v-col>
      </v-row>
    </v-container>
  </template>
</div>
</template>

<script>
import {
  mapActions,
  mapGetters,
  mapState,
  mapMutations,
} from 'vuex';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue';
import ReportChart from '../components/ReportChart.vue';
import ReportDatePicker from '../components/toolbar/ReportDatePicker.vue';
import ReportChartType from '../components/toolbar/ReportChartType.vue';
import ExportReport from '../components/toolbar/ExportReport.vue';

export default {
  name: 'ProductionLog',
  components: {
    AgGridVue,
    ReportChart,
    ReportDatePicker,
    ReportChartType,
    ExportReport,
  },
  data() {
    return {
      rowData: [],
      columnDefs: [],
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      id: null,
      gridApi: null,
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
    this.setRowData();
    this.setColumnDefs();
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.gridApi.sizeColumnsToFit();
  },
  computed: {
    ...mapState('rawdata', ['records', 'dateRange', 'report']),
    ...mapGetters('rawdata', ['masterItems', 'getTags']),
    tags() {
      return this.getTags(this.id, 4);
    },
  },
  async created() {
    await this.getElements();
    console.log(this.masterItems);
  },
  watch: {
    dateRange() {
      this.fetchDateRecords();
    },
  },
  methods: {
    ...mapMutations('rawdata', ['setReport', 'setGridState']),
    ...mapActions('rawdata', ['getRecords', 'getElements', 'getAssets']),
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
      console.log(state);
      this.setGridState(JSON.stringify(state));
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
      this.tags.forEach((element) => {
        const data = colState.find((f) => f.colId === element.tagName);
        console.log(data);
        if (data) {
          element.hide = data.hide;
        }
      });
      const data = {
        cols: this.tags,
        reportData: this.rowData,
      };
      this.setReport(data);
      this.setGridState(JSON.stringify(state));
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
      console.log(this.dateRange);
    },
    async fetchRecords() {
      this.loading = true;
      await this.getRecords({
        elementName: this.id,
        assetId: 4,
      });
      this.loading = false;
    },
    async onElementSelect(item) {
      this.id = item.to;
      await this.fetchRecords();
      await this.setColumnDefs();
      await this.setRowData();
      const data = {
        cols: this.tags,
        reportData: this.rowData,
      };
      this.setReport(data);
    },
    setRowData() {
      this.rowData = this.records;
    },
    setColumnDefs() {
      this.columnDefs = this.tags.map((tag) => ({
        headerName: `${tag.tagDescription}${tag.required ? '*' : ''}`,
        field: tag.tagName,
      }));
    },
  },
};
</script>
