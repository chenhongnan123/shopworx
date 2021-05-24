<template>
  <v-dialog
    scrollable
    persistent
    id="importmaster"
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="headline">
        Import CSV file
      </v-card-title>
      <v-card-text>
        <div>{{ message }}</div>
        <review-master-data
          :tags="records"
          :records="masterData"
          :reviewType="reviewType"
          :missingTags="missingTags"
          :missingData="missingData"
          :matchedColumns="matchedColumns"
          @file-imported="processFileReview"
          @data-reviewed="validateData"
          :invalidDataTypes="invalidDataTypes"
          @column-reviewed="processColumnReview"
          :duplicateColumnData="duplicateColumnData"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="closeDialog"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable */
import { mapActions, mapMutations } from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';
import ReviewMasterData from './ReviewMasterData.vue';

export default {
  name: 'ImportMasterData',

  props: {
    id: {
      type: String,
    },
    records: {
      type: Array,
    },
  },
  components: {
    ReviewMasterData,
  },
  data() {
    return {
      tags: null,
      file: null,
      message: '',
      error: false,
      dialog: false,
      reviewType: '',
      mappedTags: null,
      masterData: null,
      missingTags: null,
      missingData: null,
      importedRows: null,
      matchedColumns: null,
      importedColumns: null,
      invalidDataTypes: null,
      duplicateColumnData: null,
    };
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('element', ['postBulkRecords']),
    async importCSV(e) {
      this.file = e && e !== undefined ? e.target.files[0] : null;
      if (this.file) {
        this.dialog = true;
        await this.processFileUpload();
      }
    },
    async processFileUpload() {
      await this.mapFile();
      if (this.importedRows && this.importedRows.length
        && this.importedColumns && this.importedColumns.length) {
        this.mapColumns();
        this.validateColumns();
        if (this.mappedTags) {
          await this.mapData();
        }
      }
    },
    async mapFile() {
      this.message = this.$i18n.t('setup.importMaster.parsing');
      if (this.file) {
        const csvParser = new CSVParser();
        try {
          const extractedData = await csvParser.parse(this.file);
          this.importedRows = extractedData.data;
          this.importedColumns = extractedData.meta.fields
            .map((field) => field.trim());
          if (this.importedColumns && this.importedColumns.length === 0) {
            this.error = true;
            this.file = null;
            this.message = this.$i18n.t('setup.importMaster.missingHeaders');
          } else if (this.importedRows && this.importedRows.length === 0) {
            this.error = true;
            this.file = null;
            this.message = this.$i18n.t('setup.importMaster.missingData');
          }
        } catch (e) {
          this.error = true;
          this.message = this.$i18n.t('setup.importMaster.fileUnparsable');
        }
      } else {
        this.error = true;
        this.message = this.$i18n.t('setup.importMaster.fileNotFound', { file: this.expectedFileName });
        this.message = `File ${this.expectedFileName} not found!`;
      }
    },
    mapColumns() {
      this.message = this.$i18n.t('setup.importMaster.mapping');
      this.matchedColumns = this.importedColumns.map((column) => {
        const matchedTag = this.records.find((tag) => tag.tagDescription === column.replace("*", ""));
        let tagName = null;
        if (matchedTag) {
          ({ tagName } = matchedTag);
        }
        return {
          column,
          tagName,
          ignore: !tagName,
        };
      });

      this.validateColumns();
    },
    validateColumns() {
      const matchedTagNames = this.matchedColumns.map((col) => col.tagName);
      const unmatchedColumns = this.records
        .filter((tag) => !matchedTagNames.includes(tag.tagName));
      const matchedTags = Object.values(this.mapTags());
      const uniqueTags = [...new Set(matchedTags)];
      this.missingTags = unmatchedColumns
        .filter((tag) => tag.required)
        .map((tag) => tag.tagDescription);
      if (this.missingTags && this.missingTags.length) {
        this.error = true;
        this.reviewType = 'column';
        this.message = `Missing required columns -${this.missingTags[0]}
        ${this.missingTags.length > 1 ? 'and more' : ''}!`;
      } else if (matchedTags.length !== uniqueTags.length) {
        this.error = true;
        this.reviewType = 'column';
        this.message = 'Column names are not unique!';
      } else {
        this.mappedTags = this.mapTags();
      }
    },
    mapTags() {
      return this.matchedColumns
        .filter((item) => !item.ignore && item.tagName)
        .reduce((acc, cur) => {
          acc[cur.column] = cur.tagName;
          return acc;
        }, {});
    },
    async mapData() {
      const filteredData = this.importedRows.map((row) => this.filterData(row));
      this.masterData = filteredData.map((data) => this.mapRow(data));
      this.tags = this.masterData
        .filter((tag) => Object.values(this.mappedTags).includes(tag.tagName));
      await this.validateData();
    },
    filterData(obj) {
      return Object.keys(this.mappedTags)
        .map((k) => (k in obj ? { [k]: obj[k] } : null))
        .reduce((res, o) => Object.assign(res, o), {});
    },
    mapRow(obj) {
      return Object.keys(obj).reduce((acc, key) => ({
        ...acc,
        ...{ [this.mappedTags[key] || key]: obj[key] },
      }), {});
    },
    async validateData() {
      this.missingData = this.missingRequiredData();
      // this.duplicateColumnData = this.duplicateData();
      this.invalidDataTypes = this.validateDataType();
      if (this.missingData && this.missingData.length) {
        this.error = true;
        this.reviewType = 'data';
        this.message = `Missing required data for ${this.missingData[0].tag}
          at row ${this.missingData[0].row} ${this.missingData.length > 1 ? 'and more' : ''}!`;
        this.$emit('on-validation', !this.error);
      } else if (this.duplicateColumnData && this.duplicateColumnData.length) {
        this.error = true;
        this.reviewType = 'data';
        this.message = `Duplicate data for ${this.duplicateColumnData[0]}
          ${this.duplicateColumnData.length > 1 ? 'and more' : ''}!`;
        this.$emit('on-validation', !this.error);
      } else if (this.invalidDataTypes && this.invalidDataTypes.length) {
        this.error = true;
        this.reviewType = 'data';
        this.message = `Invalid data type for ${this.invalidDataTypes[0]}
          ${this.invalidDataTypes.length > 1 ? 'and more' : ''}!`;
        this.$emit('on-validation', !this.error);
      } else {
        await this.createRecords();
      }
    },
    missingRequiredData() {
      const res = [];
      this.masterData.forEach((d, r) => {
        this.records.forEach((t) => {
          if (t.required) {
            const val = d[t.tagName];
            if (val === null || val === '' || val === undefined) {
              res.push({ row: r + 1, tag: t.tagDescription });
            }
          }
        });
      });
      return res;
    },
    // duplicateData() {
    //   const res = [];
    //   this.masterData.forEach((t) => {
    //     if (t.tagName === this.masterElement.uniqueTagName) {
    //       const matchedRecords = this.records.map((rec) => rec[t.tagName]);
    //       const uniqueRecords = [...new Set(matchedRecords)];
    //       if (matchedRecords.length !== uniqueRecords.length) {
    //         res.push(t.tagDescription);
    //       }
    //     }
    //   });
    //   return res;
    // },
    validateDataType() {
      const res = [];
      this.records.forEach((t) => {
        const matchedRecords = this.masterData.map((rec) => rec[t.tagName]);
        if (
          t.emgTagType.toLowerCase() === 'int'
          || t.emgTagType.toLowerCase() === 'long'
          || t.emgTagType.toLowerCase() === 'duration'
        ) {
          const invalid = matchedRecords.some((rec) => rec % 1 !== 0);
          if (invalid) {
            res.push(`${t.tagDescription}(Number)`);
          }
        } else if (
          t.emgTagType.toLowerCase() === 'float'
          || t.emgTagType.toLowerCase() === 'double'
        ) {
          const invalid = matchedRecords.some((rec) => Number.isNaN(rec - parseFloat(rec)));
          if (invalid) {
            res.push(`${t.tagDescription}(Decimal)`);
          }
        } else if (t.emgTagType.toLowerCase() === 'boolean') {
          const truthyValues = ['true', 'false', true, false];
          const invalid = matchedRecords.some((rec) => {
            if (rec) {
              return !truthyValues.includes(rec.toLowerCase());
            }
            return true;
          });
          if (invalid) {
            res.push(`${t.tagDescription}(Boolean)`);
          }
        }
      });
      return res;
    },
    async createRecords() {
      this.message = this.$i18n.t('setup.importMaster.importing');
      const recordsCreated = await this.postBulkRecords({
        elementName: this.id,
        payload: this.masterData,
      });

      if (recordsCreated) {
        this.error = false;
        this.message = 'Record imported successfully!';
        this.setAlert({
          show: true,
          type: 'success',
          message: 'CREATED_RECORD',
        });
        this.dialog = false;
        this.$emit('on-imported');
        this.$emit('on-validation', !this.error);
      } else {
        this.error = true;
        this.reviewType = 'connection';
        this.message = this.$i18n.t('setup.importMaster.recordsNotCreated');
        this.$emit('on-validation', !this.error);
      }
    },
    async processColumnReview(matchedColumns) {
      this.matchedColumns = matchedColumns;
      this.validateColumns();
      if (this.mappedTags) {
        await this.mapData();
      }
    },
    async processFileReview(file) {
      this.file = file;
      await this.mapFile();
      if (this.importedRows && this.importedRows.length
        && this.importedColumns && this.importedColumns.length) {
        this.mapColumns();
        this.validateColumns();
        if (this.mappedTags) {
          await this.mapData();
        }
      }
    },
    closeDialog() {
      this.dialog = false;
      this.$emit('on-close-dialog');
    }
  },
};
</script>
