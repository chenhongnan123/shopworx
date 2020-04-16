<template>
  <v-container
    fluid
    class="py-0"
    style="height:100%"
  >
    <portal to="app-header">
      <span>Planning</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-if="onboarded"
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
    </portal>
    <portal to="app-extension" v-if="onboarded">
      <v-tabs
        center-active
        v-model="planView"
      >
        <v-tab class="text-none">
          Dashboard
        </v-tab>
        <v-tab class="text-none">
          Calendar
        </v-tab>
        <v-tab class="text-none">
          Schedule
        </v-tab>
      </v-tabs>
    </portal>
    <add-plan />
    <v-row style="height:100%">
      <v-col class="pa-0">
      <template v-if="loading">
      </template>
      <template v-else>
        <plan-setup v-if="!onboarded" />
        <v-fade-transition mode="out-in" v-else>
          <plan-dashboard v-if="planView === 0" />
          <plan-calendar-view v-else-if="planView === 1" />
          <plan-schedule-view v-else-if="planView === 2" />
        </v-fade-transition>
      </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PlanDashboard from './PlanDashboard.vue';
import PlanScheduleView from './PlanScheduleView.vue';
import PlanCalendarView from './PlanCalendarView.vue';
import PlanSetup from './PlanSetup.vue';
import AddPlan from '../components/AddPlan.vue';

export default {
  name: 'Planning',
  components: {
    PlanDashboard,
    PlanScheduleView,
    PlanCalendarView,
    PlanSetup,
    AddPlan,
  },
  data() {
    return {
      planView: 0,
      loading: false,
    };
  },
  computed: {
    ...mapState('planning', ['onboarded']),
  },
  async created() {
    this.loading = true;
    const view = localStorage.getItem('planView');
    this.planView = view ? JSON.parse(view) : 0;
    await this.getAppSchema();
    const element = await this.getPlanningElement();
    if (element) {
      this.setOnboarded(true);
      this.setExtendedHeader(true);
    }
    this.loading = false;
  },
  watch: {
    onboarded(val) {
      if (val) {
        this.setExtendedHeader(true);
      }
    },
    planView(val) {
      localStorage.setItem('planView', val);
    },
  },
  methods: {
    ...mapMutations('planning', ['setOnboarded']),
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('planning', ['getPlanningElement']),
  },
};
</script>
