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
        Parameter filters
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
            :items="lineList"
            outlined
            dense
            hide-details
            v-model="line"
            name="name"
            label="Select Line"
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
          <v-autocomplete
            class="mt-5"
            :items="sublineList"
            outlined
            dense
            hide-details
            v-model="subline"
            name="name"
            label="Select Subine"
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
          <v-autocomplete
            class="mt-5"
            :items="stationList"
            outlined
            dense
            hide-details
            v-model="station"
            name="name"
            label="Select Station"
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
          <v-autocomplete
            class="mt-5"
            :items="substationList"
            outlined
            dense
            hide-details
            v-model="substation"
            name="name"
            label="Select Substation"
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
          <v-autocomplete
            class="mt-5"
            :items="parameterList"
            outlined
            dense
            hide-details
            v-model="selectedParameterName"
            name="name"
            label="Parameter Name"
            item-text="name"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="directionList"
            outlined
            dense
            hide-details
            v-model="selectedParameterDirection"
            name="name"
            label="Parameter Direction"
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
        <v-autocomplete
            class="mt-5"
            :items="categoryList"
            outlined
            dense
            hide-details
            v-model="selectedParameterCategory"
            name="name"
            label="Parameter Category"
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
        <v-autocomplete
            class="mt-5"
            :items="datatypeList"
            outlined
            dense
            hide-details
            v-model="selectedParameterDatatype"
            name="name"
            label="Parameter Datatype"
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
      <v-card-actions>
        <v-btn
          class="text-none"
          color="primary"
          @click="btnApply"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          :disabled="!substationValue"
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
      line: null,
      subline: null,
      station: null,
      substation: null,
      selectedParameterName: null,
      selectedParameterDirection: null,
      selectedParameterCategory: null,
      selectedParameterDatatype: null,
      selectedParameterStartAdress: null,
    };
  },
  // props: ['station', 'substation'],
  computed: {
    ...mapState('parameterConfiguration', ['filter', 'parameterList', 'lineList', 'sublineList', 'stationList', 'substationList', 'lineValue', 'sublineValue', 'stationValue', 'substationValue', 'directionList', 'categoryList', 'datatypeList']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
  },
  watch: {
    line(val) {
      this.setLineValue(val);
      const query = `?query=lineid==${val}`;
      this.getSublineList(query);
      this.setSublineValue('');
      this.setStationValue('');
      this.setSubstationValue('');
    },
    subline(val) {
      this.setSublineValue(val);
      const query = `?query=sublineid=="${val}"`;
      this.getStationList(query);
      this.setStationValue('');
      this.setSubstationValue('');
    },
    async station(val) {
      this.setStationValue(val);
      await this.getSubstationList(`?query=stationid=="${val}"`);
      this.setSubstationValue('');
    },
    async substation(val) {
      await this.setSubstationValue(val);
      // const query = `?query=substationid=="${val || null}"`;
      // query += `${this.substationValue ? 'sub' : ''}stationid==
      // "${this.substationValue || this.stationValue}"`;
      // this.getParameterListRecords(query);
    },
    lineValue(val) {
      if (!val) {
        this.line = '';
        this.subline = '';
        this.station = '';
        this.substation = '';
      }
    },
    sublineValue(val) {
      if (!val) {
        this.subline = '';
        this.station = '';
        this.substation = '';
      }
    },
    stationValue(val) {
      if (!val) {
        this.station = '';
        this.substation = '';
      }
    },
    substationValue(val) {
      if (!val) {
        this.substation = '';
      }
    },
  },
  methods: {
    ...mapMutations('parameterConfiguration', ['setFilter', 'toggleFilter', 'setLineValue', 'setSublineValue', 'setStationValue', 'setSubstationValue']),
    ...mapActions('parameterConfiguration', ['getParameterListRecords', 'getSublineList', 'getStationList', 'getSubstationList']),
    btnApply() {
      let query = '?query=';
      if (this.selectedParameterName) {
        query += `name=="${this.selectedParameterName}"&`;
      }
      if (this.selectedParameterDirection) {
        query += `parameterdirection=="${this.selectedParameterDirection}"&`;
      }
      if (this.selectedParameterCategory) {
        query += `parametercategory=="${this.selectedParameterCategory}"&`;
      }
      if (this.selectedParameterDatatype) {
        query += `datatype=="${this.selectedParameterDatatype}"&`;
      }
      if (this.selectedParameterStartAdress) {
        query += `startadress=="${this.selectedParameterStartAdress}"&`;
      }
      query += `substationid=="${this.substationValue || null}"`;
      // const query = `?query=substationid=="${this.substationValue || null}"`;
      this.getParameterListRecords(query);
    },
    btnReset() {
      this.getParameterListRecords(`?query=${this.substation ? 'sub' : ''}stationid=="${this.substation || this.station}"`);
      this.toggleFilter();
      // this.selectedParameterName = '';
      // this.selectedParameterDirection = '';
      // this.selectedParameterCategory = '';
      // this.selectedParameterDatatype = '';
      // this.selectedParameterStartAdress = '';
      this.line = '';
      this.subline = '';
      this.station = '';
      this.substation = '';
    },
  },
};
</script>
