<template>
  <v-card flat>
    <v-card-title primary-title class="px-2">
      Selected Subprocess: {{ selectedProcessName }}
      <v-spacer></v-spacer>
      <v-text-field
        dense
        outlined
        single-line
        hide-details
        v-model="search"
        autocomplete="off"
        label="Filter models"
        append-icon="mdi-magnify"
      ></v-text-field>
      <create-model-dialog />
    </v-card-title>
    <v-card-text>
      <v-row
        no-gutters
        align="center"
        justify="center"
        v-if="fetchingMaster"
      >
        <v-col cols="12" align="center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="36"
          ></v-progress-circular>
        </v-col>
        <v-col cols="12" align="center">
          <span>
            Fetching parameters and transformations...
          </span>
        </v-col>
      </v-row>
      <v-data-table
        v-else
        :items="models"
        :search="search"
        :headers="headers"
        hide-default-footer
        :loading="fetchingModels"
      >
        <template #loading>
          Fetching models...
        </template>
        <template #no-data>
          No model available
        </template>
        <template #no-results>
          No matching model found for '{{ search }}'
        </template>
        <template #item.status="{ item }">
          <model-status :model="item" />
        </template>
        <template #item.logs="{ item }">
          <deployment-logs-dialog :model="item" />
        </template>
        <template #item.details="{ item }">
          <model-details-dialog :model="item" />
        </template>
        <template #item.actions="{ item }">
          <deploy-model :model="item" />
          <delete-model :model="item" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import CreateModelDialog from './CreateModelDialog.vue';
import DeploymentLogsDialog from './DeploymentLogsDialog.vue';
import ModelDetailsDialog from './ModelDetailsDialog.vue';
import DeployModel from './DeployModel.vue';
import DeleteModel from './DeleteModel.vue';
import ModelStatus from './ModelStatus.vue';

export default {
  name: 'ProcessModelTable',
  components: {
    CreateModelDialog,
    DeploymentLogsDialog,
    ModelDetailsDialog,
    DeployModel,
    DeleteModel,
    ModelStatus,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Name', value: 'modelname' },
        { text: 'Description', value: 'modeldescription' },
        {
          text: 'Last update status',
          value: 'status',
          sortable: false,
        },
        {
          text: 'Logs',
          value: 'logs',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Details',
          value: 'details',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          filterable: false,
        },
      ],
    };
  },
  async created() {
    this.setFetchingMaster(true);
    await Promise.all([
      this.getInputParameters(),
      this.getOutputTransformations(),
    ]);
    this.setFetchingMaster(false);
  },
  computed: {
    ...mapState('modelManagement', [
      'selectedProcessName',
      'fetchingModels',
      'fetchingMaster',
      'models',
    ]),
  },
  methods: {
    ...mapActions('modelManagement', [
      'getModels',
      'getInputParameters',
      'getOutputTransformations',
    ]),
    ...mapMutations('modelManagement', ['setFetchingMaster']),
  },
};
</script>
