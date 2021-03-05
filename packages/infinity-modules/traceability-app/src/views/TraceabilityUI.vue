<template>
<div style="height:100%">
    <portal to="app-header">
      <span v-text="$t('appTitleTraceability')"></span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
    </portal>
    <portal
      to="app-extension"
    >
        <v-toolbar
          flat
          dense
          class="stick pa-0"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
        <v-text-field
        class="mt-2 mr-2"
        v-model="newTrecibility.searchMainID"
        append-icon="mdi-magnify"
        :label="$t('Search ID')"
        single-line
        hide-details
        clearable
        ></v-text-field>
        <v-autocomplete
          clearable
          class="mt-8 mr-4"
          :label="$t('Select Sub-Line')"
          :items="subLineList"
          return-object
          item-text="name"
          v-model="newTrecibility.selectedSubLine"
          @change="handleSubLineClick"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-autocomplete
          clearable
          class="mt-8 mr-4"
          :label="$t('Select Sub-Station')"
          :items="sortedSubStation"
          return-object
          item-text="name"
          v-model="newTrecibility.selectedSubStation"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-text-field
          class="mt-8"
          type="datetime-local"
          v-model="newTrecibility.fromdate"
          :label="$t('From date')"
        ></v-text-field>
        <v-text-field
          class="mt-8 ml-4"
          type="datetime-local"
          v-model="newTrecibility.todate"
          :label="$t('To date')"
        ></v-text-field>
        <v-btn small color="primary" class="text-none ml-2"
           :loading="searchBtnLoading"
           @click="btnSearch">
            {{ $t('displayTags.buttons.btnSearch') }}
          </v-btn>
        <!-- <v-btn small :loading="saving" color="primary"
           class="text-none ml-2" @click="btnExport">
            {{ $t('Export') }}
        </v-btn> -->
          <export-reports
          :label="this.$t('Export')"
          @on-export="onExport"/>
          <!-- <v-btn small
            :loading="saving"
            color="primary" class="text-none ml-2" @click="btnExportDemo">
            Export Demo
          </v-btn> -->
        </v-toolbar>
    </portal>
    <!-- <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
        <v-spacer></v-spacer>
         <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2"
            :disabled="prevDisabled"
            @click="prevSearch((pageNumber-=1))">Prev
            </v-btn>
            <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2"
            @click="nextSearch(pageNumber+=1)">Next
            </v-btn>
        </v-toolbar> -->
    <PartStatusView ref="partstatus" :pageNumber="pageNumber"/>
    <v-tabs
        dense
        center-active
        v-model="recipeView"
      >
        <v-tab class="text-none">
          {{ $t('Components') }}
        </v-tab>
        <v-tab class="text-none">
          {{ $t('Parameters') }}
        </v-tab>
        <v-tab class="text-none">
          {{ $t('Quality History') }}
        </v-tab>
      </v-tabs>
    <!-- <recipe-filter></recipe-filter> -->
    <template>
      <v-fade-transition mode="out-in">
          <overall-list v-show="recipeView === 0"  ref="overall" :pageNumber="pageNumber"/>
      </v-fade-transition>
      <v-fade-transition mode="out-in">
          <process-parameters v-show="recipeView === 1" ref="process"
           :pageNumber="pageNumber"/>
      </v-fade-transition>
      <v-fade-transition mode="out-in">
          <quality-history-view v-show="recipeView === 2" ref="quality"
           :pageNumber="pageNumber"/>
      </v-fade-transition>
    </template>
  </div>
</template>
<script>
/* eslint-disable */
import { mapState, mapMutations, mapActions } from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import OverallList from './OverallList.vue';
import ProcessParameters from './ProcessParameters.vue';
import PartStatusView from './PartStatusView.vue';
import QualityHistoryView from './QualityHistoryView.vue';
import ExportReports from './ExportReports.vue';

