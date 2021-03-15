<template>
  <v-card flat>
    <v-card-text>
      <v-row no-gutters>
        <v-col lg="6" xl="4">
          <v-text-field
            label="License key*"
            v-model="license"
            :rules="requiredRule"
          ></v-text-field>
        </v-col>
        <v-col class="text-right">
          <v-btn
            small
            @click="addRow"
            color="success"
            class="text-none mt-3"
          >
            <v-icon left>mdi-plus</v-icon>
            Add asset
          </v-btn>
          <v-btn
            small
            color="error"
            @click="addRow"
            class="text-none ml-2 mt-3"
            :disabled="!rowsSelected"
          >
            <v-icon left>mdi-delete</v-icon>
            Delete selected asset(s)
          </v-btn>
        </v-col>
      </v-row>
      <ag-grid-vue
        :rowData="rowData"
        rowSelection="multiple"
        class="ag-theme-balham mt-1"
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
        :defaultColDef="defaultColDef"
        :suppressRowClickSelection="true"
        :suppressDragLeaveHidesColumns="true"
        style="width: 100%; height: 300px;"
        @selection-changed="onSelectionChanged(n)"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export default {
  name: 'AssetInput',
  components: {
    AgGridVue,
  },
  props: {
    assetInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      license: '',
      rowData: [],
      columnDefs: [],
      rowsSelected: false,
      gridApi: null,
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      requiredRule: [
        (v) => !!v || 'Required.',
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {
      stopEditingWhenGridLosesFocus: true,
    };
    this.defaultColDef = {
      filter: false,
      editable: true,
      resizable: true,
      floatingFilter: false,
      checkboxSelection: this.isFirstColumn,
      headerCheckboxSelection: this.isFirstColumn,
      headerCheckboxSelectionFilteredOnly: this.isFirstColumn,
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    isFirstColumn(params) {
      const displayedColumns = params.columnApi.getAllDisplayedColumns();
      const thisIsFirstColumn = displayedColumns[0] === params.column;
      return thisIsFirstColumn;
    },
    onSelectionChanged(event) {
      this.rowsSelected = event.api.getSelectedRows().length > 0;
    },
    addRow() {
      this.gridApi.applyTransaction({
        add: [this.getNewRowItem()],
        addIndex: 0,
      });
    },
    deleteSelectedRows() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.gridApi.applyTransaction({ remove: selectedRows });
      this.rowsSelected = this.gridApi.getSelectedRows().length > 0;
    },
  },
};
</script>
