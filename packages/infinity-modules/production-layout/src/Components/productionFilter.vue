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
            :items="sublines"
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
            @change="getProcessBySubStation"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="processes"
            outlined
            dense
            hide-details
            v-model="selectedProcess"
            name="name"
            label="Select Process"
            item-text="name"
            item-value="id"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions
       class="mt-10">
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
  name: 'ProductionFilter',
  created() {
  },
  data() {
    return {
      saving: false,
      selectedSubLine: null,
      selectedStation: null,
      selectedSubstation: null,
      selectedProcess: null,
    };
  },
  computed: {
    ...mapState('productionLayout', ['filter', 'lines', 'sublines', 'sublineByline', 'stationBySubline', 'subStationByStation', 'processes', 'selectedLine']),
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
    ...mapActions('productionLayout', ['getfilteredSubline', 'getfilteredStation', 'getfilteredSubStation', 'getSublines', 'getStations', 'getSubStations', 'getProcesses']),
    getProcessBySubStation() {
      this.getProcesses(`?query=substationid=="${this.selectedSubstation.id}"`);
    },
    getStationBySubline() {
      this.getfilteredStation(`?query=sublineid=="${this.selectedSubLine.id}"`);
    },
    getSubstationByStation() {
      this.getfilteredSubStation(`?query=stationid=="${this.selectedStation}"`);
    },
    async btnApply() {
      if (this.selectedSubLine && !this.selectedStation
         && !this.selectedSubstation && !this.selectedProcess) {
        const querySubline = `?query=id=="${this.selectedSubLine.id}"`;
        await this.getSublines(querySubline);
      } else if (this.selectedSubLine && this.selectedStation
         && !this.selectedSubstation && !this.selectedProcess) {
        const querySubline = `?query=id=="${this.selectedSubLine.id}"`;
        await this.getSublines(querySubline);
        const querystation = `?query=sublineid=="${this.selectedSubLine.id}"%26%26id=="${this.selectedStation}"`;
        await this.getStations(querystation);
        const querySubstation = `?query=stationid=="${this.selectedStation}"%26%26id=="${this.selectedSubstation.id}"`;
        await this.getSubStations(querySubstation);
        const queryProcess = `?query=substationid=="${this.selectedSubstation.id}"`;
        await this.getProcesses(queryProcess);
      } else if (this.selectedSubLine && this.selectedStation
         && this.selectedSubstation && !this.selectedProcess) {
        const querySubline = `?query=id=="${this.selectedSubLine.id}"`;
        await this.getSublines(querySubline);
        const querystation = `?query=sublineid=="${this.selectedSubLine.id}"%26%26id=="${this.selectedStation}"`;
        await this.getStations(querystation);
        const querySubstation = `?query=stationid=="${this.selectedStation}"%26%26id=="${this.selectedSubstation.id}"`;
        await this.getSubStations(querySubstation);
        const queryProcess = `?query=substationid=="${this.selectedSubstation.id}`;
        await this.getProcesses(queryProcess);
      } else if (this.selectedSubLine && this.selectedStation
         && this.selectedSubstation && this.selectedProcess) {
        const querySubline = `?query=id=="${this.selectedSubLine.id}"`;
        await this.getSublines(querySubline);
        const querystation = `?query=sublineid=="${this.selectedSubLine.id}"%26%26id=="${this.selectedStation}"`;
        await this.getStations(querystation);
        const querySubstation = `?query=stationid=="${this.selectedStation}"%26%26id=="${this.selectedSubstation.id}"`;
        await this.getSubStations(querySubstation);
        const queryProcess = `?query=substationid=="${this.selectedSubstation.id}"%26%26id=="${this.selectedProcess}"`;
        await this.getProcesses(queryProcess);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_INPUT',
        });
      }
    },
    async btnReset() {
      this.toggleFilter();
      this.selectedSubLine = '';
      this.selectedStation = '';
      this.selectedSubstation = '';
      await this.getSublines(`?query=lineid==${this.selectedLine.id}`);
      await this.getStations('');
      await this.getSubStations('');
      await this.getProcesses('');
    },
  },
};
</script>
