<template>
  <portal to="app-extension">
    <v-toolbar
      flat
      dense
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <div class="mt-5 mr-4">
        <toggle-selection />
      </div>
      <div v-if="this.selectedItems.length > 0">
         <assign-reason />
      </div>
      <v-spacer></v-spacer>
      <div class="mt-1" v-show="!edit">
        <span class="title">
          {{ duration }} | {{ machine }} | {{ shift }} - {{ date }}
        </span>
      </div>
      <div v-show="edit">
        <duration-selection />
        <machine-selection />
        <shift-selection />
        <date-selection />
      </div>
      <v-btn
        icon
        small
        outlined
        class="ml-2"
        @click="edit = !edit"
      >
        <v-icon small v-if="!edit">mdi-pencil</v-icon>
        <v-icon small v-else>mdi-check</v-icon>
      </v-btn>
    </v-toolbar>
  </portal>
</template>

<script>
import { mapState } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';
import DurationSelection from './toolbar/DurationSelection.vue';
import MachineSelection from './toolbar/MachineSelection.vue';
import ShiftSelection from './toolbar/ShiftSelection.vue';
import DateSelection from './toolbar/DateSelection.vue';
import ToggleSelection from './toolbar/ToggleSelection.vue';
import AssignReason from './AssignReasonDialog.vue';

export default {
  name: 'DowntimeToolbar',
  components: {
    DurationSelection,
    MachineSelection,
    ShiftSelection,
    DateSelection,
    ToggleSelection,
    AssignReason,
  },
  data() {
    return {
      edit: false,
    };
  },
  computed: {
    ...mapState('downtimeLog', [
      'selectedDuration',
      'selectedMachine',
      'selectedShift',
      'selectedDate',
      'selectedItems',
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
};
</script>
