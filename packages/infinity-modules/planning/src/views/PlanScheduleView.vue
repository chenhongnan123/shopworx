<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <schedule-toolbar @fetch-plans="fetchPlans" />
        <template v-if="loading">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </template>
        <template v-else>
          <template v-for="(timeSlot, n) in timeSlots">
            <div
              :key="timeSlot.value"
              style="border-left: 4px solid"
              class="headline pl-2 font-weight-medium"
              :class="n !== 0 ? 'my-4' : 'mb-4'"
            >
              {{ timeSlot.text }}
            </div>
            <template v-if="!plans[timeSlot.value].length">
              <span class="mb-2 px-4" :key="`no-plan-${timeSlot.value}`">
                No plans
              </span>
            </template>
            <template v-else>
              <template v-for="plan in plans[timeSlot.value]">
                <plan-card
                  :plan="plan"
                  :key="plan._id"
                  class="mb-2 mx-4"
                />
              </template>
            </template>
          </template>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import {
  now,
  dayEnd,
  dayStart,
  isWithinRange,
} from '@shopworx/services/util/date.service';
import ScheduleToolbar from '../components/schedule/ScheduleToolbar.vue';
import PlanCard from '../components/schedule/PlanCard.vue';

export default {
  name: 'PlanScheduleView',
  components: {
    ScheduleToolbar,
    PlanCard,
  },
  data() {
    return {
      plans: {},
      loading: false,
      timeSlots: [
        {
          text: 'Now',
          value: 'now',
        },
        {
          text: 'Today',
          value: 'today',
        },
        {
          text: 'This week',
          value: 'thisweek',
        },
        {
          text: 'Next week',
          value: 'nextweek',
        },
        {
          text: 'Later',
          value: 'later',
        },
      ],
    };
  },
  created() {
    this.fetchPlans();
  },
  methods: {
    ...mapActions('planning', ['getMachineSchedule']),
    async fetchPlans() {
      this.loading = true;
      this.plans = {
        now: [],
        today: [],
        thisweek: [],
        nextweek: [],
        later: [],
      };
      const result = await this.getMachineSchedule();
      if (result) {
        const plans = Object
          .keys(result)
          .map((planId) => {
            const items = result[planId];
            let { partname } = items[0];
            if (items.length > 1) {
              partname = items
                .map((item) => item.partname)
                .join(', ');
            }
            return {
              ...items[0],
              partname,
            };
          });
        this.categorizePlans(plans);
      }
      this.loading = false;
    },
    categorizePlans(plans) {
      const start = dayStart(now());
      const end = dayEnd(now());
      const weekStart = new Date(start.getTime() + 1 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(end.getTime() + 8 * 24 * 60 * 60 * 1000);
      const nextWeekStart = new Date(start.getTime() + 8 * 24 * 60 * 60 * 1000);
      const nextWeekEnd = new Date(end.getTime() + 15 * 24 * 60 * 60 * 1000);
      const today = { start, end };
      const thisweek = {
        start: weekStart,
        end: weekEnd,
      };
      const nextweek = {
        start: nextWeekStart,
        end: nextWeekEnd,
      };
      const later = {
        start: nextWeekEnd,
      };
      const interval = {
        today,
        thisweek,
        nextweek,
        later,
      };
      this.plans.now = plans.filter((plan) => {
        const runningPlan = plan.status === 'inProgress' || plan.status === 'paused';
        const overduePlan = plan.status === 'notStarted' && plan.scheduledstart < start.getTime();
        return runningPlan || overduePlan;
      });
      Object.keys(interval).forEach((key) => {
        if (key !== 'later') {
          this.plans[key] = plans.filter((plan) => isWithinRange(
            new Date(plan.scheduledstart),
            interval[key],
          ));
        } else {
          this.plans[key] = plans.filter((plan) => (
            plan.scheduledstart > interval[key].start.getTime()
          ));
        }
      });
    },
  },
};
</script>
