<template>
  <portal to="app-extension">
    <v-toolbar
      flat
      dense
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <div v-if="selectedDowntimes.length > 0 && toggleSelection">
         <assign-reason-dialog />
      </div>
      <v-spacer></v-spacer>
      <div class="mt-1">
        <span class="title">
          <span v-if="filterCount">
            {{ $t('downtime.records', {
              current: filterCount,
              total: downtimeCount
            }) }}
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
import AssignReasonDialog from './AssignReasonDialog.vue';

export default {
  name: 'DowntimeToolbar',
  components: {
    AssignReasonDialog,
  },
  data() {
    return {
      edit: false,
    };
  },
  computed: {
    ...mapState('downtimeLog', [
      'drawer',
      'downtimeList',
      'selectedDuration',
      'selectedDowntimes',
      'toggleSelection',
      'downtimeCount',
    ]),
    ...mapGetters('webApp', ['filters', 'filteredRecords']),
    ...mapGetters('helper', ['locale']),
    machine() {
      let machine = '';
      if (this.filters && this.filters.machinename) {
        if (this.filters.machinename.value === 'All') {
          machine = this.$t('downtime.allMachines');
        } else {
          machine = this.filters.machinename.value;
        }
      }
      return machine;
    },
    shift() {
      let machine = '';
      if (this.filters && this.filters.shiftName) {
        if (this.filters.shiftName.value === 'All') {
          machine = this.$t('downtime.allShifts');
        } else {
          machine = this.filters.shiftName.value;
        }
      }
      return machine;
    },
    date() {
      return this.filters && this.filters.date
        ? formatDate(
          new Date(this.filters.date.value),
          'PP',
          { locale: this.locale },
        ) : '';
    },
    filterCount() {
      const downtime = this.filteredRecords(this.downtimeList);
      return downtime.length;
    },
  },
  methods: {
    ...mapMutations('downtimeLog', ['toggleDrawer']),
  },
};
</script>
