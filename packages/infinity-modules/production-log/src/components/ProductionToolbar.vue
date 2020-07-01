<template>
  <div>
    <span class="mt-1" v-show="!edit">
      <span>
        {{ shift }} - {{ date }}
      </span>
    </span>
    <span v-show="edit">
      <shift-selection />
      <date-selection />
    </span>
    <v-btn
      icon
      small
      outlined
      class="ml-2 mb-1"
      @click="edit = !edit"
    >
      <v-icon small v-if="!edit">mdi-pencil</v-icon>
      <v-icon small v-else>mdi-check</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';
import ShiftSelection from './dashboard/ShiftSelection.vue';
import DateSelection from './dashboard/DateSelection.vue';

export default {
  name: 'ProductionToolbar',
  components: {
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
      'selectedShift',
      'selectedDate',
    ]),
    shift() {
      return 'Shift 1';
    },
    date() {
      return this.selectedDate ? formatDate(new Date(this.selectedDate), 'PP') : '';
    },
  },
};
</script>
