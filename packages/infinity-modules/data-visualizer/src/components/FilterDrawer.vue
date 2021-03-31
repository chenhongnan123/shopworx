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
          :disabled="fetching"
        ></v-select>
        <v-select
          dense
          outlined
          label="Subline"
          :items="sublines"
          item-value="id"
          item-text="name"
          v-model="subline"
          :disabled="!line || fetching"
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
          :disabled="!line || !subline || fetching"
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
          :disabled="!line || !subline || !station || fetching"
        ></v-select>
        <v-select
          dense
          outlined
          label="Data type"
          :items="dataTypes"
          item-value="name"
          item-text="description"
          v-model="dataType"
          :disabled="!line || !subline || !station || !subStation || fetching"
        ></v-select>
        <v-text-field
          label="Date from"
          dense
          v-model="dateFrom"
          type="datetime-local"
          :disabled="fetching"
          outlined
        ></v-text-field>
        <v-text-field
          label="Date to"
          dense
          v-model="dateTo"
          type="datetime-local"
          :disabled="fetching"
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
          :loading="parametersLoading"
          :disabled="fetching"
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
            :disabled="fetching"
            v-for="parameter in filteredParameters"
          ></v-checkbox>
        </perfect-scrollbar>
      </v-card-text>
    </perfect-scrollbar>
    <v-card-actions class="pl-0 pr-4">
      <v-btn
        block
        color="primary"
        @click="fetchData"
        :disabled="disableApply"
        :loading="fetching"
      >
        Apply
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

// const PROCESS_TYPES = ['11', '38', '42', '45'];
// const PRODUCTION_TYPES = ['15', '17', '18'];
const REQUIRED_TAGS = ['mainid', 'timestamp'];

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
      // allParameters: [],
      sublineLoading: false,
      stationLoading: false,
      subStationLoading: false,
      parametersLoading: false,
    };
  },
  computed: {
    ...mapState('dataVisualizer', [
      'lines',
      'elements',
      'fetching',
    ]),
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
          .filter((param) => param.description
            .trim()
            .toUpperCase()
            .includes(this.search.trim().toUpperCase()))
          .map(({ name, description }) => ({
            name,
            description,
          }));
      }
      return this.parameters
        .map(({ name, description }) => ({
          name,
          description,
        }));
    },
  },
  methods: {
    ...mapActions('dataVisualizer', [
      'getSublines',
      'getStations',
      'getSubStations',
      // 'getParameters',
    ]),
    getTags(element) {
      let tags = [];
      const elem = this.elements.find((e) => e.element.elementName === element);
      if (elem) {
        tags = elem.tags
          .sort((a, b) => a.tagOrder - b.tagOrder)
          .map((t) => ({
            name: t.tagName,
            description: t.tagDescription,
            dataType: t.emgTagType,
          }))
          .filter((t) => !REQUIRED_TAGS.includes(t.name));
      }
      return tags;
    },
    fetchData() {
      const columns = this.parameters
        .filter((p) => this.selectedParameters.includes(p.name));
      const payload = {
        elementName: `${this.dataType}_${this.subStation}`,
        tags: [
          ...REQUIRED_TAGS,
          ...this.selectedParameters,
        ],
        columns: [
          { name: 'mainid', description: 'Main ID', dataType: 'String' },
          { name: 'timestamp', description: 'Timestamp', dataType: 'Datetime' },
          ...columns,
        ],
        dateFrom: new Date(this.dateFrom).getTime(),
        dateTo: new Date(this.dateTo).getTime(),
      };
      this.$emit('on-fetch', payload);
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
        this.selectedParameters = [];
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
        this.selectedParameters = [];
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
        this.selectedParameters = [];
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
      // this.parametersLoading = true;
      if (val) {
        this.dataType = null;
        this.selectedParameters = [];
        this.dataTypes = [];
        this.parameters = [];
        const filteredElems = this.elements
          .map((elem) => elem.element)
          .filter((elem) => elem.elementName.includes(val));
        this.dataTypes = filteredElems.map((e) => ({
          name: e.elementName.replace(`_${val}`, ''),
          description: e.elementDescription.replace(`_${val}`, ''),
        }));
        if (this.dataTypes.length === 1) {
          [this.dataType] = this.dataTypes;
        }
        /* this.allParameters = await this.getParameters(this.subStation);
        this.parametersLoading = false; */
      }
    },
    dataType(val) {
      if (val) {
        this.selectedParameters = [];
        this.parameters = [];
        /* this.parameters = this.allParameters.filter((p) => {
          if (val.toUpperCase() === 'PROCESS') {
            return PROCESS_TYPES.includes(p.parametercategory);
          }
          if (val.toUpperCase() === 'PRODUCTION') {
            return PRODUCTION_TYPES.includes(p.parametercategory);
          }
          return false;
        }); */
        this.parameters = this.getTags(`${val}_${this.subStation}`);
      }
    },
  },
};
</script>
