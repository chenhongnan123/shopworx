<template>
  <div id="task">
    <portal to="app-header">
      <span>{{ $t('maintenancetask.name') }}</span>
      <!-- <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn> -->
    </portal>
    <portal to="app-extension">
      <v-tabs dense center-active v-model="viewer">
        <v-tab class="text-none">
          <v-icon class="mr-1" small>mdi-calendar-multiselect</v-icon>
          {{ $t('maintenancetask.calendar') }}
        </v-tab>
        <v-tab class="text-none">
          <v-icon class="mr-1" small>mdi-format-list-bulleted-square</v-icon>
          {{ $t('maintenancetask.list') }}
        </v-tab>
      </v-tabs>
    </portal>
    <task-calendar v-if="viewer == 0" />
    <task-list v-else />
    <add-task />
  </div>
</template>

<script>
import { monthStart, monthEnd } from '@shopworx/services/util/date.service';
import { mapActions, mapState, mapMutations } from 'vuex';
import AddTask from '../components/AddTask.vue';
import TaskCalendar from '../components/TaskCalendar.vue';
import TaskList from '../components/TaskList.vue';

export default {
  components: {
    AddTask,
    TaskCalendar,
    TaskList,
  },
  name: 'MaintenanceTask',
  data() {
    return {
      confirmDialog: false,
      saving: false,
      viewer: 0,
    };
  },
  computed: {
    ...mapState('task', [
      'assets',
      'filter',
      'isApply',
      'planList',
      'machineList',
      'typeValue',
      'machineValue',
      'taskList',
      'monthValue',
      'statusValue',
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
  },
  watch: {
    typeValue(val) {
      if (!val) {
        this.setTypeValue('');
        this.getRecords(this.getQuery());
      }
    },
    machineValue(val) {
      if (!val) {
        this.setMachineValue('');
        this.getRecords(this.getQuery());
      }
    },
    statusValue(val) {
      if (!val) {
        this.setStatusValue('');
        this.getRecords(this.getQuery());
      }
    },
    // monthValue(val) {
    //   if (!val) {
    //     this.setMonthValue('');
    //   }
    //   this.getRecords(this.getQuery());
    // },
  },
  async created() {
    this.setExtendedHeader(true);
    await this.getAssets();
    // const currentMonth = formatDate(new Date(), 'yyyy-MM');
    // this.setMonthValue(currentMonth);
    // this.getRecords('');
    // await this.getLineList();
    // await this.getMachineList();
    // await this.getSublineList();
    // await this.getOperatorList();
    // await this.getSolutionRecords();
  },
  methods: {
    ...mapMutations('helper', ['setAlert', 'setExtendedHeader']),
    ...mapMutations('task', [
      'toggleFilter',
      'setAddTaskDialog',
      'setApply',
      'setPlanList',
      'setTypeValue',
      'setMachineValue',
      'setMonthValue',
      'setStatusValue',
    ]),
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
    handleClick(value) {
      this.$router.push({ name: 'maintenance-plandetail', params: { id: value.id } });
    },
    getQuery() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      const start = new Date(monthStart(new Date(this.monthValue))).getTime();
      const end = new Date(monthEnd(new Date(this.monthValue))).getTime();
      query += `%26%26planstarttime<${end}`;
      query += `%26%26planendtime>${start}`;
      if (this.typeValue) {
        query += `%26%26typeValue=="${this.typeValue}"`;
      }
      if (this.machineValue) {
        query += `%26%26machineid=="${this.machineValue}"`;
      }
      if (this.statusValue) {
        query += `%26%26status=="${this.statusValue}"`;
      }
      return query;
    },
    async RefreshUI() {
      await this.getRecords(this.getQuery());
    },
  },
};
</script>

<style lang="sass">
#task
  height: 100%
  width: 100%
  .stick
    width: 100%
    padding: 20px 0
    overflow: hidden
    z-index: 1
.photo
  display: grid
  grid-template-rows: 1fr
  gap: 10px
  grid-template-columns: 48px 1fr
  align-items: center
  .v-small-dialog
    display: none
</style>
