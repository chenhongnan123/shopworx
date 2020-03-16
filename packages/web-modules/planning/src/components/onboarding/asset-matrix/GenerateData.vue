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
      <p class="mt-1 caption text-justify">
        {{ $t('onboarding.importData.helper.required') }}
        |
        {{ $tc('onboarding.reviewData.helper.count', rowData.length) }}
      </p>
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
import { mapMutations, mapState, mapActions } from 'vuex';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue';
import AgGridService from '@shopworx/services/util/agGrid.service';

export default {
  name: 'GenerateData',
  components: {
    AgGridVue,
  },
  props: {
    masters: {
      type: Array,
      required: true,
    },
    masterTags: {
      type: Array,
      required: true,
    },
  },
  created() {
    this.mapTags();
  },
  watch: {
    masters() {
      this.mapTags();
      this.mapColumns();
      this.addRows();
    },
  },
  data() {
    return {
      tags: [],
      rowData: [],
      gridApi: null,
      isValid: true,
      columnDefs: [],
      dataObject: null,
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      generatedData: [],
      rowsSelected: false,
    };
  },
  computed: {
    ...mapState('planning', ['generatedMatrix']),
  },
  beforeMount() {
    this.gridOptions = {};
    this.mapColumns();
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
    this.addRows();
    // this.gridApi.sizeColumnsToFit();
  },
  methods: {
    ...mapActions('planning', ['generateMatrix']),
    ...mapMutations('helper', ['setAlert']),
    mapTags() {
      if (this.masters && this.masters.length) {
        this.tags = [
          ...this.masters.map((master) => master.tags).flat(),
          ...this.masterTags,
        ];
      }
    },
    mapColumns() {
      this.columnDefs = this.tags.map((tag) => ({
        headerName: `${tag.tagDescription}${tag.required ? '*' : ''}`,
        field: tag.tagName,
        cellEditor: AgGridService.getCellEditor(tag.emgTagType),
        cellRenderer: AgGridService.getCellRenderer(tag.emgTagType),
      }));
    },
    async generateData() {
      const elements = this.masters.map((master) => master.element);
      await this.generateMatrix(elements);
    },
    async addRows() {
      this.gridApi.showLoadingOverlay();
      await this.generateData();
      this.gridApi.updateRowData({ add: this.generatedMatrix });
      this.gridApi.hideOverlay();
    },
    validateData(data) {
      this.isValid = true;
      data.forEach((d) => {
        this.tags.forEach((t) => {
          if (t.required) {
            const val = d[t.tagName];
            if (!val) {
              this.isValid = false;
            }
          }
        });
      });
      this.$emit('is-valid-data', this.isValid);
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
    importData() {
      const data = {
        data: this.rowData,
        fields: this.tags,
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
