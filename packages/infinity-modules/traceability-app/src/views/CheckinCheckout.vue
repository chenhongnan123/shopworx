<template>
<div style="height:100%">
    <!-- <portal
      to="app-extension"
    > -->
        <v-toolbar
          flat
          dense
          class="stick pa-0"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
        <v-autocomplete
          clearable
          class="mt-8 mr-4"
          :label="$t('Select Element')"
          :items="masterItems"
          return-object
          item-text="title"
          v-model="selectedElement"
          @change="handleElementClick"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-text-field
          class="mt-8"
          type="datetime-local"
          v-model="processdata.fromdate"
          :label="$t('From date')"
        ></v-text-field>
        <v-text-field
          class="mt-8 ml-4"
          type="datetime-local"
          v-model="processdata.todate"
          :label="$t('To date')"
        ></v-text-field>
        <v-btn small color="primary" class="text-none ml-2"
           :loading="searchBtnLoading"
           @click="btnSearch">
            {{ $t('displayTags.buttons.btnSearch') }}
          </v-btn>
        </v-toolbar>
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0 mb-2">
        <ag-grid-vue
          :sideBar="true"
          v-model="dataList"
          multiSortKey="ctrl"
          :animateRows="true"
          :enableCharts="true"
          pivotPanelShow="always"
          :columnDefs="headerList"
          rowGroupPanelShow="always"
          :gridOptions="gridOptionsPart"
          :enableRangeSelection="true"
          class="ag-theme-balham mt-2"
          :defaultColDef="defaultColDefPart"
          style="width: 100%; height: 550px;"
          @sort-changed="onStateChange"
          @filter-changed="onStateChange"
          @column-pinned="onStateChange"
          @column-visible="onStateChange"
          @column-resized="onStateChange"
          @column-moved="onStateChange"
          @column-row-group-changed="onStateChange"
          @column-pivot-changed="onStateChange"
          @column-value-changed="onStateChange"
          :pagination="true"
        ></ag-grid-vue>
      </v-col>
    </v-row>
  </div>
</template>
<script>
/* eslint-disable */
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import { AgGridVue } from 'ag-grid-vue';

