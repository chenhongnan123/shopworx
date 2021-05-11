<template>
  <v-container id="taskdetail" fluid class="py-0" style="height: calc(100vh - 56px); ">
    <v-app-bar absolute style="" height="40px">
      <v-btn icon @click="goback" color="primary">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title class="text-subtitle-1">{{
        $t('maintenancetask.detailtitle')
      }}</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-row justify="center" style="height:22%;" class="px-2 mb-8 mt-12">
      <v-card style="width:100%;">
        <v-card-title
          primary-title
          style="background-color: #28abb9;color: white;"
          class="py-1 text-subtitle-1"
        >
          <v-icon color="white" class="mr-2">mdi-information</v-icon>
          {{ $t('maintenancetask.basic.title') }}
        </v-card-title>
        <v-card-text class="pt-4 pb-0">
          <v-form readonly>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  :label="$t('maintenancetask.taskheader.id')"
                  dense
                  v-model="taskInfo.id"
                ></v-text-field>
                <v-text-field
                  :label="$t('maintenancetask.taskheader.machinename')"
                  dense
                  v-model="taskInfo.machinename"
                ></v-text-field>
                <v-text-field
                  :label="$t('maintenancetask.taskheader.planname')"
                  dense
                  v-model="taskInfo.planname"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  :label="$t('maintenancetask.taskheader.solutionname')"
                  dense
                  v-model="taskInfo.solutionname"
                ></v-text-field>
                <v-text-field label="Status" dense v-model="taskInfo.status"></v-text-field>
                <v-text-field
                  :label="$t('maintenancetask.taskheader.planstarttime')"
                  dense
                  v-model="taskInfo.planstarttime"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  :label="$t('maintenancetask.taskheader.planendtime')"
                  dense
                  v-model="taskInfo.planendtime"
                ></v-text-field>
                <v-text-field
                  :label="$t('maintenancetask.taskheader.actualstarttime')"
                  dense
                  v-model="taskInfo.acturalstarttime"
                ></v-text-field>
                <v-text-field
                  :label="$t('maintenancetask.taskheader.actualendtime')"
                  dense
                  v-model="taskInfo.acturalendtime"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row justify="center" style="height:67%;" class="px-2 mb-6">
      <v-card color="primary" style="width:100%;height: 100%;">
        <v-card-title style="color: white;" class="py-1 text-subtitle-1">
          <v-icon color="white" class="mr-2">mdi-clipboard-list-outline</v-icon>
          {{ $t('maintenancetask.steps.title') }}

          <v-spacer></v-spacer>
          <v-btn
            color="white"
            outlined
            small
            class="mr-2"
            @click="startTask"
            :disabled="taskInfo.status !== 'assigned'"
          >
            {{ $t('general.start') }}
          </v-btn>
          <v-btn
            color="white"
            outlined
            small
            class="mr-2"
            @click="reportTask"
            :disabled="taskInfo.status !== 'in progress'"
          >
            {{ $t('general.save') }}
          </v-btn>
          <v-btn
            v-if="checkAuthCode(operator, 'M1')"
            color="white"
            @click="reportValidate"
            outlined
            small
            :disabled="taskInfo.status !== 'in progress'"
          >
            {{ $t('general.complete') }}
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0" style="height: calc(100% - 36px);overflow: auto;">
          <v-stepper v-model="e1" id="tasksteps" style="height: 100%;">
            <v-stepper-header>
              <v-stepper-step class="pa-0" editable :complete="e1 > 1" step="1"
                >{{ $t('maintenancetask.steps.task') }}
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step class="pa-0" editable :complete="e1 > 2" step="2">{{
                $t('maintenancetask.steps.replacement')
              }}</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items style="height: calc(100% - 35px);">
              <v-stepper-content step="1" style="height: 100%;" class="pa-0">
                <v-tabs
                  height="30px"
                  v-model="tab"
                  color="primary"
                  slider-color="primary"
                  class="mt-1"
                >
                  <v-tab v-for="(value, name) in solutiondetails" :key="name">
                    {{ name }}
                  </v-tab>
                </v-tabs>
                <v-tabs-items
                  style="height: calc(100% - 30px);"
                  id="solutiondetailtab"
                  v-model="tab"
                >
                  <v-tab-item
                    v-for="(value, name) in solutiondetails"
                    :key="name"
                    style="height: 100%;"
                  >
                    <v-stepper vertical style="height: 100%;overflow: auto;" class="list">
                      <template v-for="(item, index) in value">
                        <v-stepper-step
                          editable
                          :key="index"
                          :step="index + 1"
                          style="flex-direction: row;"
                          :complete="!item.result"
                          :color="getColor(item.result)"
                        >
                          {{ item.solutiondetailname }}{{ item.result ? ` - ${item.result}` : '' }}
                        </v-stepper-step>
                        <v-stepper-content
                          :step="index + 1"
                          :key="item._id"
                          style="width: calc(100% - 80px);
                        padding: 8px 0px 16px 23px;margin: -8px 0px -16px 36px;"
                        >
                          <v-card outlined class="mb-2 mr-0" height="100%" width="450px">
                            <v-card-text class="white--text">
                              <v-textarea
                                filled
                                height="50px"
                                :label="$t('maintenancetask.tasklistheader.description')"
                                :value="item.description || ' '"
                                readonly
                              ></v-textarea>
                              <v-form class="px-2" readonly>
                                <v-row>
                                  <v-col cols="4" class="py-0">
                                    <v-text-field
                                      :label="$t('maintenancetask.tasklistheader.type')"
                                      dense
                                      v-model="item.type"
                                      hide-details
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="4" class="py-0">
                                    <v-text-field
                                      :label="$t('maintenancetask.tasklistheader.lower')"
                                      dense
                                      v-model="item.lower"
                                      hide-details
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="4" class="py-0">
                                    <v-text-field
                                      :label="$t('maintenancetask.tasklistheader.upper')"
                                      dense
                                      v-model="item.upper"
                                      hide-details
                                    ></v-text-field>
                                  </v-col>
                                </v-row>
                              </v-form>
                              <v-form class="px-2 mt-3">
                                <v-row>
                                  <v-col cols="4" class="py-0">
                                    <v-text-field
                                      label="Value"
                                      :disabled="taskInfo.status !== 'in progress'"
                                      :type="item.type === 'value' ? 'number' : 'text'"
                                      v-model="item.value"
                                      required
                                      hide-details
                                      @input="getResult(item)"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="8" class="py-0">
                                    <v-radio-group
                                      row
                                      v-model="item.result"
                                      :disabled="
                                        (item.islimited && item.type === 'value') ||
                                          taskInfo.status !== 'in progress'
                                      "
                                    >
                                      <label>Result: </label>
                                      <v-radio class="ml-5" label="OK" value="OK"></v-radio>
                                      <v-radio label="NG" value="NG"></v-radio>
                                    </v-radio-group>
                                  </v-col>
                                </v-row>
                              </v-form>
                            </v-card-text>
                          </v-card>
                        </v-stepper-content>
                      </template>
                    </v-stepper>
                  </v-tab-item>
                </v-tabs-items>
              </v-stepper-content>

              <v-stepper-content step="2" style="height: 100%;" class="pa-0 px-3">
                <v-card-title class="pa-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    small
                    text
                    @click="dialog = true"
                    :disabled="taskInfo.status !== 'in progress'"
                  >
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
                    {{ $t('maintenancetask.sparepartheader.sparepart') }}:
                    {{ sparepart.sparepartname }}
                    <v-spacer></v-spacer>
                    <v-btn
                      icon
                      color="green"
                      @click="
                        updatedialog = true;
                        updated = sparepart._id;
                      "
                      :disabled="taskInfo.status !== 'in progress'"
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
                      :disabled="taskInfo.status !== 'in progress'"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text class="pa-0 mt-2">
                    <v-row class="mx-0">
                      <v-col cols="3" class="py-0">
                        <v-subheader style="height: 24px;justify-content: center;">{{
                          $t('maintenancetask.sparepartheader.position')
                        }}</v-subheader>
                        <p class="text-center font-weight-bold mb-1">
                          {{ sparepart.machinepositionname }}
                        </p>
                      </v-col>
                      <v-col cols="3" class="py-0">
                        <v-subheader style="height: 24px;justify-content: center;">{{
                          $t('maintenancetask.sparepartheader.lower')
                        }}</v-subheader>
                        <p class="text-center font-weight-bold mb-1">
                          {{ sparepart.lower }}
                        </p>
                      </v-col>
                      <v-col cols="3" class="py-0">
                        <v-subheader style="height: 24px;justify-content: center;">{{
                          $t('maintenancetask.sparepartheader.upper')
                        }}</v-subheader>
                        <p class="text-center font-weight-bold mb-1">
                          {{ sparepart.upper }}
                        </p>
                      </v-col>
                      <v-col cols="3" class="py-0">
                        <v-subheader style="height: 24px;justify-content: center;">{{
                          $t('maintenancetask.sparepartheader.quantity')
                        }}</v-subheader>
                        <p class="text-center font-weight-bold mb-1">
                          {{ sparepart.quantity }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
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
          <v-btn color="primary" class="text-none" :loading="saving" @click="completeTask">
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
  </v-container>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions, mapMutations } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';
