<template>
  <v-container fluid id="repairdetail" class="py-0" style="height: calc(100vh - 56px);">
    <v-app-bar absolute style="" height="40px">
      <v-btn icon @click="goback" color="primary">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="text-subtitle-1">{{ $t('repair.detailtitle') }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-row justify="center" style="height:16%;" class="px-2 mb-8 mt-12">
      <v-card style="width:100%;">
        <v-card-title
          primary-title
          style="background-color: #28abb9;color: white;"
          class="py-1 text-subtitle-1"
        >
          <v-icon color="white" class="mr-2">mdi-information</v-icon>
          {{ $t('repair.basic.title') }}
        </v-card-title>
        <v-card-text class="pt-4 pb-0">
          <v-form readonly>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  :label="$t('repair.repairheader.machinename')"
                  dense
                  v-model="repairInfo.machinename"
                ></v-text-field>
                <v-text-field
                  :label="$t('repair.repairheader.solutiondetailname')"
                  dense
                  v-model="repairInfo.solutiondetailname"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  :label="$t('repair.repairheader.solutiondetailvalue')"
                  dense
                  v-model="repairInfo.solutiondetailvalue"
                ></v-text-field>
                <v-text-field label="Status" dense v-model="repairInfo.status"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  :label="$t('repair.repairheader.actualstarttime')"
                  dense
                  v-model="repairInfo.starttime"
                ></v-text-field>
                <v-text-field
                  :label="$t('repair.repairheader.actualendtime')"
                  dense
                  v-model="repairInfo.endtime"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row justify="center" style="height:73%;" class="px-2 mb-6">
      <v-card color="primary" style="width:100%;height: 100%;">
        <v-card-title style="color: white;" class="py-1 text-subtitle-1">
          <v-icon color="white" class="mr-2">mdi-clipboard-list-outline</v-icon>
          {{ $t('repair.steps.title') }}

          <v-spacer></v-spacer>
          <v-btn
            color="white"
            outlined
            small
            class="mr-2"
            :disabled="repairInfo.status != 'new'"
            @click="startRepair"
          >
            {{ $t('general.start') }}
          </v-btn>
          <v-btn
            color="white"
            outlined
            small
            class="mr-2"
            :disabled="repairInfo.status != 'in progress'"
            @click="saveRepiar"
          >
            {{ $t('general.save') }}
          </v-btn>
          <v-btn
            color="white"
            @click="confirmdialog = true"
            outlined
            small
            :disabled="repairInfo.status != 'in progress'"
          >
            {{ $t('general.complete') }}
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0" style="height: calc(100% - 36px);overflow: auto;">
          <v-stepper v-model="e1" id="repairsteps" style="height: 100%;">
            <v-stepper-header>
              <v-stepper-step class="pa-0" editable :complete="e1 > 1" step="1"
                >{{ $t('repair.steps.repair') }}
              </v-stepper-step>

              <v-stepper-step class="pa-0" editable :complete="e1 > 2" step="2">{{
                $t('repair.steps.replacement')
              }}</v-stepper-step>

              <v-stepper-step class="pa-0" editable :complete="e1 > 3" step="3">{{
                $t('repair.repairheader.image')
              }}</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items style="height: calc(100% - 35px);">
              <v-stepper-content step="1" style="height: 100%;overflow: auto;" class="pa-0 px-5">
                <v-form class="mt-5">
                  <v-text-field
                    outlined
                    readonly
                    :label="$t('repair.repairheader.fault')"
                    v-model="repairInfo.faultname"
                  ></v-text-field>
                  <v-textarea
                    outlined
                    readonly
                    :label="$t('repair.repairheader.faultdescription')"
                    v-model="repairInfo.faultdescription"
                  ></v-textarea>
                  <v-textarea
                    outlined
                    clearable
                    :disabled="saving"
                    :label="$t('repair.repairheader.ica')"
                    v-model="repairInfo.ica"
                  ></v-textarea>
                  <v-textarea
                    outlined
                    clearable
                    :disabled="saving"
                    :label="$t('repair.repairheader.repairaction')"
                    v-model="repairInfo.repairaction"
                  ></v-textarea>
                  <v-textarea
                    outlined
                    clearable
                    :disabled="saving"
                    :label="$t('repair.repairheader.remark')"
                    v-model="repairInfo.remark"
                  ></v-textarea>
                </v-form>
              </v-stepper-content>
              <v-stepper-content step="2" style="height: 100%;" class="pa-0 px-3">
                <v-card-title class="pa-0">
                  <v-spacer></v-spacer>
                  <v-btn color="primary" small text @click="dialog = true">
                    <v-icon small>mdi-plus</v-icon>
                    {{ $t('general.add') }}
                  </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card class="mt-4 mx-2" v-for="sparepart in replacementList" :key="sparepart._id">
                  <v-card-title primary-title class="py-1">
                    <v-avatar :color="sparepart.quantity ? 'green' : 'red'" size="30" class="mr-3">
                      <v-icon dark>mdi-cog</v-icon>
                    </v-avatar>
                    {{ $t('repair.sparepartheader.sparepart') }}:
                    {{ sparepart.sparepartname }}
                    <v-spacer></v-spacer>
                    <v-btn
                      icon
                      color="green"
                      @click="
                        updatedialog = true;
                        updated = sparepart._id;
                      "
                      :disabled="repairInfo.status !== 'in progress'"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="red"
                      @click="
                        sparepartconfirmdialog = true;
                        spareparttodelete = sparepart;
                      "
                      :disabled="repairInfo.status !== 'in progress'"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text class="pa-0 mt-2">
                    <v-row class="mx-0">
                      <v-col cols="6" class="py-0">
                        <v-subheader style="height: 24px;justify-content: center;">{{
                          $t('repair.sparepartheader.position')
                        }}</v-subheader>
                        <p class="text-center font-weight-bold mb-1">
                          {{ sparepart.machinepositionname }}
                        </p>
                      </v-col>
                      <v-col cols="6" class="py-0">
                        <v-subheader style="height: 24px;justify-content: center;">{{
                          $t('repair.sparepartheader.quantity')
                        }}</v-subheader>
                        <p class="text-center font-weight-bold mb-1">
                          {{ sparepart.quantity }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-stepper-content>
              <v-stepper-content step="3" style="height: 100%;" class="pa-0 px-3">
                <v-card-title class="pa-0">
                  <v-spacer></v-spacer>
                  <v-btn color="primary" small text @click="imagedialog = true">
                    <v-icon small>mdi-plus</v-icon>
                    {{ $t('general.add') }}
                  </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-data-table
                  :headers="headers"
                  hide-default-footer
                  class="elevation-1"
                  disable-sort
                  :items="repairimageList"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-icon color="primary" class="mr-2" @click="prevImage(item)">
                      mdi-eye
                    </v-icon>
                    <v-icon
                      color="red"
                      @click="
                        imageconfirmdialog = true;
                        imagetodelete = item;
                      "
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-row>
    <v-dialog
      id="reportsparepart"
      v-model="dialog"
      persistent
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="primary">
          <span class="white--text">
            {{ $t('maintenancetask.reportsparepart.title') }}
          </span>
        </v-card-title>
        <v-card-text style="height: 200px;">
          <v-form ref="form" lazy-validation>
            <v-autocomplete
              clearable
              :label="$t('maintenancetask.reportsparepart.sparepart')"
              :items="sparepartList"
              :disabled="saving"
              @change="handleSparepart"
              :rules="rules.sparepart"
              item-text="text"
              return-object
              ref="sparepart"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-subtitle v-text="item.sparepartname"></v-list-item-subtitle>
                  <v-list-item-title
                    >{{ $t('maintenancetask.reportsparepart.position') }}:
                    {{ item.machinepositionname }}</v-list-item-title
                  >
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-text-field
              :rules="rules.quantity"
              :label="$t('maintenancetask.reportsparepart.quantity')"
              v-model="sparepartObj.quantity"
              type="number"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text class="text-none" @click="dialog = false">
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!sparepartObj.sparepartid || !sparepartObj.quantity"
            class="text-none"
            :loading="saving"
            @click="addSparepart"
          >
            {{ $t('general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      id="updatereplacement"
      v-model="updatedialog"
      persistent
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="primary">
          <span class="white--text">
            {{ $t('maintenancetask.reportsparepart.title') }}
          </span>
        </v-card-title>
        <v-card-text style="height: 100px;">
          <v-form ref="form" lazy-validation>
            <v-text-field
              :rules="rules.quantity"
              :label="$t('maintenancetask.reportsparepart.quantity')"
              v-model="sparepartObj.quantity"
              type="number"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text class="text-none" @click="updatedialog = false">
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!sparepartObj.quantity"
            class="text-none"
            :loading="saving"
            @click="updateReplacement"
          >
            {{ $t('general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      id="reportconfirm"
      v-model="confirmdialog"
      persistent
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="primary">
          <span class="white--text">
            {{ $t('maintenancetask.confirmreport') }}
          </span>
        </v-card-title>
        <v-card-text class="black--text text-h6">
          {{ $t('general.confirmcompletemessage') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text class="text-none" @click="confirmdialog = false">
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn color="primary" class="text-none" :loading="saving" @click="completeRepair">
            {{ $t('general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      id="reportimage"
      v-model="imagedialog"
      persistent
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="primary">
          <span class="white--text">
            {{ $t('repair.reportimage.title') }}
          </span>
        </v-card-title>
        <v-card-text style="height: 220px;">
          <v-form ref="image" lazy-validation class="mt-5">
            <v-file-input
              outlined
              clearable
              :disabled="saving"
              :label="$t('repair.reportimage.image')"
              prepend-icon=""
              id="file"
              @change="uploaded($event)"
            ></v-file-input>
            <v-text-field
              outlined
              clearable
              :disabled="saving"
              :rules="rules.name"
              :label="$t('repair.reportimage.name')"
              v-model="repairimageObj.name"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            class="text-none"
            @click="
              imagedialog = false;
              repairimageObj = {};
            "
          >
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!repairimageObj.image || !repairimageObj.name"
            class="text-none"
            :loading="saving"
            @click="addRepairImage"
          >
            {{ $t('general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="imageconfirmdialog"
      persistent
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="primary">
          <span class="white--text">
            {{ $t('repair.reportimage.deleteheader') }}
          </span>
        </v-card-title>
        <v-card-text class="black--text text-h6">
          {{ $t('repair.reportimage.deletemessage') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            class="text-none"
            @click="
              imageconfirmdialog = false;
              imagetodelete = null;
            "
          >
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn color="primary" class="text-none" :loading="saving" @click="deleteImage">
            {{ $t('general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="sparepartconfirmdialog"
      persistent
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="primary">
          <span class="white--text">
            {{ $t('repair.reportsparepart.deleteheader') }}
          </span>
        </v-card-title>
        <v-card-text class="black--text text-h6">
          {{ $t('repair.reportsparepart.deletemessage') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            class="text-none"
            @click="
              sparepartconfirmdialog = false;
              spareparttodelete = null;
            "
          >
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn color="primary" class="text-none" :loading="saving" @click="deleteSparepart">
            {{ $t('general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="imageprevdialog" scrollable transition="dialog-transition">
      <v-img v-if="imagesrc" :src="imagesrc"></v-img>
    </v-dialog>
  </v-container>
</template>

<script>
// import _ from 'lodash';
import { mapState, mapActions, mapMutations } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';
import FileService from '@shopworx/services/api/file.service';
import WMSService from '@shopworx/services/api/wms.service';

const contentEnum = Object.freeze({
  image: 'image',
  audio: 'audio',
  video: 'video',
  application: 'file',
});

export default {
  name: 'RepairDetail',
  data() {
    return {
      imagesrc: null,
      saving: false,
      e1: null,
      dialog: false,
      updatedialog: false,
      confirmdialog: false,
      imagedialog: false,
      imageconfirmdialog: false,
      imagetodelete: null,
      imageprevdialog: false,
      sparepartconfirmdialog: false,
      spareparttodelete: null,
      sparepartObj: {},
      repairimageObj: {},
      rules: {
        quantity: [(v) => !!v || 'Quantity is required!'],
        sparepart: [(v) => !!v || 'Sparepart is required!'],
        name: [(v) => !!v || 'Image Name is required!'],
      },
      headers: [
        { text: this.$t('repair.reportimage.numberindex'), value: 'numberIndex' },
        { text: this.$t('repair.reportimage.name'), value: 'name' },
        { text: this.$t('repair.reportimage.action'), value: 'actions', sortable: false },
      ],
    };
  },
  computed: {
    ...mapState('auth', ['operator']),
    ...mapState('maintenance', [
      'assets',
      'sparepartList',
      'faultList',
      'repairList',
      'replacementList',
      'repairimageList',
    ]),
    userName: {
      get() {
        return this.operator.operatorname;
      },
    },
    repairInfo: {
      get() {
        if (this.repairList.filter((item) => item.id === this.repairid).length > 0) {
          const repair = { ...this.repairList.filter((item) => item.id === this.repairid)[0] };
          repair.starttime = repair.starttime
            ? formatDate(new Date(Number(repair.starttime)), "yyyy-MM-dd'T'HH:mm")
            : '';
          repair.endtime = repair.endtime
            ? formatDate(new Date(Number(repair.endtime)), "yyyy-MM-dd'T'HH:mm")
            : '';
          return repair;
        }
        return {};
      },
      set() {},
    },
    files() {
      let temp = [];
      if (this.repairInfo.image) {
        temp = [this.repairInfo.image];
      }
      return temp;
    },
  },
  async created() {
    this.repairid = this.$route.params.id;
    await this.getAssets();
    await this.getReplacementList(`?query=repairid=="${this.repairid}"`);
    await this.getRepairByQuery(`?query=id=="${this.repairid}"&sortquery=createdTimestamp==-1`);
    await this.getRepairImageByQuery(
      `?query=repairid=="${this.repairid}"&sortquery=createdTimestamp==-1`,
    );
    await this.getSparepartRecords(`?query=machineid=="${this.repairInfo.machineid}"`);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('maintenance', [
      'getAssets',
      'getSparepartRecords',
      'postBulkRecords',
      'updateRecordById',
      'createReplacement',
      'getRepairByQuery',
      'updateRepair',
      'getDownloadLink',
      'getReplacementList',
      'getRepairImageByQuery',
      'createRepairImage',
      'getRepairImageByQuery',
      'deleteRecordById',
    ]),
    goback() {
      this.$router.go(-1);
    },
    async startRepair() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);

      // update repair status
      const putpaylod = {
        assetid: getAssetId,
        status: 'in progress',
        editedby: this.userName,
        editedtime: new Date().getTime(),
        starttime: new Date().getTime(),
        startdate: Number(formatDate(new Date(), 'yyyyMMdd')),
      };
      const repair = await this.updateRepair({ id: this.repairInfo._id, payload: putpaylod });
      if (repair) {
        this.getRepairByQuery(`?query=id=="${this.repairid}"&sortquery=createdTimestamp==-1`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'START_REPAIR',
        });
      }
    },
    async saveRepiar() {
      const { repairInfo } = this;
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);

      const data = {
        assetid: getAssetId,
        ica: repairInfo.ica || '',
        repairaction: repairInfo.repairaction || '',
        remark: repairInfo.remark || '',
      };
      const save = await this.updateRecordById({
        payload: data,
        element: 'repair',
        id: repairInfo._id,
      });
      if (save) {
        this.getRepairByQuery(`?query=id=="${this.repairid}"&sortquery=createdTimestamp==-1`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'SAVE_REPAIR',
        });
      }
    },
    handleSparepart(item) {
      const {
        machineid,
        machinename,
        machinepositionid,
        machinepositionname,
        sparepartid,
        sparepartname,
        sparepartcode,
      } = item;
      this.sparepartObj = {
        machineid,
        machinename,
        machinepositionid,
        machinepositionname,
        sparepartid,
        sparepartname,
        sparepartcode,
      };
    },
    getFileDetails(file) {
      const { name, type } = file;
      const lastIndex = name.lastIndexOf('.');
      const nameWithoutExt = name.substring(0, lastIndex);
      const extension = name.substring(lastIndex + 1);
      const temp = type.split('/');
      const content = contentEnum[temp[0]] || 'file';
      return { content, nameWithoutExt, extension };
    },
    uploaded(e) {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);

      const reader = new FileReader();
      reader.readAsArrayBuffer(e);
      reader.onload = async (event) => {
        const { content, nameWithoutExt, extension } = this.getFileDetails(e);
        const fileParam = `${content}/${nameWithoutExt}?elementName=files&extension=${extension}`;
        const form = new FormData();
        form.append('file', new Blob([event.target.result]), {
          contentType: 'multipart/form-data',
        });
        form.append('assetid', getAssetId);
        const response = await FileService.uploadFile(fileParam, form);
        if (response.status === 200) {
          const link = await this.getDownloadLink(
            `?query=originalFilename=="${nameWithoutExt}"&sortquery=sortindex==-1&pagenumber=1&pagesize=1`,
          );
          if (link) {
            const { downloadlink } = link[0];
            this.repairimageObj.image = downloadlink;
            this.repairimageObj.filename = nameWithoutExt;
            this.$refs.image.validate();
          }
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'FILE_UPLOAD_FAILED',
          });
        }
      };
    },
    async addSparepart() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);

      // update replacement
      const payload = {
        ...this.sparepartObj,
        repairid: this.repairid,
        assetid: getAssetId,
        quantity: Number(this.sparepartObj.quantity),
        createdby: this.userName,
        createdtime: new Date().getTime(),
        type: 2,
      };
      const replacement = await this.createReplacement(payload);
      if (replacement) {
        Object.keys(this.sparepartObj).forEach((k) => {
          this.sparepartObj[k] = '';
        });
        await this.getReplacementList(`?query=repairid=="${this.repairid}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'CREATE REPALCEMENT',
        });
        this.dialog = false;
        this.$refs.sparepart.reset();
      }
    },
    async updateReplacement() {
      const data = { ...this.sparepartObj };
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);

      // update replacement
      const putpaylod = {
        assetid: getAssetId,
        quantity: Number(data.quantity),
        editedby: this.userName,
        editedtime: new Date().getTime(),
      };
      const replacement = await this.updateRecordById({
        id: this.updated,
        payload: putpaylod,
        element: 'replacement',
      });
      if (replacement) {
        await this.getReplacementList(`?query=repairid=="${this.repairid}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'UPDATE REPALCEMENT',
        });
        Object.keys(this.sparepartObj).forEach((k) => {
          this.sparepartObj[k] = '';
        });
        this.updated = null;
      }
      this.updatedialog = false;
    },
    async completeRepair() {
      if (this.replacementList.length > 0) {
        const checkstock = this.replacementList.map((replacement) => {
          const sparepartobj = this.sparepartList.filter(
            (item) => item.sparepartid === replacement.sparepartid,
          )[0];
          if (sparepartobj) {
            const { quantity } = replacement;
            const warehouse = {
              warehousecode: sparepartobj.warehousecode,
              warehousename: sparepartobj.warehousename,
            };
            const location = {
              locationcode: sparepartobj.locationcode || '',
              locationname: sparepartobj.locationname || '',
            };
            return WMSService.checkStock(
              warehouse,
              location,
              {
                partname: sparepartobj.sparepartname,
                partnumber: sparepartobj.sparepartcode,
              },
              quantity,
            );
          }
          return new Promise((resolve) => {
            resolve(false);
          });
        });

        const checkstockresult = await Promise.all(checkstock);
        if (checkstockresult.filter((rst) => rst === false).length > 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'Please Check Sparepart and Sparepart Stock!',
          });
          return;
        }
      }

      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      this.saving = true;

      const putpaylod = {
        assetid: getAssetId,
        status: 'completed',
        editedby: this.userName,
        editedtime: new Date().getTime(),
        endtime: new Date().getTime(),
      };
      const task = await this.updateRepair({ id: this.repairInfo._id, payload: putpaylod });
      if (task) {
        this.getRepairByQuery(`?query=id=="${this.repairid}"&sortquery=createdTimestamp==-1`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'COMPLETED_REPAIR',
        });
      }
      // Sparepart out-bound
      this.replacementList.forEach((replacement) => {
        const sparepartobj = this.sparepartList.filter(
          (item) => item.sparepartid === replacement.sparepartid,
        )[0];
        if (sparepartobj) {
          const { quantity } = replacement;
          const warehouse = {
            warehousecode: sparepartobj.warehousecode,
            warehousename: sparepartobj.warehousename,
          };
          const location = {
            locationcode: sparepartobj.locationcode || '',
            locationname: sparepartobj.locationname || '',
          };
          WMSService.createOutboundRecord(
            warehouse,
            location,
            {
              partname: sparepartobj.sparepartname,
              partnumber: sparepartobj.sparepartcode,
            },
            {
              key: 5,
              type: 'Consumption',
              description: '耗用出库',
            },
            Number(quantity),
            this.userName,
            new Date().getTime(),
            getAssetId,
          );
        }
      });
      this.saving = false;
      this.confirmdialog = false;
    },
    async addRepairImage() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);

      // update replacement
      const payload = {
        ...this.repairimageObj,
        repairid: this.repairid,
        assetid: getAssetId,
        createdby: this.userName,
        createdtime: new Date().getTime(),
      };
      const images = await this.createRepairImage(payload);
      if (images) {
        Object.keys(this.sparepartObj).forEach((k) => {
          this.repairimageObj[k] = '';
        });
        await this.getRepairImageByQuery(`?query=repairid=="${this.repairid}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'CREATE REPAIR IMAGE',
        });
        this.imagedialog = false;
        this.$refs.image.reset();
      }
    },
    async deleteImage() {
      const response = await this.deleteRecordById({
        id: this.imagetodelete._id,
        name: 'repairimage',
      });
      if (response) {
        this.imagetodelete = null;
        this.imageconfirmdialog = false;
        await this.getRepairImageByQuery(`?query=repairid=="${this.repairid}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'DELETE REPAIR IMAGE',
        });
      }
    },
    async prevImage(item) {
      const response = await FileService.getInlineImage(item.image);
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onload = (event) => {
        this.imagesrc = event.target.result;
        this.imageprevdialog = true;
      };
    },
    async deleteSparepart() {
      const response = await this.deleteRecordById({
        id: this.spareparttodelete._id,
        name: 'replacement',
      });
      if (response) {
        this.spareparttodelete = null;
        this.sparepartconfirmdialog = false;
        await this.getReplacementList(`?query=repairid=="${this.repairid}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'DELETE REPLACEMENT',
        });
      }
    },
  },
};
</script>
<style>
#repairsteps > .v-stepper__header .v-stepper__step__step {
  margin: 5px 5px 5px 10px;
}
#repairsteps > .v-stepper__header {
  height: 34px;
}
#repairsteps > .v-stepper__header .v-stepper__step {
  justify-content: center;
  height: 34px;
  width: 170px;
}
#repairsteps > .v-stepper__header .v-stepper__label {
  display: block !important;
}
#repairsteps > .v-stepper__header .v-divider {
  margin: 0;
}

#repairdetail .v-stepper__wrapper {
  height: 100%;
  overflow: auto;
}
</style>
