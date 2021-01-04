<template>
  <div>
    <portal to="settings-header">
      <add-nodebot
        @on-create="getNodebots"
        #default="{ on, attrs }"
      >
        <v-btn
          small
          v-on="on"
          v-bind="attrs"
          color="primary"
          class="text-none"
        >
          <v-icon left>mdi-plus</v-icon>
          Add nodebot
        </v-btn>
      </add-nodebot>
    </portal>
    <v-text-field
      dense
      rounded
      outlined
      single-line
      hide-details
      v-model="search"
      prepend-inner-icon="$search"
      label="Filter nodebots"
    ></v-text-field>
    <v-data-table
      dense
      item-key="_id"
      class="transparent mt-2"
      :search="search"
      :items="sortedNodebots"
      :headers="headers"
      disable-pagination
      hide-default-footer
      :loading="loading"
    >
      <template #loading>
        Fetching nodebots...
      </template>
      <template #no-data>
        No nodebot available
      </template>
      <template #no-results>
        No matching nodebot found for '{{ search }}'
      </template>
    <!-- eslint-disable-next-line -->
      <template #item.releaseversion="{ item }">
        v{{ item.releaseversion }}
      </template>
    <!-- eslint-disable-next-line -->
      <template #item.instances="{ item }">
        <div v-if="item.instances && item.instances.length">
          <div v-for="instance in item.instances" :key="instance.id">
            {{ instance.name }}
          </div>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';
import AddNodebot from '../actions/AddNodebot.vue';

export default {
  name: 'Nodebots',
  components: {
    AddNodebot,
  },
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Description',
          value: 'description',
        },
        {
          text: 'Version',
          value: 'releaseversion',
          sortable: false,
        },
        {
          text: 'Instances',
          value: 'instances',
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
    ...mapState('customerDeployment', ['nodebots']),
    sortedNodebots() {
      return sortArray(this.nodebots, 'name');
    },
  },
  created() {
    this.setNodebots([]);
    this.getNodebots();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('customerDeployment', ['setNodebots']),
    ...mapActions('customerDeployment', ['fetchNodebots', 'updateNodebot']),
    async getNodebots() {
      this.loading = true;
      await this.fetchNodebots();
      this.loading = false;
    },
    async updateNodebotConfig({ id, payload }) {
      const updated = await this.updateNodebot({ id, payload });
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'NODEBOT_UPDATE',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'NODEBOT_UPDATE',
        });
      }
    },
  },
};
</script>
