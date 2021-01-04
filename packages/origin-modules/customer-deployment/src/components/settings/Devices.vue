<template>
  <div>
    <portal to="settings-header">
      <add-device
        :addDevice="true"
        @on-create="getDevices"
        #default="{ on, attrs }"
      >
        <v-btn
          small
          v-on="on"
          v-bind="attrs"
          color="primary"
          class="text-none"
        >
          <v-icon left>mdi-plus</v-icon>
          Add device
        </v-btn>
      </add-device>
    </portal>
    <v-text-field
      dense
      rounded
      outlined
      single-line
      hide-details
      v-model="search"
      prepend-inner-icon="$search"
      label="Filter devices"
    ></v-text-field>
    <v-data-table
      dense
      item-key="_id"
      class="transparent mt-2"
      :search="search"
      :items="sortedDevices"
      :headers="headers"
      disable-pagination
      hide-default-footer
      :loading="loading"
    >
      <template #loading>
        Fetching devices...
      </template>
      <template #no-data>
        No device available
      </template>
      <template #no-results>
        No matching device found for '{{ search }}'
      </template>
    <!-- eslint-disable-next-line -->
      <template #item.ispasswordless="{ item }">
        <v-checkbox
          :input-value="item.ispasswordless"
          hide-details
          class="ma-0 pa-0"
          @change="updateDeviceConfig({
            id: item._id,
            payload: { ispasswordless: !item.ispasswordless }
          })"
        ></v-checkbox>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';
import AddDevice from '../actions/AddDevice.vue';

export default {
  name: 'Devices',
  components: {
    AddDevice,
  },
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        {
          text: 'Device name',
          value: 'name',
        },
        {
          text: 'Device description',
          value: 'description',
        },
        {
          text: 'Device IP',
          value: 'ipaddr',
          sortable: false,
        },
        {
          text: 'Hostname',
          value: 'hostname',
          sortable: false,
        },
        {
          text: 'Is passwordless',
          value: 'ispasswordless',
          sortable: false,
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', ['devices']),
    sortedDevices() {
      return sortArray(this.devices, 'name');
    },
  },
  created() {
    this.setDevices([]);
    this.getDevices();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('customerDeployment', ['setDevices']),
    ...mapActions('customerDeployment', ['fetchDevices', 'updateDevice']),
    async getDevices() {
      this.loading = true;
      await this.fetchDevices();
      this.loading = false;
    },
    async updateDeviceConfig({ id, payload }) {
      const updated = await this.updateDevice({ id, payload });
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'DEVICE_UPDATE',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'DEVICE_UPDATE',
        });
      }
    },
  },
};
</script>
