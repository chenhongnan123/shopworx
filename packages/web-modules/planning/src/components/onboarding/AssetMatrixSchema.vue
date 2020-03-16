<template>
  <div>
    <v-expansion-panels
      flat
      hover
      accordion
      v-model="panel"
    >
      <v-expansion-panel
        :key="index"
        :disabled="step.disabled || loading"
        v-for="(step, index) in formSteps"
      >
        <v-expansion-panel-header>
          <span>
            <v-icon v-text="step.icon"></v-icon>
            <span
              v-text="$t(step.title)"
              class="ml-2"
            ></span>
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content
          :style="index === 1 ? 'height: 520px': ''"
          class="mt-1"
        >
          <select-masters
            v-if="index === 0"
            :assetId="assetId"
            @master-selected="onMasterSelect"
          />
          <generate-data
            :masters="selectedMaster"
            :masterTags="tags"
            :assetId="assetId"
            v-else-if="index === 1"
            @data-imported="onDataImport"
          />
          <select-matrix-tags
            v-else-if="index === 2"
            :fields="fields"
            @columns-matched="onColumnsMatched"
          />
          <review-data
            :loading="loading"
            v-else-if="index === 3"
            :importedData="importedData"
            @data-reviewed="onDataReviewed"
            :selectedTags="selectedTags"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SelectMasters from './asset-matrix/SelectMasters.vue';
import GenerateData from './asset-matrix/GenerateData.vue';
import SelectMatrixTags from './asset-matrix/SelectMatrixTags.vue';
import ReviewData from './asset-matrix/ReviewData.vue';

export default {
  name: 'AssetMatrixSchema',
  components: {
    SelectMasters,
    GenerateData,
    SelectMatrixTags,
    ReviewData,
  },
  props: {
    assetId: {
      type: Number,
      required: true,
    },
    element: {
      type: Object,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      panel: 0,
      fields: [],
      loading: false,
      elementId: null,
      selectedMaster: [],
      importedData: [],
      tagsToProvision: [],
      dataToProvision: [],
      masterSelected: false,
      dataImported: false,
      selectedTags: [],
      columnsMatched: false,
    };
  },
  computed: {
    formSteps() {
      return [
        {
          title: `planning.onboarding.steps.${this.element.elementName}.selectMasters`,
          icon: 'mdi-database-refresh',
          disabled: false,
        },
        {
          title: `planning.onboarding.steps.${this.element.elementName}.importData`,
          icon: 'mdi-database-import',
          disabled: !this.masterSelected,
        },
        {
          title: `planning.onboarding.steps.${this.element.elementName}.matchColumns`,
          icon: 'mdi-database-settings',
          disabled: !this.dataImported,
        },
        {
          title: `planning.onboarding.steps.${this.element.elementName}.reviewData`,
          icon: 'mdi-database-check',
          disabled: !this.columnsMatched,
        },
      ];
    },
  },
  methods: {
    ...mapActions('element', ['createBulkRecords']),
    ...mapActions('planning', ['getElements']),
    onMasterSelect(data) {
      this.selectedMaster = data;
      this.masterSelected = true;
      this.panel = 1;
    },
    onDataImport(data) {
      this.importedData = data.data;
      this.fields = data.fields;
      this.dataImported = true;
      this.panel = 2;
    },
    onColumnsMatched(data) {
      this.selectedTags = data;
      this.columnsMatched = true;
      this.panel = 3;
    },
    async onDataReviewed(data) {
      this.loading = true;
      this.tagsToProvision = data.tags;
      this.dataToProvision = data.data;
      const recordsCreated = await this.createBulkRecords({
        element: this.element,
        tags: this.tagsToProvision,
        records: this.dataToProvision,
        assetId: this.assetId,
      });
      if (recordsCreated) {
        await this.getElements();
      }
      this.loading = false;
    },
  },
};
</script>
