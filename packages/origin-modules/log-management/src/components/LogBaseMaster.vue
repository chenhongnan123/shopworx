<template>
<v-container fluid class="py-0">
  <v-row justify="center">
    <v-col cols="12" xl="10" class="py-0">
  <v-card
    flat
    class="transparent"
    style="height: 100%"
  >
   <v-toolbar
      flat
      dense
      class="stick"
      :color="$vuetify.theme.dark ? '#121212' : ''"
      :headerTitle="$t('logManagement')"
    >
    <v-responsive>
      <v-text-field
          class="mt-8 ml-0"
          type="datetime-local"
          v-model="fromdate"
          :label="$t('From date')"
      ></v-text-field>
    </v-responsive>
    <v-responsive>
      <v-text-field
          class="mt-8 ml-4"
          type="datetime-local"
          v-model="todate"
          :label="$t('To date')"
      ></v-text-field>
    </v-responsive>
      <v-spacer></v-spacer>
      <v-btn
        small
        outlined
        color="primary"
        class="text-none ml-2 mr-2 mt-3"
        @click="searchRecord"
      >
        Search
      </v-btn>
      <v-btn
        small
        outlined
        color="primary"
        class="text-none ml-2 mr-2 mt-3"
        @click="refreshUI"
      >
        Refresh
      </v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="logs"
      :items-per-page="5"
      class="elevation-1 mb-4 mt-2"
      show-select
      @click:row="handleClick"
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
    <div v-if="selectedRowData.length > 0 || selectedRowDataswxCodes.length > 0">
    <v-tabs
      v-model="tab"
      background-color="transparent"
      color="primary"
    >
      <v-tab
      >
        Details
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
      >
      <v-card
         class="mt-0"
         height="190">
          <v-card-title>
            <!-- <span class="headline">Details</span> -->
            <v-spacer></v-spacer>
          </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
             <h2>Metadata</h2>
              {{selectedRowData}}
            </v-col>
            <v-col cols="6">
             <h2>Description</h2>
             <v-flex>
              <div v-if="this.language === 'zhHans'">
                {{selectedRowDataswxCodes[0].endescription || 'no descriprion'}}
              </div>
              <div v-else>
                {{selectedRowDataswxCodes[0].cndescription || 'no descriprion'}}
              </div>
             </v-flex>
              <h2>Type</h2>
              {{selectedRowDataswxCodes[0].code || 'no descriprion'}}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
        </v-card-actions>
     </v-card>
     </v-tab-item>
    </v-tabs-items>
    </div>
  </v-card>
    </v-col>
  </v-row>
</v-container>
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
      tab: null,
      todate: null,
      fromdate: null,
      selectedRowData: [],
      selectedRowDataswxCodes: [],
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
      language: null,
      headers: [
        {
          text: 'Time',
          value: 'createdTimestamp',
        },
        {
          text: 'Log Type',
          align: 'start',
          sortable: false,
          value: 'logtype',
        },
        {
          text: 'Sub-Station',
          align: 'start',
          sortable: false,
          value: 'substationid',
        },
        {
          text: 'Log Code',
          align: 'start',
          sortable: false,
          value: 'logcode',
        },
        { text: 'Source', value: 'logsource' },
      ],
    };
  },
  created() {
    this.language = this.currentLocale;
    this.fetchRecords();
    this.zipService = ZipService;
    this.getSwxLogs(this.id);
    this.getSwxLogCodes(this.id);
  },
  computed: {
    ...mapState('logManagement', ['records', 'logs', 'logcodes']),
    ...mapGetters('logManagement', ['getTags']),
    currentLocale: {
      get() {
        return this.$i18n.locale;
      },
    },
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
      this.getSwxLogCodes(this.id);
      this.selectedRowData = [];
      this.selectedRowDataswxCodes = [];
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
    ...mapActions('logManagement', ['getRecords', 'updateRecord', 'getSwxLogs', 'getSwxLogCodes']),
    ...mapMutations('helper', ['setAlert']),
    async refreshUI() {
      await this.getSwxLogs('');
    },
    async searchRecord() {
      const from = new Date(this.fromdate).getTime();
      const to = new Date(this.todate).getTime();
      await this.getSwxLogs(`?datefrom=${from}&dateto=${to}`);
    },
    async handleClick(item) {
      this.selectedRowData = [];
      this.selectedRowDataswxCodes = [];
      this.selectedRowData = item.metadata;
      const codeDescriptionMapping = this.logcodes
        .filter((c) => c.endescription === item.endescription);
      const codeTypeMapping = this.logcodes.filter((c) => c.code === item.logcode);
      this.selectedRowDataswxCodes = codeDescriptionMapping;
      this.selectedRowDataswxCodes = codeTypeMapping;
      console.log(this.selectedRowDataswxCodes);
    },
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