export default {
  name: 'Trecibility',
  components: {
    AgGridVue,
  },
  beforeMount() {
    this.dataList = null;
    this.gridOptionsPart = {};
    this.defaultColDefPart = {
      filter: true,
      sortable: true,
      resizable: true,
      enableValue: true,
      enablePivot: true,
      enableRowGroup: true,
      floatingFilter: true,
    };
  },
  mounted() {
    // this.restoreState();
    this.gridApi = this.gridOptionsPart.api;
    this.gridColumnApi = this.gridOptionsPart.columnApi;
  },
  async created() {
    this.dataList = [];
    await this.getElements();
    this.language = this.currentLocale;
    this.zipService = ZipService;
    const view = localStorage.getItem('planView');
    this.recipeView = view ? JSON.parse(view) : 0;
    this.setExtendedHeader(true);
    await this.getSubLines('');
    // create element list
    this.elementList.push({
        name: 'Check In',
        value: 'checkin',
    },{
        name: 'Check Out',
        value: 'checkout',
    })
  },
  data() {
    return {
      // recipeView: 0,
      pageNumber: 1,
      processdata: {},
      prevDisabled: false,
      processParametersheader: [],
      processParametersList: [],
      saving: false,
      elementList: [],
      selectedElement: null,
      language: null,
      searchBtnLoading: false,
      headerList: [],
    };
  },
  computed: {
    ...mapGetters('traceabilityApp', ['masterItems']),
    ...mapGetters('traceabilityApp', ['getTags']),
    ...mapState('traceabilityApp', [
      'recipeViewState',
      'subLineList',
      'subStationList',
      'subStationListData',
      'trecibilityState',
      'partStatusList',
      'componentList',
      'parametersList',
      'sortedSubStation',
      'runningOrder',
      'bomDetailsList',
    ]),
    currentLocale: {
      get() {
        return this.$i18n.locale;
      },
    },
    recipeView: {
      get() {
        return this.recipeViewState;
      },
      set(val) {
        this.setRecipeViewState(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('helper', ['setExtendedHeader', 'setTrecibilityState']),
    ...mapMutations('traceabilityApp', ['setRecipeViewState']),
    ...mapActions('traceabilityApp', [
      'getSubStations',
      'getComponentList',
      'getSortedSubStations',
      'getSubLines',
      'getProcessElement',
      'getProcessParameters',
      'getParametersList',
      'getRunningOrder',
      'getRecordsData',
      'getElements',
      'getBOMDetails',
      'getSubStationElementsData',
    ]),
    ...mapActions('element', ['getRecords']),
    async handleSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getSortedSubStations(query);
    },
    onStateChange() {
      const colState = this.gridColumnApi.getColumnState();
      const groupState = this.gridColumnApi.getColumnGroupState();
      const sortState = this.gridApi.getSortModel();
      const filterState = this.gridApi.getFilterModel();
      /* console.log('***********************');
      console.log('colState: ', colState);
      console.log('groupState: ', groupState);
      console.log('sortState: ', sortState);
      console.log('filterState: ', filterState);
      console.log('***********************'); */
      const state = {
        colState,
        groupState,
        sortState,
        filterState,
      };
      this.setGridState(JSON.stringify(state));
    },
    async handleElementClick() {
      this.dataList = [];
      const elementDetails = this.getTags(this.selectedElement.to, 4);
      this.headerList = [];
      // for traceability element - show heading titles in english or chinese
      if (this.selectedElement.to === 'traceability') {
        if (this.language === 'zhHans') {
          this.headerList.push(
            {
              headerName: 'Main Id',
              field: 'mainid',
              resizable: true,
            },
          );
          await this.getSubStations('');
          await Promise.all(this.subStationList.map(async (s) => {
            const paramRecord = await this.getParametersList(`?query=substationid=="${s.id}"%26%26
              (parametercategory=="15"%7C%7Cparametercategory=="17"%7C%7Cparametercategory=="18")`);
            if (paramRecord.length > 0) {
              await Promise.all(paramRecord.map((p) => {
                this.headerList.push(
                  {
                    headerName: `${s.name}_${p.chinesedescription}`,
                    field: `${s.id}_${p.name}`,
                    resizable: true,
                  },
                );
                return true;
              }));
            }
          }));
        } else {
          elementDetails.forEach((element) => {
            this.headerList.push(
              {
                headerName: element.tagDescription,
                field: element.tagName,
                resizable: true,
              },
            );
          });
        }
      } else {
        elementDetails.forEach((f) => {
          this.headerList.push({
            headerName: f.tagDescription,
            field: f.tagName,
          });
        })
      }
    },
    onExport(e) {
      this.exportReport(e);
    },
    async exportReport(type) {
      if (type === 'gridCSV') {
        this.exportGridCSV();
      } else if (type === 'gridExcel') {
        await this.exportGridExcel();
      }
    },
    async exportGridCSV() {
      this.$refs.partstatus.exportGridCSV();
      this.$refs.overall.exportGridCSV();
      this.$refs.process.exportGridCSV();
      this.$refs.quality.exportGridCSV();
    },
    exportGridExcel() {
      this.$refs.partstatus.exportGridExcel();
      this.$refs.overall.exportGridExcel();
      this.$refs.process.exportGridExcel();
      this.$refs.quality.exportGridExcel();
    },
    async btnExport() {
      // const nameEement = this.id;
      // partstatus table
      this.saving = true;
      let fileName = 'partstatus_data';
      let parameterSelected = this.$refs.partstatus.partStatusList.map((item) => ({ ...item }));
      let headerKeys = ['createdTimestamp', 'modifiedtimestamp', 'completedproductid', 'mainid', 'substationname', 'overallresult', 'ordername', 'packagebatchid', 'producttypename'];
      let column = ['createdTimestamp', 'modifiedtimestamp', 'completedproductid', 'mainid', 'substationname', 'overallresult', 'ordername', 'packagebatchid', 'producttypename'];
      if (this.language === 'zhHans') {
        column = ['创建日期', '修改日期', '成品码', '主条码', '工位结果', '产品总结果', '订单名称', '包装码', '产品名称'];
      }
      let csvContent = [];
      parameterSelected.forEach((parameter) => {
        const arr = [];
        headerKeys.forEach((key) => {
          arr.push(parameter[key]);
        });
        csvContent.push(arr);
      });
      let csvParser = new CSVParser();
      let content = csvParser.unparse({
        fields: column,
        data: csvContent,
      });
      this.addToZip({
        fileName: `${fileName}.csv`,
        fileContent: content,
      });
      // component table
      await this.btnComponentLogic();
      fileName = 'component_data';
      parameterSelected = this.componentList.map((item) => ({ ...item }));
      headerKeys = ['createdTimestamp', 'completedproductid', 'mainid', 'substationname', 'componentname', 'componentvalue', 'boundstatus', 'reworkstatus', 'qualitystatus'];
      column = ['createdTimestamp', 'completedproductid', 'mainid', 'substationname', 'componentname', 'componentvalue', 'boundstatus', 'reworkstatus', 'qualitystatus'];
      if (this.language === 'zhHans') {
        column = ['创建日期', '成品码', '主条码', '工位结果', '零件名', '零件码', '绑定状态', '返工状态', '质量状态'];
      }
      csvContent = [];
      parameterSelected.forEach((parameter) => {
        const arr = [];
        headerKeys.forEach((key) => {
          arr.push(parameter[key]);
        });
        csvContent.push(arr);
      });
      csvParser = new CSVParser();
      content = csvParser.unparse({
        fields: column,
        data: csvContent,
      });
      this.addToZip({
        fileName: `${fileName}.csv`,
        fileContent: content,
      });
      // process table
      // await this.btnProcessParametersLogic();
      fileName = 'process_parameter_data';
      // await this.getProcessParameters();
      parameterSelected = this.$refs.process
        .processParametersList.map((item) => ({ ...item }));
      let columnHeader = this.$refs.process.headerForCSV;
      column = this.$refs.process.headerForCSV;
      if (this.currentLocale === 'zhHans') {
        column = this.$refs.process.headerForCSVChinese;
      }
      csvContent = [];
      parameterSelected.forEach((parameter) => {
        const arr = [];
        columnHeader.forEach((key) => {
          arr.push(parameter[key]);
        });
        csvContent.push(arr);
      });
      csvParser = new CSVParser();
      content = csvParser.unparse({
        fields: column,
        data: csvContent,
      });
      this.addToZip({
        fileName: `${fileName}.csv`,
        fileContent: content,
      });
      const zip = await this.zipService.generateZip();
      this.zipService.downloadFile(zip, 'traceability.zip');
      this.saving = false;
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
    async btnSearch() {
      this.searchBtnLoading = true;
      const fromDate = new Date(this.processdata.fromdate).getTime();
      const toDate = new Date(this.processdata.todate).getTime();
      let param = '?';
      if (fromDate) {
        param += `datefrom=${fromDate}&`;
      }
      if (toDate) {
        param += `dateto=${toDate}&`;
      }
      param += 'pagenumber=1&pagesize=500';
      const payload = {
        elementname: this.selectedElement.to,
        query: param,
      }
      this.dataList = await this.getRecordsData(payload);
      this.searchBtnLoading = false;
    },
  },
};
</script>
