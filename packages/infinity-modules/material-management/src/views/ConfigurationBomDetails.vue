<template>
  <div style="height:100%">
    <v-container fluid class="py-0">
      <v-row>
        <v-select
            hide-details
            label="Select Line name"
            :items="lineList"
            item-text="name"
            return-object
            @change="handleLineClick"/>
            <v-select
            class="ml-2"
            hide-details
            label="Select Subline name"
            :items="sublineList"
            item-text="name"
            return-object
            required
            @change="handleSubLineClick"/>
            <v-select
            class="ml-2"
            hide-details
            label="Select Station name"
            :items="sublineList"
            item-text="name"
            return-object
            required
            @change="handleSubLineClick"/>
            <v-select
            class="ml-2"
            hide-details
            label="Select Sub-Station name"
            :items="sublineList"
            item-text="name"
            return-object
            required
            @change="handleSubLineClick"/>
            <v-btn small color="primary" class="text-none ml-2 mt-2">
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
        <template v-slot:item.stationid="{ item }">
            {{ item.stationid }}
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
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'BomDetails',
  data() {
    return {
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
          text: 'Quality',
          value: 'qualitystatus',
        },
        {
          text: 'Saving',
          value: 'savedata',
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
  async created() {
    await this.handleGetDetails();
    // await this.getSubStationListForConfigScreen('');
    // console.log(this.substationList);
  },
  methods: {
    ...mapActions('bomManagement', ['getSubStationListForConfigScreen', 'getBomDetailsListRecords', 'getParameterList', 'updateRecordById']),
    handleLineClick() {
    },
    handleSubLineClick() {
    },
    async handleGetDetails() {
      const bomdetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
      console.log(bomdetailList);
      bomdetailList.forEach((element) => {
        element.configstatus.forEach((f) => {
          f[element.parametername] = false;
        });
        if (this.headerNext.filter((f) => f.value === element.parametername).length === 0) {
          this.headerNext.push(
            {
              text: element.parametername,
              value: element.parametername,
            },
          );
          // this.headers.push(
          //   {
          //     text: element.parametername,
          //     value: element.parametername,
          //   },
          // );
        }
      });
      console.log(bomdetailList);
      this.bomDetailList = bomdetailList;
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
  computed: {
    ...mapState('bomManagement', [
      'lineList',
      'sublineList',
      'subStationListForConfig',
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