export default {
  name: 'Trecibility',
  components: {
    OverallList,
    ProcessParameters,
    PartStatusView,
    QualityHistoryView,
    ExportReports
  },
  async updated() {
    this.backAndfourth();
  },
  async created() {
    this.language = this.currentLocale;
    this.zipService = ZipService;
    const view = localStorage.getItem('planView');
    this.recipeView = view ? JSON.parse(view) : 0;
    this.setExtendedHeader(true);
    await this.getSubLines('');
    // await this.getSubStations();
    // await this.fetchRecords();
    await this.showInput();
    this.$root.$on('dataLoded', (data) => {
      const getList = data;
      if (getList) {
        this.searchBtnLoading = false;
      } else {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PROCESS_PARAMETERS_NOT_LOADED_YET',
        });
      }
    });
  },
  data() {
    return {
      // recipeView: 0,
      pageNumber: 1,
      prevDisabled: false,
      processParametersheader: [],
      processParametersList: [],
      saving: false,
      language: null,
      searchBtnLoading: false,
    };
  },
  computed: {
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
    newTrecibility: {
      get() {
        return this.trecibilityState;
      },
      set(val) {
        this.setTrecibilityState(val);
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
      'getBOMDetails',
      'getSubStationElementsData',
    ]),
    ...mapActions('element', ['getRecords']),
    async handleSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getSortedSubStations(query);
    },
    async backAndfourth() {
      if (this.pageNumber === 1) {
        this.prevDisabled = true;
      } else {
        this.prevDisabled = false;
      }
    },
    async showInput() {
      const subline = this.subLineList;
      const firstSubline = subline[0];
      this.newTrecibility.selectedSubLine = firstSubline;
      // this.newTrecibility.fromdate = '2020-09-21T13:59';
      // const tDate = (new Date()).toISOString().slice(0, 16).replace(/-/g, '-');
      // const cDate = new Date(tDate).getTime();
      // alert(tDate);
      // this.newTrecibility.todate = tDate;
      // this.setAlert({
      //   show: true,
      //   type: 'success',
      //   message: 'FETCH_RECORD',
      // });
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
      console.log(column.length);
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
    async btnExportDemo() {
      this.saving = true;
      // 1. Running order
      // 2. Get BOM ID
      // 3. Get assemblyid related Bom Details
      await this.getRunningOrder('?query=orderstatus=="Running"');
      await this.getBOMDetails(`?query=bomid==${this.runningOrder[0].bomid}`);
      const fromDate = new Date(this.trecibilityState.fromdate).getTime();
      const toDate = new Date(this.trecibilityState.todate).getTime();
      let param = '?query=componentname=="subassemblyid"&';
      if (fromDate) {
        param += `datefrom=${fromDate}&`;
      }
      if (toDate) {
        param += `dateto=${toDate}&`;
      }
      const componenetData = await this.getComponentList(param);
      const processSendDataArray = [];
      // const duplicateMainIdCheck = [];
      componenetData.forEach((component) => {
        // if (!duplicateMainIdCheck.includes(component.mainid)) {
        //  duplicateMainIdCheck.push(component.mainid);
        const dataPresentFlag = processSendDataArray.filter((f) => f.componentvalue
          === component.componentvalue);
        if (dataPresentFlag.length === 0) {
          this.$refs.process.processParametersList.forEach((process) => {
            if (process.mainid === component.mainid) {
              const subStationName = this.subStationList.find((u) => u
                .id === component.substationid);
              if (!this.$refs.process.headerForCSV.includes(`${subStationName.name}_${component.componentname}`)) {
                this.$refs.process.headerForCSV.push(`${subStationName.name}_${component.componentname}`);
              }
              process[`${subStationName.name}_${component.componentname}`] = component.componentvalue;
              component[`${subStationName.name}_${component.componentname}`] = component.componentvalue;
              component.substationname = subStationName.name;
              processSendDataArray.push(component);
            }
          });
        }
        // }
      });
      await this.getK2RouterData(processSendDataArray);
      const parameterSelected = this.$refs.process
        .processParametersList.map((item) => ({ ...item }));
      const column = this.$refs.process.headerForCSV;
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
        fileName: 'process_parameters.csv',
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
    async getK2RouterData(mainidList) {
      await this.getParametersList(`?query=(parametercategory=="15"%7C%7Cparametercategory=="17"%7
            C%7Cparametercategory=="18")`);
      const fromDate = new Date(this.trecibilityState.fromdate).getTime();
      const toDate = new Date(this.trecibilityState.todate).getTime();
      await this.getSubStationElementsData(`?datefrom=${fromDate}&dateto=${toDate}`);
      await Promise.all(mainidList.map(async (request) => {
        const bomData = this.bomDetailsList.filter((bom) => bom.sublineid === request.sublineid
          && bom.parametername === 'subassemblyid' && bom.substationid === request.substationid);
        const subStationDataList = this.subStationListData
          .filter((sub) => sub.sublineid === bomData[0].boundsublineid);
        await Promise.all(subStationDataList.map(async (s) => {
          // const elementDetails = await this.getProcessElement(s.id);
          if (s[`headers_${s.id}`]) {
            s[`headers_${s.id}`].tags.forEach(async (element) => {
              if (element.tagName !== 'mainid') {
                const data = this.$refs.process.headerForCSV.includes(`${s.name}_${element.tagName}`);
                if (!data) {
                  this.$refs.process.headerForCSV.push(`${s.name}_${element.tagName}`);
                }
              }
            });
            const subAssemblyIdFieldName = `${request.substationname}_subassemblyid`;
            let processData = s[`data_${s.id}`];
            if (processData.length > 0) {
              processData = processData.filter((a) => a.mainid === request[subAssemblyIdFieldName]);
            }
            // await this.getProcessParameters({
            //   elementname: s.id,
            //   payload: `?query=mainid=="${request[subAssemblyIdFieldName]}"`,
            // });
            if (this.$refs.process.processParametersList.find((pro) => pro
              .mainid === request.mainid)) {
              const object = this.$refs.process.processParametersList.find((pp) => pp
                .mainid === request.mainid);
              this.$refs.process.processParametersList.splice(this.$refs
                .process.processParametersList
                .indexOf(object), 1);
              const processDataObject = processData[0];
              this.parametersList.filter((p) => p.substationid === s.id).forEach((para) => {
                if (processDataObject && object) {
                  if (processDataObject[para.name]) {
                    object[`${s.name}_${para.name}`] = processDataObject[para.name];
                  } else {
                    object[`${s.name}_${para.name}`] = 0;
                  }
                }
              });
              this.$refs.process.processParametersList.push(object);
            } else {
              const processDataObject = processData[0];
              if (processDataObject) {
                const object = {
                  mainid: request.mainid,
                  createdTimestamp: request.createdTimestamp,
                };
                this.parametersList.forEach((para) => {
                  if (processDataObject[para.name]) {
                    object[`${s.name}_${para.name}`] = processDataObject[para.name];
                  } else {
                    object[`${s.name}_${para.name}`] = 0;
                  }
                });
                this.$refs.process.processParametersList.push(object);
              }
            }
          }
        }));
      }));
    },
    async btnComponentLogic() {
      const fromDate = new Date(this.trecibilityState.fromdate).getTime();
      const toDate = new Date(this.trecibilityState.todate).getTime();
      let param = '';
      if (!this.trecibilityState.searchMainID && !this.trecibilityState.selectedSubLine
         && (fromDate || toDate)) {
        param = '?';
      } else {
        param = '?query=';
      }
      if (this.trecibilityState.searchMainID) {
        param += `mainid=="${this.trecibilityState.searchMainID}"||`;
        param += `carrierid=="${this.trecibilityState.searchMainID}"||`;
        param += `packagebatchid=="${this.trecibilityState.searchMainID}"||`;
        param += `componentvalue=="${this.trecibilityState.searchMainID}"||`;
        param += `completedproductid=="${this.trecibilityState.searchMainID}"&`;
      }
      if (this.trecibilityState.selectedSubStation) {
        param += `substationid=="${this.trecibilityState.selectedSubStation.id}"&`;
      }
      if (this.trecibilityState.selectedSubLine) {
        param += `sublineid=="${this.trecibilityState.selectedSubLine.id}"&`;
      }
      if (fromDate) {
        param += `datefrom=${fromDate}&`;
      }
      if (toDate) {
        param += `dateto=${toDate}&`;
      }
      param += 'sortquery=modifiedtimestamp==-1';
      // param += 'pagenumber=1&pagesize=20';
      await this.getComponentList(param);
      await this.getParametersList(`?query=sublineid=="${this.trecibilityState.selectedSubLine.id}"`);
      await Promise.all(this.componentList.map((com) => {
        const data = this.parametersList.filter((f) => f.name === `q_${com.componentname}`);
        console.log(data);
        if (data.length > 0 && this.currentLocale === 'zhHans') {
          com.componentname = data[0].chinesedescription;
        }
        return com;
      }));
    },
    async btnProcessParametersLogic() {
      this.processParametersList = [];
      const fromDate = new Date(this.trecibilityState.fromdate).getTime();
      const toDate = new Date(this.trecibilityState.todate).getTime();
      this.processParametersheader = [];
      this.processParametersheader.push('createdTimestamp', 'mainid');
      // let param = `?${(fromDate || toDate) ? '' : 'query='}`;
      let param = '';
      if (!this.trecibilityState.searchMainID && !this.trecibilityState.selectedSubStation
         && (fromDate || toDate)) {
        param = '?';
      } else {
        param = '?query=';
      }
      if (this.trecibilityState.searchMainID) {
        param += `mainid=="${this.trecibilityState.searchMainID}"||`;
        param += `carrierid=="${this.trecibilityState.searchMainID}"||`;
        param += `packagebatchid=="${this.trecibilityState.searchMainID}"||`;
        param += `componentvalue=="${this.trecibilityState.searchMainID}"||`;
        param += `completedproductid=="${this.trecibilityState.searchMainID}"&`;
      }
      if (this.trecibilityState.selectedSubStation) {
        param += `substationid=="${this.trecibilityState.selectedSubStation.id}"&`;
      }
      if (fromDate) {
        param += `datefrom=${fromDate}&`;
      }
      if (toDate) {
        param += `dateto=${toDate}&`;
      }
      param += 'sortquery=modifiedtimestamp==-1';
      console.log(param);
      // param += 'pagenumber=1&pagesize=20';
      // await this.getPartStatus(param);
      await this.getSubStations(`?query=sublineid=="${this.trecibilityState.selectedSubLine.id}"`);
      await Promise.all(this.subStationList.map(async (s) => {
        const elementDetails = await this.getProcessElement(s.id);
        if (elementDetails) {
          elementDetails.tags.forEach((element) => {
            if (element.tagName !== 'mainid') {
              const data = this.processParametersheader
                .filter((p) => p === element.tagName);
              if (data.length === 0) {
                this.processParametersheader.push(`${s.name}_${element.tagName}`);
              }
            }
          });
          await this.getParametersList(`?query=substationid=="${s.id}"%26%26(parametercategory=="15"%7C%7Cparametercategory=="17"%7C%7Cparametercategory=="18")`);
          this.$refs.partstatus.partStatusList.forEach(async (f) => {
            const processData = await this.getProcessParameters({
              elementname: s.id,
              payload: `?query=mainid=="${f.mainid}"`,
            });
            if (this.processParametersList.find((pro) => pro.mainid === f.mainid)) {
              const object = this.processParametersList.find((pp) => pp.mainid === f.mainid);
              this.processParametersList.splice(this.processParametersList.indexOf(object), 1);
              const processDataObject = processData[0];
              this.parametersList.forEach((para) => {
                if (processDataObject && object) {
                  if (processDataObject[para.name]) {
                    object[`${s.name}_${para.name}`] = processDataObject[para.name];
                  } else {
                    object[`${s.name}_${para.name}`] = 0;
                  }
                }
              });
              this.processParametersList.push(object);
            } else {
              const processDataObject = processData[0];
              if (processDataObject) {
                const object = {
                  mainid: f.mainid,
                  createdTimestamp: f.createdTimestamp,
                };
                this.parametersList.forEach((para) => {
                  if (processDataObject[para.name]) {
                    object[`${s.name}_${para.name}`] = processDataObject[para.name];
                  } else {
                    object[`${s.name}_${para.name}`] = 0;
                  }
                });
                this.processParametersList.push(object);
              }
            }
          });
        }
      }));
      // await Promise.all(this.subStationList.map(async (s) => {
      //   const elementDetails = await this.getProcessElement(s.id);
      //   if (elementDetails) {
      //     elementDetails.tags.forEach((element) => {
      //       if (element.tagName !== 'mainid') {
      //         const data = this.processParametersheader
      //           .filter((p) => p === element.tagName);
      //         if (data.length === 0) {
      //           console.log(element.tagName);
      //           this.processParametersheader.push(element.tagName);
      //         }
      //       }
      //     });
      //     const processData = await this.getProcessParameters({
      //       elementname: s.id,
      //       payload: param,
      //     });
      //     if (processData) {
      //       const finalData = processData.map((l) => ({
      //         ...l,
      //         substationname: s.name,
      //       }));
      //       if (this.processParametersList.length === 0) {
      //         this.processParametersList = finalData;
      //       } else {
      //         finalData.forEach((f) => {
      //           this.processParametersList.push(f);
      //         });
      //       }
      //     }
      //   }
      // }));
    },
    addToZip(file) {
      this.zipService.addFile(file);
    },
    async btnSearch() {
      if (this.newTrecibility.fromdate && this.newTrecibility.todate
         && !this.newTrecibility.selectedSubLine) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_SUBLINE',
        });
      } else if (this.newTrecibility.fromdate && !this.newTrecibility.todate
         && !this.newTrecibility.selectedSubLine) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_SUBLINE',
        });
      } else if (!this.newTrecibility.fromdate && this.newTrecibility.todate
         && !this.newTrecibility.selectedSubLine) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_SUBLINE',
        });
      } else {
        this.searchBtnLoading = true;
        await this.$refs.partstatus.btnSearchCheckOut();
        await this.$refs.overall.btnSearchCheckOut();
        await this.$refs.process.btnSearchProcessParameters();
        await this.$refs.quality.btnSearchProcessParameters();
        // this.$refs.partstatus.handleSubLineClick();
        if (this.recipeView === 0) {
          this.$refs.overall.btnSearchCheckOut();
          this.$refs.overall.handleSubLineClick();
          // this.$refs.partstatus.btnSearchCheckOut();
        }
        if (this.recipeView === 1) {
          this.$refs.process.btnSearchProcessParameters();
          // this.$refs.process.handleStationClick();
          // this.$refs.partstatus.btnSearchCheckOut();
        }
        if (this.recipeView === 2) {
          this.$refs.quality.btnSearchProcessParameters();
          this.$refs.quality.handleStationClick();
          // this.$refs.partstatus.btnSearchCheckOut();
        }
      }
    },
    async nextSearch() {
      this.$refs.partstatus.nextSearch();
      if (this.recipeView === 0) {
        this.$refs.overall.nextSearch();
      }
      if (this.recipeView === 1) {
        this.$refs.process.nextSearch();
      }
      if (this.recipeView === 2) {
        this.$refs.quality.nextSearch();
      }
    },
    async prevSearch() {
      this.$refs.partstatus.prevSearch();
      if (this.recipeView === 0) {
        this.$refs.overall.prevSearch();
      }
      if (this.recipeView === 1) {
        this.$refs.process.prevSearch();
      }
      if (this.recipeView === 2) {
        this.$refs.quality.prevSearch();
      }
    },
    // async clearInput() {
    //   this.newTrecibility.selectedSubLine = '';
    // },
  },
};
</script>
