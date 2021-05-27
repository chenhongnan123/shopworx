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
        <!-- <v-col cols="2">
            <v-autocomplete
              class="ml-2"
              clearable
              label="Component Type"
              :items="compTypeList"
              return-object
              item-text="name"
              v-model="selectedComType"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
        </v-col> -->
        <v-col class="d-flex flex-row-reverse">
            <v-btn small color="primary" class="text-none ml-2 mt-2" @click="searchData">
            Search
          </v-btn>
          <v-btn small
            color="primary" class="text-none ml-2 mt-2" @click="btnExport">
            Export
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="bomDetailsConfigList"
        item-key="_id"
        class="tableContainer mt-2"
        >
        <template #item="{ item, headers }">
          <tr>
            <td>
              {{ lineList.find((f) => Number(f.id) === item.lineid).name }}
            </td>
            <td>
              {{ sublineList.find((f) => f.id === item.sublineid).name }}
            </td>
            <td>
              {{ stationList.find((f) => f.id === item.stationid).name }}
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              <div v-for="(status, i) in item.configstatus" :key="i" inset>
                {{ status.text }}
              </div>
            </td>
            <td v-for="(componentValues, i) in getComponents(item, headers)" :key="i" inset>
              <div v-for="(value, key) in componentValues" :key="key" ripple>
                <v-checkbox
                  v-if="typeof value === 'boolean'"
                  :input-value="value"
                  hide-details
                  @change="checkSaveDataQualityStatus($event, item, key)"
                ></v-checkbox>
                <v-select
                  v-else
                  label="-"
                  :items="item.componentStatusList"
                  return-object
                  solo
                  dense
                  depressed
                  item-text="name"
                  :value="value"
                  @input="parameter => chanageComponentStatus(item, parameter, key)"
                >
                <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-select>
                <!-- <v-text-field v-else :value="value" dense hide-details></v-text-field> -->
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';

