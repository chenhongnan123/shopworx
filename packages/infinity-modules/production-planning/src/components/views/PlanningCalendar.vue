<template>
  <v-calendar
    ref="calendar"
    :weekdays="[0, 1, 2, 3, 4, 5, 6]"
    :type="calendarType"
    v-model="focus"
    :now="today"
    color="accent"
    :events="events"
    :locale="locale"
    :event-color="getEventColor"
    @click:event="showEvent"
    @click:more="viewDay"
    @click:date="viewDay"
    @change="fetchEvents"
  >
    <template #event="{ event }">
      <div>
        <strong>{{ event.planid }}</strong>
        {{ event.machinename }}
        {{ event.partname }}
      </div>
    </template>
  </v-calendar>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';

export default {
  name: 'PlanningCalendar',
  data() {
    return {
      events: [],
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
    };
  },
  mounted() {
    this.setCalendarRef(this.$refs.calendar);
  },
  computed: {
    ...mapGetters('productionPlanning', ['planStatus', 'planning']),
    ...mapGetters('helper', ['locale']),
    ...mapState('productionPlanning', [
      'today',
      'view',
      'calendarFocus',
      'calendarRef',
    ]),
    calendarType: {
      get() {
        return this.view;
      },
      set(val) {
        this.setView(val);
      },
    },
    focus: {
      get() {
        return this.calendarFocus;
      },
      set(val) {
        this.setCalendarFocus(val);
      },
    },
  },
  methods: {
    ...mapActions('productionPlanning', ['fetchPlanningList']),
    ...mapMutations('productionPlanning', [
      'setCalendarFocus',
      'setCalendarRef',
      'setView',
    ]),
    ...mapMutations('webApp', ['setFilter']),
    getPlanColor(status) {
      return this.planStatus(status).color;
    },
    getEventColor(event) {
      return event.color;
    },
    viewDay({ date }) {
      this.setCalendarFocus(date);
      this.setView('day');
    },
    formatDate(timestamp) {
      const a = new Date(timestamp);
      return `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`;
    },
    async fetchEvents({ start, end }) {
      const min = start.date;
      const max = end.date;
      this.setFilter({
        field: 'date',
        value: {
          value: [min, max],
          operation: 'range',
        },
      });
      await this.fetchPlanningList();
      this.start = start;
      this.end = end;
      this.setEvents(this.planning);
    },
    setEvents(plans) {
      if (plans) {
        const events = plans.map((plan) => {
          let s = this.formatDate(plan.actualstart);
          let e = this.formatDate(plan.actualend);
          const name = plan.planid;
          const color = this.getPlanColor(plan.status);
          if (plan.status === 'notStarted') {
            s = this.formatDate(plan.scheduledstart);
            e = this.formatDate(plan.scheduledend);
          } else if (plan.status === 'inProgress') {
            e = this.formatDate(plan.scheduledend);
          }
          return {
            ...plan,
            name,
            color,
            start: s,
            end: e,
          };
        });
        this.events = events;
      }
    },
    showEvent({ event }) {
      this.$router.push({
        name: 'productionPlanDetails',
        params: { id: event.planid },
      });
    },
  },
  watch: {
    planning: {
      deep: true,
      handler(plans) {
        this.setEvents(plans || []);
      },
    },
  },
};
</script>
