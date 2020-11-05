<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on }">
      <v-btn
        small
        v-on="on"
        outlined
        color="primary"
        class="text-none"
      >
        <v-icon left small v-text="'$productionLog'"></v-icon>
        Rejections
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Add new rejection
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="close"
          :disabled="saving"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <template v-if="loading">Loading...</template>
        <div
          v-else
          :key="index"
          class="mb-4"
          v-for="(data, index) in hourlyData"
        >
          <div class="text-h6 primary--text">
            {{ data.displayhour }}
          </div>
          <v-row no-gutters>
            <v-col cols="4">
              <div class="body-2">
                Produced
              </div>
              <div class="text-uppercase title font-weight-regular mb-2 info--text">
                {{ production.produced }}
              </div>
            </v-col>
            <v-col cols="4">
              <div class="body-2">
                Rejected
              </div>
              <div class="text-uppercase title font-weight-regular mb-2 error--text">
                {{ production.rejected }}
              </div>
            </v-col>
            <v-col cols="4">
              <div class="body-2">
                Accepted
              </div>
              <div class="text-uppercase title font-weight-regular mb-2 warning--text">
                {{ production.accepted }}
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                dense
                hide-details
                outlined
                label="Quantity"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                hide-details
                outlined
                label="Reason"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                dense
                rows="2"
                hide-details
                outlined
                label="Remarks"
              ></v-textarea>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ProductionSplit',
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hourlyData: [],
      saving: false,
      loading: false,
      dialog: false,
    };
  },
  watch: {
    dialog(val) {
      if (val) {
        this.getHourlyData();
      }
    },
  },
  methods: {
    ...mapActions('productionLog', ['fetchHourlyProduction']),
    async getHourlyData() {
      this.loading = true;
      this.hourlyData = await this.fetchHourlyProduction({
        machine: this.production.machinename,
        part: this.production.partname,
        shift: this.production.shift,
      });
      this.loading = false;
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
