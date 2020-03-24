<template>
  <v-card flat class="transparent">
    <v-card-text style="height:500px">
      <div
        v-if="requiredData"
        class="font-weight-medium"
      >
        Missing required data:
        <div v-for="(data, n) in requiredData" :key="n">
          {{ data }}
        </div>
      </div>
      <div
        v-if="duplicateColumnData && duplicateColumnData.length"
        class="font-weight-medium"
      >
        Duplicate data for:
        {{ duplicateColumnData.join(',') }}
      </div>
      <div
        v-if="invalidDataTypes && invalidDataTypes.length"
        class="font-weight-medium"
      >
        Invalid data type for:
        {{ invalidDataTypes.join(',') }}
      </div>
      <ag-grid-vue
        v-model="rowData"
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
        class="ag-theme-balham mt-2"
        :defaultColDef="defaultColDef"
        style="width: 100%; height: 70%;"
      ></ag-grid-vue>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="save"
        color="primary"
        class="text-none"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
      >
        Save changes
      </v-btn>
      <v-btn
        text
        color="primary"
        class="text-none"
        @click="$emit('cancel')"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
      >
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
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
    save() {
      this.$emit('save', this.rowData);
    },
  },
};
</script>
