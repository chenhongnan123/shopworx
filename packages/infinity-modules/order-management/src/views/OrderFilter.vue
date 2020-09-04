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
        Order filters
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleFilter">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 180px)">
          <v-autocomplete
            :items="['Cell 1', 'Cell 2', 'Cell 3']"
            outlined
            dense
            hide-details
            name="cellFilter"
            label="Cell"
            id="cellFilter"
          ></v-autocomplete>
          <div class="subheading font-weight-regular mt-4">Order Status</div>
          <v-chip-group
            column
            multiple
            mandatory>
            <v-chip outlined active-class="info--text">New</v-chip>
            <v-chip outlined active-class="warning--text">Released</v-chip>
            <v-chip outlined active-class="success--text">Running</v-chip>
            <v-chip outlined active-class="error--text">Interrupted</v-chip>
            <v-chip outlined active-class="accent--text">Completed</v-chip>
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
  name: 'OrderFilter',
  computed: {
    ...mapState('orderManagement', ['filter']),
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
    ...mapMutations('orderManagement', ['setFilter', 'toggleFilter']),
  },
};
</script>
