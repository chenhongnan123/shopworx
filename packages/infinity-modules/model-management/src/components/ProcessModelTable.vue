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
      <v-data-table
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
        <template #item.status>
          <span class="success--text font-weight-medium">
            SUCCESS
          </span>
        </template>
        <template #item.logs>
          <deployment-logs-dialog />
        </template>
        <template #item.details>
          <model-details-dialog />
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
import { mapState, mapActions } from 'vuex';
import CreateModelDialog from './CreateModelDialog.vue';
import DeploymentLogsDialog from './DeploymentLogsDialog.vue';
import ModelDetailsDialog from './ModelDetailsDialog.vue';
import DeployModel from './DeployModel.vue';
import DeleteModel from './DeleteModel.vue';

export default {
  name: 'ProcessModelTable',
  components: {
    CreateModelDialog,
    DeploymentLogsDialog,
    ModelDetailsDialog,
    DeployModel,
    DeleteModel,
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
  computed: {
    ...mapState('modelManagement', [
      'selectedProcessName',
      'fetchingModels',
      'models',
    ]),
  },
  methods: {
    ...mapActions('modelManagement', ['getModels']),
  },
};
</script>
