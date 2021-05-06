<template>
  <v-container fluid class="py-0" style="height:100%">
    <v-row justify="center" style="height:100%">
      <v-col cols="12" xl="10" class="py-0" style="height:90%">
        <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
          <v-btn small color="primary" class="text-none" @click="setAddPlanDialog(true)">
            <v-icon small left>mdi-plus</v-icon>
            {{ $t('Add order') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2"
            @click="updateRange({ start, end })"
          >
            <v-icon small left>mdi-refresh</v-icon>
            {{ $t('Refresh') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn small outlined class="text-none" @click="setToday">
            {{ $t('Today') }}
          </v-btn>
          <v-btn small icon class="ml-2" @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn small icon class="ml-2" @click="next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <span class="mx-4">{{ title }}</span>
          <v-menu
            bottom
            offset-y
          >
            <template #activator="{ on }">
              <v-btn small outlined class="text-none ml-2" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon small right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="type = 'day'">
                <v-list-item-title v-text="$t('Day')"></v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title v-text="$t('Week')"></v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title v-text="$t('Month')"></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
          <!-- <v-btn small color="primary" outlined class="text-none" @click="filterClick">
            <v-icon small left>mdi-filter-variant</v-icon>
            {{ $t('Filters') }}
          </v-btn> -->
        </v-toolbar>
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :now="today"
          :type="type"
          :event-color="getEventColor"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'OrderCalendarView',
  data() {
    return {
      focus: '',
      events: [],
      today: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      start: null,
      end: null,
    };
  },
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return '';
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? '' : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? '' : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`;
        case 'week':
        case '4day':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`;
        default:
          return '';
      }
    },
    ...mapState('orderManagement', ['orderList']),
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      });
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  // watch: {
  //   orderList: {
  //     handler(val) {
  //       if (val) {
  //         const end = this.end;
  //         const start = this.start;
  //         this.updateRange({ start, end });
  //       }
  //     },
  //   },
  // },
  methods: {
    ...mapMutations('orderManagement', ['setAddPlanDialog', 'toggleFilter', 'setArchive']),
    ...mapActions('orderManagement', ['getOrderRecords', 'getOrderListRecords']),
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    filterClick() {
      this.setArchive(true);
      this.toggleFilter();
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    async updateRange({ start, end }) {
      const events = [];
      await this.getOrderListRecords('?query=visible==true');
      if (this.orderList && this.orderList.length) {
        for (let i = 0; i < this.orderList.length; i += 1) {
          const object = {};
          object.name = this.orderList[i].ordername;
          object.color = this.planStatusClass(this.orderList[i].orderstatus);
          if (this.orderList[i].orderstatus === 'Interrupted') {
            object.start = this.formatDate(new Date(this.orderList[i].orderinttime).getTime());
            const expCycleTime = 23456;
            const targetCount = this.orderList[i].targetcount * expCycleTime;
            object.end = this.formatDate(new Date(this.orderList[i].orderinttime)
              .getTime() + targetCount);
          } else if (this.orderList[i].orderstatus === 'Completed') {
            if (this.orderList[i].ordercompletetime) {
              object.start = this.formatDate(new Date(this.orderList[i].ordercompletetime)
                .getTime());
              const expCycleTime = 23456;
              const targetCount = this.orderList[i].targetcount * expCycleTime;
              object.end = this.formatDate(new Date(this.orderList[i].ordercompletetime).getTime()
                + targetCount);
            } else {
              object.start = this.formatDate(this.orderList[i].scheduledstart);
              object.end = this.formatDate(this.orderList[i].scheduledend);
            }
          } else {
            object.start = this.formatDate(this.orderList[i].scheduledstart);
            object.end = this.formatDate(this.orderList[i].scheduledend);
          }
          events.push(object);
        }
      }
      this.start = start;
      this.end = end;
      this.events = events;
    },
    planStatusClass(planstatus) {
      switch (planstatus) {
        case 'Running': return 'success';
        case 'Interrupted': return 'error';
        case 'New': return 'info';
        case 'Released': return 'warning';
        case 'Completed': return 'accent';
        default: return '';
      }
    },
    nth(d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
    },
    formatDate(timestamp) {
      const a = new Date(timestamp);
      return `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`;
    },
  },
};
</script>

<style scoped>
.stick {
  position: -webkit-sticky;
  position: sticky;
  top: 104px;
  z-index: 1;
}
</style>
