<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        class="text-none mr-2"
        color="primary"
        small
        v-on="on"
        v-bind="attrs"
      >
        <v-icon left>mdi-cast</v-icon>
        Send to TV
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        Select a TV
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          dense
          outlined
          single-line
          v-model="search"
          autocomplete="off"
          label="Filter TVs"
          append-icon="mdi-magnify"
        ></v-text-field>
        <template v-if="!fetchingTvs">
          <v-radio-group
            hide-details
            class="ma-0 pa-0"
            v-model="selectedTv"
          >
            <v-radio
              v-for="tv in filteredTvs"
              :key="tv.deviceid"
              :label="tv.devicename"
              :value="tv"
            ></v-radio>
          </v-radio-group>
        </template>
        <v-row
          v-else
          no-gutters
          align="center"
          justify="center"
        >
          <v-col cols="12" align="center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="36"
            ></v-progress-circular>
          </v-col>
          <v-col cols="12" align="center">
            <span>
              Fetching TV list...
            </span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!selectedTv"
          :loading="sending"
          @click="sendDashboardToTv"
        >
          Send to TV
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  name: 'SendToTv',
  data() {
    return {
      dialog: false,
      search: '',
      sending: false,
      selectedTv: null,
      fetchingTvs: false,
    };
  },
  async created() {
    this.fetchingTvs = true;
    if (!this.myTvs.length) {
      await this.getMyDevices();
    }
    this.fetchingTvs = false;
  },
  computed: {
    ...mapState('auth', ['sessionId']),
    ...mapGetters('user', ['myTvs']),
    filteredTvs() {
      return this.myTvs
        .filter((param) => param.devicename
          .trim()
          .toUpperCase()
          .includes(this.search.trim().toUpperCase()));
    },
  },
  methods: {
    ...mapActions('user', ['getMyDevices']),
    ...mapActions('dashboard', ['updateTV']),
    async sendDashboardToTv() {
      if (this.selectedTv) {
        this.sending = true;
        const id = this.selectedTv._id;
        const payload = {
          dashboardurl: this.$route.fullPath,
          sessionid: this.sessionId,
          status: 'CAST',
          assetid: 0,
        };
        const updated = await this.updateTV({
          id,
          payload,
        });
        if (updated) {
          this.selectedTv = null;
          this.dialog = false;
        }
        this.sending = false;
      }
    },
  },
};
</script>
