<template>
  <v-card flat>
    <v-card-title primary-title class="pl-2">
      Filters
    </v-card-title>
    <perfect-scrollbar style="height: calc(100vh - 196px)">
      <v-card-text class="pl-0 py-0">
        <v-select
          dense
          outlined
          class="mt-1"
          label="Line"
          v-model="line"
          :items="lines"
          item-value="id"
          item-text="name"
          :loading="loading"
        ></v-select>
        <v-select
          dense
          outlined
          label="Subline"
          :items="sublines"
          item-value="id"
          item-text="name"
          v-model="subline"
          :disabled="!line"
          :loading="sublineLoading"
        ></v-select>
        <v-select
          dense
          outlined
          label="Station"
          :items="stations"
          item-value="id"
          item-text="name"
          v-model="station"
          :loading="stationLoading"
          :disabled="!line || !subline"
        ></v-select>
        <v-select
          dense
          outlined
          label="Sub station"
          :items="subStations"
          item-value="id"
          item-text="name"
          v-model="subStation"
          :loading="subStationLoading"
          :disabled="!line || !subline || !station"
        ></v-select>
        <v-select
          dense
          outlined
          label="Data type"
          :items="dataTypes"
          item-value="id"
          item-text="name"
          v-model="dataType"
          :disabled="!line || !subline || !station || !subStation"
        ></v-select>
        <v-text-field
          label="Date from"
          dense
          v-model="dateFrom"
          type="datetime-local"
          outlined
        ></v-text-field>
        <v-text-field
          label="Date to"
          dense
          v-model="dateTo"
          type="datetime-local"
          outlined
        ></v-text-field>
        <div class="font-weight-medium">
          Parameters
        </div>
        <v-text-field
          label="Search"
          dense
          single-line
          v-model="search"
          autocomplete="off"
          clearable
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <perfect-scrollbar style="height: 150px">
          <v-checkbox
            hide-details
            class="ma-0 pa-0"
            :key="parameter.name"
            v-model="selectedParameters"
            :label="parameter.description"
            :value="parameter.name"
            v-for="parameter in filteredParameters"
          ></v-checkbox>
        </perfect-scrollbar>
      </v-card-text>
    </perfect-scrollbar>
    <v-card-actions class="pl-0 pr-4">
      <v-btn
        block
        color="primary"
        :disabled="disableApply"
      >
        Apply
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'FilterDrawer',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: '',
      line: null,
      subline: null,
      station: null,
      subStation: null,
      dataType: null,
      dateFrom: null,
      dateTo: null,
      selectedParameters: [],
      sublines: [],
      stations: [],
      subStations: [],
      dataTypes: [],
      parameters: [],
      sublineLoading: false,
      stationLoading: false,
      subStationLoading: false,
    };
  },
  computed: {
    ...mapState('dataVisualizer', ['lines', 'elements']),
    disableApply() {
      return this.loading
        || !this.line
        || !this.subline
        || !this.station
        || !this.subStation
        || !this.dataType
        || !this.dateFrom
        || !this.dateTo
        || !this.selectedParameters.length;
    },
    filteredParameters() {
      if (this.search) {
        return this.parameters
          .filter((param) => param.tagDescription
            .trim()
            .toUpperCase()
            .includes(this.search.trim().toUpperCase()))
          .map(({ tagName, tagDescription }) => ({
            name: tagName,
            description: tagDescription,
          }));
      }
      return this.parameters
        .map(({ tagName, tagDescription }) => ({
          name: tagName,
          description: tagDescription,
        }));
    },
  },
  methods: {
    ...mapActions('dataVisualizer', [
      'getSublines',
      'getStations',
      'getSubStations',
    ]),
    getTags(element) {
      let tags = [];
      const elem = this.elements.find((e) => e.element.elementDescription === element);
      if (elem) {
        ({ tags } = elem);
      }
      return tags;
    },
  },
  watch: {
    async line(val) {
      this.sublineLoading = true;
      if (val) {
        this.subline = null;
        this.station = null;
        this.subStation = null;
        this.dataType = null;
        this.sublines = [];
        this.stations = [];
        this.subStations = [];
        this.dataTypes = [];
        this.parameters = [];
        this.sublines = await this.getSublines(this.line);
        if (this.sublines.length === 1) {
          this.subline = this.sublines[0].id;
        }
      }
      this.sublineLoading = false;
    },
    async subline(val) {
      this.stationLoading = true;
      if (val) {
        this.station = null;
        this.subStation = null;
        this.dataType = null;
        this.stations = [];
        this.subStations = [];
        this.dataTypes = [];
        this.parameters = [];
        this.stations = await this.getStations(this.subline);
        if (this.stations.length === 1) {
          this.station = this.stations[0].id;
        }
      }
      this.stationLoading = false;
    },
    async station(val) {
      this.subStationLoading = true;
      if (val) {
        this.subStation = null;
        this.dataType = null;
        this.subStations = [];
        this.dataTypes = [];
        this.parameters = [];
        this.subStations = await this.getSubStations(this.station);
        if (this.subStations.length === 1) {
          this.subStation = this.subStations[0].id;
        }
      }
      this.subStationLoading = false;
    },
    subStation(val) {
      if (val) {
        this.dataType = null;
        this.dataTypes = [];
        this.parameters = [];
        const filteredElems = this.elements
          .map((elem) => elem.element)
          .filter((elem) => elem.elementName.includes(val));
        this.dataTypes = filteredElems.map((e) => e.elementDescription.replace(`_${val}`, ''));
        if (this.dataTypes.length === 1) {
          [this.dataType] = this.dataTypes;
          this.parameters = this.getTags(`${this.dataType}_${val}`);
        }
      }
    },
    dataType(val) {
      if (val) {
        this.parameters = [];
        this.parameters = this.getTags(`${val}_${this.subStation}`);
      }
    },
  },
};
</script>
