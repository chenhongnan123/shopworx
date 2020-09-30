<template>
  <div style="height:100%">
    <plan-setup v-if="!onboarded" />
    <v-fade-transition mode="out-in" v-else>
      <plan-dashboard
        :isFullScreen="isFullScreen"
        v-if="planView === 0"
      />
      <plan-calendar-view v-else-if="planView === 1" />
      <plan-schedule-view v-else-if="planView === 2" />
    </v-fade-transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import PlanDashboard from './PlanDashboard.vue';
import PlanScheduleView from './PlanScheduleView.vue';
import PlanCalendarView from './PlanCalendarView.vue';
import PlanSetup from './PlanSetup.vue';

export default {
  name: 'Planning',
  components: {
    PlanDashboard,
    PlanScheduleView,
    PlanCalendarView,
    PlanSetup,
  },
  created() {
    if (this.onboarded) {
      this.setExtendedHeader(true);
    }
  },
  watch: {
    onboarded(val) {
      if (val) {
        this.setExtendedHeader(true);
      }
    },
  },
  computed: {
    ...mapState('planning', ['onboarded', 'isFullScreen', 'planView']),
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
