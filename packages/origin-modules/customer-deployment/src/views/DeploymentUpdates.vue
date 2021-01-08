<template>
  <div style="height:100%">
    <portal to="app-header">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>Deployment updates</span>
    </portal>
    <v-data-table
      dense
      :loading="loading"
      item-key="_id"
      :options.sync="options"
      class="transparent mx-4"
      :items="deploymentOrders"
      :headers="headers"
      :itemsPerPage="15"
      :footer-props="{
        disableItemsPerPage: true,
      }"
      :server-items-length="total"
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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import ViewLogs from '../components/actions/ViewLogs.vue';

export default {
  name: 'DeploymentUpdates',
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
          text: 'Deployment service ID',
          value: 'deploymentserviceid',
          sortable: false,
        },
        {
          text: 'Instance ID',
          value: 'instanceid',
          sortable: false,
        },
        {
          text: 'Device ID',
          value: 'lineid',
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
  async created() {
    this.setExtendedHeader(false);
  },
  computed: {
    ...mapState('customerDeployment', ['deploymentOrders']),
    illustration() {
      return this.$vuetify.theme.dark
        ? 'coming-soon-dark'
        : 'coming-soon-light';
    },
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('customerDeployment', ['fetchDeploymentOrders']),
    goBack() {
      this.$router.push({ name: 'customerDeployment' });
    },
    async getData() {
      const { page, itemsPerPage } = this.options;
      this.loading = true;
      const records = await this.fetchDeploymentOrders({
        pagesize: itemsPerPage,
        pagenumber: page,
      });
      if (records && records.totalCount) {
        this.total = records.totalCount;
      }
      this.loading = false;
    },
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.getData();
      },
    },
  },
};
</script>
