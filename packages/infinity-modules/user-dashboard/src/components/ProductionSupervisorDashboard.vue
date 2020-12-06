<template>
  <div style="height:100%">
    <portal to="app-header">
      Shift summary
      <v-btn small outlined color="primary" class="text-none ml-4">
        Shift 3, 5th Dec
        <v-icon right small>mdi-menu-down</v-icon>
      </v-btn>
    </portal>
    <v-row>
      <v-col cols="12" lg="6" xl="4">
        <oee-summary />
      </v-col>
      <v-col cols="12" lg="6" xl="8">
        <v-row>
          <v-col cols="12">
            Production
          </v-col>
          <v-col cols="12">
            Machines with no operator
          </v-col>
          <v-col cols="12">
            Downtimes with no reason
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import OeeSummary from '@shopworx/ui-components/widgets/OeeSummary.vue';

export default {
  name: 'ProductionSupervisorDashboard',
  components: {
    OeeSummary,
  },
};
</script>
