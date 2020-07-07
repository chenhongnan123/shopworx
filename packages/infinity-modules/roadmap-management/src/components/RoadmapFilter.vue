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
        Roadmap filters
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleFilter">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 220px)">
          <v-autocomplete
            :items="roadmapTypeList"
            outlined
            dense
            hide-details
            v-model="selectedRoadType"
            name="name"
            label="Roadmap Type name"
            item-text="name"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          class="text-none"
          color="primary"
          @click="btnApply"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          Apply
        </v-btn>
        <v-btn
         class="text-none"
         color="primary"
         @click="btnReset"
         text>
         Reset
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'OrderFilter',
  created() {
  },
  data() {
    return {
      orderStatusSelected: null,
      selectedRoadType: null,
      flag: false,
    };
  },
  computed: {
    ...mapState('roadmapManagement', ['filter', 'roadmapList', 'roadmapTypeList']),
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
    ...mapMutations('roadmapManagement', ['setRoadmapList', 'setFilter', 'toggleFilter']),
    ...mapActions('roadmapManagement', ['getRecords']),
    btnApply() {
      let query = '?query=';
      query += `roadmaptype=="${this.selectedRoadType}"`;
      this.getRecords(query);
      this.toggleFilter();
    },
    async btnReset() {
      this.selectedRoadType = '';
      await this.getRecords('');
      this.toggleFilter();
    },
  },
};
</script>
