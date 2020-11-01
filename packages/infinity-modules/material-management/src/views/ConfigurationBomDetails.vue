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
        :items="bomDetailList"
        item-key="id"
        class="tableContainer mt-2"
        >
        <template v-slot:item.lineid="{ item }">
            {{ lineList.find((f) => Number(f.id) === item.lineid).name }}
        </template>
        <template v-slot:item.sublineid="{ item }">
            {{ sublineList.find((f) => f.id === item.sublineid).name }}
        </template>
        <template v-slot:item.station="{ item }">
            {{ item.station }}
        </template>
        <template v-slot:item.substation="{ item }">
            {{ item.substation }}
        </template>
        <template v-slot:item.configstatus="{ item }">
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
        </template>
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
          v-model="item.componentStatusSelected"
          @change="chanageComponentStatus(item)"
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
          value: 'substation',
        },
        // {
        //   text: 'Config Data',
        //   value: 'configstatus',
        // },
        {
          text: 'Parameter Name',
          value: 'parametername',
        },
        {
          text: 'Update Quality',
          value: 'qualitystatus',
        },
        {
          text: 'Save ID',
          value: 'savedata',
        },
        {
          text: 'Component Status',
          value: 'componentstatus',
        },
      ],
      headerNext: [
        {
          text: 'Config-Status',
          value: 'configtstaus',
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
      this.bomDetailList.forEach(async (bom) => {
        // set component status list to everystation
        // bom.componentStatusList = await this.getParameterList
        // (`?query=substationid=="${bom.substationid}"%26%26parametercategory=="32"`);
        const list = [{
          name: '-',
        }];
        list.push(...await this.getParameterList(`?query=substationid=="${bom.substationid}"%26%26parametercategory=="46"`));
        bom.componentStatusList = list;
      });
      // bomdetailList.forEach((element) => {
      //   element.configstatus.forEach((f) => {
      //     f[element.parametername] = false;
      //   });
      //   if (this.headerNext.filter((f) => f.value === element.parametername).length === 0) {
      //     this.headerNext.push(
      //       {
      //         text: element.parametername,
      //         value: element.parametername,
      //       },
      //     );
      //     // this.headers.push(
      //     //   {
      //     //     text: element.parametername,
      //     //     value: element.parametername,
      //     //   },
      //     // );
      //   }
      // });
      console.log(bomdetailList);
      this.bomDetailList = bomdetailList;
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
    },
    async checkSaveData(event, item) {
      const payload = {
        id: item._id,
        payload: {
          savedata: event,
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
