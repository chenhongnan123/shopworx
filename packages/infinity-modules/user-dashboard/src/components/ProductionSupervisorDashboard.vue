<template>
  <div style="height:100%">
    <portal to="app-header">
      Shift summary
      <shift-selector v-if="currentDate" />
      <v-tooltip bottom v-if="!isMobile">
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            small
            v-on="on"
            v-bind="attrs"
            class="ml-2"
            :disabled="loading"
            @click="getDashboardData"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        Last refreshed at: <strong>{{ lastRefreshedAt }}</strong>
      </v-tooltip>
    </portal>
    <v-row v-if="currentDate">
      <v-col cols="12" lg="6" xl="5">
        <oee-summary />
      </v-col>
      <v-col cols="12" lg="6" xl="7" v-if="!isMobile">
        <v-row>
          <v-col cols="12" class="pt-0">
            <shift-production />
          </v-col>
          <v-col cols="12">
            <shift-downtime />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ShiftSelector from './ShiftSelector.vue';
import OeeSummary from './widgets/OeeSummary.vue';
import ShiftProduction from './widgets/ShiftProduction.vue';
import ShiftDowntime from './widgets/ShiftDowntime.vue';

export default {
  name: 'ProductionSupervisorDashboard',
  components: {
    ShiftSelector,
    OeeSummary,
    ShiftProduction,
    ShiftDowntime,
  },
  data() {
    return {
      fetching: false,
    };
  },
  async created() {
    this.fetching = true;
    await Promise.all([
      this.getShifts(),
      this.getMachines(),
      this.getOperators(),
      this.getRejectionReasons(),
      this.getDowntimeReasons(),
    ]);
    await this.getBusinessTime();
    this.fetching = false;
  },
  computed: {
    ...mapState('userDashboard', [
      'currentDate',
      'lastRefreshedAt',
      'loading',
    ]),
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    ...mapActions('userDashboard', [
      'getShifts',
      'getMachines',
      'getOperators',
      'getRejectionReasons',
      'getDowntimeReasons',
      'getBusinessTime',
      'getDashboardData',
    ]),
  },
};
</script>
