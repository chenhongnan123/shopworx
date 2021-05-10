<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="addmaintenancetask"
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="primary">
        <span class="white--text">
          {{ $t('maintenancetask.addtitle') }}
        </span>
      </v-card-title>
      <v-card-text style="height: 300px;">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-autocomplete
            clearable
            :label="$t('maintenancetask.taskheader.machinename')"
            :items="machineList"
            :disabled="saving"
            @change="handleMachine"
            :rules="rules.machine"
            item-text="machinename"
            return-object
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-subtitle v-text="item.machinecode"></v-list-item-subtitle>
                <v-list-item-title v-text="item.machinename"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            clearable
            :label="$t('maintenancetask.taskheader.solutionname')"
            :items="solutionList"
            :disabled="saving"
            :rules="rules.solution"
            @change="handleSolution"
            return-object
            item-text="name"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
            readOnly
            :label="$t('maintenancetask.taskheader.type')"
            v-model="taskObj.type"
          ></v-text-field>
          <v-text-field
            :disabled="saving"
            :label="$t('maintenancetask.taskheader.plandate')"
            v-model="plandate"
            type="date"
            clearable
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
          class="text-none"
          :disabled="
            !taskObj.machineid &&
              !taskObj.solutionid &&
              !taskObj.planstarttime &&
              !taskObj.planendtime
          "
          :loading="saving"
          @click="saveTask"
        >
          {{ $t('maintenancetask.general.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';
import { dayStart, dayEnd, formatDate } from '@shopworx/services/util/date.service';

const maintenancetaskTags = {
  TASKID_TAG: 'id',
  PLANID_TAG: 'planid',
  PLANNAME_TAG: 'planname',
  MACHINEID_TAG: 'machineid',
  MACHINENAME_TAG: 'machinename',
  MACHINECODE_TAG: 'machinecode',
  SOLUTION_TAG: 'solutionid',
  SOLUTIONNAME_TAG: 'solutionname',
  SOLUTIONTYPE_TAG: 'solutiontype',
  STATUS_TAG: 'status',
  CREATEDTIME: 'createdtime',
  TYPE_TAG: 'type',
  PLANSTARTTIME_TAG: 'planstarttime',
  PLANDATE_TAG: 'plandate',
  PLANENDTIME_TAG: 'planendtime',
  TASKTRIGGER_TAG: 'tasktrigger',
};

const taskdetailTags = {
  TASKID_TAG: 'taskid',
  SOLUTION_TAG: 'solutionid',
  SOLUTIONNAME_TAG: 'solutionname',
  SOLUTIONDETAILNAME_TAG: 'solutiondetailname',
  DESCRIPTION_TAG: 'description',
  GROUP_TAG: 'group',
  ISLIMITED_TAG: 'islimited',
  LOWER_TAG: 'lower',
  RESULT_TAG: 'result',
  TYPE_TAG: 'type',
  UPPER_TAG: 'upper',
  VALUE_TAG: 'value',
  IMAGE_TAG: 'image',
};

const solutiondetailTags = {
  SOLUTION_TAG: 'solutionid',
  SOLUTIONNAME_TAG: 'solutionname',
  NAME_TAG: 'name',
  DESCRIPTION_TAG: 'description',
  GROUP_TAG: 'group',
  ISLIMITED_TAG: 'islimited',
  LOWER_TAG: 'lower',
  TYPE_TAG: 'type',
  UPPER_TAG: 'upper',
  IMAGE_TAG: 'image',
};

const taskoperatorTags = {
  TASKID_TAG: 'taskid',
  PLANID_TAG: 'planid',
  PLANNAME_TAG: 'planname',
  OPERATORID_TAG: 'operatorid',
  OPERATORNAME_TAG: 'operatorname',
};

const operatorbindmachineTags = {
  OPERATORID_TAG: 'operatorid',
  OPERATORNAME_TAG: 'operatorname',
  MACHINEID_TAG: 'machineid',
  MACHINENAME_TAG: 'machinename',
};
export default {
  name: 'AddMaintenanceTaskDialog',
  data() {
    return {
      plandate: '',
      taskObj: {
        status: 'new',
        type: 'PM',
      },
      rules: {
        planstart: [(v) => !!v || 'Plan Start Time is required'],
        planend: [(v) => !!v || 'Plan End Time is required'],
        machine: [(v) => !!v || 'Machine is required'],
        solution: [(v) => !!v || 'Solution is required'],
      },
      saving: false,
      valid: false,
      operators: [],
    };
  },
  computed: {
    ...mapState('task', [
      'filter',
      'addTaskDialog',
      'machineList',
      'solutionList',
      'machineValue',
      'operatorList',
      'assets',
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.addTaskDialog;
      },
      set(val) {
        this.setAddTaskDialog(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('task', ['setAddTaskDialog']),
    ...mapActions('task', [
      'createTask',
      'getRecords',
      'createOperatorList',
      'getSolutionDetailRecords',
      'createTaskDetailList',
      'getOperatorBindMachineList',
      'getTaskList',
    ]),
    getQuery() {
      let query = '?query=assetId!=-1';
      if (this.typeValue) {
        query += `%26%26type=="${this.typeValue}"`;
      }
      if (this.machineValue) {
        query += `%26%26machineid=="${this.machineValue}"`;
      }
      return query;
    },
    async saveTask() {
      const { taskObj } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        const getAssetId = this.assets.filter((item) => item.status === 'ACTIVE').reduce((acc, item) => acc + item.id, 0);
        // taskObj.planstarttime = new Date(taskObj.planstarttime).getTime();
        // taskObj.planendtime = new Date(taskObj.planendtime).getTime();
        const payload = {
          planname: 'PM',
          planid: 'plan-0',
          ...taskObj,
          assetid: getAssetId,
          createdby: this.userName,
          createdtime: new Date().getTime(),
          planstarttime: new Date(dayStart(new Date(this.plandate))).getTime(),
          planendtime: new Date(dayEnd(new Date(this.plandate))).getTime(),
          plandate: formatDate(new Date(this.plandate), 'yyyyMMdd'),
        };
        this.saving = true;
        const task = await this.createTask(payload);
        const newtask = await this.getTaskList(
          '?query=planid=="plan-0"&sortquery=createdTimestamp==-1&pagenumber=1&pagesize=1',
        );
        if (newtask && newtask.length) {
          await this.createTaskDetails(this.taskObj.solutionid, newtask[0]);
          await this.createTaskOperator(newtask[0]);
        }
        this.saving = false;

        // eslint-disable-next-line max-len
        if (task) {
          this.getRecords(this.getQuery());
          this.taskObj = {
            status: 'new',
            type: 'PM',
          };
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_MAINTENANCE_TASK',
          });
        }
        this.dialog = false;
      }
    },
    handleSolution(item) {
      if (item) {
        this.taskObj.solutionid = item.id;
        this.taskObj.solutionname = item.name;
        this.taskObj.solutiontype = item.type;
      }
    },
    handleMachine(item) {
      if (item) {
        this.taskObj.machineid = item.id;
        this.taskObj.machinename = item.machinename;
        this.taskObj.machinecode = item.machinecode;
      }
    },
    handleType(item) {
      if (item) {
        this.taskObj.unit = item === 'TBM' ? 'day' : 'count';
      }
    },
    async createTaskDetails(solutionid, task) {
      const query = `?query=solutionid=="${solutionid}"`;
      const response = await this.getSolutionDetailRecords(query);

      if (response && response.length) {
        const details = response;
        if (details.length > 0) {
          // eslint-disable-next-line
          const bulkpayload = details.map((detail) => {
            return {
              [taskdetailTags.TASKID_TAG]: task[maintenancetaskTags.TASKID_TAG],
              [taskdetailTags.SOLUTION_TAG]: detail[solutiondetailTags.SOLUTION_TAG],
              [taskdetailTags.SOLUTIONNAME_TAG]: detail[solutiondetailTags.SOLUTIONNAME_TAG],
              [taskdetailTags.SOLUTIONDETAILNAME_TAG]: detail[solutiondetailTags.NAME_TAG],
              [taskdetailTags.DESCRIPTION_TAG]: detail[solutiondetailTags.DESCRIPTION_TAG],
              [taskdetailTags.GROUP_TAG]: detail[solutiondetailTags.GROUP_TAG],
              [taskdetailTags.ISLIMITED_TAG]: detail[solutiondetailTags.ISLIMITED_TAG],
              [taskdetailTags.LOWER_TAG]: detail[solutiondetailTags.LOWER_TAG],
              [taskdetailTags.RESULT_TAG]: '',
              [taskdetailTags.TYPE_TAG]: detail[solutiondetailTags.TYPE_TAG],
              [taskdetailTags.UPPER_TAG]: detail[solutiondetailTags.UPPER_TAG],
              [taskdetailTags.VALUE_TAG]: '',
              [taskdetailTags.IMAGE_TAG]: detail[solutiondetailTags.IMAGE_TAG],
              assetid: 0,
            };
          });
          this.createTaskDetailList(bulkpayload);
        }
      }
    },
    async createTaskOperator(task) {
      const query = `?query=machineid=="${this.taskObj.machineid}"`;
      const response = await this.getOperatorBindMachineList(query);
      if (response && response.length) {
        const details = response;
        if (details.length > 0) {
          // eslint-disable-next-line
          const bulkpayload = details.map((detail) => {
            return {
              [taskoperatorTags.TASKID_TAG]: task[maintenancetaskTags.TASKID_TAG],
              [taskoperatorTags.PLANID_TAG]: 'plan-0',
              [taskoperatorTags.PLANNAME_TAG]: 'PM',
              [taskoperatorTags.OPERATORID_TAG]: detail[operatorbindmachineTags.OPERATORID_TAG],
              [taskoperatorTags.OPERATORNAME_TAG]: detail[operatorbindmachineTags.OPERATORNAME_TAG],
              assetid: 0,
            };
          });
          this.createOperatorList(bulkpayload);
        }
      }
    },
  },
};
</script>
<style lang="sass">
#clicktoupload
  margin: 0 auto
  border: 2px dashed #00bcd4
  cursor: pointer
  height: 200px
  width: 200px
  line-height: 200px
  text-align: center
</style>
