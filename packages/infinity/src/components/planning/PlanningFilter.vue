<template>
  <v-navigation-drawer
    absolute
    right
    :overlay-opacity="0"
    temporary
    v-model="showFilter"
  >
    <v-toolbar
      flat
      :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'"
    >
      <v-toolbar-title>
        Plan filters
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleFilter">
        <v-icon v-text="'$close'"></v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 180px)">
          <v-autocomplete
            :items="['IMH01', 'IMH02', 'IMH03']"
            outlined
            dense
            hide-details
            name="machineFilter"
            label="Machine"
            id="machineFilter"
          ></v-autocomplete>
          <div class="subheading font-weight-regular mt-4">Plan status</div>
          <v-chip-group
            column
            multiple
            mandatory
          >
            <v-chip outlined active-class="success--text">Completed</v-chip>
            <v-chip outlined active-class="error--text">Aborted</v-chip>
            <v-chip outlined active-class="info--text">Not started</v-chip>
            <v-chip outlined active-class="warning--text">In Progress</v-chip>
          </v-chip-group>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          class="text-none"
          color="primary"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          Apply
        </v-btn>
        <v-btn class="text-none" color="primary" text>Reset</v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'PlanningFilter',
  computed: {
    ...mapState('planning', ['filter']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
  },
  methods: {
    ...mapMutations('planning', ['setFilter', 'toggleFilter']),
  },
};
</script>
