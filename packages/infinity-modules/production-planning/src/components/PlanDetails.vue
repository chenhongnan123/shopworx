<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="5" xl="6" class="py-0">
        <plan-info />
      </v-col>
      <v-col cols="12" lg="7" xl="6" class="py-0">
        <v-row>
          <v-col cols="12" class="py-0">
            <cycletime-trend />
          </v-col>
          <v-col cols="12" class="py-0">
            <v-row>
              <v-col cols="12" lg="6" class="py-0">
                <rejection-pareto />
              </v-col>
              <v-col cols="12" lg="6" class="py-0">
                <downtime-pareto />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlanInfo from './details/PlanInfo.vue';
import CycletimeTrend from './details/CycletimeTrend.vue';
import RejectionPareto from './details/RejectionPareto.vue';
import DowntimePareto from './details/DowntimePareto.vue';

export default {
  name: 'PlanDetails',
  components: {
    PlanInfo,
    CycletimeTrend,
    RejectionPareto,
    DowntimePareto,
  },
};
</script>
