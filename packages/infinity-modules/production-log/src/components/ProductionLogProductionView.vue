<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" md="12" xl="12">
        <production-on-date />
      </v-col>
      <v-col style="display:hidden">
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
