<template>
  <v-container fluid class="py-0">
    <v-row justify="left">
      <v-col cols="12" md="3" xl="2">
        <in-progress-stats />
      </v-col>
      <v-col cols="12" md="3" xl="2">
        <released-stats />
      </v-col>
      <v-col cols="12" md="3" xl="2">
        <interrupted-stats />
      </v-col>
      <v-col cols="12" md="3" xl="2">
        <not-started-stats />
      </v-col>
      <v-col cols="12" md="3" xl="2">
        <completed-stats />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="6" xl="5">
        <running-orders />
      </v-col>
      <v-col cols="12" md="6" xl="5">
        <running-late-order />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="6" xl="5">
        <released-orders />
      </v-col>
      <v-col cols="12" md="6" xl="5">
        <overdue-plans />
      </v-col>
    </v-row>
    <v-row justify="left">
      <v-col cols="12" md="6" xl="5">
        <not-started-plans />
      </v-col>
      <v-col cols="12" md="6" xl="5">
        <completed-orders />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ReleasedOrders from '../components/dashboard/list/ReleasedOrders.vue';
import RunningOrders from '../components/dashboard/list/RunningOrders.vue';
import OverduePlans from '../components/dashboard/list/OverduePlans.vue';
import NotStartedPlans from '../components/dashboard/list/NotStartedPlans.vue';
import CompletedOrders from '../components/dashboard/list/CompletedOrders.vue';
import RunningLateOrder from '../components/dashboard/list/RunningLateOrder.vue';
import InProgressStats from '../components/dashboard/stats/InProgressStats.vue';
import NotStartedStats from '../components/dashboard/stats/NotStartedStats.vue';
import InterruptedStats from '../components/dashboard/stats/InterruptedStats.vue';
import CompletedStats from '../components/dashboard/stats/CompletedStats.vue';
import ReleasedStats from '../components/dashboard/stats/ReleasedStats.vue';

export default {
  name: 'OrderScheduleView',
  components: {
    ReleasedOrders,
    RunningOrders,
    OverduePlans,
    CompletedOrders,
    RunningLateOrder,
    NotStartedPlans,
    InProgressStats,
    NotStartedStats,
    ReleasedStats,
    InterruptedStats,
    CompletedStats,
  },
};
</script>
