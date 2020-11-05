<template>
  <div style="height:100%">
    <v-container fluid class="py-0">
      <!-- <v-toolbar
        flat
        dense
        class="stick"
        :color="$vuetify.theme.dark ? '#121212': ''"
      > -->
        <!-- <v-btn small color="primary" outlined class="text-none ml-2" @click="handleGetData">
          <v-icon small left>mdi-refresh</v-icon>
          Get Data
        </v-btn> -->
        <!-- <v-btn small color="error"
          outlined
          class="text-none ml-2"
          @click="confirmListDialog = true"
          v-if="bomDetailList.length && bomDetailSelected.length">
          <v-icon small left>mdi-delete</v-icon>
          Delete
        </v-btn> -->
      <!-- </v-toolbar> -->
      <v-row>
        <v-col cols="2">
          <v-text-field
            v-if="!!lineList.filter((item) => item.id === query.lineid)[0]"
            :value="lineList.filter((item) => item.id === query.lineid)[0].name"
            label="Line"
            disabled
          ></v-text-field>
          <v-text-field
            v-else
            label="Line"
            disabled
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="2">
          <v-text-field
            v-if="!!sublineList.filter((item) => item.id === query.sublineid)[0]"
            :value="sublineList.filter((item) => item.id === query.sublineid)[0].name"
            label="Subline"
            disabled
          ></v-text-field>
          <v-text-field
            v-else
            label="Subline"
            disabled
          ></v-text-field>
        </v-col> -->
        <v-col cols="2">
          <v-text-field
            :value="query.name"
            label="BOM"
            disabled
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            :value="query.bomnumber"
            label="Number"
            disabled
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        v-model="bomDetailSelected"
        :headers="headers"
        :items="bomDetailList"
        item-key="id"
        class="tableContainer"
        >
        <template v-slot:item.savedata="{ item }">
         <v-checkbox
               primary
               hide-details
               :value = item.savedata
               v-model="item.savedata"
               @change="checkSaveData($event, item)"
               ></v-checkbox>
        </template>
        <template v-slot:item.boundsublinename="{ item }">
         <v-select
          v-if="item.parametercategory === '21'"
          label="-"
          :items="sublineList"
          :disabled="saving"
          return-object
          solo
          dense
          depressed
          item-text="name"
          v-model="item.stationSelected"
          @change="chanageStation(item)"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
         </v-select>
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
        <template v-slot:item.materialname="props">
          <v-select
            :disabled="saving"
            :items="materialListChoice"
            v-model="props.item.materialname"
            @change="handleChangeMaterial(props.item)"
            label="-"
            item-text="name"
            solo
            dense
            depressed
          ></v-select>
        </template>
        <template v-slot:item.materialcategory="props" v-if="categoryList.length">
        {{categoryList.filter((category) => Number(props.item.materialcategory) === category.id)[0]
        && categoryList.filter((category) => Number(props.item.materialcategory) === category.id)
        [0].name}}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            small
            color="error"
            @click="deleteItem(item)"
          >
            <v-icon v-text="'$delete'"></v-icon>
          </v-btn>
        </template>
        <template v-slot:top>
          <v-dialog
            persistent
            scrollable
            v-model="confirmDialog"
            max-width="500px"
            transition="dialog-transition"
          >
            <v-card>
              <v-card-title primary-title>
                <span>
                  Please confirm
                </span>
                <v-spacer></v-spacer>
                <v-btn icon small @click="confirmDialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                Are you sure to delete the item?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  class="text-none"
                  :loading="saving"
                  @click="handleDeleteItem"
                >
                  Yes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
      <v-dialog
        persistent
        scrollable
        v-model="confirmListDialog"
        max-width="500px"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-title primary-title>
            <span>
              Please confirm
            </span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="confirmListDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            Are you sure to delete the items?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="text-none"
              :loading="saving"
              @click="handleDeleteItemList"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'BomDetails',
  data() {
    return {
      bomDetailList: [],
      bomDetailSelected: [],
      parameterListForComponentStatus: [],
      headers: [
        {
          text: 'Line',
          value: 'line',
        },
        {
          text: 'Subline',
          value: 'subline',
        },
        {
          text: 'Substation',
          value: 'substation',
        },
        {
          text: 'Component Name',
          value: 'parametername',
        },
        // { text: 'Check Result', value: 'componentstatus', width: 180 },
        { text: 'Material', value: 'materialname', width: 120 },
        { text: 'Bound Sub-Line', value: 'boundsublinename', width: 180 },
        // { text: 'Bound Substation', value: 'boundsubstationname', width: 180 },
        // { text: 'Save Date?', value: 'savedata', width: 180 },
        // { text: 'Material TypeID', value: 'materialtype', width: 180 },
        // { text: 'Category', value: 'materialcategory', width: 120 },
        { text: 'Actions', value: 'actions', width: 120 },
      ],
      materialname: '',
      substationname: '',
      confirmDialog: false,
      confirmListDialog: false,
      bomdetailObjDefault: null,
      saving: false,
      stationSelected: '',
      componentStatusSelected: '',
    };
  },
  async created() {
    console.log(this.query, 'query');
    await this.getMaterialListRecords('');
    await this.getMaterialListChoice('');
    await this.handleGetDetails();
    await this.getSublineList('');
    // await this.configurationLogic();
    // await this.getSubStationList('');
    // this.getFilteredSubstation();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('bomManagement', [
      'getBomDetailsListRecords',
      'getParameterList',
      'createBomdetailList',
      'createBomDetailConfigList',
      'deleteBomDetail',
      'updateBomDetail',
      'updateRecordById',
      'getSublineList',
      'getSubStationList',
      'getSubStationListForConfigScreen',
    ]),
    ...mapActions('materialManagement', ['getMaterialListRecords', 'getMaterialListChoice']),
    async getFilteredsubstation() {
      await this.getSubStationList('');
    },
    // async getFilteredSubstation() {
    //   const sub = await this.getBomDetailsListRecords();
    //   await this.getSubStationList(`?query=sublineid=="${sub[0].sublineid}"`);
    // },
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
      console.log(this.bomDetailList);
      if (this.bomDetailList.length === 0) {
        await this.handleGetData();
        await this.getSubStationListForConfigScreen('');
        this.subStationListForConfig.forEach(async (element) => {
          const clist = [{
            name: '-',
          }];
          clist.push(...await this.getParameterList(`?query=substationid=="${element.id}"%26%26parametercategory=="46"`));
          element.componentStatusList = clist;
          element.bomid = this.query.id;
        });
        console.log(this.subStationListForConfig);
        let finalList = [];
        if (this.subStationListForConfig && this.subStationListForConfig.length) {
          finalList = this.subStationListForConfig.map((l) => ({
            ...l,
          }));
        }
        console.log(finalList);
        // await this.createBomDetailConfigList(finalList);
      }
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
    async getComponentStatusList(item) {
      console.log(item);
      item.componentStatusList = await this.getParameterList(`?query=substationid=="${item.substationid}"%26%26parametercategory=="46"`);
    },
    async handleGetData() {
      const parameterList = (await this.getParameterList(`?query=lineid==${this.query.lineid || null}`))
        .filter((parameter) => Number(parameter.parametercategory) === 24
        || Number(parameter.parametercategory) === 26
        || Number(parameter.parametercategory) === 21);
      console.log(parameterList, 'parameterList');

      if (this.bomDetailList.length) {
        await Promise.all(this.bomDetailList.map(
          (bomdetail) => this.deleteBomDetail(bomdetail._id),
        ));
        this.bomDetailList = [];
      }
      if (parameterList.length > 0) {
        const bomDetailList = parameterList.map((parameter) => ({
          lineid: parameter.lineid,
          sublineid: parameter.sublineid,
          stationid: parameter.stationid,
          substationid: parameter.substationid,
          bomid: this.query.id,
          name: this.query.name,
          parametername: parameter.name,
          parametercategory: parameter.parametercategory,
          materialname: '',
          materialtype: '',
          materialcategory: '',
          assetid: 4,
        }));
        await this.createBomdetailList(bomDetailList);
        this.bomDetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
      }
    },
    // configurationLogic() {
    // },
    async chanageStation(item) {
      const { stationSelected } = item;
      // const substationItem = this.substationList
      //   .filter((substation) => stationSelected === substation.name)[0];
      let payload;
      if (stationSelected.name !== '-') {
        payload = {
          id: item._id,
          payload: {
            stationSelected,
            boundsublinename: stationSelected.name,
            boundsublineid: stationSelected.id,
          },
        };
      } else {
        // stationSelected = '';
        payload = {
          id: item._id,
          payload: {
            stationSelected,
            boundsublinename: '',
            boundsublineid: '',
          },
        };
      }
      console.log(payload, 'payload');
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
      // this.bomDetailList = await this.getBomDetailsListRecords
      // (`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
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
    async handleChangeMaterial(item) {
      let { materialname } = item;
      const materialItem = this.materialList
        .filter((material) => materialname === material.name)[0];
      let payload = {};
      if (materialname !== '-') {
        payload = {
          id: item._id,
          payload: {
            materialname,
            materialtype: materialItem.materialtype,
            materialcategory: materialItem.materialcategory,
          },
        };
      } else {
        materialname = '';
        payload = {
          id: item._id,
          payload: {
            materialname,
            materialtype: '',
            materialcategory: '',
          },
        };
      }
      console.log(payload, 'payload');
      this.saving = true;
      const updateResult = await this.updateRecordById(payload);
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'UPDATE_MATERIAL',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_MATERIAL',
        });
      }
      // this.bomDetailList =
      // await this.getBomDetailsListRecords
      // (`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
    },
    deleteItem(item) {
      this.confirmDialog = true;
      this.bomdetailObjDefault = item;
    },
    async handleDeleteItem() {
      this.saving = true;
      const deleteResult = await this.deleteBomDetail(this.bomdetailObjDefault._id);
      this.saving = false;
      if (deleteResult) {
        this.bomDetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'BOM_DETAIL_DELETED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_BOM_DETAIL',
        });
      }
      this.confirmDialog = false;
    },
    async handleDeleteItemList() {
      this.saving = true;
      const results = await Promise.all(this.bomDetailSelected.map(
        (bomDetail) => this.deleteBomDetail(bomDetail._id),
      ));
      if (results.every((bool) => bool === true)) {
        this.bomDetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
        this.bomDetailSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'BOM_DETAIL_DELETED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_BOM_DETAIL',
        });
      }
      this.saving = false;
      this.confirmListDialog = false;
    },
  },
  computed: {
    ...mapState('bomManagement', ['bomList', 'categoryList', 'lineList', 'sublineList', 'lineValue', 'sublineValue', 'parameterList', 'substationList', 'subStationListForConfig']),
    ...mapState('materialManagement', ['materialList', 'materialListChoice']),
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
