<template>
  <v-card>
    <v-card-title class="pb-0">
      Logs
    </v-card-title>
    <v-divider></v-divider>
    <perfect-scrollbar>
      <v-card-text class="pb-0" style="height:408px">
        <v-container fill-height v-if="!selectedDevice">
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
        <v-data-table
          dense
          v-else
          :loading="loading"
          :options.sync="options"
          :itemsPerPage="5"
          :footer-props="{
            disableItemsPerPage: true,
          }"
          :server-items-length="total"
          item-key="_id"
          class="transparent"
          :items="mappedOrders"
          :headers="headers"
        >
          <template #no-data>
            <v-container fill-height>
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
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.actions="{ item }">
            <view-logs :deploymentOrder="item" />
          </template>
        </v-data-table>
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
      total: 0,
      options: {},
      headers: [
        {
          text: 'Instance ID',
          value: 'instanceid',
          sortable: false,
        },
        {
          text: 'Operation',
          value: 'operationname',
          sortable: false,
        },
        {
          text: 'Started at',
          value: 'createdTimestamp',
          sortable: false,
        },
        {
          text: 'Last status update',
          value: 'status',
          sortable: false,
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
    async getData() {
      const { page, itemsPerPage } = this.options;
      this.loading = true;
      const records = await this.fetchDeploymentOrders({
        pagesize: itemsPerPage,
        pagenumber: page,
        deviceId: this.selectedDevice.id,
      });
      if (records && records.totalCount) {
        this.total = records.totalCount;
      }
      this.loading = false;
    },
  },
  watch: {
    selectedDevice: {
      immediate: true,
      handler() {
        this.getData();
      },
    },
    options: {
      deep: true,
      handler() {
        this.getData();
      },
    },
  },
};
</script>
