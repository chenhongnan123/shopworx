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
        Production filters
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
            class="mt-5"
            :items="lines"
            outlined
            dense
            hide-details
            v-model="selectedLine"
            name="name"
            label="Select Line"
            item-text="name"
            item-value="id"
            return-object
            clearable
            @change="getSublinebyLine"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="sublineByline"
            outlined
            dense
            hide-details
            v-model="selectedSubLine"
            name="name"
            label="Select Subline"
            item-text="name"
            item-value="id"
            clearable
            return-object
            @change="getStationBySubline"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="stationBySubline"
            outlined
            dense
            hide-details
            v-model="selectedStation"
            name="name"
            label="Select Station"
            item-text="name"
            item-value="id"
            clearable
            @change="getSubstationByStation"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="subStationByStation"
            outlined
            dense
            hide-details
            v-model="selectedSubstation"
            name="name"
            label="Select Substation"
            item-text="name"
            item-value="id"
            clearable
            return-object
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
          :loading="saving"
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
  name: 'productionFilter',
  created() {
  },
  data() {
    return {
      saving: false,
      selectedLine: null,
      selectedSubLine: null,
      selectedStation: null,
      selectedSubstation: null,
    };
  },
  computed: {
    ...mapState('productionLayout', ['filter', 'lines', 'sublineByline', 'stationBySubline', 'subStationByStation']),
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
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('productionLayout', ['setFilter', 'toggleFilter']),
    ...mapActions('productionLayout', ['getfilteredSubline', 'getfilteredStation', 'getfilteredSubStation', 'getSublines', 'getStations']),
    getSublinebyLine() {
      this.getfilteredSubline(`?query=lineid==${this.selectedLine.id}`);
    },
    getStationBySubline() {
      this.getfilteredStation(`?query=sublineid=="${this.selectedSubLine.id}"`);
    },
    getSubstationByStation() {
      this.getfilteredSubStation(`?query=stationid=="${this.selectedStation}"`);
    },
    btnApply() {
      let query = '?query=';
      if (this.selectedLine && !this.selectedLine) {
        query += `lineid==${this.selectedLine.id}}&`;
        this.getSublines(query);
      } else if (this.selectedLine && this.selectedSubLine
         && !this.selectedStation && !this.selectedSubstation) {
        query += `id=="${this.selectedSubLine.id}"`;
        this.getSublines(query);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_INPUT',
        });
      }
    },
    btnReset() {
      this.toggleFilter();
      this.selectedLine = '';
      this.selectedSubLine = '';
      this.selectedStation = '';
      this.selectedSubstation = '';
    },
  },
};
</script>
