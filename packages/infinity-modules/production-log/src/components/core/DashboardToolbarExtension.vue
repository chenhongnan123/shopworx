<template>
  <portal to="app-extension">
    <v-toolbar
      flat
      dense
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <v-spacer></v-spacer>
      <div class="mt-1" v-show="!edit">
        <span class="title">
          {{ machine }} | {{ shift }} - {{ date }}
        </span>
      </div>
      <div v-show="edit">
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
import MachineSelection from './MachineSelection.vue';
import ShiftSelection from './ShiftSelection.vue';
import DateSelection from './DateSelection.vue';

export default {
  name: 'DashboardToolbarExtension',
  components: {
    MachineSelection,
    ShiftSelection,
    DateSelection,
  },
  data() {
    return {
      edit: false,
    };
  },
  computed: {
    ...mapState('productionLog', [
      'selectedMachine',
      'selectedShift',
      'selectedDate',
    ]),
    machine() {
      return this.selectedMachine ? this.selectedMachine : '';
    },
    shift() {
      return 'Shift 1';
    },
    date() {
      return this.selectedDate ? formatDate(new Date(this.selectedDate), 'PP') : '';
    },
  },
};
</script>
