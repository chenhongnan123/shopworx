<template>
  <v-card
    flat
    class="transparent"
    style="height: 100%"
  >
    <v-card-text class="pa-0">
      <v-btn
        color="primary"
        class="text-none"
        @click="importCSV"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        v-text="$t('onboarding.importData.buttons.import')"
      ></v-btn>
      <input
        ref="uploader"
        class="d-none"
        type="file"
        accept=".csv"
        @change="onFileChanged"
      >
      <p
        class="mt-1 text-justify"
        v-text="$t('onboarding.importData.helper.importWarning')"
      ></p>
    </v-card-text>
    <span v-text="$t('onboarding.importData.helper.manualInput')">
    </span>
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
      <p
        class="mt-1 caption text-justify"
        v-text="$t('onboarding.importData.helper.required')"
      ></p>
    </v-card-text>
    <v-card-actions class="px-0">
      <v-btn
        color="primary"
        class="text-none"
        @click="importData"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        v-text="$t('onboarding.importData.buttons.continue')"
      ></v-btn>
      <v-spacer></v-spacer>
      <v-btn
        outlined
        color="success"
        class="text-none"
        @click="addRow"
        v-text="$t('onboarding.importData.buttons.addRow')"
      ></v-btn>
      <v-btn
        outlined
        color="error"
        class="text-none"
        :disabled="!rowsSelected"
        @click="deleteSelectedRows"
        v-text="$t('onboarding.importData.buttons.deleteRows')"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue';
import CSVParser from '@shopworx/services/parser/csv.service';
import AgGridService from '@shopworx/services/util/agGrid.service';

export default {
  name: 'ImportOnboardingData',
  components: {
    AgGridVue,
  },
  props: {
    tags: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      rowData: [],
      gridApi: null,
      isValid: true,
      columnDefs: [],
      csvParser: null,
      dataObject: null,
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      rowsSelected: false,
    };
  },
  beforeMount() {
    this.csvParser = new CSVParser();
    this.gridOptions = {};
    this.columnDefs = this.tags.map((tag) => ({
      headerName: `${tag.tagDescription}${tag.required ? '*' : ''}`,
      field: tag.tagDescription,
      cellEditor: AgGridService.getCellEditor(tag.emgTagType),
      cellRenderer: AgGridService.getCellRenderer(tag.emgTagType),
    }));
    this.defaultColDef = {
      filter: true,
      editable: true,
      resizable: true,
      checkboxSelection: this.isFirstColumn,
      headerCheckboxSelection: this.isFirstColumn,
      headerCheckboxSelectionFilteredOnly: this.isFirstColumn,
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.addRow();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    validateData(data) {
      this.isValid = true;
      data.forEach((d) => {
        this.tags.forEach((t) => {
          if (t.required) {
            const val = d[t.tagDescription];
            if (!val) {
              this.isValid = false;
            }
          }
        });
      });
      this.$emit('is-valid-data', this.isValid);
    },
    importCSV() {
      this.$refs.uploader.click();
    },
    async onFileChanged(e) {
      const selectedFile = e && e !== undefined ? e.target.files[0] : null;
      e.target.value = '';
      if (selectedFile) {
        const csvData = await this.csvParser.parse(selectedFile);
        if (csvData && csvData.data) {
          const data = {
            data: csvData.data,
            fields: csvData.meta.fields,
          };
          this.validateData(csvData.data);
          if (csvData.data && csvData.data.length) {
            this.$emit('data-imported', data);
          } else if (!this.isValid) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'NO_RECORDS_IN_FILE',
            });
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'NO_RECORDS_IN_FILE',
            });
          }
        }
      }
    },
    isFirstColumn(params) {
      const displayedColumns = params.columnApi.getAllDisplayedColumns();
      const thisIsFirstColumn = displayedColumns[0] === params.column;
      return thisIsFirstColumn;
    },
    getNewRowItem() {
      return this.tags.reduce((acc, tag) => {
        acc[tag.tagDescription] = null;
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
    importData() {
      const data = {
        data: this.rowData,
        fields: this.tags.map((tag) => tag.tagDescription),
      };
      this.validateData(this.rowData);
      if (this.isValid) {
        this.$emit('data-imported', data);
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
