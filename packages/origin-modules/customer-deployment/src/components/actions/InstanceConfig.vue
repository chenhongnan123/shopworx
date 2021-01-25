<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="800px"
    transition="dialog-transition"
  >
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip bottom>
        <template #activator="{ on: tooltip }">
          <v-btn
            icon
            :disabled="!instance.isdeployed
              || instance.isdeploying"
            v-on="{ ...tooltip, ...dialog }"
            v-bind="attrs"
          >
            <v-icon>mdi-cog-refresh-outline</v-icon>
          </v-btn>
        </template>
        <span>Re-configure instance</span>
      </v-tooltip>
    </template>
    <v-form ref="form" v-model="isValid" @submit.prevent="reconfigureInstance">
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          {{ instance.name }} configuration
        </v-card-title>
        <v-card-text>
          <v-textarea
            dense
            outlined
            class="mt-1"
            label="Configuration"
            v-model="configuration"
            prepend-icon="mdi-file-settings-outline"
            rows="15"
            :rules="configRules"
            auto-grow
            :disabled="saving"
          ></v-textarea>
        </v-card-text>
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
            Re-configure
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'InstanceConfig',
  props: {
    instance: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      configuration: '',
      isValid: false,
      dialog: false,
      saving: false,
      configRules: [
        (v) => !!v || 'Configuration is required',
        (v) => this.isValidJsonString(v) || 'Input valid JSON configuration',
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', [
      'selectedService',
      'selectedDevice',
      'mappedDevices',
    ]),
    isConfigUnchanged() {
      return JSON.stringify(this.configuration) === JSON.stringify(this.instance.configuration);
    },
  },
  methods: {
    ...mapMutations('customerDeployment', ['setReactiveMappedDevice', 'setSelectedDevice']),
    ...mapActions('customerDeployment', ['createDeploymentOrder']),
    isValidJsonString(jsonString) {
      if (!(jsonString && typeof jsonString === 'string')) {
        return false;
      }
      try {
        JSON.parse(jsonString);
        return true;
      } catch (error) {
        return false;
      }
    },
    cancel() {
      this.configuration = '';
      this.dialog = false;
    },
    mapInstances() {
      // update instance in selected device
      this.setSelectedDevice({
        ...this.selectedDevice,
        instances: this.selectedDevice.instances.map((instance) => {
          let isreconfigured = true;
          if (this.instance.id === instance.id) {
            isreconfigured = false;
          }
          return {
            ...instance,
            isreconfigured,
          };
        }),
      });
      // update instance list in mapped device
      for (let i = 0; i < this.mappedDevices.length; i += 1) {
        if (this.selectedDevice.id === this.mappedDevices[i].id) {
          this.setReactiveMappedDevice({
            index: i,
            payload: {
              ...this.mappedDevices[i],
              instances: this.mappedDevices[i].instances.map((instance) => {
                let isreconfigured = true;
                if (this.instance.id === instance.id) {
                  isreconfigured = false;
                }
                return {
                  ...instance,
                  isreconfigured,
                };
              }),
            },
          });
        }
      }
    },
    async reconfigureInstance() {
      if (await this.$root.$confirm.open(
        'Re-configure instance',
        `Please confirm the re-configuration for "${this.instance.name}".
        You cannot stop the re-configuration once it is started.`,
      )) {
        this.saving = true;
        const payload = {
          deploymentserviceid: this.selectedService.id,
          deploymentservicename: this.selectedService.name,
          lineid: this.selectedDevice.id,
          linename: this.selectedDevice.name,
          nodebotmasterid: this.instance.nodebot.id,
          nodebotmastername: this.instance.nodebot.name,
          instanceid: this.instance.id,
          instancename: this.instance.name,
          operationname: 'reconfigure-instance',
          status: 'Pending',
          assetid: 0,
        };
        await this.createDeploymentOrder(payload);
        this.mapInstances();
        this.saving = false;
        this.cancel();
      }
    },
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.configuration = this.instance.configuration;
      } else {
        this.configuration = '';
      }
    },
  },
};
</script>
