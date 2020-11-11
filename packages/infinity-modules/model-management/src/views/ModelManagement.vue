<template>
  <v-container fluid class="py-0">
  <v-row justify="center">
    <v-col cols="12" xl="10" class="py-0">
      <model-management-header />
      <v-row>
        <v-col cols="12" md="6">
          <line-selection />
        </v-col>
      </v-row>
      <line-details />
      <v-fade-transition mode="out-in">
        <process-model-table class="mt-4" v-if="selectedProcess" />
      </v-fade-transition>
    </v-col>
  </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import ModelManagementHeader from '../components/ModelManagementHeader.vue';
import LineSelection from '../components/LineSelection.vue';
import LineDetails from '../components/LineDetails.vue';
import ProcessModelTable from '../components/ProcessModelTable.vue';

export default {
  name: 'ModelManagement',
  components: {
    ModelManagementHeader,
    LineSelection,
    LineDetails,
    ProcessModelTable,
  },
  computed: {
    ...mapState('modelManagement', ['selectedProcess']),
  },
};
</script>
