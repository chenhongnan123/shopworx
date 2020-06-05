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
        <v-col cols="2">
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
        :headers="headers"
        :items="bomDetailList"
        item-key="bomnumber"
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
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            small
            color="error"
            @click="deleteItem(item)"
          >
            <v-icon v-text="'$delete'"></v-icon>
          </v-btn>
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
      headers: [
        {
          text: 'Substation',
          value: 'substationid',
        },
        {
          text: 'Parameter Name',
          value: 'parametername',
        },
        { text: 'Material', value: 'materialname' },
        { text: 'Material TypeID', value: 'materialtype' },
        { text: 'Category', value: 'materialcategory' },
        { text: 'Actions', value: 'actions' },
      ],
      materialname: '',
      confirmDialog: false,
      bomdetailObjDefault: null,
      saving: false,
    };
  },
  created() {
    console.log(this.query);
    this.getMaterialListRecords(`?query=sublineid=="${this.query.sublineid || null}"`);
    this.handleGetDetails();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('bomManagement', ['getBomDetailsListRecords', 'getParameterList', 'createBomdetailList', 'deleteBomDetail', 'updateBomDetail']),
    ...mapActions('materialManagement', ['getMaterialListRecords']),
    async handleGetDetails() {
      const bomdetailList = await this.getBomDetailsListRecords(`?query=name=="${this.query.name}"&sublineid=="${this.query.sublineid || null}"`);
      this.bomDetailList = bomdetailList;
    },
    async handleGetData() {
      await this.getParameterList(`?query=sublineid=="${this.query.sublineid || null}"`);
      // await this.getParameterList('');
      if (this.bomDetailList.length) {
        await Promise.all(this.bomDetailList.map(
          (bomdetail) => this.deleteBomDetail(bomdetail._id),
        ));
        this.bomDetailList = [];
      }
      this.bomDetailList = this.parameterList.map((parameter) => ({
        substationid: parameter.substationid,
        name: this.query.name,
        parametername: parameter.name,
        materialname: '',
        materialtype: '',
        materialcategory: '',
        sublineid: this.query.sublineid,
        assetid: '4',
      }));
      this.createBomdetailList(this.bomDetailList);
    },
    async handleChangeMaterial(item) {
      const { materialname } = item;
      const materialItem = this.materialList
        .filter((material) => materialname === material.name)[0];
      const query = `?query=parametername=="${item.parametername}"`;
      const payload = {
        materialname: item.materialname,
        materialtype: materialItem.materialtype,
        materialcategory: materialItem.materilcategory,
      };
      this.saving = true;
      const updateResult = await this.updateBomDetail({ query, payload });
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'update_material',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'network',
        });
      }
      this.bomDetailList = await this.getBomDetailsListRecords(`?query=name=="${this.query.name}"&sublineid=="${this.query.sublineid || null}"`);
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
        this.bomDetailList = await this.getBomDetailsListRecords(`?query=name=="${this.query.name}"&sublineid=="${this.query.sublineid || null}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'update BOM Details success',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'network error',
        });
      }
      this.confirmDialog = false;
    },
  },
  computed: {
    ...mapState('bomManagement', ['bomList', 'categoryList', 'lineList', 'sublineList', 'lineValue', 'sublineValue', 'parameterList', 'materialList']),
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
