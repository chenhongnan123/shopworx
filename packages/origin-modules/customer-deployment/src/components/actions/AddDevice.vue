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
            <!-- TODO: list -->
            <!-- TODO: or text -->
          </template>
          <v-text-field
            dense
            outlined
            class="mt-1"
            v-model="name"
            prepend-icon="mdi-devices"
            label="Name"
            :disabled="saving"
            :loading="loading"
            :rules="deviceRules"
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
            :disabled="saving || loading"
          ></v-textarea>
          <v-text-field
            dense
            outlined
            v-model="hostname"
            prepend-icon="mdi-dns-outline"
            label="Hostname"
            :disabled="saving || loading"
            :rules="hostRules"
          ></v-text-field>
          <v-text-field
            dense
            outlined
            v-model="ipaddr"
            prepend-icon="mdi-web"
            label="IP address"
            :disabled="saving || loading"
            :rules="ipRules"
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
        d.deploymentserviceid !== undefined && d.ispasswordless
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
    ]),
    clear() {
      this.name = '';
      this.description = '';
      this.hostname = '';
      this.ipaddr = '';
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
        const payload = {
          deploymentserviceid: this.selectedService.id,
          name: this.name,
          description: this.description,
          hostname: this.hostname,
          ipaddr: this.ipaddr,
          ispasswordless: true,
        };
        const device = await this.createDevice(payload);
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
