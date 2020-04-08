<template>
  <v-container
    fluid
    style="height:100%"
  >
    <portal to="app-header">
      <span>Planning</span>
      <v-icon
        class="ml-4 mb-1"
        v-text="'$info'"
      ></v-icon>
      <v-icon
        v-if="onboarded"
        class="ml-2 mb-1"
        v-text="'$settings'"
      ></v-icon>
    </portal>
    <portal to="app-tabs" v-if="onboarded">
      <v-tabs
        center-active
        v-model="planView"
      >
        <v-tab class="text-none">
          Schedule
        </v-tab>
        <v-tab class="text-none">
          List
        </v-tab>
        <v-tab class="text-none">
          Board
        </v-tab>
        <v-tab class="text-none">
          Calendar
        </v-tab>
      </v-tabs>
    </portal>
    <v-row style="height:100%">
      <v-col>
      <template v-if="loading">
      </template>
      <template v-else>
        <plan-setup v-if="!onboarded" />
        <v-fade-transition mode="out-in" v-else>
          <plan-schedule-view v-if="planView === 0" />
          <plan-list-view v-if="planView === 1" />
          <plan-board-view v-else-if="planView === 2" />
          <plan-calendar-view v-else-if="planView === 3" />
        </v-fade-transition>
      </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import PlanScheduleView from './PlanScheduleView.vue';
import PlanListView from './PlanListView.vue';
import PlanBoardView from './PlanBoardView.vue';
import PlanCalendarView from './PlanCalendarView.vue';
import PlanSetup from './PlanSetup.vue';

export default {
  name: 'Planning',
  components: {
    PlanScheduleView,
    PlanListView,
    PlanBoardView,
    PlanCalendarView,
    PlanSetup,
  },
  data() {
    return {
      planView: 0,
      loading: false,
      onboarded: false,
    };
  },
  async created() {
    this.loading = true;
    const view = localStorage.getItem('planView');
    this.planView = view ? JSON.parse(view) : 0;
    await this.getAppSchema();
    const element = await this.getElement('planning');
    if (element) {
      this.onboarded = true;
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
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('element', ['getElement']),
    ...mapActions('webApp', ['getAppSchema']),
  },
};
</script>
