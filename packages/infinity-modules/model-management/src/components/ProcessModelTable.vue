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
                <v-tooltip
                 top
                 max-width="300"
                 >
                  <template v-slot:activator="{ on, attrs }">
                    <a
                      v-on="on"
                      v-bind="attrs"
                      class="font-weight-medium text-decoration-underline"
                      @click="$router.push({
                        name: 'modelDetails',
                        params: { id: item.name },
                      })"
                    >
                      {{ item.name }}
                    </a>
                  </template>
                  <span class="toolTipProperty">{{ item.description || "N.A" }}</span>
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
                <div class="d-inline ma-0 pa-0">
                <v-btn
                  icon
                >
                 <v-checkbox
                  color="blue"
                  hide-details
                  :value = item.modelUpdateStatus
                  v-model="item.modelUpdateStatus"
                  @change="changeModelStatus($event, item)"
                ></v-checkbox>
                </v-btn>
                <div class="d-inline ma-0 pa-0">
                  <v-btn
                  icon
                >
                <deploy-model
                :model="item" />
                  </v-btn>
                </div>
                <div class="d-inline ma-0 pa-0">
                <v-btn
                  icon
                >
                <delete-model :model="item" />
                </v-btn>
                </div>
                </div>
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
        stop: false,
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
    // this.setFetchingMaster(true);
    // await Promise.all([
    //   await this.getInputParameters(),
    //   await this.getOutputTransformations(),
    // ]);
    // this.setFetchingMaster(false);
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
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('modelManagement', [
      'getModels',
      'getInputParameters',
      'getOutputTransformations',
      'updateStatusOfModel',
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
    async changeModelStatus(event, item) {
      console.log(event);
      console.log(item);
      if (event) {
        const makeTrue = {
          id: item.id,
          modelupdatestatus: true,
        };
        const update = await this.updateStatusOfModel(makeTrue);
        if (update) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'STATUS_UPDATED_AS_ACTIVATE',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'STATUS_NOT_UPDATED',
          });
        }
      } else {
        const makeFalse = {
          id: item.id,
          modelupdatestatus: false,
        };
        const update = await this.updateStatusOfModel(makeFalse);
        if (update) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'STATUS_UPDATED_AS_NOT_ACTIVE',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'STATUS_NOT_UPDATED',
          });
        }
      }
    },
  },
};
</script>
<style scoped>
.toolTipProperty:before {
  content:"DESCRIPTION:";
  font-size: 15PX;
  display: block;
}
 .toolTipProperty {
  display: inline-block !important;
  padding: 2px;
  width: fit-content;
  height: fit-content;
}
.v-input--selection-controls{ padding-bottom: 18px; }
</style>
