<template>
  <portal to="app-extension">
    <v-toolbar
      flat
      dense
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <template v-if="isCalendarView">
        <v-btn
          class="text-none"
          color="primary"
          outlined
          small
          @click="setToday"
        >
          Today
        </v-btn>
        <v-btn
          icon
          class="ml-2"
          @click="setPrev"
        >
          <v-icon v-text="'$prev'"></v-icon>
        </v-btn>
        <v-btn
          icon
          class="ml-2"
          @click="setNext"
        >
          <v-icon v-text="'$next'"></v-icon>
        </v-btn>
        <span class="title ml-2" v-if="calendarRef">
          {{ calendarRef.title }}
        </span>
      </template>
      <span class="title" v-else>
        {{ date }}
      </span>
      <v-spacer></v-spacer>
      <v-btn
        small
        class="text-none mr-2"
        color="primary"
        :to="{ name: 'addProductionPlan' }"
      >
        <v-icon left small>mdi-plus</v-icon>
        Add new plan
      </v-btn>
      <v-btn
        small
        outlined
        color="primary"
        :to="{ name: 'reorderPlans' }"
        class="text-none mr-2"
      >
        <v-icon left small>mdi-swap-vertical</v-icon>
        Re-order plans
      </v-btn>
      <v-menu bottom right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="text-none mr-2"
            color="primary"
            outlined
            small
            v-bind="attrs"
            v-on="on"
          >
            <span>{{ typeToLabel[viewType] }}</span>
            <v-icon right v-text="'mdi-menu-down'"></v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="viewType = 'default'">
            <v-list-item-title>List</v-list-item-title>
          </v-list-item>
          <v-list-item @click="viewType = 'month'">
            <v-list-item-title>Month</v-list-item-title>
          </v-list-item>
          <v-list-item @click="viewType = 'week'">
            <v-list-item-title>Week</v-list-item-title>
          </v-list-item>
          <v-list-item @click="viewType = 'day'">
            <v-list-item-title>Day</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-badge
        overlap
        bordered
        color="primary"
        icon="mdi-check-outline"
        :value="showBadge"
      >
        <v-btn
          small
          outlined
          color="primary"
          class="text-none"
          @click="toggleDrawer(true)"
        >
          <v-icon small left>mdi-filter-variant</v-icon>
          Filters
        </v-btn>
      </v-badge>
    </v-toolbar>
  </portal>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'PlanningToolbar',
  data() {
    return {
      typeToLabel: {
        default: 'List',
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
    };
  },
  computed: {
    ...mapState('productionPlanning', [
      'drawer',
      'view',
      'today',
      'calendarRef',
    ]),
    ...mapGetters('webApp', ['filters']),
    ...mapGetters('productionPlanning', ['isCalendarView']),
    viewType: {
      get() {
        return this.view;
      },
      set(view) {
        this.setView(view);
      },
    },
    showBadge() {
      const isMachineFilter = !this.filters.machinename.value.includes('All');
      const isPartFilter = !this.filters.partname.value.includes('All');
      const isStatusFilter = this.filters.status.value.length !== 4;
      return isMachineFilter || isPartFilter || isStatusFilter;
    },
    date() {
      let dateText = '';
      if (this.filters && this.filters.date && this.filters.date.value) {
        const start = formatDate(new Date(this.filters.date.value[0]), 'PP');
        dateText = start;
        let end = '';
        if (this.filters.date.value.length === 2) {
          end = formatDate(new Date(this.filters.date.value[1]), 'PP');
        }
        dateText = `${start} - ${end}`;
      }
      return dateText;
    },
  },
  methods: {
    ...mapMutations('productionPlanning', [
      'toggleDrawer',
      'setView',
      'setCalendarFocus',
    ]),
    setToday() {
      this.setCalendarFocus(this.today);
    },
    setPrev() {
      this.calendarRef.prev();
    },
    setNext() {
      this.calendarRef.next();
    },
  },
};
</script>
