<template>
  <div>
    <v-text-field
      dense
      rounded
      outlined
      single-line
      hide-details
      v-model="search"
      prepend-inner-icon="$search"
      label="Filter services"
    ></v-text-field>
    <v-data-table
      dense
      item-key="_id"
      class="transparent mt-2"
      :search="search"
      :items="services"
      :headers="headers"
      disable-pagination
      hide-default-footer
      :loading="loading"
    >
      <template #loading>
        Fetching services...
      </template>
      <template #no-data>
        No service available
      </template>
      <template #no-results>
        No matching service found for '{{ search }}'
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';

export default {
  name: 'Services',
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        {
          text: 'Service name',
          value: 'name',
        },
        {
          text: 'Service IP',
          value: 'ipaddr',
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
    ...mapState('customerDeployment', ['deploymentServices']),
    services() {
      return sortArray(this.deploymentServices, 'name');
    },
  },
  async created() {
    this.loading = true;
    await this.fetchDeploymentServices();
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('customerDeployment', ['fetchDeploymentServices']),
    async updateAssetConfig({ id, payload }) {
      const updated = await this.updateMachine({ id, payload });
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'ASSET_UPDATE',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ASSET_UPDATE',
        });
      }
    },
  },
};
</script>
