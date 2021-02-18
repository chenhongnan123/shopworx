<template>
  <v-card
    flat
    class="transparent"
    style="height: 100%"
  >
    <v-data-table
      :headers="headers"
      :items="logs"
      :items-per-page="5"
      class="elevation-1"
    ></v-data-table>
    <!-- <ag-grid-vue
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
    ></ag-grid-vue> -->
  </v-card>
</template>

<script>
import {
  mapActions,
  mapGetters,
  mapState,
  mapMutations,
} from 'vuex';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
// import { AgGridVue } from 'ag-grid-vue';

export default {
  name: 'LogBaseMaster',
  components: {
    // AgGridVue,
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
      headers: [
        {
          text: 'Log Type',
          align: 'start',
          sortable: false,
          value: 'logtype',
        },
        { text: 'Log Code', value: 'logcode' },
        { text: 'Source', value: 'logsource' },
        { text: 'MetaData', value: 'metadata' },
      ],
    };
  },
  created() {
    this.fetchRecords();
    this.zipService = ZipService;
    this.getSwxLogs(this.id);
  },
  computed: {
    ...mapState('logManagement', ['records', 'logs']),
    ...mapGetters('logManagement', ['getTags']),
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
      this.getSwxLogs(this.id);
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
    ...mapActions('logManagement', ['getRecords', 'updateRecord', 'getSwxLogs']),
    ...mapMutations('helper', ['setAlert']),
    async fetchRecords() {
      this.loading = true;
      await this.getRecords({
        elementName: this.id,
        assetId: this.assetId,
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
    onSelectionChanged(event) {
      this.rowsSelected = event.api.getSelectedRows().length > 0;
    },
    addRow() {
      this.gridApi.applyTransaction({ add: [this.getNewRowItem()] });
    },
    deleteSelectedRows() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.gridApi.applyTransaction({ remove: selectedRows });
      this.rowsSelected = this.gridApi.getSelectedRows().length > 0;
    },
    editMethod(event) {
      if (event.data.assetid) {
        const makevisible = true;
        this.updateData.push(event.data);
        this.$emit('showupdatebtnemt', makevisible);
      }
    },
    async updateValue() {
      const elementName = this.id;
      const data = this.updateData;
      const multipleRows = data.forEach(async (item) => {
        await this.updateRecord(
          {
            query: item._id, payload: item, name: elementName,
          },
        );
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
      const makeunvisible = false;
      this.$emit('showupdatebtnemt', makeunvisible);
      this.updateData = [];
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
