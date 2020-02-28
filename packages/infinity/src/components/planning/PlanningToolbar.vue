<template>
  <v-toolbar
    flat
    fixed
    dense
    class="transparent"
  >
    <template v-if="$route.name === 'planning'">
      <v-toolbar-title v-text="$t('infinity.planning.toolbar.title')">
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="view === 1">
        Calendar options
      </template>
      <v-btn
        icon
        @click="toggleFilter"
      >
        <v-icon v-text="'$filter'"></v-icon>
      </v-btn>
      <span>Views |</span>
      <v-btn-toggle
        dense
        group
        mandatory
        color="primary"
        v-model="planningView"
      >
        <v-btn>
          <v-icon v-text="'$listView'"></v-icon>
        </v-btn>
        <v-btn>
          <v-icon v-text="'$calendarView'"></v-icon>
        </v-btn>
      </v-btn-toggle>
    </template>
  </v-toolbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'PlanningToolbar',
  computed: {
    ...mapState('planning', ['view']),
    planningView: {
      get() {
        return this.view;
      },
      set(val) {
        this.setView(val);
      },
    },
  },
  methods: {
    ...mapMutations('planning', ['setView', 'toggleFilter']),
  },
};
</script>
