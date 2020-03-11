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
          :style="index === 0 ? 'height: 520px': ''"
          class="mt-1"
        >
          <import-onboarding-data
            :tags="tags"
            v-if="index === 0"
            @is-valid-data="onVaildData"
            @data-imported="onDataImport"
          />
          <match-onboarding-columns
            :tags="tags"
            v-else-if="index === 1"
            :fields="fields"
            @columns-matched="onColumnsMatched"
          />
          <review-onboarding-data
            :tags="tags"
            :loading="loading"
            v-else-if="index === 2"
            :importedData="importedData"
            @data-reviewed="onDataReviewed"
            :matchedColumns="matchedColumns"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ImportOnboardingData from './base/ImportOnboardingData.vue';
import MatchOnboardingColumns from './base/MatchOnboardingColumns.vue';
import ReviewOnboardingData from './base/ReviewOnboardingData.vue';

export default {
  name: 'OnboardingForm',
  components: {
    ImportOnboardingData,
    MatchOnboardingColumns,
    ReviewOnboardingData,
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
      importedData: [],
      tagsToProvision: [],
      dataToProvision: [],
      dataImported: false,
      matchedColumns: null,
      columnsMatched: false,
    };
  },
  computed: {
    formSteps() {
      return [
        {
          title: `onboarding.steps.${this.element.elementName}.importData`,
          icon: 'mdi-database-import',
          disabled: false,
        },
        {
          title: `onboarding.steps.${this.element.elementName}.matchColumns`,
          icon: 'mdi-database-settings',
          disabled: !this.dataImported,
        },
        {
          title: `onboarding.steps.${this.element.elementName}.reviewData`,
          icon: 'mdi-database-check',
          disabled: !this.columnsMatched,
        },
      ];
    },
  },
  methods: {
    ...mapActions('element', ['createBulkRecords']),
    ...mapActions('onboarding', ['getElements']),
    onVaildData(val) {
      if (!val) {
        this.dataImported = false;
      }
    },
    onDataImport(data) {
      this.importedData = data.data;
      this.fields = data.fields;
      this.dataImported = true;
      this.panel = 1;
    },
    onColumnsMatched(data) {
      this.matchedColumns = data;
      this.columnsMatched = true;
      this.panel = 2;
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
