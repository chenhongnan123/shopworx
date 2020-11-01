<template>
  <v-card
    flat
    class="transparent"
    style="height: 100%"
  >
  <!-- <v-row justify="center"
  >
        <v-col cols="12" xl="10" class="py-0"> -->
             <!-- <v-toolbar
              flat
              dense
              lass="stick"
              :color="$vuetify.theme.dark ? '#121212': ''"
              >
              <v-spacer></v-spacer> -->
            <!-- <v-text-field
            class="mt-10 mr-2"
            type="date"
            v-model="fromdate"
            label="From date"
            dense
            ></v-text-field>
            <v-text-field
            class="mt-10 mr-2"
            type="date"
            v-model="todate"
            label="To date"
            dense
            ></v-text-field>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="fetchRecords">
            Search
          </v-btn> -->
              <!-- <v-btn
               v-if="this.showUpdateBtn"
              small color="success" outlined class="text-none ml-2" @click="updateValue">
            Update
            </v-btn> -->
            <!-- </v-toolbar> -->
        <!-- </v-col>
      </v-row> -->
    <ag-grid-vue
      v-model="rowData"
      rowSelection="multiple"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :gridOptions="gridOptions"
      :defaultColDef="defaultColDef"
      :suppressRowClickSelection="true"
      style="width: 100%; height: 400px;"
      @selection-changed="onSelectionChanged"
      @cellValueChanged="editMethod"
    ></ag-grid-vue>
  </v-card>
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
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import { AgGridVue } from 'ag-grid-vue';

export default {
  name: 'BaseMaster',
  components: {
    AgGridVue,
  },
  props: {
    assetId: {
      type: Number,
      default: 0,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      rowData: [],
      isValid: true,
      gridApi: null,
      columnDefs: [],
      filteredTags: [],
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      rowsSelected: false,
      showUpdateBtn: false,
      updateData: [],
    };
  },
  created() {
    this.fetchRecords();
    this.zipService = ZipService;
  },
  computed: {
    ...mapState('masters', ['records']),
    ...mapGetters('masters', ['getTags']),
    tags() {
      return this.getTags(this.id, this.assetId);
    },
  },
  watch: {
    assetId() {
      this.fetchRecords();
    },
    id() {
      this.fetchRecords();
      this.showUpdateBtn = false;
    },
    records() {
      this.setRowData();
      this.setColumnDefs();
    },
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
  methods: {
    ...mapActions('masters', ['getRecords', 'updateRecord']),
    ...mapMutations('helper', ['setAlert']),
    async fetchRecords() {
      // const fromdate = new Date(this.fromdate).getTime();
      // const todate = new Date(this.todate).getTime();
      this.loading = true;
      await this.getRecords({
        elementName: this.id,
        assetId: this.assetId,
        // fromDate: fromdate,
        // toDate: todate,
        // pageSize: 10,
        // pageNumber: 1,
      });
      this.loading = false;
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
    isFirstColumn(params) {
      const displayedColumns = params.columnApi.getAllDisplayedColumns();
      const thisIsFirstColumn = displayedColumns[0] === params.column;
      return thisIsFirstColumn;
    },
    getNewRowItem() {
      return this.tags.reduce((acc, tag) => {
        acc[tag.tagName] = null;
        return acc;
      }, {});
    },
    editMethod(event) {
      this.showUpdateBtn = true;
      this.updateData.push(event.data);
    },
    async onSelectionChanged(event) {
      this.rowsSelected = event.api.getSelectedRows().length > 0;
    },
    async updateValue() {
      const elementName = this.id;
      const data = this.updateData;
      console.log(this.updateData);
      const multipleRows = data.forEach(async (item) => {
        const changedRow = await this.updateRecord(
          {
            query: item._id, payload: item, name: elementName,
          },
        );
        console.log(changedRow);
      });
      let update = false;
      update = await Promise.all([multipleRows]);
      if (update) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'DATA_SAVED',
        });
      }
      this.showUpdateBtn = false;
      this.updateData = [];
    },
    addRow() {
      this.gridApi.applyTransaction({ add: [this.getNewRowItem()] });
    },
    deleteSelectedRows() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.gridApi.applyTransaction({ remove: selectedRows });
      this.rowsSelected = this.gridApi.getSelectedRows().length > 0;
    },
    async exportData() {
      const nameEement = this.id;
      const fileName = `${nameEement}_Master_Table`;
      const parameterSelected = this.rowData.map((item) => ({ ...item }));
      const column = parameterSelected[0].questions;
      const csvContent = [];
      parameterSelected.forEach((parameter) => {
        const arr = [];
        column.forEach((key) => {
          arr.push(parameter[key]);
        });
        csvContent.push(arr);
      });
      const csvParser = new CSVParser();
      const content = csvParser.unparse({
        fields: column,
        data: csvContent,
      });
      this.addToZip({
        fileName: `${fileName}.csv`,
        fileContent: content,
      });
      const zip = await this.zipService.generateZip();
      this.zipService.downloadFile(zip, `${fileName}.zip`);
      this.setAlert({
        show: true,
        type: 'success',
        message: 'DOWNLOADED',
      });
      return content;
    },
    addToZip(file) {
      this.zipService.addFile(file);
    },
  },
};
</script>
