<template>
  <v-card flat>
    <v-card-title primary-title class="px-2">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Selected Subprocess: {{ selectedProcessName }} |
      Selected Model: {{ selectedModelObject.name }}
      <v-spacer></v-spacer>
      <create-train-dialog />
      <v-btn
        small
        outlined
        color="primary"
        @click="getTrainingData"
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
        <v-data-table
          :items="traningData"
          :headers="headers"
          :loading="fetchingModels"
          :options.sync="options"
          :items-per-page="5"
        >
          <template #loading> Fetching Training data... </template>
          <template #no-data> No training data available </template>
          <template #item.modelstatus>
            <span v-if="selectedModelObject.modelUpdateStatus === true">
              Active
            </span>
            <span v-else>
              Inactive
            </span>
          </template>
          <template #item.logs="{ item }">
            <v-btn
              class="text-none"
              color="success"
              small
              outlined
              @click="fnViewLogs(item)"
            >
              View logs
            </v-btn>
          </template>
          <template #item.actions="{ item }">
            <div class="d-inline ma-0 pa-0">
                <v-btn
                    @click="onClickDisabledModel(selectedModelObject)"
                    icon
                  >
                  <deploy-training
                  :model="selectedModelObject"
                  :training="item"/>
                    </v-btn>
                </div>
                <div class="d-inline ma-0 pa-0">
                <v-btn
                @click="downloadConfigFile(item)"
                  icon
                >
                 <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-on="on"
                      v-bind="attrs"
                      color="success"
                    >
                      <v-icon v-text="'$download'"></v-icon>
                    </v-btn>
                  </template>
                  <span>Download config</span>
                </v-tooltip>
                </v-btn>
                </div>
          </template>
        </v-data-table>
      </template>
    </v-card-text>
    <v-dialog
    v-model="dialogLogs"
    scrollable
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        Logs
        <v-btn icon small @click="dialogLogs = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
       <v-data-table
            :items="trainingLogs"
            :headers="headersLogs"
            class="mb-2"
          >
          </v-data-table>
    </v-card>
  </v-dialog>
  </v-card>
</template>

<script>
import
{
  mapState,
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';
import CreateTrainDialog from './CreateTrainDialog.vue';
import DeployTraining from './DeployTraining.vue';

export default {
  name: 'ProcessModelTable',
  components: {
    CreateTrainDialog,
    DeployTraining,
  },
  data() {
    return {
      search: '',
      allowedCheckBox: false,
      testMainId: '',
      dialogLogs: false,
      interval: null,
      options: {
        descending: true,
        page: 1,
        rowsPerPage: 5,
        stop: false,
      },
      headersLogs: [
        { text: 'ID', value: 'id' },
        { text: 'TimeStamp', value: 'timestamp' },
        { text: 'Text', value: 'text' },
      ],
      headers: [
        { text: 'Job ID', value: 'jobid' },
        { text: 'Train Data element', value: 'realelement' },
        { text: 'Training Start time', value: 'createdTimestamp' },
        {
          text: 'New End time',
          value: 'newendtime',
        },
        {
          text: 'Model status',
          value: 'modelstatus',
        },
        {
          text: 'Training status',
          value: 'status',
        },
        {
          text: 'Training Mode',
          value: 'trainingmode',
        },
        {
          text: 'Logs',
          value: 'logs',
          sortable: false,
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
  created() {
    this.interval = setInterval(() => {
      this.fetchTrainingData(this.selectedModelObject.modelid);
    }, 10000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  watch: {
    models: {
      handler() {
      },
    },
  },
  computed: {
    ...mapState('user', ['roles', 'me']),
    ...mapGetters('user', ['isAdmin']),
    ...mapState('modelManagement', [
      'selectedProcessName',
      'fetchingModels',
      'fetchingMaster',
      'subLineInfo',
      'selectedModelObject',
      'models',
      'traningData',
      'trainingLogs',
    ]),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('user', ['getUserRoles', 'getMe']),
    ...mapActions('modelManagement', [
      'getModels',
      'getInputParameters',
      'getOutputTransformations',
      'updateStatusOfModel',
      'getSubLineInfo',
      'sendTestModel',
      'fetchTrainingData',
      'getTrainingLogs',
    ]),
    ...mapMutations('modelManagement', ['setFetchingMaster', 'setShowModelUI', 'setTrainingLogs']),
    async fnViewLogs(item) {
      this.setTrainingLogs([]);
      this.dialogLogs = true;
      if (item.jobid) {
        await this.getTrainingLogs(item.jobid);
      }
    },
    downloadConfigFile(item) {
      const csvData = new Blob([item.configjson], { type: 'text/json;charset=utf-8;' });
      const csvURL = window.URL.createObjectURL(csvData);
      const testLink = document.createElement('a');
      testLink.href = csvURL;
      testLink.setAttribute('download', 'config.json');
      testLink.click();
    },
    goBack() {
      this.setShowModelUI(true);
    },
    async getTrainingData() {
      await this.fetchTrainingData(this.selectedModelObject.modelid);
    },
    onClickCheckBox() {
      if (!this.isAdmin) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ONLY_ADMIN_OPERATION',
        });
      }
    },
    onClickDisabledModel(item) {
      if (!item.modelUpdateStatus) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MODEL_NOT_ACTIVE',
        });
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
