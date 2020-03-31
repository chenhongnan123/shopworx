<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :overlay="false"
    max-width="700px"
    transition="dialog-transition"
  >
    <template #activator="{ on }">
      <v-btn
        text
        v-on="on"
        color="primary"
        class="text-none pa-0"
      >
        {{ $t('setup.importMaster.review') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        {{ $t('setup.importMaster.reviewTitle', { title }) }}
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          class="text-none"
          @click="showColumnMappings = true"
          v-if="reviewType === 'data' && !showColumnMappings"
        >
          {{ $t('setup.importMaster.updateColumns') }}
        </v-btn>
        <v-btn
          text
          color="primary"
          class="text-none"
          @click="uploadFile"
        >
          {{ $t('setup.importMaster.reimport') }}
        </v-btn>
        <input
          type="file"
          accept=".csv"
          ref="uploader"
          class="d-none"
          @change="onFileChanged"
        >
      </v-card-title>
      <v-card-text class="pa-0">
        <review-column
          @save="columnReviewed"
          :masterTags="masterTags"
          :missingTags="missingTags"
          @cancel="dialog = false"
          v-if="reviewType === 'column' || showColumnMappings"
          :matchedColumns="matchedColumns"
        />
        <review-data
          :tags="tags"
          :records="records"
          @save="dataReviewed"
          :missingData="missingData"
          @cancel="dialog = false"
          v-else-if="reviewType === 'data' && !showColumnMappings"
          :invalidDataTypes="invalidDataTypes"
          :duplicateColumnData="duplicateColumnData"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ReviewColumn from './ReviewColumn.vue';
import ReviewData from './ReviewData.vue';

export default {
  name: 'ReviewMasterData',
  props: {
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: () => [],
    },
    records: {
      type: Array,
      default: () => [],
    },
    masterTags: {
      type: Array,
      default: () => [],
    },
    reviewType: {
      type: String,
      required: true,
    },
    missingData: {
      type: Array,
      default: () => [],
    },
    missingTags: {
      type: Array,
      default: () => [],
    },
    matchedColumns: {
      type: Array,
      default: () => [],
    },
    invalidDataTypes: {
      type: Array,
      default: () => [],
    },
    duplicateColumnData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ReviewColumn,
    ReviewData,
  },
  data() {
    return {
      dialog: false,
      showColumnMappings: false,
    };
  },
  methods: {
    uploadFile() {
      this.$refs.uploader.click();
    },
    onFileChanged(e) {
      const file = e && e !== undefined ? e.target.files[0] : null;
      // e.target.value = '';
      if (file) {
        this.$emit('file-imported', file);
        this.dialog = false;
      }
    },
    columnReviewed(matchedColumns) {
      this.$emit('column-reviewed', matchedColumns);
      this.dialog = false;
      this.showColumnMappings = false;
    },
    dataReviewed(data) {
      this.$emit('data-reviewed', data);
      this.dialog = false;
    },
  },
};
</script>
