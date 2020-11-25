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
      <v-btn icon @click="closeFilter">
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
            label="Select Subline"
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
            v-model="parameterName"
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
            v-model="parameterDirection"
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
            v-model="parameterCategory"
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
            v-model="parameterDatatype"
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
          :disabled="!stationValue"
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
  name: 'OrderFilter',
  created() {
  },
  data() {
    return {
      saving: false,
    };
  },
  computed: {
    ...mapState('parameterConfiguration', ['filter', 'parameterList', 'lineList', 'sublineList', 'stationList', 'substationList', 'lineValue', 'sublineValue', 'stationValue', 'substationValue', 'directionList', 'categoryList', 'datatypeList', 'selectedParameterName', 'selectedParameterDirection', 'selectedParameterCategory', 'selectedParameterDatatype']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
    parameterName: {
      get() {
        return this.selectedParameterName;
      },
      set(val) {
        this.setSelectedParameterName(val);
      },
    },
    parameterDirection: {
      get() {
        return this.selectedParameterDirection;
      },
      set(val) {
        this.setSelectedParameterDirection(val);
      },
    },
    parameterCategory: {
      get() {
        return this.selectedParameterCategory;
      },
      set(val) {
        this.setSelectedParameterCategory(val);
      },
    },
    parameterDatatype: {
      get() {
        return this.selectedParameterDatatype;
      },
      set(val) {
        this.setSelectedParameterDatatype(val);
      },
    },
    line: {
      get() {
        return this.lineValue;
      },
      set(val) {
        this.setLineValue(val);
        const query = `?query=lineid==${val}`;
        this.getSublineList(query);
        this.setSublineValue('');
        this.setStationValue('');
        this.setSubstationValue('');
      },
    },
    subline: {
      get() {
        return this.sublineValue;
      },
      set(val) {
        this.setSublineValue(val);
        const query = `?query=sublineid=="${val}"`;
        this.getStationList(query);
        this.setStationValue('');
        this.setSubstationValue('');
      },
    },
    station: {
      get() {
        return this.stationValue;
      },
      set(val) {
        this.setStationValue(val);
        this.getSubstationList(`?query=stationid=="${val}"`);
        this.setSubstationValue('');
      },
    },
    substation: {
      get() {
        this.setApply(false);
        return this.substationValue;
      },
      set(val) {
        this.setApply(false);
        this.setSubstationValue(val);
      },
    },
  },
  methods: {
    ...mapMutations('parameterConfiguration', ['setFilter', 'toggleFilter', 'setApply', 'setLineValue', 'setSublineValue', 'setStationValue', 'setSubstationValue', 'setSelectedParameterName', 'setSelectedParameterDirection', 'setSelectedParameterCategory', 'setSselectedParameterDatatype']),
    ...mapActions('parameterConfiguration', ['getParameterListRecords', 'getSublineList', 'getStationList', 'getSubstationList']),
    async btnApply() {
      let query = '?query=';
      if (this.selectedParameterName) {
        query += `name=="${this.selectedParameterName}"%26%26`;
      }
      if (this.selectedParameterDirection) {
        query += `parameterdirection=="${this.selectedParameterDirection}"%26%26`;
      }
      if (this.selectedParameterCategory) {
        query += `parametercategory=="${this.selectedParameterCategory}"%26%26`;
      }
      if (this.selectedParameterDatatype) {
        query += `datatype=="${this.selectedParameterDatatype}"%26%26`;
      }
      if (this.substationValue) {
        query += `substationid=="${this.substationValue}"`;
      } else {
        query += `stationid=="${this.stationValue || null}"`;
      }
      this.saving = true;
      await this.getParameterListRecords(query);
      this.saving = false;
      this.toggleFilter();
      this.setApply(true);
    },
    btnReset() {
      this.getParameterListRecords('?query=stationid==null');
      this.toggleFilter();
      this.selectedParameterName = '';
      this.selectedParameterDirection = '';
      this.selectedParameterCategory = '';
      this.selectedParameterDatatype = '';
      this.selectedParameterStartAdress = '';
      this.line = '';
      this.subline = '';
      this.station = '';
      this.substation = '';
    },
    closeFilter() {
      debugger;
      this.getParameterListRecords('?pagenumber=1&pagesize=10');
      this.toggleFilter();
    },
  },
};
</script>
