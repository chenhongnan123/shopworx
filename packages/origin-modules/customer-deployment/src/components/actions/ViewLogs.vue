<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="700px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        small
        v-on="on"
        v-bind="attrs"
        color="primary"
        text
        class="text-none"
      >
        View logs
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        Deployment order logs
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6" class="py-0">
            <div>
              Order ID
            </div>
            <div class="font-weight-medium">
              {{ deploymentOrder._id }}
            </div>
          </v-col>
          <v-col cols="6" class="py-0">
            <div>
              Operation
            </div>
            <div class="font-weight-medium">
              {{ deploymentOrder.operationname }}
            </div>
          </v-col>
        </v-row>
        <v-data-table
          dense
          item-key="_id"
          class="transparent mt-2"
          :items="logs"
          :headers="headers"
          disable-pagination
          hide-default-footer
          :loading="loading"
        >
          <template #loading>
            Fetching logs...
          </template>
          <template #no-data>
            No log available
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ViewLogs',
  props: {
    deploymentOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      headers: [
        {
          text: 'Status',
          value: 'status',
          sortable: false,
        },
        {
          text: 'Modified at',
          value: 'modifiedtimestamp',
          sortable: false,
        },
        {
          text: 'Log',
          value: 'logs',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', ['logs']),
  },
  methods: {
    ...mapActions('customerDeployment', ['fetchLogs']),
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.loading = true;
        // eslint-disable-next-line
        await this.fetchLogs(this.deploymentOrder._id);
        this.loading = false;
      }
    },
  },
};
</script>
