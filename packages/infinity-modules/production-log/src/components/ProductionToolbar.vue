<template>
  <portal to="app-extension">
    <v-toolbar
      flat
      dense
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <v-spacer></v-spacer>
      <div class="mt-1">
        <span class="title">
          <span v-if="filterCount">
            {{ filterCount }} of {{ productionCount }} records
            <span v-if="$vuetify.breakpoint.smAndUp">|</span>
          </span>
          <span v-if="$vuetify.breakpoint.smAndUp">
            {{ machine }} | {{ shift }} - {{ date }}
          </span>
        </span>
      </div>
      <v-btn
        icon
        small
        outlined
        class="ml-2"
        @click="toggleDrawer(true)"
      >
        <v-icon small v-if="!drawer">mdi-filter-variant</v-icon>
        <v-icon small v-else>mdi-check</v-icon>
      </v-btn>
    </v-toolbar>
  </portal>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'ProductionToolbar',
  data() {
    return {
      edit: false,
    };
  },
  computed: {
    ...mapState('productionLog', [
      'drawer',
      'productionList',
      'productionCount',
    ]),
    ...mapGetters('webApp', ['filters', 'filteredRecords']),
    machine() {
      return this.filters && this.filters.machinename ? this.filters.machinename.value : '';
    },
    shift() {
      return this.filters && this.filters.shift ? this.filters.shift.value : '';
    },
    date() {
      return this.filters && this.filters.date ? formatDate(new Date(this.filters.date.value), 'PP') : '';
    },
    filterCount() {
      const production = this.filteredRecords(this.productionList);
      return production.length;
    },
  },
  methods: {
    ...mapMutations('productionLog', ['toggleDrawer']),
  },
};
</script>