import FileService from '@shopworx/services/api/file.service';
import WMSService from '@shopworx/services/api/wms.service';

export default {
  name: 'TaskDetail',
  data() {
    return {
      e6: null,
      planstarttime: '',
      planendtime: '',
      dialog: false,
      updatedialog: false,
      confirmdialog: false,
      tab: null,
      show: false,
      solutiondetails: [],
      spareparts: [],
      toDelete: null,
      updated: null,
      saving: false,
      putrecord: null,
      taskObj: {},
      sparepartObj: {},
      operators: [],
      sparepartconfirmdialog: false,
      spareparttodelete: null,
      rules: {
        quantity: [(v) => !!v || 'Quantity is required!'],
        sparepart: [(v) => !!v || 'Sparepart is required!'],
      },
      e1: 1,
      taskHeader: [
        {
          text: this.$t('maintenancetask.tasklistheader.name'),
          value: 'name',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.description'),
          value: 'description',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.type'),
          value: 'type',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.upper'),
          value: 'upper',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.lower'),
          value: 'lower',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.value'),
          value: 'value',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.result'),
          value: 'result',
        },
      ],
      taskHeader1: [
        {
          text: this.$t('maintenancetask.tasklistheader.name'),
          value: 'solutiondetailname',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.description'),
          value: 'description',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.type'),
          value: 'type',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.upper'),
          value: 'upper',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.lower'),
          value: 'lower',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.value'),
          value: 'value',
        },
        {
          text: this.$t('maintenancetask.tasklistheader.result'),
          value: 'result',
        },
      ],
      sparepartHeader: [
        {
          text: this.$t('maintenancetask.sparepartheaderheader.sparepart'),
          value: 'sparepartname',
        },
        {
          text: this.$t('maintenancetask.sparepartheaderheader.position'),
          value: 'machinepositionname',
        },
        {
          text: this.$t('maintenancetask.sparepartheaderheader.upper'),
          value: 'upper',
        },
        {
          text: this.$t('maintenancetask.sparepartheaderheader.lower'),
          value: 'lower',
        },
        {
          text: this.$t('maintenancetask.sparepartheaderheader.quantity'),
          value: 'quantity',
        },
      ],
    };
  },
  watch: {
    // taskList() {
    //   this.taskInfo = { ...this.taskList.filter((item) => item.id === this.taskid)[0] };
    // },
    async taskOperatorList() {
      const promiseList = this.taskOperatorList
        // eslint-disable-next-line arrow-body-style
        .map((item) => {
          return new Promise((resolve) => {
            const { _id } = item;
            const info = this.operatorList.filter((operator) => operator.id === item.operatorid)[0];
            if (info.image) {
              const filelink = info.image;
              FileService.getInlineImage(filelink).then((response) => {
                const reader = new FileReader();
                reader.readAsDataURL(response.data);
                // eslint-disable-next-line arrow-body-style
                reader.onload = (event) => {
                  resolve({
                    bindid: _id,
                    ...item,
                    ...info,
                    _photo: event.target.result,
                  });
                };
              });
            } else {
              resolve({
                bindid: _id,
                ...item,
                ...info,
              });
            }
          });
        });
      const getData = await Promise.all(promiseList);
      this.operators = getData;
    },
    async taskdetailList() {
      this.solutiondetails = [];
      const promiseList = this.taskdetailList
        // eslint-disable-next-line arrow-body-style
        .map((i) => {
          return new Promise((resolve) => {
            if (i.image) {
              const filelink = i.image;
              FileService.getInlineImage(filelink).then((response) => {
                const reader = new FileReader();
                reader.readAsDataURL(response.data);
                // eslint-disable-next-line arrow-body-style
                reader.onload = (event) => {
                  resolve({
                    result: false,
                    ...i,
                    _photo: event.target.result,
                  });
                };
              });
            } else {
              resolve({
                result: false,
                ...i,
              });
            }
          });
        });
      const getData = await Promise.all(promiseList);
      this.solutiondetails = _.groupBy(getData, 'group');
      this.tab = 0;
    },
  },
  computed: {
    ...mapState('auth', ['operator']),
    ...mapState('maintenance', [
      'taskList',
      'taskOperatorList',
      'operatorList',
      'assets',
      'solutiondetailList',
      'sparepartinplanningList',
      'sparepartList',
      'taskdetailList',
      'replacementList',
    ]),
    ...mapState('user', ['me']),
    taskInfo: {
      get() {
        if (this.taskList.filter((item) => item.id === this.taskid).length > 0) {
          const task = { ...this.taskList.filter((item) => item.id === this.taskid)[0] };
          task.planstarttime = task.planstarttime
            ? formatDate(new Date(Number(task.planstarttime)), "yyyy-MM-dd'T'HH:mm")
            : '';
          task.planendtime = task.planendtime
            ? formatDate(new Date(Number(task.planendtime)), "yyyy-MM-dd'T'HH:mm")
            : '';
          task.acturalstarttime = task.acturalstarttime
            ? formatDate(new Date(Number(task.acturalstarttime)), "yyyy-MM-dd'T'HH:mm")
            : '';
          task.acturalendtime = task.acturalendtime
            ? formatDate(new Date(Number(task.acturalendtime)), "yyyy-MM-dd'T'HH:mm")
            : '';
          return task;
        }
        return {};
      },
      set() {},
    },
    userName: {
      get() {
        return this.operator.operatorname;
      },
    },
  },
  async created() {
    this.taskid = this.$route.params.id;
    await this.getRecords(`?query=id=="${this.taskid}"&sortquery=createdTimestamp==-1`);

    await this.getAssets();
    await this.getOperatorList();
    await this.getReplacementList(`?query=taskid=="${this.taskid}"`);
    await this.getTaskDetailList(`?query=taskid=="${this.taskid}"`);
    await this.getTaskOperatorList(`?query=taskid=="${this.taskid}"`);
    // await this.getSolutionDetailRecords(`?query=solutionid=="${this.taskInfo.solutionid}"`);
    // await this.getSparepartinplanningRecords(`?query=planid=="${this.taskInfo.planid}"`);
    await this.getSparepartRecords(`?query=machineid=="${this.taskInfo.machineid}"`);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('maintenance', ['setBindOperatorDialog']),
    ...mapActions('maintenance', [
      'getRecords',
      'getTaskOperatorList',
      'getOperatorList',
      'updateTask',
      'getAssets',
      'getSolutionDetailRecords',
      'getSparepartinplanningRecords',
      'getSparepartRecords',
      'postBulkRecords',
      'getReplacementList',
      'getTaskDetailList',
      'postSystemMessage',
      'updateRecordById',
      'createReplacement',
      'updateRecordByQuery',
      'createRepair',
      'deleteRecordById',
    ]),
    getResult(item) {
      if (item.type === 'value' && item.islimited) {
        if (item.value > item.upper || item.value < item.lower) {
          item.result = 'NG';
        } else {
          item.result = 'OK';
        }
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
      } = item;
      this.sparepartObj = {
        machineid,
        machinename,
        machinepositionid,
        machinepositionname,
        sparepartid,
        sparepartname,
      };
    },
    async addSparepart() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);

      // update replacement
      const payload = {
        ...this.sparepartObj,
        taskid: this.taskid,
        assetid: getAssetId,
        quantity: Number(this.sparepartObj.quantity),
        createdby: this.userName,
        createdtime: new Date().getTime(),
        type: 1,
      };
      const replacement = await this.createReplacement(payload);
      if (replacement) {
        Object.keys(this.sparepartObj).forEach((k) => {
          this.sparepartObj[k] = '';
        });
        await this.getReplacementList(`?query=taskid=="${this.taskid}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'CREATE REPALCEMENT',
        });
        this.dialog = false;
        this.$refs.sparepart.reset();
      }
    },
    async reportValidate() {
      // prettier-ignore
      if (this.replacementList.length > 0
        && this.replacementList.filter((item) => item.quantity === '' || !item.quantity).length > 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'Please Check Spareparts!',
        });
        return;
      }
      // check sparepart stock
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
      const tasks = _.flatMap(this.solutiondetails);
      // prettier-ignore
      if (tasks.length > 0
        && tasks.filter((item) => item.result === '').length > 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'Please Check Task List!',
        });
        return;
      }

      this.confirmdialog = true;
    },
    async reportTask() {
      const { taskInfo } = this;
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      // add Task Detail
      const tasks = _.flatMap(this.solutiondetails);
      // eslint-disable-next-line arrow-body-style
      const taskdetailpayload = tasks.map((item) => {
        if (item.islimited) {
          if (item.type === 'value' && item.islimited) {
            if (item.value > item.upper || item.value < item.lower) {
              item.result = 'NG';
            } else {
              item.result = 'OK';
            }
          }
        }
        const data = {
          assetid: getAssetId,
          solutionid: taskInfo.solutionid,
          solutionname: taskInfo.solutionname,
          solutiondetailname: item.name,
          type: item.type,
          islimited: item.islimited,
          upper: item.upper,
          lower: item.lower,
          value: item.value,
          result: item.result,
          taskid: taskInfo.id,
          group: item.group,
        };
        return this.updateRecordById({
          payload: data,
          element: 'taskdetail',
          id: item._id,
        });
      });
      this.saving = true;

      const taskdetail = await Promise.all(taskdetailpayload);
      if (taskdetail) {
        this.getRecords(`?query=id=="${this.taskid}"&sortquery=createdTimestamp==-1`);
        await this.getTaskDetailList(`?query=taskid=="${this.taskid}"`);
      }
      this.saving = false;
      this.confirmdialog = false;
    },
    async completeTask() {
      const { taskInfo } = this;
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      const tasks = _.flatMap(this.solutiondetails);
      // eslint-disable-next-line arrow-body-style
      const taskdetailpayload = tasks.map((item) => {
        const data = {
          assetid: getAssetId,
          solutionid: taskInfo.solutionid,
          solutionname: taskInfo.solutionname,
          solutiondetailname: item.name,
          type: item.type,
          islimited: item.islimited,
          upper: item.upper,
          lower: item.lower,
          value: item.value,
          result: item.result,
          taskid: taskInfo.id,
          group: item.group,
        };
        return this.updateRecordById({
          payload: data,
          element: 'taskdetail',
          id: item._id,
        });
      });
      this.saving = true;

      const taskdetail = await Promise.all(taskdetailpayload);
      if (taskdetail) {
        // update task status
        const putpaylod = {
          assetid: getAssetId,
          status: 'completed',
          editedby: this.userName,
          editedtime: new Date().getTime(),
          acturalendtime: new Date().getTime(),
        };
        const task = await this.updateTask({ id: this.taskInfo._id, payload: putpaylod });
        if (task) {
          this.getRecords(`?query=id=="${this.taskid}"&sortquery=createdTimestamp==-1`);
          await this.getTaskDetailList(`?query=taskid=="${this.taskid}"`);
          this.setAlert({
            show: true,
            type: 'success',
            message: 'COMPLETED_MAINTENANCE_TASK',
          });
        }
      }
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
      // post Repair
      const nglist = tasks.filter((item) => item.result === 'NG');
      nglist.forEach((item) => {
        const payload = {
          machineid: taskInfo.machineid,
          machinecode: taskInfo.machinecode,
          machinename: taskInfo.machinename,
          faultid: 'tpmfault',
          faultcode: 'D0001',
          faultname: 'TPM项目NG',
          faultdescription: 'TPM项目NG，自动生成维修任务',
          taskid: taskInfo.id,
          solutiondetailname: item.solutiondetailname,
          solutiondetailvalue: item.value,
          createdby: this.userName,
          createdtime: new Date().getTime(),
          status: 'new',
        };
        this.createRepair(payload);
      });
      this.confirmdialog = false;
    },
    async startTask() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);

      // update task status
      const putpaylod = {
        assetid: getAssetId,
        status: 'in progress',
        editedby: this.userName,
        editedtime: new Date().getTime(),
        acturalstarttime: new Date().getTime(),
      };
      const task = await this.updateTask({ id: this.taskInfo._id, payload: putpaylod });
      if (task) {
        this.getRecords(`?query=id=="${this.taskid}"&sortquery=createdTimestamp==-1`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'START_MAINTENANCE_TASK',
        });
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
        await this.getReplacementList(`?query=taskid=="${this.taskid}"`);
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
    async deleteSparepart() {
      const response = await this.deleteRecordById({
        id: this.spareparttodelete._id,
        name: 'replacement',
      });
      if (response) {
        this.spareparttodelete = null;
        this.sparepartconfirmdialog = false;
        await this.getReplacementList(`?query=taskid=="${this.taskid}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'DELETE REPLACEMENT',
        });
      }
    },
    goback() {
      this.$router.go(-1);
    },
    getColor(rst) {
      let color = 'orange';
      if (rst === 'NG') {
        color = 'red';
      } else if (rst === 'OK') {
        color = 'green';
      }
      return color;
    },
    checkAuthCode(operator, code) {
      // eslint-disable-next-line no-unneeded-ternary
      return operator.authcode.filter((item) => item.authcode === code).length > 0 ? true : false;
    },
  },
};
</script>
<style>
#taskdetail .v-stepper__wrapper {
  height: 100%;
}
#taskdetail .v-window__container {
  height: 100%;
}

.list .v-stepper__label {
  display: block !important;
  margin-left: 10px;
  margin-top: -1px;
  width: 80%;
}
#tasksteps > .v-stepper__header .v-stepper__step__step {
  margin: 5px 5px 5px 10px;
}
#tasksteps > .v-stepper__header {
  height: 34px;
}
#tasksteps > .v-stepper__header .v-stepper__step {
  justify-content: center;
  height: 34px;
  width: 170px;
}
#tasksteps > .v-stepper__header .v-stepper__label {
  display: block !important;
}
#tasksteps > .v-stepper__header .v-divider {
  margin: 0;
}
#solutiondetailtab .v-stepper--vertical .v-stepper__step {
  padding: 8px 24px;
}
</style>
