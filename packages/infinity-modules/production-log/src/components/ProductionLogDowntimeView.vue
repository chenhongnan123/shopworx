<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" md="6" xl="5">
        <downtime-on-date />
      </v-col>
      <v-col cols="12" md="6" xl="5">
        <downtime-with-no-reason />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DowntimeOnDate from './downtime/DowntimeOnDate.vue';
import DowntimeWithNoReason from './downtime/DowntimeWithNoReason.vue';

export default {
  name: 'ProductionLogProductionView',
  components: {
    DowntimeOnDate,
    DowntimeWithNoReason,
  },
};
</script>
