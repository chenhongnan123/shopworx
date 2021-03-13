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
        Logs {{ model }}
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
       <v-data-table
       v-if="trainingLogs.length > 0"
            :items="trainingLogs"
            :headers="headers"
            class="mb-2"
          >
          </v-data-table>
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
        { text: 'ID', value: 'id' },
        { text: 'TimeStamp', value: 'timestamp' },
        { text: 'Text', value: 'text' },
      ],
    };
  },
  computed: {
    ...mapState('modelManagement', [
      'deployedModels',
      'trainingLogs',
    ]),
  },
  methods: {
    ...mapMutations('modelManagement', ['setDeployedModels']),
    ...mapActions('modelManagement', ['getTrainingLogs']),
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.loading = true;
        // await this.getTrainingLogs();
        this.loading = false;
      }
    },
  },
};
</script>
