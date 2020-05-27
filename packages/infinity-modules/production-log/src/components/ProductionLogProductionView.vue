<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" md="6" xl="5">
        <production-on-date />
      </v-col>
      <v-col cols="12" md="6" xl="5">
        <upcoming-production />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProductionOnDate from './production/ProductionOnDate.vue';
import UpcomingProduction from './production/UpcomingProduction.vue';

export default {
  name: 'ProductionLogProductionView',
  components: {
    ProductionOnDate,
    UpcomingProduction,
  },
};
</script>
