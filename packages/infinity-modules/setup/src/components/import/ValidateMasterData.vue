<template>
  <div>
    <span>
      {{ message }}
    </span>
    <div v-if="error">
      <template v-if="!file || reviewType === 'connection'">
        <v-btn
          text
          color="primary"
          class="text-none pa-0"
          @click="uploadFile"
        >
          {{ $t('setup.importMaster.importFile') }}
        </v-btn>
        <input
          type="file"
          accept=".csv"
          ref="uploader"
          class="d-none"
          @change="onFileChanged"
        >
      </template>
      <template v-else>
        <review-master-data
          :tags="tags"
          :title="title"
          :records="records"
          :masterTags="masterTags"
          :reviewType="reviewType"
          :missingTags="missingTags"
          :missingData="missingData"
          :matchedColumns="matchedColumns"
          @file-imported="processFileReview"
          @data-reviewed="processDataReview"
          :invalidDataTypes="invalidDataTypes"
          @column-reviewed="processColumnReview"
          :duplicateColumnData="duplicateColumnData"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';
import ReviewMasterData from './ReviewMasterData.vue';

export default {
  name: 'ValidateMasterData',
  props: {
    files: {
      type: FileList,
      required: true,
    },
    data: {
      type: Object,
      required: true,
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
      records: null,
      reviewType: '',
      mappedTags: null,
      missingTags: null,
      missingData: null,
      importedRows: null,
      matchedColumns: null,
      importedColumns: null,
      invalidDataTypes: null,
      duplicateColumnData: null,
    };
  },
  computed: {
    masterElement() {
      return this.data.element;
    },
    masterTags() {
      return this.data.tags;
    },
    hiddenTags() {
      return this.data.hiddenTags;
    },
    assetId() {
      return this.data.assetId;
    },
    expectedFileName() {
      return this.data.expectedFileName;
    },
    title() {
      return this.data.title;
    },
    index() {
      return this.data.index;
    },
  },
  async created() {
    this.$emit('on-loading', true);
    this.message = this.$i18n.t('setup.importMaster.starting');
    const records = await this.getElementRecords({
      assetId: this.assetId,
      elementName: this.masterElement.elementName,
    });
    if (records && records.length) {
      this.error = false;
      this.$emit('on-validation', !this.error);
      this.message = this.$i18n.tc('setup.importMaster.recordsExist', records.length);
    } else {
      this.file = Array.from(this.files).find((f) => f.name === this.expectedFileName);
      await this.processFileUpload();
    }
    this.$emit('on-loading', false);
  },
  methods: {
    ...mapActions('setup', ['getElementRecords']),
    ...mapActions('element', ['createBulkRecords']),
    uploadFile() {
      this.$refs.uploader.click();
    },
    async onFileChanged(e) {
      this.file = e && e !== undefined ? e.target.files[0] : null;
      // e.target.value = '';
      if (this.file) {
        await this.processFileUpload();
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
            this.$emit('on-validation', !this.error);
          } else if (this.importedRows && this.importedRows.length === 0) {
            this.error = true;
            this.file = null;
            this.message = this.$i18n.t('setup.importMaster.missingData');
            this.$emit('on-validation', !this.error);
          }
        } catch (e) {
          this.error = true;
          this.message = this.$i18n.t('setup.importMaster.fileUnparsable');
          this.$emit('on-validation', !this.error);
        }
      } else {
        this.error = true;
        this.$emit('on-validation', !this.error);
        this.message = this.$i18n.t('setup.importMaster.fileNotFound', { file: this.expectedFileName });
        this.message = `File ${this.expectedFileName} not found!`;
      }
    },
    mapColumns() {
      this.message = this.$i18n.t('setup.importMaster.mapping');
      this.matchedColumns = this.importedColumns.map((column) => {
        const matchedTag = this.masterTags.find((tag) => tag.tagDescription === column);
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
      const unmatchedColumns = this.masterTags
        .filter((tag) => !matchedTagNames.includes(tag.tagName));
      const matchedTags = Object.values(this.mapTags());
      const uniqueTags = [...new Set(matchedTags)];
      this.missingTags = unmatchedColumns
        .filter((tag) => tag.required)
        .map((tag) => tag.tagDescription);
      if (this.missingTags && this.missingTags.length) {
        this.error = true;
        this.reviewType = 'column';
        this.message = `Missing required colunms -${this.missingTags[0]}
        ${this.missingTags.length > 1 ? 'and more' : ''}!`;
        this.$emit('on-validation', !this.error);
      } else if (matchedTags.length !== uniqueTags.length) {
        this.error = true;
        this.reviewType = 'column';
        this.message = 'Column names are not unique!';
        this.$emit('on-validation', !this.error);
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
      this.records = filteredData.map((data) => this.mapRow(data));
      this.tags = this.masterTags
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
      this.duplicateColumnData = this.duplicateData();
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
        this.message = `Duplicate data for ${this.duplicateColumnData[0].tag}
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
      this.records.forEach((d, r) => {
        this.tags.forEach((t) => {
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
    duplicateData() {
      const res = [];
      this.tags.forEach((t) => {
        if (t.unique) {
          const matchedRecords = this.records.map((rec) => rec[t.tagName]);
          const uniqueRecords = [...new Set(matchedRecords)];
          if (matchedRecords.length !== uniqueRecords) {
            res.push(t.tagDescription);
          }
        }
      });
      return res;
    },
    validateDataType() {
      const res = [];
      this.tags.forEach((t) => {
        const matchedRecords = this.records.map((rec) => rec[t.tagName]);
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
          const invalid = matchedRecords.some((rec) => Number.isNaN(rec));
          if (invalid) {
            res.push(`${t.tagDescription}(Decimal)`);
          }
        } else if (t.emgTagType.toLowerCase() === 'boolean') {
          const truthyValues = ['true', 'false', true, false];
          const invalid = matchedRecords.some((rec) => !truthyValues.includes(rec.toLowerCase()));
          if (invalid) {
            res.push(`${t.tagDescription}(Boolean)`);
          }
        }
      });
      return res;
    },
    async createRecords() {
      this.message = this.$i18n.t('setup.importMaster.importing');
      const recordsCreated = await this.createBulkRecords({
        element: this.masterElement,
        tags: [...this.tags, ...this.hiddenTags],
        records: this.records,
        assetId: this.assetId,
      });
      if (recordsCreated) {
        this.error = false;
        this.message = this.$i18n.tc('setup.importMaster.recordsImported', this.records.length);
        this.$emit('on-validation', !this.error);
      } else {
        this.error = true;
        this.reviewType = 'connection';
        this.message = this.$i18n.t('setup.importMaster.recordsNotCreated');
        this.$emit('on-validation', !this.error);
      }
    },
    async processFileUpload() {
      this.$emit('on-loading', true);
      await this.mapFile();
      if (this.importedRows && this.importedRows.length
        && this.importedColumns && this.importedColumns.length) {
        this.mapColumns();
        this.validateColumns();
        if (this.mappedTags) {
          await this.mapData();
        }
      }
      this.$emit('on-loading', false);
    },
    async processFileReview(file) {
      this.$emit('on-loading', true);
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
      this.$emit('on-loading', false);
    },
    async processColumnReview(matchedColumns) {
      this.$emit('on-loading', true);
      this.matchedColumns = matchedColumns;
      this.validateColumns();
      if (this.mappedTags) {
        await this.mapData();
      }
      this.$emit('on-loading', false);
    },
    async processDataReview(records) {
      this.$emit('on-loading', true);
      this.records = records;
      await this.validateData();
      this.$emit('on-loading', false);
    },
  },
};
</script>
