<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on }">
      <v-btn
        small
        v-on="on"
        color="primary"
        class="text-none ml-2"
      >
        Save as...
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        <span>
          Save as new report
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          single-line
          v-model="title"
          label="Enter a title for your report"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          :loading="saving"
          :disabled="!title"
          @click="saveReport"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SaveReportAs',
  data() {
    return {
      title: '',
      saving: false,
      dialog: false,
    };
  },
  methods: {
    ...mapActions('reports', ['saveAsNewReport']),
    async saveReport() {
      this.saving = true;
      await this.saveAsNewReport(this.title);
      this.saving = false;
      this.dialog = false;
    },
  },
};
</script>
