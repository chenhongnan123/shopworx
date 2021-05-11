<template>
  <div
    style="
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;"
  >
    <portal to="app-header">
      <span v-text="$t('maintenancetask.detailtitle')"></span>
      <!-- <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn> -->
    </portal>
    <v-container fluid class="py-0" style="height:100%;overflow: hidden;">
      <v-btn icon @click="$router.push({ name: 'maintenanceTask' })" color="primary">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span v-text="`${$t('maintenancetask.name')}`"> </span>
      <span v-text="taskInfo.name ? taskInfo.name : ''"></span>
      <v-row justify="center" style="height:22%;" class="px-6 mb-6 mt-1">
        <v-card style="width:100%;">
          <v-card-title primary-title style="background-color: #28abb9;color: white;" class="py-1">
            <v-icon color="white" class="mr-2">mdi-information</v-icon>
            {{ $t('maintenancetask.basic.title') }}
          </v-card-title>
          <v-card-text class="pt-1 pb-0 mt-5">
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
      <v-row justify="center" style="height:70%;" class="px-6 mb-6">
        <v-card style="width:100%;height: 100%;">
          <v-card-title primary-title style="background-color: #f05454;color: white;" class="py-1">
            <v-icon color="white" class="mr-2">mdi-clipboard-list-outline</v-icon>
            {{ $t('maintenancetask.steps.title') }}
          </v-card-title>
          <v-card-text class="pa-0" style="height: calc(100% - 40px);overflow: auto;">
            <v-stepper v-model="e1" style="height: 100%;">
              <v-stepper-header>
                <v-stepper-step editable :complete="e1 > 1" step="1">{{
                  $t('maintenancetask.steps.assign')
                }}</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step editable :complete="e1 > 2" step="2">{{
                  $t('maintenancetask.steps.report')
                }}</v-stepper-step>
              </v-stepper-header>

              <v-stepper-items style="height: calc(100% - 2px);">
                <v-stepper-content step="1">
                  <v-card class="ma-6 elevation-8" height="400px">
                    <v-card-text style="height: calc(100% - 60px);">
                      <v-row>
                        <v-col cols="6">
                          <v-card-title class="pa-0">
                            <v-icon left>mdi-calendar-clock</v-icon>
                            {{ $t('maintenancetask.steps.datetime') }}
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-form class="mt-4">
                            <v-text-field
                              v-if="taskInfo.status === 'new'"
                              :disabled="saving"
                              :label="$t('maintenancetask.taskheader.planstarttime')"
                              v-model="planstarttime"
                              type="datetime-local"
                              outlined
                            ></v-text-field>
                            <v-text-field
                              v-else
                              :disabled="saving"
                              :label="$t('maintenancetask.taskheader.planstarttime')"
                              v-model="taskInfo.planstarttime"
                              outlined
                              readonly
                            ></v-text-field>
                            <v-text-field
                              v-if="taskInfo.status === 'new'"
                              :disabled="saving"
                              :label="$t('maintenancetask.taskheader.planendtime')"
                              v-model="planendtime"
                              type="datetime-local"
                              outlined
                            ></v-text-field>
                            <v-text-field
                              v-else
                              :disabled="saving"
                              :label="$t('maintenancetask.taskheader.planendtime')"
                              v-model="taskInfo.planendtime"
                              outlined
                              readonly
                            ></v-text-field>
                          </v-form>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              :disabled="
                                !planendtime || !planstarttime || taskInfo.status !== 'new'
                              "
                              color="primary"
                              @click="saveAssigned"
                              >{{ $t('maintenancetask.general.save') }}</v-btn
                            >
                          </v-card-actions>
                        </v-col>
                        <v-col cols="6">
                          <v-card-title class="pa-0">
                            <v-icon left>mdi-account-multiple</v-icon>
                            {{ $t('maintenancetask.steps.operator') }}
                            <v-spacer></v-spacer>
                            <v-btn color="primary" small text @click="setBindOperatorDialog(true)">
                              <v-icon small>mdi-plus</v-icon>
                              {{ $t('maintenancetask.general.add') }}
                            </v-btn>
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-card-text>
                            <v-card
                              v-for="n in operators"
                              :key="n._id"
                              color="#ebecf1"
                              class="ma-4"
                              height="80"
                              width="80"
                              style="float: left;"
                            >
                              <v-img
                                v-if="n._photo"
                                :src="n._photo"
                                height="56px"
                                width="56px"
                                style="margin: 2px 12px 0 12px;border-radius: 50%;"
                              ></v-img>
                              <v-icon
                                v-else
                                color="primary"
                                size="56"
                                style="margin: 2px 12px 0 12px;"
                                v-text="'mdi-account'"
                              ></v-icon>

                              <v-row justify="center">
                                {{ n.operatorname }}
                              </v-row>
                            </v-card>
                          </v-card-text>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card class="ma-1" height="470px">
                    <v-card-text class="py-0" style="height: calc(100% - 50px);">
                      <v-row style="height: 100%;">
                        <v-col cols="8" style="height: 100%;overflow: auto;">
                          <v-card-title class="pa-0">
                            <v-icon left>mdi-list-status</v-icon>
                            {{ $t('maintenancetask.steps.tasklist') }}
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-tabs dense v-model="tab" color="primary" slider-color="primary">
                            <v-tab v-for="(value, name) in solutiondetails" :key="name">
                              {{ name }}
                            </v-tab>
                          </v-tabs>
                          <v-tabs-items id="solutiondetailtab" v-model="tab">
                            <v-tab-item
                              v-for="(value, name) in solutiondetails"
                              :key="name"
                              style="height: 100%;"
                            >
                              <v-data-table
                                :headers="taskHeader1"
                                :items="value"
                                class="elevation-1 ma-1"
                                :items-per-page="5"
                                dense
                              >
                                <template v-slot:item.result="{ item }">
                                  <!-- <v-switch
                                    v-model="item.result"
                                    :disabled="
                                      (item.islimited && item.type === 'value') ||
                                        taskInfo.status === 'completed'
                                    "
                                    :label="`${item.result ? 'OK' : 'NG'}`"
                                  ></v-switch> -->
                                  <v-radio-group
                                    row
                                    v-model="item.result"
                                    :disabled="
                                      (item.islimited && item.type === 'value') ||
                                        taskInfo.status !== 'in progress'
                                    "
                                    :mandatory="false"
                                  >
                                    <v-radio label="OK" value="OK"></v-radio>
                                    <v-radio label="NG" value="NG"></v-radio>
                                  </v-radio-group>
                                </template>
                                <template v-slot:item.value="props">
                                  <v-edit-dialog
                                    :return-value.sync="props.item.value"
                                    @save="getResult(props.item)"
                                  >
                                    {{ props.item.value }}
                                    <v-icon
                                      small
                                      color="primary"
                                      :disabled="taskInfo.status !== 'in progress'"
                                    >
                                      mdi-pencil
                                    </v-icon>
                                    <template v-slot:input>
                                      <v-text-field
                                        :disabled="taskInfo.status !== 'in progress'"
                                        v-model="props.item.value"
                                        label="Edit"
                                        single-line
                                        :type="props.item.type === 'value' ? 'number' : 'text'"
                                      ></v-text-field>
                                    </template>
                                  </v-edit-dialog>
                                </template>
                              </v-data-table>
                            </v-tab-item>
                          </v-tabs-items>
                        </v-col>
                        <v-col cols="4" style="height: 100%;overflow: auto;">
                          <v-card-title class="pa-0">
                            <v-icon left>mdi-cogs</v-icon>
                            {{ $t('maintenancetask.steps.sparepart') }}
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              small
                              text
                              @click="dialog = true"
                              :disabled="taskInfo.status !== 'in progress'"
                            >
                              <v-icon small>mdi-plus</v-icon>
                              {{ $t('maintenancetask.general.add') }}
                            </v-btn>
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-data-table
                            :headers="sparepartHeader"
                            :items="replacementList"
                            class="elevation-1 mt-2"
                            :items-per-page="5"
                          >
                            <template v-slot:item.quantity="props">
                              <v-edit-dialog
                                :return-value.sync="props.item.quantity"
                                @save="updateReplacement(props.item)"
                              >
                                {{ props.item.quantity }}
                                <v-icon
                                  small
                                  color="primary"
                                  :disabled="taskInfo.status !== 'in progress'"
                                >
                                  mdi-pencil
                                </v-icon>
                                <template v-slot:input>
                                  <v-text-field
                                    :disabled="taskInfo.status !== 'in progress'"
                                    v-model="props.item.quantity"
                                    label="Edit"
                                    single-line
                                    type="number"
                                  ></v-text-field>
                                </template>
                              </v-edit-dialog>
                            </template>
                            <template v-slot:item.actions="{ item }">
                              <v-icon
                                color="red"
                                @click="
                                  sparepartconfirmdialog = true;
                                  spareparttodelete = item;
                                "
                              >
                                mdi-delete
                              </v-icon>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green"
                        @click="startTask"
                        :disabled="taskInfo.status !== 'assigned'"
                        >{{ $t('maintenancetask.general.start') }}</v-btn
                      >
                      <v-btn
                        color="primary"
                        @click="reportTask"
                        :disabled="taskInfo.status !== 'in progress'"
                        >{{ $t('maintenancetask.general.save') }}</v-btn
                      >
                      <v-btn
                        color="primary"
                        @click="reportValidate"
                        :disabled="taskInfo.status !== 'in progress'"
                        >{{ $t('maintenancetask.general.complete') }}</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
    <bind-operator />
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
        <v-card-text style="height: 400px;">
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
            {{ $t('maintenancetask.general.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!sparepartObj.sparepartid || !sparepartObj.quantity"
            class="text-none"
            :loading="saving"
            @click="addSparepart"
          >
            {{ $t('maintenancetask.general.save') }}
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
          {{ $t('maintenancetask.general.confirmcompletemessage') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text class="text-none" @click="confirmdialog = false">
            {{ $t('maintenancetask.general.cancel') }}
          </v-btn>
          <v-btn color="primary" class="text-none" :loading="saving" @click="completeTask">
            {{ $t('maintenancetask.general.save') }}
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
            {{ $t('maintenancetask.reportsparepart.deleteheader') }}
          </span>
        </v-card-title>
        <v-card-text class="black--text text-h6">
          {{ $t('maintenancetask.reportsparepart.deletemessage') }}
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
            {{ $t('maintenancetask.general.cancel') }}
          </v-btn>
          <v-btn color="primary" class="text-none" :loading="saving" @click="deleteSparepart">
            {{ $t('maintenancetask.general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { formatDate } from '@shopworx/services/util/date.service';
import FileService from '@shopworx/services/api/file.service';
import WMSService from '@shopworx/services/api/wms.service';
import { mapState, mapMutations, mapActions } from 'vuex';
import BindOperator from '../components/BindOperator.vue';

export default {
  name: 'MaintenanceTaskDetail',
  components: { BindOperator },
  data() {
    return {
      sparepartconfirmdialog: false,
      spareparttodelete: null,
      planstarttime: '',
      planendtime: '',
      dialog: false,
      confirmdialog: false,
      tab: null,
      show: false,
      solutiondetails: [],
      spareparts: [],
      confirmDialog: false,
      toDelete: null,
      saving: false,
      putrecord: null,
      taskObj: {},
      sparepartObj: {},
      operators: [],
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
          text: this.$t('maintenancetask.sparepartheader.sparepart'),
          value: 'sparepartname',
        },
        {
          text: this.$t('maintenancetask.sparepartheader.position'),
          value: 'machinepositionname',
        },
        {
          text: this.$t('maintenancetask.sparepartheader.upper'),
          value: 'upper',
        },
        {
          text: this.$t('maintenancetask.sparepartheader.lower'),
          value: 'lower',
        },
        {
          text: this.$t('maintenancetask.sparepartheader.quantity'),
          value: 'quantity',
        },
        { text: '', value: 'actions', sortable: false },
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
    ...mapState('auth', ['sessionId']),
    ...mapState('task', [
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
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
  },
  async created() {
    this.taskid = this.$route.params.id;
    await this.getRecords(`?query=id=="${this.taskid}"&sortquery=createdTimestamp==-1`);

    await this.getAssets();
    await this.getOperatorList();
    if (this.taskInfo.status !== 'new') {
      this.e1 = 2;
    } else {
      this.planstarttime = this.taskInfo.planstarttime;
      this.planendtime = this.taskInfo.planendtime;
    }
    await this.getReplacementList(`?query=taskid=="${this.taskid}"`);
    await this.getTaskDetailList(`?query=taskid=="${this.taskid}"`);
    await this.getTaskOperatorList(`?query=taskid=="${this.taskid}"`);
    // await this.getSolutionDetailRecords(`?query=solutionid=="${this.taskInfo.solutionid}"`);
    // await this.getSparepartinplanningRecords(`?query=planid=="${this.taskInfo.planid}"`);
    await this.getSparepartRecords(`?query=machineid=="${this.taskInfo.machineid}"`);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('task', ['setBindOperatorDialog']),
    ...mapActions('task', [
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
    async saveAssigned() {
      if (this.planstarttime && this.planendtime) {
        const getAssetId = this.assets
          .filter((item) => item.status === 'ACTIVE')
          .reduce((acc, item) => acc + item.id, 0);
        const payload = {
          assetid: getAssetId,
          status: 'assigned',
          planstarttime: new Date(this.planstarttime).getTime(),
          planendtime: new Date(this.planendtime).getTime(),
          editedby: this.userName,
          editedtime: new Date().getTime(),
          plandate: Number(formatDate(new Date(this.planstarttime), 'yyyyMMdd')),
        };
        this.saving = true;
        const task = await this.updateTask({ id: this.taskInfo._id, payload });
        this.saving = false;
        if (task) {
          this.getRecords(`?query=id=="${this.taskid}"&sortquery=createdTimestamp==-1`);
          this.setAlert({
            show: true,
            type: 'success',
            message: 'UPDATE_MAINTENANCE_TASK',
          });
        }
      }
    },
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
          message: 'Please Check Spareparts Quantity!',
        });
        return;
      }
      if (this.replacementList.length > 0) {
        const checkstock = this.replacementList.map((replacement) => {
          const sparepartobj = this.sparepartList
            .filter((item) => item.sparepartid === replacement.sparepartid)[0];
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
            return WMSService.checkStock(warehouse, location, {
              partname: sparepartobj.sparepartname,
              partnumber: sparepartobj.sparepartcode,
            }, quantity);
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
      // post System Message
      // const nglist = taskdetailpayload.filter((item) => item.result === 'NG');
      // if (nglist.length > 0) {
      //   const payload = {
      //     title: '',
      //     message: '',
      //     data: JSON.stringify(nglist),
      //     level: 1,
      //   };
      //   await this.postSystemMessage(payload);
      // }
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
      // Sparepart out-bound
      this.replacementList.forEach((replacement) => {
        const sparepartobj = this.sparepartList
          .filter((item) => item.sparepartid === replacement.sparepartid)[0];
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
    async updateReplacement(data) {
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
        id: data._id,
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
      }
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
  },
};
</script>
<style lang="sass">
#plandetails
    display: grid
    grid-template-rows: 500px
    grid-template-columns: repeat(auto-fill, 400px)
    gap: 20px
    &:before
      height: 2px
      width: 100%
      top: calc(48px - 1px)
      left: 0
    &>.v-timeline-item
      position: relative
      display: block
      &>.v-timeline-item__body
        max-width: 100%
        top: 60px
        &>.v-card:before,&>.v-card:after
          transform: rotate(90deg)
          left: calc(50% - 10px)
          top: -16px
      &>.v-timeline-item__divider
        position: absolute
        top: 0
        left: calc(50% - 53px)
</style>
