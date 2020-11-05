<template>
  <div style="height:100%">
    <v-container fluid class="py-0">
      <v-row>
            <v-autocomplete
              class="ml-2"
              clearable
              label="Select Line name"
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
            <v-autocomplete
              class="ml-2"
              clearable
              label="Select Subline name"
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
            <v-autocomplete
              class="ml-2"
              clearable
              label="Select Station name"
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
            <v-autocomplete
              class="ml-2"
              clearable
              label="Select Sub-Station name"
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
            <v-btn small color="primary" class="text-none ml-2 mt-2" @click="searchData">
            Search
          </v-btn>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="subStationListForConfig"
        item-key="id"
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
              {{ item.station }}
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              <div v-for="(status, i) in item.configstatus" :key="i">
                {{ status.text }}
              </div>
            </td>
            <td v-for="(componentValues, i) in getComponents(item, headers)" :key="i">
              <div v-for="(value, key) in componentValues" :key="key">
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
                  item-value="name"
                  :value="value"
                  @change="chanageComponentStatus(item)"
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

export default {
  name: 'BomDetails',
  data() {
    return {
      selectedLine: null,
      selectedSubline: null,
      selectedStation: null,
      selectedSubStation: null,
      saving: false,
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
          value: 'station',
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
    };
  },
  computed: {
    ...mapState('bomManagement', [
      'lineList',
      'sublineList',
      'stationList',
      'subStations',
      'subStationListForConfig',
    ]),
  },
  props: ['query'],
  async created() {
    await this.handleGetDetails();
    await this.getSubStationListForConfigScreen('');
    this.subStationListForConfig.forEach(async (element) => {
      const clist = [{
        name: '-',
      }];
      clist.push(...await this.getParameterList(`?query=substationid=="${element.id}"%26%26parametercategory=="46"`));
      element.componentStatusList = clist;
    });
    console.log(this.subStationListForConfig);
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
          console.log(status.name);
          console.log(element[status.name]);
          if (status.name === 'componentstatus') {
            detail[`${status.name}_component_${element.parametername}`] = element[status.name] || '';
          } else {
            if (element[status.name]) {
              detail[`${status.name}_component_${element.parametername}`] = element[status.name];
            } else {
              detail[`${status.name}_component_${element.parametername}`] = false;
            }
            console.log('');
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
      console.log(newList);
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
      const bomdetailList = await this.getBomDetailsListRecords(param);
      this.bomDetailList = bomdetailList;
      this.bomDetailList.forEach(async (bom) => {
        const list = [{
          name: '-',
        }];
        list.push(...await this.getParameterList(`?query=substationid=="${bom.substationid}"%26%26parametercategory=="46"`));
        bom.componentStatusList = list;
      });
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
            detail[`${status.name}_component_${element.parametername}`] = element[status.name] || false;
          }
        });
      });
      const newList = [];
      bomdetailList.forEach((element) => {
        newList.push({ ...element, ...detail });
      });
      this.bomDetailList = newList;
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
    async chanageComponentStatus(item) {
      const { componentStatusSelected } = item;
      // const substationItem = this.substationList
      console.log(this.componentStatusSelected);
      const payload = {
        id: item._id,
        payload: {
          componentStatusSelected,
          componentstatus: componentStatusSelected.name,
        },
      };
      console.log(payload, 'payload');
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
