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
          Create new manager
        </v-card-title>
        <v-card-text>
          <v-text-field
            dense
            outlined
            class="mt-1"
            v-model="name"
            label="Manager name"
            counter="20"
            prepend-icon="mdi-rocket-outline"
            :disabled="saving"
            :loading="loading"
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            dense
            outlined
            v-model="mmonitlink"
            label="M/Monit URL"
            counter="30"
            prepend-icon="mdi-link"
            :disabled="saving || loading"
            :rules="urlRules"
          ></v-text-field>
          <template v-if="loading">
            Fetching devices...
          </template>
          <template v-else>
            <div class="mb-2 font-weight-medium">Register device</div>
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
              v-model="devicename"
              prepend-icon="mdi-devices"
              label="Device name"
              counter="20"
              :disabled="saving || !!unmappedDevice"
              :rules="!!unmappedDevice ? [] : deviceRules"
            ></v-text-field>
            <v-text-field
              dense
              outlined
              v-model="hostname"
              prepend-icon="mdi-dns-outline"
              label="Hostname"
              counter="20"
              :disabled="saving || !!unmappedDevice"
              :rules="!!unmappedDevice ? [] : hostRules"
            ></v-text-field>
            <v-text-field
              dense
              outlined
              v-model="ipaddr"
              prepend-icon="mdi-web"
              label="IP address*"
              :disabled="saving || !!unmappedDevice"
              :rules="!!unmappedDevice ? [] : ipRules"
              hideDetails="auto"
            ></v-text-field>
            <div class="caption">*This is the IP of the device where the manager is deployed</div>
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
            @click="addNewService"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'AddService',
  data() {
    return {
      unmappedDevice: null,
      name: '',
      mmonitlink: '',
      ipaddr: '',
      devicename: '',
      hostname: '',
      ispasswordless: true,
      isValid: false,
      saving: false,
      dialog: false,
      loading: false,
      nameRules: [
        (v) => !!v || 'Manager name is required',
        (v) => (v && v.length <= 20) || 'Max length 20 characters.',
        (v) => /^[A-Za-z0-9-_]+$/.test(v)
          || 'Manager name should not contain empty space or special characters',
        (v) => !this.serviceNames.includes(v) || 'Manager name is not available',
      ],
      urlRules: [
        (v) => !!v || 'URL is required',
        (v) => (v && v.length <= 30) || 'Max length 30 characters.',
        (v) => /^[A-Za-z0-9-_:./]+$/.test(v)
          || 'URL should not contain empty space or special characters',
      ],
      deviceRules: [
        (v) => !!v || 'Device name is required',
        (v) => (v && v.length <= 20) || 'Max length 20 characters.',
        (v) => /^[A-Za-z0-9-_]+$/.test(v)
          || 'Device name should not contain empty space or special characters',
        (v) => !this.deviceNames.includes(v) || 'Device name is not available',
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
      'deploymentServices',
      'devices',
    ]),
    emptyDevices() {
      return this.devices.filter((d) => (
        (d.deploymentserviceid === undefined
        || d.deploymentserviceid === 0)
        && d.ispasswordless
      ));
    },
    serviceNames() {
      return this.deploymentServices.map((s) => s.name);
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
      this.mmonitlink = '';
      this.ipaddr = '';
      this.devicename = '';
      this.hostname = '';
      this.ispasswordless = true;
      this.unmappedDevice = null;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    cancel() {
      this.clear();
      this.dialog = false;
    },
    async enablePasswordless(service, device) {
      const orderPayload = {
        deploymentserviceid: service.id,
        deploymentservicename: service.name,
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
    async addNewService() {
      if (this.isValid) {
        this.saving = true;
        let service = null;
        let device = null;
        if (!this.unmappedDevice) {
          const servicePayload = {
            name: this.name,
            mmonitlink: this.mmonitlink,
            ipaddr: this.ipaddr,
            isactive: true,
            assetid: 0,
          };
          service = await this.createService(servicePayload);
          if (service) {
            const devicePayload = {
              deploymentserviceid: service.id,
              name: this.devicename,
              description: '',
              hostname: this.hostname,
              ipaddr: this.ipaddr,
              ispasswordless: false,
              assetid: 0,
            };
            device = await this.createDevice(devicePayload);
            if (this.ispasswordless) {
              this.enablePasswordless(service, device);
            }
          }
        } else {
          const servicePayload = {
            name: this.name,
            mmonitlink: this.mmonitlink,
            ipaddr: this.unmappedDevice.ipaddr,
            isactive: true,
            assetid: 0,
          };
          service = await this.createService(servicePayload);
          if (service) {
            device = await this.updateDevice({
              // eslint-disable-next-line
              id: this.unmappedDevice._id,
              payload: {
                deploymentserviceid: service.id,
                assetid: 0,
              },
            });
          }
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
        await Promise.all([
          this.fetchDeploymentServices(),
          this.fetchDevices(),
        ]);
        this.loading = false;
      }
    },
  },
};
</script>
