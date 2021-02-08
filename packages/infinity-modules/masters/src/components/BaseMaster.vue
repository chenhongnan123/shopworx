<template>
  <v-card
    flat
    class="transparent"
    style="height: 100%"
  >
    <ag-grid-vue
      v-model="rowData"
      rowSelection="multiple"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :gridOptions="gridOptions"
      :defaultColDef="defaultColDef"
      :rowClassRules="rowClassRules"
      :suppressRowClickSelection="true"
      style="width: 100%; height: 400px;"
      @cellValueChanged="modifyData($event)"
      @selection-changed="onSelectionChanged"
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
import { AgGridVue } from 'ag-grid-vue';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';

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
      rowData: [],
      newData: [],
      updateData: [],
      columnDefs: [],
      filteredTags: [],
      isValid: true,
      loading: false,
      rowsSelected: false,
      showUpdateBtn: false,
      gridApi: null,
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      rowClassRules: null,
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
    },
    records() {
      this.setRowData();
      this.setColumnDefs();
    },
  },
  beforeMount() {
    this.gridOptions = {
      stopEditingWhenGridLosesFocus: true,
    };
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
    this.rowClassRules = {
      yellow: 'data.edited',
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.gridApi.sizeColumnsToFit();
  },
  methods: {
    ...mapActions('masters', ['getRecords', 'postBulkRecords', 'updateRecord']),
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
        acc[tag.tagName] = undefined;
        return acc;
      }, {});
    },
    onSelectionChanged(event) {
      this.rowsSelected = event.api.getSelectedRows().length > 0;
      this.$emit('deletebtnshow', this.rowsSelected);
    },
    addRow() {
      this.gridApi.applyTransaction({
        add: [this.getNewRowItem()],
        addIndex: 0,
      });

      if (this.newData.length) {
        this.newData.forEach((data) => {
          data.rowIndex += 1;
        });
      }
    },
    modifyData(event) {
      this.rowData[event.rowIndex].edited = true;
      this.$emit('savebtnshow', true);
      const currentCell = this.gridApi.getEditingCells()[0];
      this.gridApi.redrawRows();

      if (currentCell) {
        this.gridApi.startEditingCell({
          rowIndex: currentCell.rowIndex,
          colKey: currentCell.column.getId(),
        });
      }

      const updateDataIndex = this.updateData.findIndex((x) => x._id === event.data._id);
      const newDataIndex = this.newData.findIndex((x) => x.rowIndex === event.rowIndex);

      if (event.data.elementName) {
        if (updateDataIndex !== -1 && '_id' in event.data) {
          this.updateData[updateDataIndex] = event.data;
        } else {
          this.updateData.push(event.data);
        }
      }

      if (!event.data.elementName) {
        if (newDataIndex !== -1) {
          this.newData[newDataIndex] = event.data;
        } else {
          event.data.rowIndex = event.rowIndex;
          event.data.assetid = this.assetId;
          this.newData.push(event.data);
        }
      }
    },
    async saveModifiedRecords() {
      if (this.newData.length && this.updateData.length) {
        const name = this.id;
        this.newData.forEach((data) => {
          delete data.edited;
          delete data.rowIndex;
        });
        this.updateData.forEach((data) => { delete data.edited; });

        const payload = this.newData;
        const postData = await this.postBulkRecords({ payload, name });
        this.newData = [];

        const multipleRows = this.updateData.forEach(async (item) => {
          await this.updateRecord(
            {
              query: item._id, payload: item, name,
            },
          );
        });

        const update = await Promise.all([multipleRows]);
        this.updateData = [];

        if (postData && update) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATED_RECORD',
          });
          this.fetchRecords();
          this.$emit('savebtnshow', false);
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_CREATING_RECORD',
          });
        }
      } else if (this.newData.length) {
        this.saveNewRecord();
      } else {
        this.updateValue();
      }
    },
    async saveNewRecord() {
      const name = this.id;
      this.newData.forEach((data) => {
        delete data.edited;
        delete data.rowIndex;
      });

      const payload = this.newData;

      const postData = await this.postBulkRecords({ payload, name });
      this.newData = [];

      if (postData) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'CREATED_RECORD',
        });
        this.fetchRecords();
        this.$emit('savebtnshow', false);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_CREATING_RECORD',
        });
      }
    },
    deleteSelectedRows() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.gridApi.applyTransaction({ remove: selectedRows });
      this.rowsSelected = this.gridApi.getSelectedRows().length > 0;
    },
    async updateValue() {
      const elementName = this.id;
      this.updateData.forEach((data) => {
        delete data.edited;
      });
      const multipleRows = this.updateData.forEach(async (item) => {
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
      this.$emit('savebtnshow', false);
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
