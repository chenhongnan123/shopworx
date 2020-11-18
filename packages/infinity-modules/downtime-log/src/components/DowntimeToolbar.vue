<template>
  <portal to="app-extension">
    <v-toolbar
      flat
      dense
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <div class="mt-5 mr-4">
        <select-all />
      </div>
      <div v-if="selectedDowntimes.length > 0 && toggleSelection">
         <assign-reason-dialog />
      </div>
      <v-spacer></v-spacer>
      <div class="mt-1">
        <span class="title">
          <span v-if="downtimeList.length">
            Showing {{ downtimeList.length }} of {{ downtimeCount }} |
          </span>
          {{ duration }} | {{ machine }} | {{ shift }} - {{ date }}
        </span>
      </div>
      <v-btn
        icon
        small
        outlined
        class="ml-2"
        @click="toggleDrawer(true)"
      >
        <v-icon small v-if="!drawer">mdi-pencil</v-icon>
        <v-icon small v-else>mdi-check</v-icon>
      </v-btn>
    </v-toolbar>
  </portal>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';
import SelectAll from './toolbar/SelectAll.vue';
import AssignReasonDialog from './AssignReasonDialog.vue';

export default {
  name: 'DowntimeToolbar',
  components: {
    SelectAll,
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
      'downtimeCount',
      'selectedDuration',
      'selectedMachine',
      'selectedShift',
      'selectedDate',
      'selectedDowntimes',
      'toggleSelection',
    ]),
    duration() {
      return this.selectedDuration ? this.selectedDuration.name : '';
    },
    machine() {
      return this.selectedMachine ? this.selectedMachine : '';
    },
    shift() {
      return this.selectedShift ? this.selectedShift : '';
    },
    date() {
      return this.selectedDate ? formatDate(new Date(this.selectedDate), 'PP') : '';
    },
  },
  methods: {
    ...mapMutations('downtimeLog', ['toggleDrawer']),
  },
};
</script>
