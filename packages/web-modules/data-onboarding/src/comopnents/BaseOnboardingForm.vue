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
        :disabled="step.disabled"
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
            v-else-if="index === 2"
            @data-reviewed="onDataReviewed"
            :matchedColumns="matchedColumns"
            :importedData="importedData"
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
      elementId: null,
      importedData: [],
      fields: [],
      tagsToProvision: [],
      dataToProvision: [],
      matchedColumns: null,
      dataImported: false,
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
    ...mapActions('element', [
      'createElement',
      'createElementTags',
      'postElementRecords',
    ]),
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
      this.tagsToProvision = data.tags;
      this.dataToProvision = data.data;
      this.elementId = await this.createElement(this.element);
      if (this.elementId) {
        const tagsPayload = this.tagsToProvision.map((tag) => ({
          ...tag,
          elementId: this.elementId,
        }));
        const tagsCreated = await this.createElementTags(tagsPayload);
        if (tagsCreated) {
          const dataPayload = this.dataToProvision.map((postData) => ({
            ...postData,
            assetId: this.assetId,
          }));
          const recordsPosted = await this.postElementRecords({
            elementName: this.element.elementName,
            payload: dataPayload,
          });
          console.log(recordsPosted);
        }
      }
      // this.postElementRecords();
      // Move to next omnboarding item or next asset item
    },
  },
};
</script>
