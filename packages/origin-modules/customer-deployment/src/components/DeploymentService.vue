<template>
  <div style="height:100%">
    <template v-if="deploymentServices.length">
      <portal to="app-extension">
        <v-toolbar
          flat
          dense
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
          <v-responsive :max-width="300">
            <v-autocomplete
              filled
              dense
              label="Selected service"
              :loading="loading"
              v-model="service"
              item-text="name"
              return-object
              hide-details
              :items="deploymentServices"
            >
              <template #item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.ipaddr"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-responsive>
          <v-divider vertical class="ml-8"></v-divider>
          <add-service
            @on-create="getServices"
            #default="{ on, attrs }"
          >
            <v-btn
              color="primary"
              class="text-none ml-4"
              v-on="on"
              small
              v-bind="attrs"
            >
              <v-icon left>mdi-plus</v-icon>
              Add new service
            </v-btn>
          </add-service>
          <v-btn
            outlined
            small
            color="primary"
            class="text-none ml-2"
          >
            Register device
          </v-btn>
          <v-spacer></v-spacer>
          <v-responsive :max-width="300">
            <v-text-field
              dense
              outlined
              single-line
              hide-details
              v-model="search"
              autocomplete="off"
              label="Filter devices"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-responsive>
        </v-toolbar>
      </portal>
      <v-data-table
        :items="mappedDevices"
        :search="search"
        :headers="headers"
        class="mt-4 mx-4"
        :loading="fetchingDevices"
        disable-pagination
        hide-default-footer
      >
        <template #loading> Fetching devices... </template>
        <template #no-data> No device available </template>
        <template #no-results>
          No matching device found for '{{ search }}'
        </template>
      </v-data-table>
    </template>
    <v-container fluid fill-height v-else>
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col cols="5" align="center">
          <v-img
            :src="
              require(`@shopworx/assets/illustrations/${notFoundIllustration}.svg`)
            "
            contain
          />
        </v-col>
        <v-col cols="12" align="center">
          <span class="headline">
            No deployment service found.
          </span>
        </v-col>
        <v-col cols="12" align="center">
          <add-service
            @on-create="getServices"
            #default="{ on, attrs }"
          >
            <v-btn
              color="primary"
              class="text-none"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon left>mdi-plus</v-icon>
              Add new service
            </v-btn>
          </add-service>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import AddService from './actions/AddService.vue';

export default {
  name: 'DeploymentService',
  components: {
    AddService,
  },
  data() {
    return {
      search: '',
      loading: false,
      fetchingDevices: false,
      headers: [
        { text: 'Details', value: 'name' },
        { text: 'Last modified', value: 'lastModified' },
        {
          text: 'Last update status',
          value: 'status',
          sortable: false,
        },
        {
          text: 'Logs',
          value: 'logs',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Configuration',
          value: 'config',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          filterable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', [
      'deploymentServices',
      'selectedService',
      'mappedDevices',
    ]),
    notFoundIllustration() {
      return this.$vuetify.theme.dark
        ? 'not-found-dark'
        : 'not-found-light';
    },
    service: {
      get() {
        return this.selectedService;
      },
      set(val) {
        this.setSelectedService(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('customerDeployment', [
      'fetchDeploymentServices',
      'fetchDevices',
    ]),
    ...mapMutations('customerDeployment', [
      'setSelectedService',
    ]),
    async getServices() {
      this.setExtendedHeader(true);
      this.loading = true;
      this.fetchingDevices = true;
      await this.fetchDeploymentServices();
      this.loading = false;
      await this.fetchDevices(this.selectedService.id);
      this.fetchingDevices = false;
    },
  },
  watch: {
    selectedService: {
      immediate: true,
      async handler(val) {
        if (val) {
          this.fetchingDevices = true;
          await this.fetchDevices(val.id);
          this.fetchingDevices = false;
        }
      },
    },
  },
};
</script>
