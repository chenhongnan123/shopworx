<template>
  <v-responsive :min-height="300">
    <v-card
      flat
      rounded="lg"
      outlined
      :class="$vuetify.theme.dark ? 'secondary' : 'primary'"
      dark
      style="height:100%"
    >
      <v-card-title primary-title>
        Model details
        <v-spacer></v-spacer>
        <model-details-dialog
          :model="selectedModel"
          isDashboardView
        />
        <deployment-logs-dialog
          :model="selectedModel"
          isDashboardView
        />
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <div>
              Station
            </div>
            <div class="title">
              {{ selectedStationName }}
            </div>
          </v-col>
          <v-col cols="4">
            <div>
              Substation
            </div>
            <div class="title">
              {{ selectedSubstationName }}
            </div>
          </v-col>
          <v-col cols="4">
            <div>
              Subprocess
            </div>
            <div class="title warning--text">
              {{ selectedProcessName }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <div>
              Last modified at
            </div>
            <div class="title">
              {{ lastModified }}
            </div>
          </v-col>
          <v-col cols="8">
            <div>
              Last status update
            </div>
            <div class="title">
              {{ status }}
            </div>
          </v-col>
        </v-row>
        <div class="mt-2">
          Description
        </div>
        <div class="title">
          {{ description }}
        </div>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>

<script>
import { mapState } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';
import ModelDetailsDialog from '../ModelDetailsDialog.vue';
import DeploymentLogsDialog from '../DeploymentLogsDialog.vue';

export default {
  name: 'ModelInfo',
  components: {
    ModelDetailsDialog,
    DeploymentLogsDialog,
  },
  computed: {
    ...mapState('modelManagement', [
      'selectedModel',
      'selectedStationName',
      'selectedSubstationName',
      'selectedProcessName',
    ]),
    description() {
      return this.selectedModel.description;
    },
    lastModified() {
      return formatDate(new Date(this.selectedModel.lastModified), 'MMM d, HH:mm');
    },
    status() {
      return this.selectedModel.status;
    },
  },
};
</script>
