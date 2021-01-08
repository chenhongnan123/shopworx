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
        <v-tooltip bottom>
          <template #activator="{on, attrs}">
            <v-avatar
              size="16"
              v-on="on"
              v-bind="attrs"
              :color="item.ispasswordless ? 'success' : 'error'"
            ></v-avatar>
          </template>
          <span>
            {{ item.ispasswordless ? 'Yes' : 'No' }}
          </span>
        </v-tooltip>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.actions="{ item }">
        <toggle-passwordless :device="item" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';
import AddDevice from '../actions/AddDevice.vue';
import TogglePasswordless from '../actions/TogglePasswordless.vue';

export default {
  name: 'Devices',
  components: {
    AddDevice,
    TogglePasswordless,
  },
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        {
          text: 'Device ID',
          value: 'id',
        },
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
          text: 'Is passwordless?',
          value: 'ispasswordless',
          sortable: false,
          align: 'center',
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
    ...mapMutations('customerDeployment', ['setDevices']),
    ...mapActions('customerDeployment', ['fetchDevices']),
    async getDevices() {
      this.loading = true;
      await this.fetchDevices();
      this.loading = false;
    },
  },
};
</script>
