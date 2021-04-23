<template>
  <v-container fluid class="py-0">
    <div class="stick py-1">
      <div style="float: left; margin-bottom: 10px">
        <span v-if="machineList.length && !!calendarmachineValue" class="ml-2">
          {{ $t('maintenancetask.general.machine') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2"
            @click="setCalendarMachineValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate" style="max-width: 100px;">
              {{ machineList.filter((item) => item.id === calendarmachineValue)[0].name }}
            </div>
          </v-btn>
        </span>
        <span v-if="!!calendartypeValue" class="ml-2">
          {{ $t('maintenancetask.filter.type') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setCalendarTypeValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate" style="max-width: 100px">
              {{ calendartypeValue }}
            </div>
          </v-btn>
        </span>
        <span v-if="!!calendarstatusValue" class="ml-2">
          {{ $t('maintenancetask.general.status') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setCalendarStatusValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate text-capitalize" style="max-width: 100px">
              {{ calendarstatusValue }}
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
        <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleCalendarFilter">
          <v-icon small left>mdi-filter-variant</v-icon>
          {{ $t('maintenancetask.general.filter') }}
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
    <v-row class="fill-height mt-0">
      <v-col class="py-1">
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              v-if="type === 'day'"
              @click="setToday"
            >
              {{ $t('maintenancetask.filter.today') }}
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>{{ $t('maintenancetask.filter.day') }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>{{ $t('maintenancetask.filter.month') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="tasks"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @moved="updateTime"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  {{ $t('maintenancetask.general.cancel') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
      <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-row>
    <task-calendar-filter />
  </v-container>
</template>
<script>
import { formatDate, monthStart, monthEnd } from '@shopworx/services/util/date.service';
import { mapActions, mapState, mapMutations } from 'vuex';
import TaskCalendarFilter from './TaskCalendarFilter.vue';

export default {
  components: { TaskCalendarFilter },
  name: 'TaskCalendar',
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      day: 'Day',
    },
    selectedEvent: {},
    loading: false,
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: {
      new: 'blue',
      assigned: 'orange',
      'in progress': 'red',
      completed: 'green',
    },
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    status: ['new', 'assigned', 'in progress', 'completed'],
  }),
  async created() {
    // this.setExtendedHeader(true);
    await this.getAssets();
    const currentMonth = formatDate(new Date(), 'yyyy-MM');
    this.setMonthValue(currentMonth);
    this.getCalendarRecords(this.getQuery());
    await this.getLineList();
    await this.getMachineList();
    await this.getSublineList();
    await this.getOperatorList();
    await this.getSolutionRecords();
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  computed: {
    ...mapState('task', [
      'monthValue',
      'calendarstatusValue',
      'calendarmachineValue',
      'calendartypeValue',
      'assets',
      'calendartaskList',
      'planList',
      'machineList',
    ]),
    tasks() {
      return this.calendartaskList.map((item) => {
        // prettier-ignore
        const {
          planname,
          machinename,
          status,
          planstarttime,
          planendtime,
          id,
        } = item;
        return {
          name: `${machinename}: ${planname}`,
          start: new Date(planstarttime),
          end: new Date(planendtime),
          color: this.colors[status],
          timed: false,
          id,
        };
      });
    },
  },
  methods: {
    ...mapMutations('task', [
      'toggleCalendarFilter',
      'setAddTaskDialog',
      'setApply',
      'setPlanList',
      'setCalendarTypeValue',
      'setCalendarMachineValue',
      'setMonthValue',
      'setCalendarStatusValue',
    ]),
    ...mapActions('task', [
      'getCalendarRecords',
      'getLineList',
      'getSublineList',
      'getMachineList',
      'getSolutionRecords',
      'deletePlan',
      'getOperatorList',
      'getAssets',
    ]),
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = '';
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      this.$router.push({ name: 'maintenance-taskdetail', params: { id: event.id } });
      nativeEvent.stopPropagation();
    },
    async updateTime(date) {
      // prettier-ignore
      const isSameMonth = date.month === new Date(this.monthValue).getMonth()
      && date.year === new Date(this.monthValue).getFullYear;
      if (!isSameMonth) {
        this.setMonthValue(date.date.substring(0, 7));
        this.loading = true;
        await this.getCalendarRecords(this.getQuery());
        this.loading = false;
      }
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
      if (this.calendartypeValue) {
        query += `%26%26typeValue=="${this.calendartypeValue}"`;
      }
      if (this.calendarmachineValue) {
        query += `%26%26machineid=="${this.calendarmachineValue}"`;
      }
      if (this.calendarstatusValue) {
        query += `%26%26status=="${this.calendarstatusValue}"`;
      }
      return query;
    },

    async RefreshUI() {
      await this.getCalendarRecords(this.getQuery());
    },
  },
  watch: {
    calendartypeValue(val) {
      if (!val) {
        this.setCalendarTypeValue('');
        this.getCalendarRecords(this.getQuery());
      }
    },
    calendarmachineValue(val) {
      if (!val) {
        this.setCalendarMachineValue('');
        this.getCalendarRecords(this.getQuery());
      }
    },
    calendarstatusValue(val) {
      if (!val) {
        this.setCalendarStatusValue('');
        this.getCalendarRecords(this.getQuery());
      }
    },
    monthValue(val) {
      if (!val) {
        this.setMonthValue('');
      }
      this.getCalendarRecords(this.getQuery());
    },
  },
};
</script>
