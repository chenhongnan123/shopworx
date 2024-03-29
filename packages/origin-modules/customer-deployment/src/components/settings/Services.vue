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
      label="Filter managers"
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
        Fetching managers...
      </template>
      <template #no-data>
        No manager available
      </template>
      <template #no-results>
        No matching manager found for '{{ search }}'
      </template>
    <!-- eslint-disable-next-line -->
      <template #item.mmonitlink="{ item }">
        <a
          :href="item.mmonitlink && item.mmonitlink.includes('http')
            ? item.mmonitlink
            : `http://${item.mmonitlink}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ item.mmonitlink }}
        </a>
      </template>
    <!-- eslint-disable-next-line -->
      <template #item.isactive="{ item }">
        <v-checkbox
          :input-value="item.isactive"
          hide-details
          class="ma-0 pa-0"
          @change="updateServiceConfig({
            id: item._id,
            payload: { isactive: !item.isactive }
          })"
        ></v-checkbox>
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
          text: 'Manager ID',
          value: 'id',
        },
        {
          text: 'Manager name',
          value: 'name',
        },
        {
          text: 'Manager IP',
          value: 'ipaddr',
          sortable: false,
        },
        {
          text: 'M/Monit URL',
          value: 'mmonitlink',
          sortable: false,
        },
        {
          text: 'Is active',
          value: 'isactive',
          sortable: false,
        },
        /* {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        }, */
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
    this.setDeploymentServices([]);
    await this.fetchDeploymentServices(true);
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('customerDeployment', ['setDeploymentServices']),
    ...mapActions('customerDeployment', ['fetchDeploymentServices', 'updateService']),
    async updateServiceConfig({ id, payload }) {
      const updated = await this.updateService({ id, payload });
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'UPDATE',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'UPDATE',
        });
      }
    },
  },
};
</script>
