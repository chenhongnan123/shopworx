<template>
  <v-card>
    <v-form ref="form" v-model="isValid">
      <v-card-title class="pb-0">
        Device details
        <v-btn
          text
          small
          v-if="!edit"
          color="primary"
          @click="edit = true"
          class="text-none ml-2 mb-1"
        >
          <v-icon left small>mdi-pencil-outline</v-icon>
          Edit
        </v-btn>
        <template v-if="edit">
          <v-btn
            text
            small
            color="primary"
            :disabled="saving"
            @click="cancel"
            class="text-none ml-2 mb-1"
          >
            Cancel
          </v-btn>
          <v-btn
            small
            type="submit"
            color="primary"
            :disabled="!isValid"
            :loading="saving"
            @click="update"
            class="text-none ml-2 mb-1"
          >
            Update
          </v-btn>
        </template>
      </v-card-title>
      <v-divider></v-divider>
      <perfect-scrollbar>
        <v-card-text class="pb-0" style="height:408px">
          <v-row>
            <v-col cols="4" class="py-0">
              <div>
                ID
              </div>
              <div class="title">
                {{ selectedDevice.id }}
              </div>
            </v-col>
            <v-col cols="8" class="py-0">
              <div>
                Name
              </div>
              <div class="title" v-if="!edit">
                {{ selectedDevice.name }}
              </div>
              <v-text-field
                dense
                v-else
                outlined
                v-model="device.name"
                :disabled="saving"
                :rules="deviceRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <div :class="!edit ? 'mt-2' : ''">
            Description
          </div>
          <div class="title" v-if="!edit">
            {{ selectedDevice.description || '-' }}
          </div>
          <v-textarea
            dense
            outlined
            v-else
            v-model="device.description"
            rows="3"
            auto-grow
            :disabled="saving"
          ></v-textarea>
          <div :class="!edit ? 'mt-2' : ''">
            Hostname
          </div>
          <div class="title" v-if="!edit">
            {{ selectedDevice.hostname }}
          </div>
          <v-text-field
            dense
            v-else
            outlined
            v-model="device.hostname"
            :disabled="saving"
            :rules="hostRules"
          ></v-text-field>
          <div :class="!edit ? 'mt-2' : ''">
            IP address
            <v-tooltip bottom v-if="rootDevice">
              <template #activator="{ on, attrs }">
                <v-icon
                  small
                  v-on="on"
                  v-bind="attrs"
                  v-text="'$info'"
                ></v-icon>
              </template>
              <span>
                Deployment service is deployed on this device.
              </span>
            </v-tooltip>
          </div>
          <div class="title" v-if="!edit">
            <span :class="rootDevice ? 'error--text' : ''">
              {{ selectedDevice.ipaddr }}
            </span>
          </div>
          <v-text-field
            dense
            v-else
            outlined
            v-model="device.ipaddr"
            :disabled="saving"
            :rules="ipRules"
          ></v-text-field>
        </v-card-text>
      </perfect-scrollbar>
    </v-form>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'DeviceDetails',
  data() {
    return {
      edit: false,
      device: {},
      isValid: false,
      saving: false,
      deviceRules: [
        (v) => !!v || 'Device name is required',
        (v) => !this.deviceNames.includes(v) || 'Device name is not available',
      ],
      hostRules: [
        (v) => !!v || 'Hostname is required',
        (v) => !this.hostNames.includes(v) || 'Hostname is not available',
      ],
      ipRules: [
        (v) => !!v || 'IP address is required',
        (v) => !this.deviceIps.includes(v) || 'IP address is not available',
        (v) => /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/.test(v)
          || 'Input valid IP address',
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', [
      'selectedDevice',
      'selectedService',
      'devices',
      'mappedDevices',
      'deploymentServices',
    ]),
    rootDevice() {
      return this.selectedDevice.ipaddr === this.selectedService.ipaddr;
    },
    deviceNames() {
      return this.devices
        .map((d) => d.name)
        .filter((n) => n !== this.selectedDevice.name);
    },
    hostNames() {
      return this.devices
        .map((d) => d.hostname)
        .filter((n) => n !== this.selectedDevice.hostname);
    },
    deviceIps() {
      return this.devices
        .map((d) => d.ipaddr)
        .filter((n) => n !== this.selectedDevice.ipaddr);
    },
  },
  methods: {
    ...mapActions('customerDeployment', [
      'fetchDevices',
      'updateDevice',
      'updateService',
    ]),
    ...mapMutations('customerDeployment', [
      'setReactiveService',
      'setReactiveMappedDevice',
    ]),
    async update() {
      this.saving = true;
      let result = false;
      if (this.rootDevice) {
        result = await Promise.all([
          this.onDeviceUpdate(),
          this.onServiceUpdate(),
        ]);
      } else {
        result = await this.onDeviceUpdate();
      }
      if (result) {
        this.cancel();
        this.$emit('on-create');
        // TODO: success msg
      } else {
        // TODO: error of device msg
      }
      this.saving = false;
    },
    async onDeviceUpdate() {
      const device = await this.updateDevice({
        // eslint-disable-next-line
        id: this.selectedDevice._id,
        payload: this.device,
      });
      if (device) {
        for (let i = 0; i < this.mappedDevices.length; i += 1) {
          if (this.selectedDevice.id === this.mappedDevices[i].id) {
            this.setReactiveMappedDevice({
              index: i,
              payload: {
                ...this.selectedDevice,
                ...this.device,
              },
            });
          }
        }
      }
      return !!device;
    },
    async onServiceUpdate() {
      const service = await this.updateService({
        // eslint-disable-next-line
        id: this.selectedService._id,
        payload: {
          ipaddr: this.device.ipaddr,
          assetid: 0,
        },
      });
      if (service) {
        for (let i = 0; i < this.deploymentServices.length; i += 1) {
          if (this.selectedService.id === this.deploymentServices[i].id) {
            this.setReactiveService({
              index: i,
              payload: {
                ...this.selectedService,
                ipaddr: this.device.ipaddr,
                assetid: 0,
              },
            });
          }
        }
      }
      return !!service;
    },
    cancel() {
      const {
        name,
        description,
        hostname,
        ipaddr,
      } = this.selectedDevice;
      this.edit = false;
      this.device.name = name;
      this.device.description = description;
      this.device.hostname = hostname;
      this.device.ipaddr = ipaddr;
      this.device.assetid = 0;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
  },
  watch: {
    selectedDevice: {
      immediate: true,
      async handler() {
        await this.fetchDevices();
        this.cancel();
      },
    },
  },
};
</script>
