<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" md="12" xl="12">
        <production-details />
      </v-col>
      <!-- <v-col style="display:hidden">
        <upcoming-production />
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
import ProductionDetails from './production/ProductionDetails.vue';
// import UpcomingProduction from './production/UpcomingProduction.vue';

export default {
  name: 'ProductionLogProductionView',
  components: {
    ProductionDetails,
    // UpcomingProduction,
  },
};
</script>
