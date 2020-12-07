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
        small
        outlined
        v-on="on"
        color="primary"
        class="text-none"
      >
        {{ $t('planning.setup.importMaster.review') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        {{ $t('planning.setup.importMaster.reviewTitle', { title }) }}
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
          @row-selected="toggleDelete"
          :invalidDataTypes="invalidDataTypes"
          :invalidPartMatrix="invalidPartMatrix"
          v-else
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="primary"
          class="text-none"
          @click="showColumnMappings = true"
          v-if="reviewType === 'data' && !showColumnMappings"
        >
          {{ $t('planning.setup.importMaster.updateColumns') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="error"
          class="text-none"
          @click="onDelete"
          v-if="rowsSelected && reviewType === 'data' && !showColumnMappings"
        >
          {{ $t('planning.setup.importMaster.delete') }}
        </v-btn>
        <v-btn
          @click="onSave"
          color="primary"
          class="text-none"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          {{ $t('planning.setup.importMaster.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ReviewColumn from './ReviewColumn.vue';
import ReviewData from './ReviewData.vue';

export default {
  name: 'ReviewPlans',
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
    invalidPartMatrix: {
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
      rowsSelected: false,
      showColumnMappings: false,
    };
  },
  methods: {
    columnReviewed(matchedColumns) {
      this.$emit('column-reviewed', matchedColumns);
      this.dialog = false;
      this.showColumnMappings = false;
    },
    dataReviewed(data) {
      this.$emit('data-reviewed', data);
      this.dialog = false;
    },
    toggleDelete(e) {
      this.rowsSelected = e;
    },
    onDelete() {
      this.$refs.reviewDataCard.deleteSelectedRows();
    },
    onSave() {
      if (this.reviewType === 'column' || this.showColumnMappings) {
        this.$refs.reviewColumnCard.save();
      } else {
        this.$refs.reviewDataCard.save();
      }
    },
  },
};
</script>
