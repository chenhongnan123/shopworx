<template>
  <v-card-text style="height:500px">
    <v-expansion-panels
      flat
      accordion
    >
      <v-expansion-panel v-if="requiredData">
        <v-expansion-panel-header class="pa-0 ma-0">
          {{ $tc('planning.setup.importMaster.requiredData', requiredData.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in requiredData" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="duplicateColumnData && duplicateColumnData.length">
        <v-expansion-panel-header class="pa-0 ma-0">
          {{ $tc('planning.setup.importMaster.duplicateData', duplicateColumnData.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in duplicateColumnData" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="invalidDataTypes && invalidDataTypes.length">
        <v-expansion-panel-header class="pa-0 ma-0">
          {{ $tc('planning.setup.importMaster.invalidDataType', invalidDataTypes.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in invalidDataTypes" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <ag-grid-vue
      v-model="rowData"
      :columnDefs="columnDefs"
      :gridOptions="gridOptions"
      class="ag-theme-balham mt-2"
      :defaultColDef="defaultColDef"
      style="width: 100%; height: 70%;"
    ></ag-grid-vue>
  </v-card-text>
</template>

<script>
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue';

export default {
  name: 'ReviewColumn',
  props: {
    records: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    missingData: {
      type: Array,
      default: () => [],
    },
    invalidDataTypes: {
      type: Array,
      default: () => [],
    },
    duplicateColumnData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    AgGridVue,
  },
  data() {
    return {
      rowData: [],
      gridApi: null,
      columnDefs: [],
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
    };
  },
  created() {
    this.gridOptions = {};
    this.defaultColDef = {
      filter: true,
      editable: true,
      resizable: true,
    };
    this.rowData = this.records;
    this.setColumnDef();
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  watch: {
    records(val) {
      this.rowData = val;
    },
    tags() {
      this.setColumnDef();
    },
  },
  computed: {
    requiredData() {
      if (this.missingData.length) {
        const dataByRows = this.missingData.reduce((acc, cur) => {
          acc[cur.row] = [...acc[cur.row] || [], cur];
          return acc;
        }, {});
        const msgs = Object.keys(dataByRows).map((row) => {
          const rows = dataByRows[row];
          const cols = rows.map((r) => r.tag);
          return `Row: ${row}, Column: ${cols.join(',')}`;
        });
        return msgs.flat();
      }
      return null;
    },
  },
  methods: {
    setColumnDef() {
      this.columnDefs = this.tags.map((tag) => ({
        headerName: `${tag.tagDescription}${tag.required ? '*' : ''}`,
        field: tag.tagName,
      }));
    },
  },
};
</script>
