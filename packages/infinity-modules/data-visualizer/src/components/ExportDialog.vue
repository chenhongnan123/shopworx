<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <v-form ref="form" v-model="isValid" @submit.prevent="createExportRequest">
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          Export data
        </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            class="mt-1"
            v-model="emailIds"
            single-line
            label="Input email IDs (comma seperated)"
            prepend-icon="mdi-rocket-outline"
            :disabled="saving"
            :rules="[(v) => !!v || 'Required']"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            text
            :disabled="saving"
            class="text-none"
            @click="cancel"
          >
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
            Create export request
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'ExportDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    exportPayload: {
      type: Object,
    },
  },
  data() {
    return {
      isValid: false,
      saving: false,
      emailIds: '',
    };
  },
  computed: {
    ...mapState('user', ['me']),
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dataVisualizer', ['createDownloadRequest']),
    cancel() {
      this.dialog = false;
      this.emailIds = '';
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    async createExportRequest() {
      this.saving = true;
      const payload = {
        ...this.exportPayload,
        emailIds: this.emailIds,
      };
      const success = await this.createDownloadRequest(payload);
      if (success) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'EXPORT_REQUEST',
        });
        this.cancel();
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'EXPORT_REQUEST',
        });
      }
      this.saving = false;
    },
  },
  watch: {
    dialog(val) {
      if (val) {
        this.emailIds = this.me?.user?.emailId || '';
      }
    },
  },
};
</script>
