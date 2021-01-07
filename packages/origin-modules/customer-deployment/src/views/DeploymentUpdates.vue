<template>
  <div style="height:100%">
    <portal to="app-header">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>Deployment updates</span>
    </portal>
    <v-container fluid v-if="loading">
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
    <v-container fluid v-else-if="!loading && !deploymentOrders.length">
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
      <v-text-field
        dense
        outlined
        single-line
        hide-details
        class="mx-4 mb-2"
        v-model="search"
        autocomplete="off"
        label="Filter deployment orders"
        append-icon="mdi-magnify"
      ></v-text-field>
      <v-data-table
        dense
        :search="search"
        item-key="_id"
        class="transparent mx-4"
        :items="deploymentOrders"
        :headers="headers"
        :itemsPerPage="10"
        :footer-props="{
          disableItemsPerPage: true,
        }"
      >
      <!-- eslint-disable-next-line -->
      <template #item.actions="{ item }">
        <view-logs :deploymentOrder="item" />
      </template>
      </v-data-table>
    </template>
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
      search: '',
      headers: [
        {
          text: 'Deployment service ID',
          value: 'deploymentserviceid',
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
  async created() {
    this.setExtendedHeader(false);
    this.loading = true;
    await this.fetchDeploymentOrders();
    this.loading = false;
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
  },
};
</script>
