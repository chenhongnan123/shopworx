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
      :suppressRowClickSelection="true"
      style="width: 100%; height: 400px;"
      @selection-changed="onSelectionChanged"
    ></ag-grid-vue>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
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
    };
  },
  created() {
    this.fetchRecords();
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
    ...mapActions('masters', ['getRecords']),
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
      this.gridApi.updateRowData({ add: [this.getNewRowItem()] });
    },
    deleteSelectedRows() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.gridApi.updateRowData({ remove: selectedRows });
      this.rowsSelected = this.gridApi.getSelectedRows().length > 0;
    },
  },
};
</script>
