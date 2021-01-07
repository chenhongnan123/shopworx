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
              label="Selected manager"
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
              Create
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
        class="transparent mx-4"
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
        <template #item.ispasswordless="{ item }">
          <v-checkbox
            disabled
            :input-value="item.ispasswordless"
            hide-details
            class="ma-0 pa-0"
          ></v-checkbox>
        </template>
        <!-- eslint-disable-next-line -->
        <template #item.instances="{ item }">
          <div v-if="item.instances.length">
            <div
              v-for="instance in item.instances"
              :key="instance.id"
            >
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
          <add-instance
            @on-create="getDeviceInstances(item.id)"
            :deviceId="item.id"
            v-else
            #default="{ on, attrs }"
          >
            <v-btn
              v-on="on"
              icon
              v-bind="attrs"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </add-instance>
        </template>
      </v-data-table>
      <v-tabs
        v-model="tab"
        class="mx-4"
        background-color="transparent"
      >
        <v-tab class="text-none">
          Instances
        </v-tab>
        <v-tab class="text-none">
          Logs
        </v-tab>
        <v-tab class="text-none">
          Device details
        </v-tab>
      </v-tabs>
      <v-tabs-items
        class="mx-4"
        v-model="tab"
      >
        <v-tab-item>
          <monitored-instances />
        </v-tab-item>
        <v-tab-item>
          <deployment-logs />
        </v-tab-item>
        <v-tab-item>
          <device-details />
        </v-tab-item>
      </v-tabs-items>
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
import AddInstance from './actions/AddInstance.vue';
import DeviceDetails from './DeviceDetails.vue';
import MonitoredInstances from './MonitoredInstances.vue';
import DeploymentLogs from './DeploymentLogs.vue';

export default {
  name: 'DeploymentService',
  components: {
    AddService,
    AddDevice,
    AddInstance,
    DeviceDetails,
    MonitoredInstances,
    DeploymentLogs,
  },
  data() {
    return {
      search: '',
      tab: 0,
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
          text: 'Is passwordless',
          value: 'ispasswordless',
          sortable: false,
        },
        {
          text: 'Instances',
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
      'fetchInstances',
    ]),
    ...mapMutations('customerDeployment', [
      'setSelectedService',
      'setSelectedDevice',
      'setReactiveMappedDevice',
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
    async getDeviceInstances(deviceId) {
      const instances = await this.fetchInstances(deviceId);
      if (this.selectedDevice.id === deviceId) {
        this.setSelectedDevice({
          ...this.selectedDevice,
          instances,
        });
      }
      for (let i = 0; i < this.mappedDevices.length; i += 1) {
        if (this.mappedDevices[i].id === deviceId) {
          this.setReactiveMappedDevice({
            index: i,
            payload: {
              ...this.mappedDevices[i],
              instances,
            },
          });
        }
      }
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
