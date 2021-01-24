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
    <v-form ref="form" v-model="isValid">
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          {{ nodebot.name }} configuration
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
            @click="updateNodebotConfig"
            :disabled="!isValid"
          >
            Update config
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

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
      saving: false,
      isValid: false,
      configuration: '',
      dialog: false,
      configRules: [
        (v) => !!v || 'Configuration is required',
        (v) => this.isValidJsonString(v) || 'Input valid JSON configuration',
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', ['nodebots']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('customerDeployment', ['setReactiveNodebot']),
    ...mapActions('customerDeployment', ['updateNodebot']),
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
    async updateNodebotConfig() {
      this.saving = true;
      const updated = await this.updateNodebot({
        // eslint-disable-next-line
        id: this.nodebot._id,
        payload: { configuration: this.configuration },
      });
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'UPDATE',
        });
        for (let i = 0; i < this.nodebots.length; i += 1) {
          if (this.nodebot.id === this.nodebots[i].id) {
            this.setReactiveNodebot({
              index: i,
              payload: {
                ...this.nodebots[i],
                configuration: this.configuration,
              },
            });
          }
        }
        this.cancel();
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'UPDATE',
        });
      }
      this.saving = false;
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
