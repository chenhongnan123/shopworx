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
      <template #item.name="{ item }">
        {{ item.name }}
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              small
              class="ml-1 mb-1"
              v-on="on"
              v-bind="attrs"
              v-text="'$info'"
            ></v-icon>
          </template>
          <span>
            {{ item.description }}
          </span>
        </v-tooltip>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.releaseversion="{ item }">
        v{{ item.releaseversion }}
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.isinstalled="{ item }">
        <v-tooltip bottom>
          <template #activator="{on, attrs}">
            <v-avatar
              size="16"
              v-on="on"
              v-bind="attrs"
              :color="item.isinstalled ? 'success' : 'error'"
            ></v-avatar>
          </template>
          <span>
            {{ item.isinstalled ? 'Yes' : 'No' }}
          </span>
        </v-tooltip>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.instances="{ item }">
        <div v-if="item.instances && item.instances.length">
          <div v-for="instance in item.instances" :key="instance.id">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <span
                  v-on="on"
                  v-bind="attrs"
                  :class="instance.isdeployed ? 'success--text' : 'info--text'"
                >
                  {{ instance.name }}
                  <v-progress-circular
                    indeterminate
                    size="12"
                    width="2"
                    color="primary"
                    v-if="instance.isdeploying"
                  ></v-progress-circular>
                </span>
              </template>
              <span>{{ instance.isdeployed ? 'Deployed' : 'Not deployed' }}</span>
            </v-tooltip>
          </div>
        </div>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.config="{ item }">
        <nodebot-config :nodebot="item" />
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.actions="{ item }">
        <install-debian
          :nodebot="item"
          v-if="!item.isinstalled"
        />
        <update-debian
          @on-update="getNodebots"
          :nodebot="item"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';
import AddNodebot from '../actions/AddNodebot.vue';
import InstallDebian from '../actions/InstallDebian.vue';
import UpdateDebian from '../actions/UpdateDebian.vue';
import NodebotConfig from '../actions/NodebotConfig.vue';

export default {
  name: 'Nodebots',
  components: {
    AddNodebot,
    InstallDebian,
    UpdateDebian,
    NodebotConfig,
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
          text: 'Version',
          value: 'releaseversion',
          sortable: false,
        },
        {
          text: 'Configuration',
          value: 'config',
          sortable: false,
        },
        {
          text: 'Is installed?',
          value: 'isinstalled',
          sortable: false,
          align: 'center',
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
