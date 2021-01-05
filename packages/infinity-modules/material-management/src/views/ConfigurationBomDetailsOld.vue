<template>
  <div style="height:100%">
    <v-container fluid class="py-0">
      <v-row>
        <v-col cols="2">
            <v-autocomplete
              class="ml-2"
              clearable
              label="Line name"
              :items="lineList"
              return-object
              item-text="name"
              v-model="selectedLine"
              @change="handleLineClick"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
        </v-col>
        <v-col cols="2">
            <v-autocomplete
              class="ml-2"
              clearable
              label="Subline name"
              :items="sublineList"
              return-object
              item-text="name"
              v-model="selectedSubLine"
              @change="handleSubLineClick"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
        </v-col>
        <v-col cols="2">
            <v-autocomplete
              class="ml-2"
              clearable
              label="Station name"
              :items="stationList"
              return-object
              item-text="name"
              v-model="selectedStation"
              @change="handleStationClick"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
        </v-col>
        <v-col cols="2">
            <v-autocomplete
              class="ml-2"
              clearable
              label="Sub-Station name"
              :items="subStations"
              return-object
              item-text="name"
              v-model="selectedSubStation"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
        </v-col>
        <v-col cols="2">
            <v-autocomplete
              class="ml-2"
              clearable
              label="Component Type"
              :items="compTypeList"
              return-object
              item-text="name"
              v-model="selectedComType"
              @change="filterByCompType"
              :disabled="dataload"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
        </v-col>
        <v-col class="d-flex flex-row-reverse">
            <v-btn small color="primary" class="text-none ml-2 mt-2" @click="searchData">
            Search
          </v-btn>
          <v-btn small
            color="primary" class="text-none ml-2 mt-2" @click="btnExport">
            Export
          </v-btn>
        </v-col>
            <!-- <v-btn small color="primary" class="text-none ml-2 mt-2">
            Search
          </v-btn> -->
      </v-row>
      <v-data-table
        :disabled="!myloadingvariable"
        :headers="selectedHeaders"
        :items="bomDetailList"
        item-key="id"
        class="tableContainer"
        :loading="myloadingvariable"
        loading-text="Loading...please wait"
        >
        <template v-slot:item.lineid="{ item }">
            {{ lineList.find((f) => Number(f.id) === item.lineid).name }}
        </template>
        <template v-slot:item.sublineid="{ item }">
            {{ sublineList.find((f) => f.id === item.sublineid).name }}
        </template>
        <template v-slot:item.stationid="{ item }">
            {{ item.station }}
        </template>
        <template v-slot:item.substation="{ item }">
            {{ item.substation }}
        </template>
        <!-- <template v-slot:item.configstatus="{ item }">
          <v-data-table
          :items="item.configstatus"
          :headers="headerNext"
          hide-default-footer
          >
          <template v-slot:i="{ i }">
            <span v-if="i.configstatus">{{ i.configstatus }}</span>
            <span v-else>
              <v-checkbox
               primary
               hide-details
               @change="checkQualityStatus($event, i)"
               ></v-checkbox>
            </span>
        </template>
          </v-data-table>
        </template> -->
        <template v-slot:item.qualitystatus="{ item }">
         <v-checkbox
               primary
               hide-details
               :value = item.qualitystatus
               v-model="item.qualitystatus"
               @change="checkQualityStatus($event, item)"
               ></v-checkbox>
        </template>
        <template v-slot:item.savedata="{ item }">
         <v-checkbox
               primary
               hide-details
               :value = item.savedata
               v-model="item.savedata"
               @change="checkSaveData($event, item)"
               ></v-checkbox>
        </template>
        <template v-slot:item.componentstatus="{ item }">
         <v-select
          label="-"
          :items="item.componentStatusList"
          :disabled="saving"
          return-object
          solo
          dense
          depressed
          item-text="name"
          item-value="name"
          v-model="item.componentstatus"
          @change="parameter => chanageComponentStatus(item, parameter)"
        >
        <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
         </v-select>
         </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';

