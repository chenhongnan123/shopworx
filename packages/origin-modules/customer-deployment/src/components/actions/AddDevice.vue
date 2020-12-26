<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs"></slot>
    </template>
    <v-form ref="form" v-model="isValid">
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          Register device
        </v-card-title>
        <v-card-text>
          <template v-if="emptyDevices.length">
            <v-autocomplete
              filled
              dense
              label="Map existing device"
              :loading="loading"
              v-model="unmappedDevice"
              item-text="name"
              return-object
              hide-details
              clearable
              :items="emptyDevices"
            >
              <template #item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.ipaddr"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-row align="center" class="my-4">
              <v-divider class="mx-4"></v-divider>
              <span class="title">or register new</span>
              <v-divider class="mx-4"></v-divider>
            </v-row>
          </template>
          <v-text-field
            dense
            outlined
            class="mt-1"
            v-model="name"
            prepend-icon="mdi-devices"
            label="Name"
            :disabled="saving || !!unmappedDevice"
            :loading="loading"
            :rules="!!unmappedDevice ? [] : deviceRules"
          ></v-text-field>
          <v-textarea
            dense
            outlined
            v-model="description"
            class="ml-8"
            rows="3"
            auto-grow
            label="Description"
            placeholder="Optional"
            :disabled="saving || loading || !!unmappedDevice"
          ></v-textarea>
          <v-text-field
            dense
            outlined
            v-model="hostname"
            prepend-icon="mdi-dns-outline"
            label="Hostname"
            :disabled="saving || loading || !!unmappedDevice"
            :rules="!!unmappedDevice ? [] : hostRules"
          ></v-text-field>
          <v-text-field
            dense
            outlined
            v-model="ipaddr"
            prepend-icon="mdi-web"
            label="IP address"
            :disabled="saving || loading || !!unmappedDevice"
            :rules="!!unmappedDevice ? [] : ipRules"
            hideDetails="auto"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text :disabled="saving" class="text-none" @click="cancel">
            Exit
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="primary"
            class="text-none"
            :loading="saving"
            :disabled="!isValid"
            @click="addNewDevice"
          >
            Register
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AddDevice',
  data() {
    return {
      unmappedDevice: null,
      name: '',
      description: '',
      hostname: '',
      ipaddr: '',
      isValid: false,
      saving: false,
      dialog: false,
      loading: false,
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
      'selectedService',
      'devices',
    ]),
    emptyDevices() {
      return this.devices.filter((d) => (
        (d.deploymentserviceid === undefined
        || d.deploymentserviceid === 0)
        && d.ispasswordless
      ));
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
      'fetchDeploymentServices',
      'fetchDevices',
      'createService',
      'createDevice',
      'updateDevice',
    ]),
    clear() {
      this.name = '';
      this.description = '';
      this.hostname = '';
      this.ipaddr = '';
      this.unmappedDevice = null;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    cancel() {
      this.clear();
      this.dialog = false;
    },
    async addNewDevice() {
      if (this.isValid) {
        this.saving = true;
        let device = null;
        if (!this.unmappedDevice) {
          const payload = {
            deploymentserviceid: this.selectedService.id,
            name: this.name,
            description: this.description,
            hostname: this.hostname,
            ipaddr: this.ipaddr,
            ispasswordless: true,
            assetid: 0,
          };
          device = await this.createDevice(payload);
        } else {
          device = await this.updateDevice({
            // eslint-disable-next-line
            id: this.unmappedDevice._id,
            payload: {
              deploymentserviceid: this.selectedService.id,
              assetid: 0,
            },
          });
        }
        if (device) {
          this.cancel();
          this.$emit('on-create');
          // TODO: success msg
        } else {
          // TODO: error of device msg
        }
        this.saving = false;
      }
    },
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.loading = true;
        await this.fetchDevices();
        this.loading = false;
      }
    },
  },
};
</script>
