<template>
  <v-container fluid class="pa-0" style="height: calc(100vh - 56px);">
    <welcome-header />
    <welcome-timeline />
    <!-- <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay> -->
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { dayStart, dayEnd } from '@shopworx/services/util/date.service';
import WelcomeHeader from '@/components/dashboard/welcomeheader.vue';
import WelcomeTimeline from '@/components/dashboard/welcometimeline.vue';

export default {
  name: 'Dashboard',
  components: {
    WelcomeHeader,
    WelcomeTimeline,
  },
  data() {
    return {
      loading: false,
    };
  },
  async created() {
    this.loading = true;
    await this.getRecords('?query=status=="in progress"||status=="assigned"');
    const start = new Date(dayStart(new Date())).getTime();
    const end = new Date(dayEnd(new Date())).getTime();
    this.today = await this.getRecordsByQuery(
      `?query=status!="new"%26%26planendtime>=${start}%26%26planstarttime<=${end}`,
    );
    await this.getTaskOperatorList(`?query=operatorid=="${this.operator.id}"`);
    await this.getTodoList();
    await this.getTodayList();
    this.loading = false;
  },
  methods: {
    ...mapActions('maintenance', [
      'getRecords',
      'getLineList',
      'getSublineList',
      'getMachineList',
      'getSolutionRecords',
      'deletePlan',
      'getOperatorList',
      'getAssets',
      'getTaskOperatorList',
      'getRecordsByQuery',
    ]),
    ...mapMutations('maintenance', [
      'toggleListFilter',
      'setAddTaskDialog',
      'setApply',
      'setPlanList',
      'setListTypeValue',
      'setListMachineValue',
      'setListStatusValue',
      'setStartdateValue',
      'setEnddateValue',
      'setTodoList',
      'setTaskList',
      'setTodaytasks',
    ]),
    getTodoList() {
      // eslint-disable-next-line max-len
      const todo = this.taskList.filter(
        (task) => this.taskOperatorList.filter((item) => item.taskid === task.id).length > 0,
      );
      this.setTodoList(todo);
      return todo;
    },
    getTodayList() {
      // eslint-disable-next-line max-len
      const today = this.today.filter(
        (task) => this.taskOperatorList.filter((item) => item.taskid === task.id).length > 0,
      );
      this.setTodaytasks(today);
      return today;
    },
  },
  computed: {
    ...mapState('maintenance', [
      'taskList',
      'planList',
      'machineList',
      'listtypeValue',
      'listmachineValue',
      'liststatusValue',
      'startdateValue',
      'enddateValue',
      'assets',
      'taskOperatorList',
    ]),
    ...mapState('auth', ['operator']),
  },
};
</script>