export default {
  name: 'BomDetails',
  data() {
    return {
      saving: false,
      bomDetailList: [],
      selectedLine: null,
      selectedSubLine: null,
      selectedStation: null,
      selectedSubStation: null,
      selectedComType: null,
      selectedHeaders: [],
      paramSelection: null,
      myloadingvariable: false,
      orignalBomList: false,
      dataload: false,
      qHeader: [
        {
          text: 'Line',
          value: 'lineid',
        },
        {
          text: 'Subline',
          value: 'sublineid',
        },
        {
          text: 'Station',
          value: 'stationid',
        },
        {
          text: 'Substation',
          value: 'substation',
        },
        {
          text: 'Component',
          value: 'parametername',
        },
        { text: 'Component Status', value: 'componentstatus', width: 180 },
      ],
      sHeaders: [
        {
          text: 'Line',
          value: 'lineid',
        },
        {
          text: 'Subline',
          value: 'sublineid',
        },
        {
          text: 'Station',
          value: 'stationid',
        },
        {
          text: 'Substation',
          value: 'substation',
        },
        // {
        //   text: 'Config Data',
        //   value: 'configstatus',
        // },
        {
          text: 'Component',
          value: 'parametername',
        },
        {
          text: 'Quality',
          value: 'qualitystatus',
        },
        {
          text: 'Saving',
          value: 'savedata',
        },
        // { text: 'Component Status', value: 'componentstatus', width: 180 },
      ],
      headers: [
        {
          text: 'Line',
          value: 'lineid',
        },
        {
          text: 'Subline',
          value: 'sublineid',
        },
        {
          text: 'Station',
          value: 'stationid',
        },
        {
          text: 'Substation',
          value: 'substation',
        },
        {
          text: 'Component',
          value: 'parametername',
        },
        {
          text: 'Quality',
          value: 'qualitystatus',
        },
        {
          text: 'Saving',
          value: 'savedata',
        },
        { text: 'Component Status', value: 'componentstatus', width: 180 },
      ],
      headerNext: [
        {
          text: 'Config-Status',
          value: 'configtstaus',
        },
      ],
      compTypeList: [
        {
          name: 'S',
          value: 's',
          componenttypeid: 'sValue',
        },
        {
          name: 'Q',
          value: 'q',
          componenttypeid: 'qValue',
        },
      ],
    };
  },
  async created() {
    this.dataload = true;
    await this.handleGetDetails();
    this.dataload = false;
    this.zipService = ZipService;
    this.selectedHeaders = this.headers;
    // await this.getSubStationListForConfigScreen('');
    // console.log(this.substationList);
  },
  methods: {
    ...mapActions('bomManagement', [
      'getSubStationListForConfigScreen',
      'getBomDetailsListRecords',
      'getParameterList',
      'updateRecordById',
      'getBomDetailsConfigList',
      'updateDetailsConfigByQuery',
      'updateDeatilsById',
      'getSubLines',
      'getStations',
      'getSubStations',
    ]),
    async handleLineClick(item) {
      const query = `?query=lineid==${item.id}`;
      await this.getSubLines(query);
    },
    async handleSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getStations(query);
    },
    async handleStationClick(item) {
      const query = `?query=stationid=="${item.id}"`;
      await this.getSubStations(query);
    },
    async handleGetDetails() {
      const bomdetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
      await this.getBomDetailsConfigList(`?query=bomid==${this.query.id}`);
      bomdetailList.forEach(async (element) => {
        const data = this.bomDetailsConfigList.find((f) => f.id === element.substationid);
        element.componentStatusList = data.componentStatusList;
        const qualityStatusName = `qualitystatus_component_${element.parametername}`;
        const saveDataName = `savedata_component_${element.parametername}`;
        const componentStatusName = `componentstatus_component_${element.parametername}`;
        element.qualitystatus = data[qualityStatusName];
        element.savedata = data[saveDataName];
        element.componentstatus = data[componentStatusName];
      });
      this.bomDetailList = bomdetailList;
    },
    async checkSaveData(event, item) {
      let payload = {
        id: item._id,
        payload: {
          savedata: event,
        },
      };
      this.saving = true;
      let updateResult = await this.updateDeatilsById(payload);
      payload = {
        query: `?query=bomid==${this.query.id}%26%26id=="${item.substationid}"`,
        payload: {
          [`savedata_component_${item.parametername}`]: event,
        },
      };
      updateResult = await this.updateDetailsConfigByQuery(payload);
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'UPDATE_SUBSTATION',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_SUBSTATION',
        });
      }
    },
    async checkQualityStatus(event, item) {
      let payload = {
        id: item._id,
        payload: {
          qualitystatus: event,
        },
      };
      this.saving = true;
      let updateResult = await this.updateDeatilsById(payload);
      payload = {
        query: `?query=bomid==${this.query.id}%26%26id=="${item.substationid}"`,
        payload: {
          [`qualitystatus_component_${item.parametername}`]: event,
        },
      };
      updateResult = await this.updateDetailsConfigByQuery(payload);
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'UPDATE_SUBSTATION',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_SUBSTATION',
        });
      }
    },
    async chanageComponentStatus(item, parameter) {
      let payload = {
        id: item._id,
        payload: {
          componentstatus: parameter.name,
        },
      };
      this.saving = true;
      let updateResult = await this.updateDeatilsById(payload);
      payload = {
        query: `?query=bomid==${this.query.id}%26%26id=="${item.substationid}"`,
        payload: {
          [`componentstatus_component_${item.parametername}`]: parameter.name,
        },
      };
      updateResult = await this.updateDetailsConfigByQuery(payload);
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'UPDATE_COMPONENTSTATUS',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_COMPONENTSTATUS',
        });
      }
    },
    async filterByCompType(item) {
      await this.searchData();
      if (item.value === 's') {
        this.bomDetailList = this.orignalBomList;
        const filtered = this.bomDetailList.filter((str) => str.parametername.includes('s_'));
        this.paramSelection = filtered;
        this.bomDetailList = [];
        this.bomDetailList = this.paramSelection;
        this.paramSelection = [];
      } else if (item.value === '' || item.value === undefined) {
        this.bomDetailList = this.orignalBomList;
      } else {
        this.bomDetailList = this.orignalBomList;
        const qFiltered = this.bomDetailList.filter((str) => str.parametername.includes('q_'));
        this.paramSelection = qFiltered;
        this.bomDetailList = [];
        this.bomDetailList = this.paramSelection;
        this.paramSelection = [];
      }
    },
    async searchData() {
      this.dataload = false;
      this.myloadingvariable = true;
      let param = `?query=bomid==${this.query.id}`;
      if (this.selectedLine) {
        param += `%26%26lineid==${this.selectedLine.id}`;
      }
      if (this.selectedSubLine) {
        param += `%26%26sublineid=="${this.selectedSubLine.id}"`;
      }
      if (this.selectedStation) {
        param += `%26%26stationid=="${this.selectedStation.id}"`;
      }
      if (this.selectedSubStation) {
        param += `%26%26substationid=="${this.selectedSubStation.id}"`;
      }
      // if (this.selectedComType) {
      //   this.filtered();
      // }
      const bomdetailList = await this.getBomDetailsListRecords(param);
      await this.getBomDetailsConfigList(param);
      bomdetailList.forEach(async (element) => {
        const data = this.bomDetailsConfigList.find((f) => f.id === element.substationid);
        element.componentStatusList = data.componentStatusList;
        const qualityStatusName = `qualitystatus_component_${element.parametername}`;
        const saveDataName = `savedata_component_${element.parametername}`;
        const componentStatusName = `componentstatus_component_${element.parametername}`;
        element.qualitystatus = data[qualityStatusName];
        element.savedata = data[saveDataName];
        element.componentstatus = data[componentStatusName];
      });
      this.orignalBomList = bomdetailList;
      this.bomDetailList = bomdetailList;
      this.myloadingvariable = false;
    },
    async btnExport() {
      const selectedLine = this.query.line;
      const selectedBomName = this.query.name;
      const fileName = `${selectedLine}-${selectedBomName}-BomDetails`;
      const currentContext = this.bomDetailList;
      // const selectedBomNum = this.query.number;
      const csvContent = [];
      const column = [
        'line',
        'subline',
        'station',
        'substation',
        'parametername',
        'qualitystatus',
        'savedata',
        'componentstatus',
      ];
      const header = [
        'Line',
        'Subline',
        'Station',
        'SubStation',
        'Component Name',
        'Quality Status',
        'Save Data',
        'Component Status',
      ];
      currentContext.forEach((bom) => {
        const arr = [];
        column.forEach((key) => {
          arr.push(bom[key]);
        });
        csvContent.push(arr);
      });
      const csvParser = new CSVParser();
      const content = csvParser.unparse({
        fields: header,
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
        message: 'Downloaded_Bom_Details',
      });
      return content;
    },
    addToZip(file) {
      this.zipService.addFile(file);
    },
  },
  watch: {
    selectedComType: {
      handler(val) {
        if (val.componenttypeid === 'qValue') {
          this.selectedHeaders = this.qHeader;
        } else if (val.componenttypeid === undefined || val.componenttypeid === '') {
          this.selectedHeaders = this.headers;
        } else {
          this.selectedHeaders = this.sHeaders;
        }
      },
      deep: true,
    },
    selectedLine: {
      handler(val) {
        if (val) {
          this.dataload = true;
        } else {
          this.dataload = false;
        }
      },
    },
  },
  computed: {
    ...mapState('bomManagement', [
      'lineList',
      'sublineList',
      'stationList',
      'subStations',
      'subStationListForConfig',
      'bomDetailsConfigList',
    ]),
  },
  props: ['query'],
};
</script>
<style>
  .tableContainer .v-select{
    height: 30px;
  }
  .tableContainer .v-input__slot{
    width: 150px;
  }
  .tableContainer .v-text-field.v-text-field--solo.v-input--dense > .v-input__control{
    min-height: 30px;
  }
</style>
