<template>
  <v-form ref="form" v-model="isValid" @submit.prevent="fetchData">
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
            label="Element"
            v-model="selectedElement"
            :items="detaultElements"
            item-value="id"
            item-text="name"
            :loading="loading"
            :disabled="fetching"
          ></v-select>
          <v-text-field
            label="Date from"
            dense
            v-model="dateFrom"
            type="datetime-local"
            :disabled="fetching"
            outlined
            :rules="dateFromRules"
          ></v-text-field>
          <v-text-field
            label="Date to"
            dense
            v-model="dateTo"
            type="datetime-local"
            :disabled="fetching"
            outlined
            :rules="dateToRules"
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
          text
          color="primary"
          class="text-none"
          @click="exportData"
          :disabled="disableApply || fetching || !isValid"
        >
          Export
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          type="submit"
          :disabled="disableApply || !isValid"
          :loading="fetching"
        >
          Apply filters
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapState } from 'vuex';

const REQUIRED_TAGS = ['_id', 'createdTimestamp', 'modifiedtimestamp'];
const REQUIRED_COLUMNS = [
  {
    name: '_id',
    description: 'Object ID',
  },
  {
    name: 'createdTimestamp',
    description: 'Created On',
  },
  {
    name: 'modifiedtimestamp',
    description: 'Modified On',
  },
];

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
      isValid: false,
      search: '',
      dateFrom: null,
      dateTo: null,
      selectedParameters: [],
      parameters: [],
      requiredParameters: [],
      requiredColumns: [],
      parametersLoading: false,
      dateFromRules: [() => this.isValidDate() || `Should be before ${this.dateTo}`],
      dateToRules: [() => this.isValidDate() || `Should be after ${this.dateFrom}`],
      selectedElement: null,
    };
  },
  computed: {
    ...mapState('dataVisualizer', [
      'elements',
      'fetching',
    ]),
    detaultElements() {
      return this.elements
        .map((e) => e.element.elementName)
        .sort();
    },
    disableApply() {
      return this.loading
        || !this.selectedElement
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
    isValidDate() {
      let result = true;
      if (this.dateTo && this.dateFrom) {
        const start = new Date(this.dateFrom).getTime();
        const end = new Date(this.dateTo).getTime();
        result = end > start;
      }
      return result;
    },
    getTags(element) {
      let mappedTags = [];
      this.requiredParameters = [];
      const elem = this.elements.find((e) => e.element.elementName === element);
      if (elem) {
        mappedTags = elem.tags
          .sort((a, b) => a.tagOrder - b.tagOrder)
          .map((t) => ({
            name: t.tagName,
            description: t.tagDescription,
          }));
        const tags = mappedTags.map((tag) => tag.name);
        this.requiredParameters = [...REQUIRED_TAGS, ...tags];
        this.requiredColumns = [...REQUIRED_COLUMNS];
      }
      return mappedTags;
    },
    fetchData() {
      const columns = this.parameters
        .filter((p) => this.selectedParameters.includes(p.name));
      const payload = {
        elementName: this.selectedElement,
        tags: [
          ...this.requiredParameters,
          ...this.selectedParameters,
        ],
        columns: [
          ...this.requiredColumns,
          ...columns,
        ],
        dateFrom: new Date(this.dateFrom).getTime(),
        dateTo: new Date(this.dateTo).getTime(),
      };
      this.$emit('on-fetch', payload);
    },
    exportData() {
      const payload = {
        elementName: this.selectedElement,
        fields: [
          ...REQUIRED_TAGS,
          ...this.selectedParameters,
        ].join(', '),
        dateFrom: new Date(this.dateFrom).getTime(),
        dateTo: new Date(this.dateTo).getTime(),
      };
      this.$emit('on-export', payload);
    },
  },
  watch: {
    selectedElement(val) {
      if (val) {
        this.selectedParameters = [];
        this.requiredColumns = [];
        this.parameters = [];
        this.parameters = this.getTags(val);
      }
    },
  },
};
</script>
