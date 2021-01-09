<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="800px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        small
        v-on="on"
        v-bind="attrs"
        color="primary"
        text
        class="text-none"
      >
        View config
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        {{ nodebot.name }} configuration
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
          readonly
          :rules="configRules"
          auto-grow
        ></v-textarea>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'NodebotConfig',
  props: {
    nodebot: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      configuration: '',
      dialog: false,
      configRules: [
        (v) => !!v || 'Configuration is required',
        (v) => this.isValidJsonString(v) || 'Input valid JSON configuration',
      ],
    };
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
        this.configuration = this.nodebot.configuration;
      } else {
        this.configuration = '';
      }
    },
  },
};
</script>
