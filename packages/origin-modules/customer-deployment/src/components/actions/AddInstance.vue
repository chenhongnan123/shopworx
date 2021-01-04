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
          Create new instance
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            filled
            dense
            label="Select nodebot"
            :loading="loading"
            v-model="nodebot"
            item-text="id"
            return-object
            clearable
            prepend-icon="mdi-package-variant-closed"
            :items="nodebots"
            :rules="nodebotRules"
          >
            <template v-slot:selection="{ item }">
              {{ item.name }} - v{{ item.releaseversion }}
            </template>
            <template #item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.releaseversion"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-textarea
            dense
            outlined
            label="Configuration"
            v-model="configuration"
            prepend-icon="mdi-file-settings-outline"
            rows="7"
            :rules="configRules"
            auto-grow
            :disabled="saving || loading"
          ></v-textarea>
          <v-text-field
            dense
            outlined
            v-model="name"
            :rules="nameRules"
            label="Instance name"
            prepend-icon="mdi-rocket-outline"
            :disabled="saving || loading"
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
            @click="addNewInstance"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AddInstance',
  props: {
    deviceId: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      dialog: false,
      isValid: false,
      loading: false,
      saving: false,
      nodebot: null,
      configuration: '',
      name: '',
      nodebotRules: [
        (v) => !!v || 'Nodebot is required.',
      ],
      nameRules: [
        (v) => !!v || 'Package name is required.',
      ],
      configRules: [
        (v) => !!v || 'Configuration is required',
        (v) => this.isValidJsonString(v) || 'Input valid JSON configuration',
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', [
      'nodebots',
      'selectedService',
      'selectedDevice',
    ]),
  },
  methods: {
    ...mapActions('customerDeployment', ['fetchNodebots', 'createInstance']),
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
    clear() {
      this.name = '';
      this.configuration = '';
      this.nodebotfile = null;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    cancel() {
      this.clear();
      this.dialog = false;
    },
    async addNewInstance() {
      this.saving = true;
      const payload = {
        deploymentserviceid: this.selectedService.id,
        lineid: this.deviceId || this.selectedDevice.id,
        nodebotmasterid: this.nodebot.id,
        name: this.name,
        configuration: this.configuration,
      };
      const createdInstance = await this.createInstance(payload);
      if (createdInstance) {
        this.cancel();
        this.$emit('on-create');
      }
      this.saving = false;
    },
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.loading = true;
        await this.fetchNodebots();
        this.loading = false;
      }
    },
    nodebot(val) {
      if (val) {
        this.configuration = val.configuration;
      } else {
        this.configuration = '';
      }
    },
  },
};
</script>
