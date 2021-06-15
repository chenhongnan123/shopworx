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
      <v-btn
        small
        outlined
        color="primary"
        class="text-none ml-2 mr-2 mt-3"
        @click="exportData"
      >
        Sample
      </v-btn>
      <v-btn
        small
        outlined
        color="primary"
        class="text-none ml-2 mr-2 mt-3"
        @click="importData"
        :loading="importBtnLoading"
      >
        Import
      </v-btn>
      <input
        multiple
        type="file"
        accept=".csv"
        ref="uploader"
        class="d-none"
        id="uploadFiles"
        @change="onFilesChanged"
      />
    </v-toolbar>
    <v-progress-linear
     :indeterminate="myProgressVariable"
     v-if="myProgressVariable"
     class="mt-1">
    </v-progress-linear>
    <v-progress-linear
     :indeterminate="flagElement"
     v-if="flagElement"
     reverse
     class="mt-1">
    </v-progress-linear>
    <ag-grid-vue
      v-model="rowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      @rowClicked="handleClick($event)"
      rowSelection="single"
      class="ag-theme-balham mt-2"
      style="width: 100%; height: 250px; cursor:pointer;"
    ></ag-grid-vue>
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
               <h2>Code</h2>
              {{selectedRowDataswxCodes[0].code || 'no Code'}}
            </v-col>
            <v-col cols="6">
             <h2>Description</h2>
             <v-flex>
              <div v-if="this.language === 'zhHans'">
                {{selectedRowDataswxCodes[0].cndescription || 'no descriprion'}}
              </div>
              <div v-else>
                {{selectedRowDataswxCodes[0].endescription || 'no descriprion'}}
              </div>
             </v-flex>
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
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import { AgGridVue } from 'ag-grid-vue';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'LogBaseMaster',
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
      myProgressVariable: true,
      importBtnLoading: false,
      headers: [
        {
          headerName: this.$t('Created Date'),
          field: 'createdTimestamp',
          resizable: true,
        },
        {
          headerName: 'Log Type',
          field: 'logtype',
          resizable: true,
        },
        {
          headerName: 'Log Code',
          field: 'logcode',
          resizable: true,
        },
        {
          headerName: 'Log source',
          field: 'logsource',
          resizable: true,
        },
      ],
      column: [
        'code',
        'endescription',
        'cndescription',
      ],
      csvContent: [
        'XXX01000',
        'Station not found',
        '机器故障',
      ],
    };
  },
  async created() {
    this.language = this.currentLocale;
    this.zipService = ZipService;
    await this.getSwxLogCodes();
    this.getSwxLogsElement();
  },
  computed: {
    ...mapState('logManagement', ['records', 'logs', 'logcodes', 'elementExisted']),
    ...mapGetters('logManagement', ['getTags']),
    currentLocale: {
      get() {
        return this.$i18n.locale;
      },
    },
    tags() {
      return this.getTags(this.id, this.assetId);
    },
    flagElement: {
      get() {
        if (this.elementExisted) {
          this.getSwxLogsElement();
        }
        return this.elementExisted;
      },
    },
  },
  watch: {
    logs() {
      this.setRowData();
      this.setColumnDefs();
    },
  },
  beforeMount() {
    this.gridOptions = {};
    this.defaultColDef = {
      filter: true,
      resizable: true,
      floatingFilter: true,
      headerCheckboxSelectionFilteredOnly: this.isFirstColumn,
      rowSelection: 'single',
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
    ...mapActions('logManagement', ['getRecords', 'updateRecord', 'getSwxLogs', 'getSwxLogCodes', 'createNewLogCodes']),
    ...mapMutations('helper', ['setAlert']),
    async refreshUI() {
      this.selectedRowData = [];
      this.selectedRowDataswxCodes = [];
      if (this.fromdate && this.todate) {
        this.myProgressVariable = true;
        const from = new Date(this.fromdate).getTime();
        const to = new Date(this.todate).getTime();
        await this.getSwxLogs(`?datefrom=${from}&dateto=${to}`);
        this.myProgressVariable = false;
      } else {
        this.myProgressVariable = true;
        await this.getSwxLogsElement();
        this.myProgressVariable = false;
      }
    },
    async getSwxLogsElement() {
      this.myProgressVariable = true;
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const from = new Date(yesterday).getTime();
      const to = new Date(today).getTime();
      const records = await this.getSwxLogs(`?datefrom=${from}&dateto=${to}`);
      this.fromdate = formatDate(new Date(from), 'yyyy-MM-dd\'T\'HH:mm');
      this.todate = formatDate(new Date(to), 'yyyy-MM-dd\'T\'HH:mm');
      this.myProgressVariable = false;
      if (!records) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'No_LOGS_FOUND',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'LOGS_FOUND',
        });
      }
    },
    async searchRecord() {
      if (!this.fromdate || !this.todate) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'EITHER_DATE_EMPTY',
        });
      } else if (this.fromdate > this.todate) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'TO_DATE_IS_NOT_GREATER',
        });
      } else {
        this.selectedRowData = [];
        this.selectedRowDataswxCodes = [];
        this.myProgressVariable = true;
        const from = new Date(this.fromdate).getTime();
        const to = new Date(this.todate).getTime();
        await this.getSwxLogs(`?datefrom=${from}&dateto=${to}`);
        this.myProgressVariable = false;
      }
    },
    async handleClick(item) {
      const responce = item.data;
      this.selectedRowData = [];
      this.selectedRowDataswxCodes = [];
      if (this.logcodes.length) {
        if (this.language === 'zhHans') {
          this.selectedRowData = responce.metadata;
          const codeDescriptionMapping = this.logcodes
            .filter((c) => c.cndescription === responce.cndescription);
          const codeTypeMapping = this.logcodes.filter((c) => c.code === responce.logcode);
          if (!codeTypeMapping.length) {
            this.selectedRowData = [];
            this.selectedRowDataswxCodes = [];
            this.setAlert({
              show: true,
              type: 'error',
              message: 'CODE_NOT_AVAILABLE',
            });
          } else {
            this.selectedRowDataswxCodes = codeDescriptionMapping;
            this.selectedRowDataswxCodes = codeTypeMapping;
          }
        } else {
          this.selectedRowData = responce.metadata;
          const codeDescriptionMapping = this.logcodes
            .filter((c) => c.endescription === responce.endescription);
          const codeTypeMapping = this.logcodes.filter((c) => c.code === responce.logcode);
          if (!codeTypeMapping.length) {
            this.selectedRowData = [];
            this.selectedRowDataswxCodes = [];
            this.setAlert({
              show: true,
              type: 'error',
              message: 'CODE_NOT_AVAILABLE',
            });
          } else {
            this.selectedRowDataswxCodes = codeDescriptionMapping;
            this.selectedRowDataswxCodes = codeTypeMapping;
          }
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SWXCODES_ELEMENT_EMPTY',
        });
      }
    },
    setRowData() {
      this.rowData = this.logs;
    },
    setColumnDefs() {
      this.columnDefs = this.headers;
    },
    isFirstColumn(params) {
      const displayedColumns = params.columnApi.getAllDisplayedColumns();
      const thisIsFirstColumn = displayedColumns[0] === params.column;
      return thisIsFirstColumn;
    },
    onSelectionChanged(event) {
      this.rowsSelected = event.api.getSelectedRows().length > 0;
    },
    async exportData() {
      const fileName = 'Swxlogcodes-sample';
      const csvParser = new CSVParser();
      const content = csvParser.unparse({
        fields: this.column,
        data: this.csvContent,
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
    importData() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(e) {
      this.importBtnLoading = true;
      const files = e && e !== undefined ? e.target.files : null;
      const ext = /^.+\.([^.]+)$/.exec(files[0].name);
      const getFileExtension = ext == null ? 'Null input from upload' : ext[1];
      if (getFileExtension !== 'csv' && getFileExtension !== 'CSV') {
        this.savingImport = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'UPLOAD_ONLY_CSV',
        });
        this.importBtnLoading = false;
        document.getElementById('uploadFiles').value = null;
        return;
      }
      const csvParser = new CSVParser();
      const { data } = await csvParser.parse(files[0]);
      if (data.length > 0) {
        const codelist = data.map((item) => item.code.toLowerCase().split(' ').join(''));
        const dummycode = [];
        data.forEach((d) => {
          const codesDuplicate = this.logcodes
            .filter((l) => l.code.toLowerCase().split(' ').join('') === d.code.toLowerCase().split(' ').join(''));
          if (codesDuplicate.length) {
            dummycode.push(d.code);
          }
        });
        if (dummycode.length) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'DUPLICATE_CODES_IN_DATABASE',
          });
          this.importBtnLoading = false;
          document.getElementById('uploadFiles').value = null;
          return;
        }
        const codeLength = [];
        codelist.forEach((len) => {
          if (len.length > 15) {
            codeLength.push(len);
          }
        });
        if (codeLength.length) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'CODE_LENGTH_EXCEEDED',
          });
          this.importBtnLoading = false;
          document.getElementById('uploadFiles').value = null;
          return;
        }
        if (codelist.length > 100) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ROW_LIMIT',
          });
          this.importBtnLoading = false;
          document.getElementById('uploadFiles').value = null;
          return;
        }
        const nullCode = [];
        data.forEach((em) => {
          if (em.code === null || em.code === '' || em.code === undefined) {
            nullCode.push(em.code);
          }
        });
        if (nullCode.length) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'EMPTY_INPUT',
          });
          this.importBtnLoading = false;
          document.getElementById('uploadFiles').value = null;
          return;
        }
        const duplicateCodes = codelist.map((item) => item)
          .filter((value, index, self) => self.indexOf(value) !== index);
        if (duplicateCodes.length > 0) {
          this.validateFlag = false;
          this.savingImport = false;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'DUPLICATE_CODES',
          });
          this.importBtnLoading = false;
          document.getElementById('uploadFiles').value = null;
        } else {
          const obj = {
            assetid: 4,
            siteId: 197,
            customerId: 195,
            userId: 200,
          };
          const payload = [];
          data.forEach((el) => {
            payload.push({
              code: el.code,
              endescription: el.endescription,
              cndescription: el.cndescription,
              ...obj,
            });
          });
          const created = await this.createNewLogCodes(payload);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'CODE_CREATED',
            });
            this.importBtnLoading = false;
            this.myProgressVariable = true;
            await this.getSwxLogCodes();
            this.getSwxLogsElement();
            this.myProgressVariable = false;
            document.getElementById('uploadFiles').value = null;
          }
        }
      } else {
        this.validateFlag = false;
        this.savingImport = false;
        this.importBtnLoading = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'IMPORT_EMPTY_FILE',
        });
        document.getElementById('uploadFiles').value = null;
      }
    },
  },
};
</script>
