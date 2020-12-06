<template>
  <v-card
    height="100%"
    rounded="lg"
  >
    <v-card-title>
      Registered TVs
      <v-spacer></v-spacer>
      <register-tv @on-register="fetchDevices" />
    </v-card-title>
    <v-card-text>
      <v-data-table
        :items="myTvs"
        :headers="headers"
        :loading="fetchingTvs"
        disable-pagination
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
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import RegisterTv from './RegisterTv.vue';

export default {
  name: 'RegisteredTvs',
  components: {
    RegisterTv,
  },
  data() {
    return {
      fetchingTvs: false,
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
    if (success) {
      await this.getMyDevices();
    }
    this.fetchingTvs = false;
  },
  computed: {
    ...mapState('user', ['isDeviceElemAvailable']),
    ...mapGetters('user', ['myTvs']),
  },
  methods: {
    ...mapActions('user', ['getMyDevices']),
    ...mapActions('user', ['getDeviceElement']),
    async fetchDevices() {
      this.fetchingTvs = true;
      await this.getMyDevices();
      this.fetchingTvs = false;
    },
  },
};
</script>
