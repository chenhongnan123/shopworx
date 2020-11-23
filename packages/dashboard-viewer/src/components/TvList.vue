<template>
  <v-card flat class="transparent">
    <v-card-title class="display-1 font-weight-medium justify-space-between primary--text">
      Available TVs
      <register-tv @on-register="fetchDevices" />
    </v-card-title>
    <v-text-field
      dense
      outlined
      single-line
      hide-details
      v-model="search"
      autocomplete="off"
      label="Filter TV"
      append-icon="mdi-magnify"
    ></v-text-field>
    <v-data-table
      :items="myTvs"
      :search="search"
      :headers="headers"
      :loading="fetchingTvs"
      hide-default-footer
    >
      <template #loading>
        Fetching TVs...
      </template>
      <template #no-data>
        No TV available
      </template>
      <template #no-results>
        No matching TV found for '{{ search }}'
      </template>
      <template #item="{ item }">
        <tr>
          <td>
            {{ item.deviceid }}
          </td>
          <td>
            {{ item.devicename }}
          </td>
          <td>
            edit delete cast
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import RegisterTv from './RegisterTv.vue';

export default {
  name: 'TvList',
  components: {
    RegisterTv,
  },
  data() {
    return {
      fetchingTvs: false,
      search: '',
      headers: [
        { text: 'Device Id', value: 'deviceid' },
        { text: 'TV Name', value: 'devicename' },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          filterable: false,
        },
      ],
    };
  },
  async created() {
    this.fetchingTvs = true;
    let success = true;
    if (!this.isDeviceElemAvailable) {
      success = await this.getDeviceElement();
    }
    if (success && !this.myTvs.length) {
      await this.getMyDevices();
    }
    this.fetchingTvs = false;
  },
  computed: {
    ...mapState('dashboard', ['isDeviceElemAvailable']),
    ...mapGetters('user', ['myTvs']),
  },
  methods: {
    ...mapActions('user', ['getMyDevices']),
    ...mapActions('dashboard', ['getDeviceElement']),
    async fetchDevices() {
      this.fetchingTvs = true;
      await this.getMyDevices();
      this.fetchingTvs = false;
    },
    filterDashboards(value, search, item) {
      return this.$i18n.t(`dashboards.${item.title}`)
        .toLowerCase()
        .indexOf(search.toLowerCase()) > -1;
    },
  },
};
</script>
