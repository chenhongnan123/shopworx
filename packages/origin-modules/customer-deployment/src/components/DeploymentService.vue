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
              class="mb-2"
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
          <add-service
            @on-create="getServices"
            #default="{ on, attrs }"
          >
            <v-btn
              color="primary"
              class="text-none ml-4"
              small
              v-on="on"
              v-bind="attrs"
            >
              <v-icon left>mdi-plus</v-icon>
              Create service
            </v-btn>
          </add-service>
          <v-divider vertical class="mx-4"></v-divider>
          <add-device
            @on-create="getDevices"
            #default="{ on, attrs }"
          >
            <v-btn
              text
              small
              v-on="on"
              v-bind="attrs"
              color="primary"
              class="text-none px-0"
            >
              Register device
            </v-btn>
          </add-device>
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
        class="mt-2 mx-4"
        :loading="fetchingDevices"
        disable-pagination
        hide-default-footer
      >
        <template #loading> Fetching devices... </template>
        <template #no-data> No device available </template>
        <template #no-results>
          No matching device found for '{{ search }}'
        </template>
        <!-- eslint-disable-next-line -->
        <template #item.name="{ item }">
          <v-btn
            small
            :outlined="isDeviceSelected(item.id)"
            :text="!isDeviceSelected(item.id)"
            color="primary"
            @click="setSelectedDevice(item)"
            class="text-none"
          >
            {{ item.name }}
          </v-btn>
        </template>
        <!-- eslint-disable-next-line -->
        <template #item.ipaddr="{ item }">
          <span
            :class="isRootDevice(item.ipaddr)
              ? 'error--text'
              : ''"
            v-text="item.ipaddr"
          ></span>
          <v-tooltip bottom v-if="isRootDevice(item.ipaddr)">
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
              Deployment service is deployed on this device.
            </span>
          </v-tooltip>
        </template>
        <!-- eslint-disable-next-line -->
        <template #item.status>
          N/A
        </template>
        <!-- eslint-disable-next-line -->
        <template #item.instances>
          <v-icon>mdi-plus</v-icon>
        </template>
      </v-data-table>
      <v-row class="mx-4 mt-4" v-if="selectedDevice">
        <v-col cols="12" md="6" xl="4">
          <device-details />
        </v-col>
        <v-col cols="12" md="6" xl="4">
          <monitored-instances />
        </v-col>
        <v-col cols="12" xl="4">
          <deployment-logs />
        </v-col>
      </v-row>
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
import AddDevice from './actions/AddDevice.vue';
import DeviceDetails from './DeviceDetails.vue';
import MonitoredInstances from './MonitoredInstances.vue';
import DeploymentLogs from './DeploymentLogs.vue';

export default {
  name: 'DeploymentService',
  components: {
    AddService,
    AddDevice,
    DeviceDetails,
    MonitoredInstances,
    DeploymentLogs,
  },
  data() {
    return {
      search: '',
      loading: false,
      fetchingDevices: false,
      headers: [
        { text: 'Device name', value: 'name' },
        {
          text: 'Hostname',
          value: 'hostname',
          sortable: false,
        },
        {
          text: 'IP address',
          value: 'ipaddr',
          sortable: false,
        },
        {
          text: 'Last update status',
          value: 'status',
          sortable: false,
        },
        {
          text: 'Monitored instances',
          value: 'instances',
          sortable: false,
          filterable: false,
          align: 'center',
        },
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', [
      'deploymentServices',
      'selectedService',
      'selectedDevice',
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
      'setSelectedDevice',
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
    async getDevices() {
      this.fetchingDevices = true;
      await this.fetchDevices(this.selectedService.id);
      this.fetchingDevices = false;
    },
    isDeviceSelected(id) {
      if (this.selectedDevice) {
        return this.selectedDevice.id === id;
      }
      return false;
    },
    isRootDevice(ip) {
      return ip === this.selectedService.ipaddr;
    },
  },
  watch: {
    selectedService: {
      immediate: true,
      async handler(val) {
        if (val) {
          this.fetchingDevices = true;
          await this.fetchDevices(val.id);
          if (this.mappedDevices.length) {
            const device = this.selectedDevice
              ? this.mappedDevices
                .find((d) => d.id === this.selectedDevice.id)
              : null;
            if (!device) {
              this.setSelectedDevice(this.mappedDevices[0]);
            }
          } else {
            this.setSelectedDevice(null);
          }
          this.fetchingDevices = false;
        }
      },
    },
  },
};
</script>