export default {
  name: 'BomDetails',
  data() {
    return {
      componentSelectedItem: null,
      selectedLine: null,
      selectedSubline: null,
      selectedStation: null,
      selectedSubStation: null,
      selectedComType: null,
      saving: false,
      hideQcolumn: false,
      bomDetailList: [],
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
          value: 'name',
        },
        {
          text: 'Config Status',
          value: 'configstatus',
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
  watch: {
    selectedComType: {
      handler(val) {
        this.compareValues(val);
      },
      deep: true,
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
  async created() {
    this.zipService = ZipService;
    await this.getStations('');
    await this.getBomDetailsConfigList(`?query=bomid==${this.query.id}`);
    if (this.bomDetailsConfigList.length === 0) {
      const list = await this.getSubStationListForConfigScreen(
        {
          bomid: this.query.id,
          lineid: this.query.lineid,
        },
      );
      await this.createBomDetailConfigList(list);
      await this.getBomDetailsConfigList(`?query=bomid==${this.query.id}`);
    }
    const bomdetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
    bomdetailList.forEach((element) => {
      if (!this.headers.find((f) => f.text === element.parametername)) {
        this.headers.push(
          {
            text: element.parametername,
            value: `component_${element.parametername}`,
          },
        );
      }
    });
    // await this.handleGetDetails();
    // await this.getSubStationListForConfigScreen('');
    // this.subStationListForConfig.forEach(async (element) => {
    //   const clist = [{
    //     name: '-',
    //   }];
    //   clist.push(...await this.getParameterList
    // (`?query=substationid=="${element.id}"%26%26parametercategory=="46"`));
    //   element.componentStatusList = clist;
    // });
    // console.log(this.subStationListForConfig);
    // await this.getSubStationListForConfigScreen('');
    // console.log(this.substationList);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('bomManagement', [
      'getSubStationListForConfigScreen',
      'getBomDetailsListRecords',
      'getParameterList',
      'updateRecordById',
      'getSubLines',
      'getStations',
      'getSubStations',
      'getBomDetailsConfigList',
      'createBomDetailConfigList',
    ]),
    getComponents(item, headers) {
      const componentList = headers.filter((header) => header.value.includes('component_'));
      return componentList.map((component) => {
        const values = Object.keys(item)
          .filter((i) => i.includes(component.value))
          .reduce((acc, cur) => {
            acc[cur] = item[cur];
            return acc;
          }, {});
        return values;
      });
    },
    async compareValues(val) {
      if (val.componenttypeid === 'sValue') {
        this.hideQcolumn = true;
      } else {
        this.hideQcolumn = false;
      }
    },
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
      this.bomDetailList = bomdetailList;
      // const parametersList =
      // this.bomDetailList.forEach(async (bom) => {
      //   // set component status list to everystation
      //   // bom.componentStatusList = await this.getParameterList
      //   // (`?query=substationid=="${bom.substationid}"%26%26parametercategory=="32"`);
      //   const list = [{
      //     name: '-',
      //   }];
      //   list.push(...await this.getParameterList(`?query=substationid=="${bom.substationid}
      // "%26%26parametercategory=="46"`));
      //   bom.componentStatusList = list;
      // });
      bomdetailList.forEach((element) => {
        if (!this.headers.find((f) => f.text === element.parametername)) {
          this.headers.push(
            {
              text: element.parametername,
              value: `component_${element.parametername}`,
            },
          );
        }
      });
      const detail = {};
      bomdetailList.forEach((element) => {
        element.configstatus.forEach((status) => {
          if (status.name === 'componentstatus') {
            detail[`${status.name}_component_${element.parametername}`] = element[status.name] || '';
          } else {
            if (element[status.name]) {
              detail[`${status.name}_component_${element.parametername}`] = element[status.name];
            } else {
              detail[`${status.name}_component_${element.parametername}`] = false;
            }
          }
          // console.log({
          //   config: status.name,
          //   component: element.parametername,
          //   value: element[status.name],
          // });
        });
      });
      const newList = [];
      bomdetailList.forEach(async (element) => {
        const list = [{
          name: '-',
        }];
        list.push(...await this.getParameterList(`?query=substationid=="${element.substationid}"%26%26parametercategory=="46"`));
        element.componentStatusList = list;
        newList.push({ ...element, ...detail });
      });
      this.bomDetailList = newList;
    },
    async searchData() {
      let param = `?query=bomid==${this.query.id}`;
      if (this.selectedLine) {
        param += `%26%26lineid==${this.selectedLine.id}`;
      }
      if (this.selectedSubline) {
        param += `%26%26sublineid=="${this.selectedSubline.id}"`;
      }
      if (this.selectedStation) {
        param += `%26%26stationid=="${this.selectedStation.id}"`;
      }
      if (this.selectedSubStation) {
        param += `%26%26substationid=="${this.selectedSubStation.id}"`;
      }
      const bomdetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
      bomdetailList.forEach((element) => {
        if (!this.headers.find((f) => f.text === element.parametername)) {
          this.headers.push(
            {
              text: element.parametername,
              value: `component_${element.parametername}`,
            },
          );
        }
      });
      await this.getBomDetailsConfigList(param);
    },
    async checkSaveDataQualityStatus(event, item, key) {
      // key = "qualitystatus_component_pcbaid"
      // const data = key.split('_component_');
      const payload = {
        id: item._id,
        payload: {
          [key]: event,
        },
      };
      this.saving = true;
      const updateResult = await this.updateRecordById(payload);
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'DATA_UPDATED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DATA_UPDATE',
        });
      }
    },
    async chanageComponentStatus(item, parameter, key) {
      const payload = {
        id: item._id,
        payload: {
          [key]: parameter.name,
        },
      };
      this.saving = true;
      const updateResult = await this.updateRecordById(payload);
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
      // this.bomDetailList = await this.getBomDetailsListRecords
      // (`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
    },
    async checkQualityStatus(event, item) {
      const payload = {
        id: item._id,
        payload: {
          qualitystatus: event,
        },
      };
      this.saving = true;
      const updateResult = await this.updateRecordById(payload);
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
    async btnExport() {
      // const selectedLine = this.query.line;
      const selectedBomName = this.query.name;
      const fileName = `${selectedBomName}-BomConfiguration`;
      const currentContext = this.bomDetailsConfigList;
      // const selectedBomNum = this.query.number;
      const csvContent = [];
      const column = [
        'lineid',
        'sublineid',
        'stationid',
        'substationid',
        'configstatus',
      ];
      const header = [
        'Line',
        'Subline',
        'Station',
        'SubStation',
        'Config Status',
        'pcbaid',
        'pipestringid',
        'coverid',
        'screwbatchid',
      ];
      currentContext.forEach((bom) => {
        const arr = [];
        column.forEach((key) => {
          if (key === 'configstatus') {
            arr.push(bom.configstatus[0].name);
            arr.push(bom.qualitystatus_component_pcbaid);
            arr.push(bom.qualitystatus_component_pipestringid);
            arr.push(bom.qualitystatus_component_coverid);
            arr.push(bom.qualitystatus_component_screwbatchid);
          } if (key === 'configstatus') {
            arr.push(bom.configstatus[1].name);
            arr.push(bom.savedata_component_pcbaid);
            arr.push(bom.savedata_component_pipestringid);
            arr.push(bom.savedata_component_coverid);
            arr.push(bom.savedata_component_screwbatchid);
          } if (key === 'configstatus') {
            arr.push(bom.configstatus[2].name);
            arr.push(bom.componentstatus_component_pcbaid);
            arr.push(bom.componentstatus_component_pipestringid);
            arr.push(bom.componentstatus_component_coverid);
            arr.push(bom.componentstatus_component_screwbatchid);
          } else {
            arr.push(bom[key]);
          }
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
