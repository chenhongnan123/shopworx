<template>
  <v-container fluid class="py-0">
    <div class="stick py-3">
      <div style="float: left; margin-bottom: 10px">
        <span v-if="machineList.length && !!listmachineValue" class="ml-2">
          {{ $t('maintenancetask.general.machine') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2"
            @click="setListMachineValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate" style="max-width: 100px;">
              {{ machineList.filter((item) => item.id === listmachineValue)[0].name }}
            </div>
          </v-btn>
        </span>
        <span v-if="!!listtypeValue" class="ml-2">
          {{ $t('maintenancetask.filter.type') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setListTypeValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate" style="max-width: 100px">
              {{ listtypeValue }}
            </div>
          </v-btn>
        </span>
        <span v-if="!!liststatusValue" class="ml-2">
          {{ $t('maintenancetask.filter.status') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setListStatusValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate text-capitalize" style="max-width: 100px">
              {{ liststatusValue }}
            </div>
          </v-btn>
        </span>
        <span v-if="!!startdateValue" class="ml-2">
          {{ $t('maintenancetask.filter.startdate') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setStartdateValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate text-capitalize" style="max-width: 100px">
              {{ startdateValue }}
            </div>
          </v-btn>
        </span>
        <span v-if="!!enddateValue" class="ml-2">
          {{ $t('maintenancetask.filter.enddate') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setEnddateValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate text-capitalize" style="max-width: 100px">
              {{ enddateValue }}
            </div>
          </v-btn>
        </span>
      </div>
      <div style="float: right">
        <v-btn small color="primary" class="text-none" @click="setAddTaskDialog(true)">
          <v-icon small left>mdi-plus</v-icon>
          {{ $t('maintenancetask.general.add') }}
        </v-btn>
        <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
          <v-icon small left>mdi-refresh</v-icon>
          {{ $t('maintenancetask.general.refresh') }}
        </v-btn>
        <v-btn
          small
          color="error"
          outlined
          class="text-none ml-2"
          v-if="planList.length && planSelected.length == 1 && planSelected[0].status == 'unable'"
          @click="confirmDialog = true"
        >
          <v-icon small left>mdi-delete</v-icon>
          {{ $t('maintenancetask.general.delete') }}
        </v-btn>
        <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleListFilter">
          <v-icon small left>mdi-filter-variant</v-icon>
          {{ $t('maintenancetask.general.filter') }}
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
    <v-row class="fill-height full-width mt-6">
      <v-data-table :headers="headers" :items="taskList" class="elevation-1" style="width:100%;">
        <template v-slot:item.status="{ item }">
          <v-chip :color="getColor(item.status)" dark class="text-capitalize">{{
            item.status
          }}</v-chip>
        </template>
        <template v-slot:item.id="{ item }">
          <span @click="handleClick(item)"
            ><a>{{ item.id }}</a></span
          >
        </template>
        <template v-slot:item.planstarttime="{ item }">
          <span>{{
            item.planstarttime
              ? format(new Date(Number(item.planstarttime)), 'yyyy-MM-dd HH:mm')
              : ''
          }}</span>
        </template>
        <template v-slot:item.planendtime="{ item }">
          <span>{{
            item.planendtime ? format(new Date(Number(item.planendtime)), 'yyyy-MM-dd HH:mm') : ''
          }}</span>
        </template>
        <template v-slot:item.acturalstarttime="{ item }">
          <span>{{
            item.acturalstarttime
              ? format(new Date(Number(item.acturalstarttime)), 'yyyy-MM-dd HH:mm')
              : ''
          }}</span>
        </template>
        <template v-slot:item.acturalendtime="{ item }">
          <span>{{
            item.acturalendtime
              ? format(new Date(Number(item.acturalendtime)), 'yyyy-MM-dd HH:mm')
              : ''
          }}</span>
        </template>
        <template v-slot:item.createdtime="{ item }">
          <span>{{
            item.createdtime ? format(new Date(Number(item.createdtime)), 'yyyy-MM-dd HH:mm') : ''
          }}</span>
        </template>
      </v-data-table>
    </v-row>
    <task-list-filter />
  </v-container>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { formatDate, dayStart, dayEnd } from '@shopworx/services/util/date.service';
import TaskListFilter from './TaskListFilter';

export default {
  name: 'TaskList',
  components: { TaskListFilter },
  data() {
    return {
      headers: [
        {
          text: this.$t('maintenancetask.taskheader.id'),
          value: 'id',
        },
        {
          text: this.$t('maintenancetask.taskheader.machinename'),
          value: 'machinename',
        },
        {
          text: this.$t('maintenancetask.taskheader.planname'),
          value: 'planname',
        },
        {
          text: this.$t('maintenancetask.taskheader.solutionname'),
          value: 'solutionname',
        },
        {
          text: this.$t('maintenancetask.taskheader.type'),
          value: 'type',
        },
        {
          text: this.$t('maintenancetask.taskheader.status'),
          value: 'status',
        },
        {
          text: this.$t('maintenancetask.taskheader.planstarttime'),
          value: 'planstarttime',
        },
        {
          text: this.$t('maintenancetask.taskheader.planendtime'),
          value: 'planendtime',
        },
        {
          text: this.$t('maintenancetask.taskheader.actualstarttime'),
          value: 'acturalstarttime',
        },
        {
          text: this.$t('maintenancetask.taskheader.actualendtime'),
          value: 'acturalendtime',
        },
        {
          text: this.$t('maintenancetask.taskheader.createdtime'),
          value: 'createdtime',
        },
      ],
      format: formatDate,
    };
  },
  async created() {
    await this.getAssets();
    await this.getRecords('?pagenumber=1&pagesize=10');
    await this.getLineList();
    await this.getMachineList();
    await this.getSublineList();
    await this.getOperatorList();
    await this.getSolutionRecords();
  },
  methods: {
    ...mapActions('task', [
      'getRecords',
      'getLineList',
      'getSublineList',
      'getMachineList',
      'getSolutionRecords',
      'deletePlan',
      'getOperatorList',
      'getAssets',
    ]),
    ...mapMutations('task', [
      'toggleListFilter',
      'setAddTaskDialog',
      'setApply',
      'setPlanList',
      'setListTypeValue',
      'setListMachineValue',
      'setListStatusValue',
      'setStartdateValue',
      'setEnddateValue',
    ]),
    getColor(status) {
      if (status === 'in progress') return 'red';
      if (status === 'assigned') return 'orange';
      if (status === 'completed') return 'green';
      return 'blue';
    },
    handleClick(value) {
      this.$router.push({ name: 'maintenance-taskdetail', params: { id: value.id } });
    },
    getQuery() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.startdateValue) {
        const start = new Date(dayStart(new Date(this.startdateValue))).getTime();
        query += `%26%26planendtime>${start}`;
      }
      if (this.enddateValue) {
        const end = new Date(dayEnd(new Date(this.enddateValue))).getTime();
        query += `%26%26planstarttime<${end}`;
      }
      if (this.listtypeValue) {
        query += `%26%26typeValue=="${this.listtypeValue}"`;
      }
      if (this.listmachineValue) {
        query += `%26%26machineid=="${this.listmachineValue}"`;
      }
      if (this.liststatusValue) {
        query += `%26%26status=="${this.liststatusValue}"`;
      }
      if (
        // prettier-ignore
        !this.listtypeValue && !this.listmachineValue && !this.liststatusValue
        && !this.startdateValue && !this.enddateValue
      ) {
        query = '?pagenumber=1&pagesize=10';
      }
      return query;
    },
    async RefreshUI() {
      await this.getRecords(this.getQuery());
    },
  },
  computed: {
    ...mapState('task', [
      'taskList',
      'planList',
      'machineList',
      'listtypeValue',
      'listmachineValue',
      'liststatusValue',
      'startdateValue',
      'enddateValue',
      'assets',
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
  },
  watch: {
    listtypeValue(val) {
      if (!val) {
        this.setListTypeValue('');
        this.getRecords(this.getQuery());
      }
    },
    listmachineValue(val) {
      if (!val) {
        this.setListMachineValue('');
        this.getRecords(this.getQuery());
      }
    },
    liststatusValue(val) {
      if (!val) {
        this.setListStatusValue('');
        this.getRecords(this.getQuery());
      }
    },
    startdateValue(val) {
      if (!val) {
        this.setStartdateValue('');
        this.getRecords(this.getQuery());
      }
    },
    enddateValue(val) {
      if (!val) {
        this.setEnddateValue('');
        this.getRecords(this.getQuery());
      }
    },
  },
};
</script>
