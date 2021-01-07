<template>
  <v-card>
    <v-card-title class="pb-0">
      Logs
    </v-card-title>
    <v-divider></v-divider>
    <perfect-scrollbar>
      <v-card-text class="pb-0" style="height:408px">
        <v-container fill-height v-if="loading">
          <v-row
            align="center"
            justify="center"
            :no-gutters="$vuetify.breakpoint.smAndDown"
          >
            <v-col cols="12" align="center">
              <v-progress-circular
                indeterminate
                color="primary"
                size="72"
              ></v-progress-circular>
            </v-col>
            <v-col cols="12" align="center">
              <div class="title">
                Fetching deployment orders...
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-container fill-height v-else-if="!loading && !mappedOrders.length">
          <v-row
            align="center"
            justify="center"
            :no-gutters="$vuetify.breakpoint.smAndDown"
          >
            <v-col cols="12" align="center">
              <v-img
                :src="require(`@shopworx/assets/illustrations/${illustration}.svg`)"
                id="construction_illustration"
                height="260"
                contain
              />
            </v-col>
            <v-col cols="12" align="center">
              <div class="title">
                No deployment order!
              </div>
            </v-col>
          </v-row>
        </v-container>
        <template v-else>
          <v-data-table
            dense
            item-key="_id"
            class="transparent"
            :items="mappedOrders"
            :headers="headers"
          >
          <!-- eslint-disable-next-line -->
          <template #item.actions="{ item }">
            <view-logs :deploymentOrder="item" />
          </template>
          </v-data-table>
        </template>
      </v-card-text>
    </perfect-scrollbar>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ViewLogs from './actions/ViewLogs.vue';

export default {
  name: 'DeploymentLogs',
  components: {
    ViewLogs,
  },
  data() {
    return {
      loading: false,
      headers: [
        {
          text: 'Instance ID',
          value: 'instanceid',
        },
        {
          text: 'Operation',
          value: 'operationname',
        },
        {
          text: 'Started at',
          value: 'createdTimestamp',
        },
        {
          text: 'Last status update',
          value: 'status',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', [
      'selectedDevice',
      'mappedOrders',
    ]),
    illustration() {
      return this.$vuetify.theme.dark
        ? 'coming-soon-dark'
        : 'coming-soon-light';
    },
  },
  methods: {
    ...mapActions('customerDeployment', ['fetchDeploymentOrders']),
  },
  watch: {
    selectedDevice: {
      immediate: true,
      async handler() {
        this.loading = true;
        await this.fetchDeploymentOrders(this.selectedDevice.id);
        this.loading = false;
      },
    },
  },
};
</script>
