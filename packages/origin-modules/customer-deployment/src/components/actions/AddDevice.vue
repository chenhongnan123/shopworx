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
    <v-form ref="form" v-model="isValid" @submit.prevent="addNewDevice">
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          {{ addDevice ? 'Add' : 'Register' }} device
        </v-card-title>
        <v-card-text>
          <template v-if="emptyDevices.length && !addDevice">
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
            counter="20"
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
            counter="200"
            auto-grow
            label="Description"
            :rules="descRules"
            placeholder="Optional"
            :disabled="saving || loading || !!unmappedDevice"
          ></v-textarea>
          <v-text-field
            dense
            outlined
            v-model="hostname"
            prepend-icon="mdi-dns-outline"
            label="Hostname"
            counter="20"
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
          ></v-text-field>
          <template v-if="addDevice">
            <v-autocomplete
              filled
              dense
              clearable
              label="Map to deployment manager (optional)"
              :loading="loading"
              v-model="service"
              item-text="name"
              return-object
              class="ml-8"
              :items="deploymentServices"
            >
              <template #item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.ipaddr"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-checkbox
              v-if="service"
              label="Enable passwordless"
              v-model="ispasswordless"
              hide-details="auto"
            ></v-checkbox>
          </template>
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
          >
            {{ addDevice ? 'Add' : 'Register' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'AddDevice',
  props: {
    addDevice: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      unmappedDevice: null,
      name: '',
      description: '',
      hostname: '',
      ipaddr: '',
      ispasswordless: false,
      isValid: false,
      saving: false,
      dialog: false,
      loading: false,
      service: null,
      deviceRules: [
        (v) => !!v || 'Device name is required',
        (v) => (v && v.length <= 20) || 'Max length 20 characters.',
        (v) => /^[A-Za-z0-9-_]+$/.test(v)
          || 'Device name should not contain empty space or special characters',
        (v) => !this.deviceNames.includes(v) || 'Device name is not available',
      ],
      descRules: [
        (v) => !v || (v && v.length <= 200) || 'Max length 200 characters.',
      ],
      hostRules: [
        (v) => !!v || 'Hostname is required',
        (v) => (v && v.length <= 20) || 'Max length 20 characters.',
        (v) => /^[A-Za-z0-9-_]+$/.test(v)
          || 'Host name should not contain empty space or special characters',
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
      'deploymentServices',
      'devices',
    ]),
    emptyDevices() {
      return this.devices.filter((d) => {
        const hasServiceKey = Object.prototype.hasOwnProperty.call(d, 'deploymentserviceid');
        return (!hasServiceKey
          || d.deploymentserviceid === undefined
          || d.deploymentserviceid === 0);
      });
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
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('customerDeployment', [
      'fetchDeploymentServices',
      'fetchDevices',
      'createService',
      'createDevice',
      'updateDevice',
      'createDeploymentOrder',
    ]),
    clear() {
      this.name = '';
      this.description = '';
      this.hostname = '';
      this.ipaddr = '';
      this.ispasswordless = false;
      this.unmappedDevice = null;
      this.service = null;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    cancel() {
      this.clear();
      this.dialog = false;
    },
    async enablePasswordless(device) {
      const orderPayload = {
        deploymentserviceid: this.addDevice
          ? this.service.id
          : this.selectedService.id,
        deploymentservicename: this.addDevice
          ? this.service.name
          : this.selectedService.name,
        lineid: device.id,
        linename: device.name,
        operationname: 'enable-passwordless',
        status: 'Pending',
        assetid: 0,
      };
      const order = await this.createDeploymentOrder(orderPayload);
      if (order) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PASSWORDLESS',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PASSWORDLESS',
        });
      }
    },
    async addNewDevice() {
      if (this.isValid) {
        this.saving = true;
        let device = null;
        if (!this.unmappedDevice) {
          let payload = {
            deploymentserviceid: this.service ? this.service.id : 0,
            name: this.name,
            description: this.description,
            hostname: this.hostname,
            ipaddr: this.ipaddr,
            ispasswordless: false,
            assetid: 0,
          };
          if (!this.addDevice) {
            this.ispasswordless = true;
            payload = {
              deploymentserviceid: this.selectedService.id,
              name: this.name,
              description: this.description,
              hostname: this.hostname,
              ipaddr: this.ipaddr,
              ispasswordless: false,
              assetid: 0,
            };
          }
          device = await this.createDevice(payload);
          if (this.ispasswordless) {
            this.enablePasswordless(device);
          }
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
        await this.fetchDeploymentServices();
        this.loading = false;
      }
    },
  },
};
</script>
