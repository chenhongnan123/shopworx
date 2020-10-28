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
          <span v-if="productionList.length">
            {{ productionCount }} records |
          </span>
          {{ machine }} | {{ shift }} - {{ date }}
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
      'selectedDuration',
      'selectedMachine',
      'selectedShift',
      'selectedDate',
      'selectedProductions',
      'toggleSelection',
    ]),
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
    ...mapMutations('productionLog', ['toggleDrawer']),
  },
};
</script>
