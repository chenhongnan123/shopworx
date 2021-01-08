<template>
  <v-card>
    <v-card-title class="pb-0">
      Instances
      <refresh-instances @on-refresh="getDeviceInstances" />
      <add-instance
        @on-create="getDeviceInstances"
        #default="{ on, attrs }"
      >
        <v-btn
          v-on="on"
          v-bind="attrs"
          outlined
          small
          color="primary"
          class="text-none ml-2 mb-1"
        >
          <v-icon left>mdi-plus</v-icon>
          New instance
        </v-btn>
      </add-instance>
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
              <v-progress-circular
                indeterminate
                color="primary"
                size="72"
              ></v-progress-circular>
            </v-col>
            <v-col cols="12" align="center">
              <div class="title">
                Fetching instances...
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-container
          fill-height
          v-else-if="selectedDevice
            && (!selectedDevice.instances
            || !selectedDevice.instances.length)"
        >
          <v-row
            align="center"
            justify="center"
            :no-gutters="$vuetify.breakpoint.smAndDown"
          >
            <template v-if="loading">
              <v-col cols="12" align="center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="72"
                ></v-progress-circular>
              </v-col>
              <v-col cols="12" align="center">
                <div class="title">
                  Fetching instances...
                </div>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12" align="center">
                <v-img
                  :src="require(`@shopworx/assets/illustrations/${illustration}.svg`)"
                  id="server_illustration"
                  height="260"
                  contain
                />
              </v-col>
              <v-col cols="12" align="center" class="pt-0">
                <div class="title">
                  Your monitored instances appear here
                </div>
                <div>
                  <add-instance
                    @on-create="getDeviceInstances"
                    #default="{ on, attrs }"
                  >
                    <v-btn
                      v-on="on"
                      v-bind="attrs"
                      color="primary"
                      class="text-none mt-1"
                    >
                      <v-icon left>mdi-plus</v-icon>
                      Create instance
                    </v-btn>
                  </add-instance>
                </div>
              </v-col>
            </template>
          </v-row>
        </v-container>
        <template v-else>
          <v-data-table
            dense
            :loading="loading"
            item-key="_id"
            class="transparent"
            :items="selectedDevice.instances"
            :headers="headers"
            disable-pagination
            hide-default-footer
          >
          <!-- eslint-disable-next-line -->
          <template #item.nodebot="{ item }">
            <span v-if="item.nodebot">
              {{ item.nodebot.name }} - v{{ item.nodebot.releaseversion }}
            </span>
            <span v-else>-</span>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.isdeployed="{ item }">
            <v-tooltip bottom v-if="item.isdeployed">
              <template #activator="{on, attrs}">
                <v-avatar
                  size="16"
                  v-on="on"
                  v-bind="attrs"
                  :color="item.isdeployed ? 'success' : 'error'"
                ></v-avatar>
              </template>
              <span>
                {{ item.isdeployed ? 'Yes' : 'No' }}
              </span>
            </v-tooltip>
            <v-progress-circular
              indeterminate
              size="15"
              width="2"
              color="primary"
              v-else
            ></v-progress-circular>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.isreconfigured="{ item }">
            <v-tooltip bottom v-if="item.isreconfigured">
              <template #activator="{on, attrs}">
                <v-avatar
                  size="16"
                  v-on="on"
                  v-bind="attrs"
                  :color="item.isreconfigured ? 'success' : 'error'"
                ></v-avatar>
              </template>
              <span>
                {{ item.isreconfigured ? 'Yes' : 'No' }}
              </span>
            </v-tooltip>
            <v-progress-circular
              indeterminate
              size="15"
              width="2"
              color="primary"
              v-else
            ></v-progress-circular>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.actions="{ item }">
            <deploy-instance :instance="item" />
            <instance-config :instance="item" />
            <remove-instance :instance="item" v-if="item.isdeployed" />
            <terminate-instance :instance="item" v-else />
          </template>
          </v-data-table>
        </template>
      </v-card-text>
    </perfect-scrollbar>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import RefreshInstances from './actions/RefreshInstances.vue';
import AddInstance from './actions/AddInstance.vue';
import DeployInstance from './actions/DeployInstance.vue';
import InstanceConfig from './actions/InstanceConfig.vue';
import RemoveInstance from './actions/RemoveInstance.vue';
import TerminateInstance from './actions/TerminateInstance.vue';

export default {
  name: 'MonitoredInstances',
  components: {
    RefreshInstances,
    AddInstance,
    DeployInstance,
    InstanceConfig,
    RemoveInstance,
    TerminateInstance,
  },
  data() {
    return {
      loading: false,
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Is deployed?',
          value: 'isdeployed',
          align: 'center',
        },
        {
          text: 'Is configured?',
          value: 'isreconfigured',
          align: 'center',
        },
        {
          text: 'Nodebot',
          value: 'nodebot',
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
      'mappedDevices',
    ]),
    illustration() {
      return this.$vuetify.theme.dark
        ? 'server-dark'
        : 'server-light';
    },
  },
  methods: {
    ...mapMutations('customerDeployment', [
      'setReactiveMappedDevice',
      'setSelectedDevice',
    ]),
    ...mapActions('customerDeployment', ['fetchInstances']),
    async getDeviceInstances() {
      this.loading = true;
      const instances = await this.fetchInstances(this.selectedDevice.id);
      this.setSelectedDevice({
        ...this.selectedDevice,
        instances,
      });
      for (let i = 0; i < this.mappedDevices.length; i += 1) {
        if (this.mappedDevices[i].id === this.selectedDevice.id) {
          this.setReactiveMappedDevice({
            index: i,
            payload: {
              ...this.mappedDevices[i],
              instances,
            },
          });
        }
      }
      this.loading = false;
    },
  },
};
</script>
