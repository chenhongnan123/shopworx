<template>
  <v-card height="450">
    <v-card-title>
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
          @click="edit = false"
          class="text-none ml-2 mb-1"
        >
          Cancel
        </v-btn>
        <v-btn
          small
          color="primary"
          :loading="saving"
          @click="updateDevice"
          class="text-none ml-2 mb-1"
        >
          Update
        </v-btn>
      </template>
    </v-card-title>
    <perfect-scrollbar style="height: 390px">
      <v-card-text class="py-0">
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
              Updating the device IP will also update the service IP.
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
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'DeviceDetails',
  data() {
    return {
      edit: false,
      device: {},
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
    ]),
    rootDevice() {
      console.log(this.selectedDevice.ipaddr === this.selectedService.ipaddr);
      return this.selectedDevice.ipaddr === this.selectedService.ipaddr;
    },
    deviceNames() {
      return this.devices.map((d) => d.name);
    },
    hostNames() {
      return this.devices.map((d) => d.hostname);
    },
    deviceIps() {
      return this.devices.map((d) => d.ipaddr);
    },
  },
  methods: {
    ...mapActions('customerDeployment', [
      'fetchDevices',
      'updateDevice',
    ]),
    updateDevice() {
      this.saving = true;
      console.log(this.selectedDevice);
      this.saving = false;
    },
  },
  watch: {
    selectedDevice: {
      immediate: true,
      async handler({
        id,
        name,
        description,
        hostname,
        ipaddr,
      }) {
        this.edit = false;
        await this.fetchDevices();
        this.device.id = id;
        this.device.name = name;
        this.device.description = description;
        this.device.hostname = hostname;
        this.device.ipaddr = ipaddr;
      },
    },
  },
};
</script>
