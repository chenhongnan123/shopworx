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
          ref="reviewColumnCard"
          :masterTags="masterTags"
          :missingTags="missingTags"
          :matchedColumns="matchedColumns"
          v-if="reviewType === 'column' || showColumnMappings"
        />
        <review-data
          :tags="tags"
          :records="records"
          ref="reviewDataCard"
          @save="dataReviewed"
          :missingData="missingData"
          :invalidDataTypes="invalidDataTypes"
          :duplicateColumnData="duplicateColumnData"
          v-else-if="reviewType === 'data' && !showColumnMappings"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          class="text-none"
          @click="dialog = false"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          {{ $t('setup.importMaster.cancel') }}
        </v-btn>
        <v-btn
          @click="onSave"
          color="primary"
          class="text-none"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          {{ $t('setup.importMaster.save') }}
        </v-btn>
      </v-card-actions>
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
    onSave() {
      if (this.reviewType === 'column' || this.showColumnMappings) {
        this.$refs.reviewColumnCard.save();
      } else if (this.reviewType === 'data' && !this.showColumnMappings) {
        this.$refs.reviewDataCard.save();
      }
    },
  },
};
</script>
