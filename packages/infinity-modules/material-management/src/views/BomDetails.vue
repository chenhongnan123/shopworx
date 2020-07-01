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
      <v-toolbar
        flat
        dense
        class="stick"
        :color="$vuetify.theme.dark ? '#121212': ''"
      >
        <v-btn small color="primary" outlined class="text-none ml-2" @click="handleGetData">
          <v-icon small left>mdi-refresh</v-icon>
          Get Data
        </v-btn>
        <v-btn small color="error"
          outlined
          class="text-none ml-2"
          @click="confirmListDialog = true"
          v-if="bomDetailList.length && bomDetailSelected.length">
          <v-icon small left>mdi-delete</v-icon>
          Delete
        </v-btn>
      </v-toolbar>
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
        show-select
        v-model="bomDetailSelected"
        :headers="headers"
        :items="bomDetailList"
        item-key="id"
        class="tableContainer"
        >
        <template v-slot:item.materialname="props">
          <v-select
            :disabled="saving"
            :items="materialList"
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
      headers: [
        {
          text: 'Line',
          value: 'line',
          width: 120,
        },
        {
          text: 'Subline',
          value: 'subline',
          width: 120,
        },
        {
          text: 'Station',
          value: 'station',
          width: 120,
        },
        {
          text: 'Substation',
          value: 'substation',
          width: 120,
        },
        {
          text: 'Parameter Name',
          value: 'parametername',
          width: 180,
        },
        { text: 'Material', value: 'materialname', width: 120 },
        { text: 'Material TypeID', value: 'materialtype', width: 180 },
        { text: 'Category', value: 'materialcategory', width: 120 },
        { text: 'Actions', value: 'actions', width: 120 },
      ],
      materialname: '',
      confirmDialog: false,
      confirmListDialog: false,
      bomdetailObjDefault: null,
      saving: false,
    };
  },
  async created() {
    // console.log(this.query, 'query');
    await this.getMaterialListRecords('');
    this.handleGetDetails();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('bomManagement', ['getBomDetailsListRecords', 'getParameterList', 'createBomdetailList', 'deleteBomDetail', 'updateBomDetail', 'updateRecordById']),
    ...mapActions('materialManagement', ['getMaterialListRecords']),
    async handleGetDetails() {
      const bomdetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
      this.bomDetailList = bomdetailList;
    },
    async handleGetData() {
      const parameterList = (await this.getParameterList(`?query=lineid==${this.query.lineid || null}`))
        .filter((parameter) => Number(parameter.parametercategory) === 25
        || Number(parameter.parametercategory) === 27);
      // console.log(parameterList, 'parameterList');

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
          materialname: '',
          materialtype: '',
          materialcategory: '',
          assetid: '4',
        }));
        await this.createBomdetailList(bomDetailList);
        this.bomDetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
      }
    },
    async handleChangeMaterial(item) {
      const { materialname } = item;
      const materialItem = this.materialList
        .filter((material) => materialname === material.name)[0];
      const payload = {
        id: item._id,
        payload: {
          materialname,
          materialtype: materialItem.materialtype,
          materialcategory: materialItem.materialcategory,
        },
      };
      // console.log(payload, 'payload');
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
      this.bomDetailList = await this.getBomDetailsListRecords(`?query=bomid==${this.query.id}%26%26lineid==${this.query.lineid || null}`);
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
    ...mapState('bomManagement', ['bomList', 'categoryList', 'lineList', 'sublineList', 'lineValue', 'sublineValue', 'parameterList']),
    ...mapState('materialManagement', ['materialList']),
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
