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
            v-on="{ ...tooltip, ...dialog }"
            v-bind="attrs"
          >
            <v-icon>mdi-cog-refresh-outline</v-icon>
          </v-btn>
        </template>
        <span>Re-configure instance</span>
      </v-tooltip>
    </template>
    <v-form ref="form" v-model="isValid">
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
            :disabled="!isValid || isConfigUnchanged"
          >
            Re-configure
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

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
    isConfigUnchanged() {
      return JSON.stringify(this.configuration) === JSON.stringify(this.instance.configuration);
    },
  },
  methods: {
    ...mapActions('customerDeployment', ['fetchLogs']),
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
