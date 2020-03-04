<template>
  <v-card
    flat
    class="transparent"
    style="height: 100%"
  >
    <v-card-text
      class="pa-0"
      style="height: 320px"
    >
      <ag-grid-vue
        v-model="rowData"
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
        class="ag-theme-balham mt-2"
        :defaultColDef="defaultColDef"
        style="width: 100%; height: 90%;"
        @selection-changed="onSelectionChanged"
      ></ag-grid-vue>
    </v-card-text>
    <v-card-actions class="px-0">
      <v-btn
        color="primary"
        class="text-none"
        :loading="loading"
        @click="reviewData"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
      >
        {{ $t('onboarding.reviewData.buttons.continue') }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        outlined
        @click="addRow"
        color="success"
        class="text-none"
        :disabled="loading"
        v-text="$t('onboarding.reviewData.buttons.addRow')"
      ></v-btn>
      <v-btn
        outlined
        color="error"
        class="text-none"
        @click="deleteSelectedRows"
        :disabled="!rowsSelected || loading"
        v-text="$t('onboarding.reviewData.buttons.deleteRows')"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue';
import AgGridService from '@shopworx/services/util/agGrid.service';

export default {
  name: 'ReviewOnboardingData',
  components: {
    AgGridVue,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: Array,
      required: true,
    },
    importedData: {
      type: Array,
      required: true,
    },
    matchedColumns: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
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
  watch: {
    matchedColumns() {
      this.setRowData();
      this.setColumnDefs();
    },
    importedData() {
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
    ...mapMutations('helper', ['setAlert']),
    validateData(data) {
      this.isValid = true;
      data.forEach((d) => {
        this.filteredTags.forEach((t) => {
          if (t.required) {
            const val = d[t.tagName];
            if (!val) {
              this.isValid = false;
            }
          }
        });
      });
    },
    setRowData() {
      const filteredData = this.importedData
        .map((data) => this.filterData(this.matchedColumns, data));
      const renamedData = filteredData.map((data) => this.renameKeys(this.matchedColumns, data));
      this.rowData = renamedData;
    },
    setColumnDefs() {
      this.filteredTags = this.tags
        .filter((tag) => Object.values(this.matchedColumns).includes(tag.tagName));
      this.columnDefs = this.filteredTags.map((tag) => ({
        headerName: `${tag.tagDescription}${tag.required ? '*' : ''}`,
        field: tag.tagName,
        cellEditor: AgGridService.getCellEditor(tag.emgTagType),
        cellRenderer: AgGridService.getCellRenderer(tag.emgTagType),
      }));
    },
    filterData(keysMap, obj) {
      return Object.keys(keysMap)
        .map((k) => (k in obj ? { [k]: obj[k] } : null))
        .reduce((res, o) => Object.assign(res, o), {});
    },
    renameKeys(keysMap, obj) {
      return Object.keys(obj).reduce((acc, key) => ({
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] },
      }), {});
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
    reviewData() {
      const data = {
        data: this.rowData,
        tags: this.filteredTags,
      };
      this.validateData(this.rowData);
      if (this.isValid) {
        this.$emit('data-reviewed', data);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MISSING_REQUIRED_VALUE',
        });
      }
    },
  },
};
</script>
