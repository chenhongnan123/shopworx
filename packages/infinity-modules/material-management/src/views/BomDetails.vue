<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>BOM Details</span>
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
    <v-container fluid class="py-0">
      <v-btn icon @click="$router.push({ name: 'materialManagement' })">
      <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>BOM Name: {{query.name}}</span>
      <span></span>
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
        <template v-slot:item.boundsubstationname="{ item }">
         <v-select
          v-if="item.parametercategory === '24'"
          label="-"
          :items="substationList"
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
          text: 'Parameter Name',
          value: 'parametername',
        },
        { text: 'Material', value: 'materialname', width: 120 },
        { text: 'Bound Substation', value: 'boundsubstationname', width: 180 },
        { text: 'Component Status', value: 'componentstatus', width: 180 },
        { text: 'Save Date?', value: 'savedata', width: 180 },
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
    await this.getMaterialListRecords('');
    await this.getMaterialListChoice('');
    await this.handleGetDetails();
    await this.getSubStationList('');
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('bomManagement', ['getBomDetailsListRecords', 'getParameterList', 'createBomdetailList', 'deleteBomDetail', 'updateBomDetail', 'updateRecordById', 'getSublineList', 'getSubStationList']),
    ...mapActions('materialManagement', ['getMaterialListRecords', 'getMaterialListChoice']),
    async getFilteredsubstation() {
      await this.getSubStationList('');
    },
    async handleGetDetails() {
      const bomdetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
      this.bomDetailList = bomdetailList;
      this.bomDetailList.forEach(async (bom) => {
        const list = [{
          name: '-',
        }];
        list.push(...await this.getParameterList(`?query=substationid=="${bom.substationid}"%26%26parametercategory=="46"`));
        bom.componentStatusList = list;
      });
      if (this.bomDetailList.length === 0) {
        this.handleGetData();
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
      item.componentStatusList = await this.getParameterList(`?query=substationid=="${item.substationid}"%26%26parametercategory=="46"`);
    },
    async handleGetData() {
      const parameterList = (await this.getParameterList(`?query=lineid==${this.query.lineid || null}`))
        .filter((parameter) => Number(parameter.parametercategory) === 24
        || Number(parameter.parametercategory) === 26);

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
    async chanageStation(item) {
      const { stationSelected } = item;
      let payload;
      if (stationSelected.name !== '-') {
        payload = {
          id: item._id,
          payload: {
            stationSelected,
            boundsubstationname: stationSelected.name,
            boundsubstationid: stationSelected.id,
          },
        };
      } else {
        payload = {
          id: item._id,
          payload: {
            stationSelected,
            boundsubstationname: '',
            boundsubstationid: '',
          },
        };
      }
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
      const payload = {
        id: item._id,
        payload: {
          componentStatusSelected,
          componentstatus: componentStatusSelected.name,
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
    ...mapState('bomManagement', ['bomList', 'categoryList', 'lineList', 'sublineList', 'lineValue', 'sublineValue', 'parameterList', 'substationList']),
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
