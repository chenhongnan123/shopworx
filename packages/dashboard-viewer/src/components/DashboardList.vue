<template>
  <div>
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
    <div v-if="!filteredDashboards.length">
      No dashboard found for '{{ search }}'
    </div>
    <v-list v-else>
      <v-list-item
        v-for="item in filteredDashboards"
        :key="item.id"
        :to="{ name: item.title }"
        color="primary"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-title v-text="$t(`dashboards.${item.title}`)"></v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DashboardList',
  data() {
    return {
      search: '',
    };
  },
  computed: {
    ...mapGetters('user', ['myDashboards']),
    filteredDashboards() {
      return this.myDashboards
        .filter((item) => this.$i18n.t(`dashboards.${item.title}`)
          .trim()
          .toUpperCase()
          .includes(this.search.trim().toUpperCase()));
    },
  },
};
</script>
