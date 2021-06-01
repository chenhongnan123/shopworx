<template>
  <v-dialog
    v-model="dialog"
    scrollable
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }" v-if="!isDashboardView">
      <v-icon small color="primary">mdi-console</v-icon>
      <a
        v-on="on"
        v-bind="attrs"
        color="primary"
      >
        View logs
      </a>
    </template>
    <template #activator="{ on, attrs }" v-else>
      <v-btn
        class="text-none"
        color="white"
        small
        outlined
        v-on="on"
        v-bind="attrs"
      >
        <v-icon left small color="white">mdi-console</v-icon>
        View logs
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        Deployment Logs for {{ model.name }}
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="py-0" v-if="loading">
        <v-row
          no-gutters
          align="center"
          justify="center"
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
              Fetching model logs...
            </span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-expansion-panels v-else-if="deployedModels.length > 0" accordion>
      <v-expansion-panel v-for="(detail) in deployedModels" :key="detail._id">
        <v-expansion-panel-header>
          <span>
            Order ID: {{ detail._id }}
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :items="detail.logs"
            :headers="headers"
            hide-default-footer
            class="mb-2"
          >
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
      </v-expansion-panels>
      <v-card-text class="py-0" v-else>
        No logs available
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'DeploymentLogsDialog',
  props: {
    model: {
      type: Object,
      required: true,
    },
    isDashboardView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      headers: [
        { text: 'Date', value: 'modifiedtimestamp' },
        { text: 'Station', value: 'stationid' },
        { text: 'Sub-Station', value: 'substationid' },
        { text: 'Sub-Process', value: 'subprocessid' },
        { text: 'Operation name', value: 'operationname' },
        {
          text: 'Status',
          value: 'status',
        },
        // { text: 'Logs', value: 'logs' },
      ],
    };
  },
  computed: {
    ...mapState('modelManagement', [
      'deployedModels',
    ]),
  },
  methods: {
    ...mapMutations('modelManagement', ['setDeployedModels']),
    ...mapActions('modelManagement', ['fetchDeployedModels']),
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.loading = true;
        this.setDeployedModels([]);
        await this.fetchDeployedModels(this.model.modelid);
        this.loading = false;
      }
    },
  },
};
</script>
