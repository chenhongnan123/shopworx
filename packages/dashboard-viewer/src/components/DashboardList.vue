<template>
  <v-card flat class="transparent">
    <v-card-title class="display-1 font-weight-medium justify-space-between primary--text">
      Available dashboards
    </v-card-title>
    <v-text-field
      dense
      outlined
      single-line
      hide-details
      v-model="search"
      autocomplete="off"
      label="Filter dashboard"
      append-icon="mdi-magnify"
    ></v-text-field>
    <v-data-table
      :items="myDashboards"
      :search="search"
      :headers="headers"
      :loading="fetchingDashboards"
      hide-default-footer
      :custom-filter="filterDashboards"
    >
      <template #loading>
        Fetching dashboards...
      </template>
      <template #no-data>
        No dashboard available
      </template>
      <template #no-results>
        No matching dashboard found for '{{ search }}'
      </template>
      <template #item="{ item }">
        <tr>
          <td>
            <v-icon left v-text="item.icon"></v-icon>
            {{ $t(`dashboards.${item.title}`) }}
          </td>
          <td>
            <v-btn
              color="primary"
              small
              text
              class="text-none"
              :to="{ name: item.title }"
            >
              Open
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DashboardList',
  data() {
    return {
      fetchingDashboards: false,
      search: '',
      headers: [
        { text: 'Dashboard', value: 'title' },
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
    this.fetchingDashboards = true;
    await this.getMySolutions();
    this.fetchingDashboards = false;
  },
  computed: {
    ...mapGetters('user', ['myDashboards']),
  },
  methods: {
    ...mapActions('user', ['getMySolutions']),
    filterDashboards(value, search, item) {
      return this.$i18n.t(`dashboards.${item.title}`)
        .toLowerCase()
        .indexOf(search.toLowerCase()) > -1;
    },
  },
};
</script>
