<template>
  <v-card flat>
    <v-card-title primary-title class="px-2">
      Selected Subprocess: {{ selectedProcessName }}
      <v-spacer></v-spacer>
      <create-model-dialog />
      <v-btn
        small
        outlined
        color="primary"
        @click="getModels"
        class="text-none ml-5"
        :disabled="fetchingMaster || fetchingModels"
      >
        <v-icon left small>mdi-refresh</v-icon>
        Refresh
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters align="center" justify="center" v-if="fetchingMaster">
        <v-col cols="12" align="center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="36"
          ></v-progress-circular>
        </v-col>
        <v-col cols="12" align="center">
          <span> Fetching parameters and transformations... </span>
        </v-col>
      </v-row>
      <template v-else>
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
        <v-data-table
          :items="models"
          :search="search"
          :headers="headers"
          :loading="fetchingModels"
          :custom-filter="filterModels"
          :options.sync="options"
          :items-per-page="5"
        >
          <template #loading> Fetching models... </template>
          <template #no-data> No model available </template>
          <template #no-results>
            No matching model found for '{{ search }}'
          </template>
          <template #item="{ item }">
            <tr>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on" v-bind="attrs" class="font-weight-medium">
                      {{ item.name }}
                    </div>
                  </template>
                  <span>{{ item.description || "N.A" }}</span>
                </v-tooltip>
              </td>
              <td>
                {{ new Date(item.lastModified).toLocaleString() }}
              </td>
              <td>
                <model-status :model="item" />
              </td>
              <td>
                <deployment-logs-dialog :model="item" />
              </td>
              <td>
                <model-details-dialog :model="item" />
              </td>
              <td>
                <deploy-model :model="item" />
                <delete-model :model="item" />
              </td>
            </tr>
          </template>
        </v-data-table>
      </template>
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
      options: {
        descending: true,
        page: 1,
        rowsPerPage: 5,
      },
      headers: [
        { text: 'Details', value: 'name' },
        { text: 'Last modified', value: 'lastModified' },
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
          text: 'Configuration',
          value: 'config',
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
  watch: {
    models: {
      handler() {
        this.search = '';
      },
    },
  },
  computed: {
    ...mapState('modelManagement', [
      'selectedProcessName',
      'fetchingModels',
      'fetchingMaster',
      'models',
    ]),
    pages() {
      if (this.options.rowsPerPage == null
         || this.options.totalItems == null
      ) return 0;
      return Math.ceil(this.options.totalItems / this.options.rowsPerPage);
    },
  },
  methods: {
    ...mapActions('modelManagement', [
      'getModels',
      'getInputParameters',
      'getOutputTransformations',
    ]),
    ...mapMutations('modelManagement', ['setFetchingMaster']),
    filterModels(value, search, item) {
      if (item.description) {
        return (
          item.name.toLowerCase().indexOf(search.toLowerCase()) > -1
           || item.description.toLowerCase().indexOf(search.toLowerCase()) > -1
        );
      }
      return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
    },
  },
};
</script>
