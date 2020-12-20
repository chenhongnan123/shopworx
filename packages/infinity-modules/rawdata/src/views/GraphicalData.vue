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
      <v-responsive :max-width="340">
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
      </v-responsive>
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
      <report-date-picker />
      <report-chart-type />
      <export-report @on-export="onExport" />
    </v-toolbar>
    <template>
      <v-container fluid class="py-0">
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
  mapActions, mapGetters, mapState, mapMutations,
} from 'vuex';

import ReportDatePicker from '../components/toolbar/ReportDatePicker.vue';
import ReportChartType from '../components/toolbar/ReportChartType.vue';
import ExportReport from '../components/toolbar/ExportReport.vue';

export default {
  name: 'ProductionLog',
  components: {
    ReportDatePicker,
    ReportChartType,
    ExportReport,
  },
  data() {
    return {
      id: null,
      pagenumber: 0,
      pagesize: 100,
      selectedParameters: [],
    };
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
    ...mapMutations('rawdata', ['setReport', 'setGridState']),
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
        if (data) {
          element.hide = data.hide;
        }
      });
      const data = {
        cols: this.tags,
        reportData: this.rowData ? this.rowData.results : [],
      };
      this.setReport(data);
      this.setGridState(JSON.stringify(state));
    },
    async btnRefresh() {
      const today = new Date(this.dateRange[1]).getTime();
      const yesterday = new Date(this.dateRange[0]).getTime();
      this.rowData = await this.getRecordsByTagData({
        elementName: this.id,
        queryParam: `?datefrom=${yesterday}&dateto=${today}&pagenumber=${this.pagenumber}&pagesize=${this.pagesize}`,
        request: {
          tags: this.selectedParameters,
        },
      });
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
      if (this.id.includes('real_') || this.id.includes('process_')) {
        const element = this.id.split('_');
        await this.getParameterCatgory({ payload: '?query=flagforrawdata==true', substation: element[1] });
        this.rowData = await this.getRecordsByTagData({
          elementName: this.id,
          queryParam: `?datefrom=${yesterday}&dateto=${today}&pagenumber=${this.pagenumber}&pagesize=${this.pagesize}`,
          request: {
            tags: this.paramList,
          },
        });
      } else {
        this.rowData = await this.getRecords({
          elementName: this.id,
          request: `?datefrom=${yesterday}&dateto=${today}&pagenumber=${this.pagenumber}&pagesize=${this.pagesize}`,
        });
      }
      this.loading = false;
      console.log(this.rowData);
      return this.rowData;
    },
    async onElementSelect(item) {
      this.pagenumber = 0;
      this.id = item.to;
      const reportData = {
        cols: this.tags,
        reportData: this.rowData ? this.rowData.results : [],
      };
      this.setReport(reportData);
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
