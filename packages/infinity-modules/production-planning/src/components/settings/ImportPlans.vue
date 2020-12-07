<template>
  <div>
    <portal to="settings-header">
      <span>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none"
          @click="downloadCSV"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          <v-icon
            left
            small
            v-text="'mdi-download-outline'"
          ></v-icon>
        Download CSV template
        </v-btn>
      </span>
    </portal>
    <v-responsive :max-width="400">
      <v-file-input
        filled
        hide-details
        single-line
        ref="fileupload"
        label="Select file from your computer"
        prepend-inner-icon="mdi-upload-outline"
        prepend-icon=""
        @change="onFileChanged"
      ></v-file-input>
    </v-responsive>
    <div class="caption">
      You can import plans in CSV format.
    </div>
    <div v-if="fileImported" class="mt-4">
      <div class="mb-2">
        {{ message }}
      </div>
      <review-plans
        :tags="tags"
        title="Plans"
        :records="records"
        :masterTags="masterTags"
        :reviewType="reviewType"
        :missingTags="missingTags"
        :missingData="missingData"
        :matchedColumns="matchedColumns"
        @data-reviewed="processDataReview"
        :invalidDataTypes="invalidDataTypes"
        :invalidPartMatrix="invalidPartMatrix"
        @column-reviewed="processColumnReview"
      />
    </div>
    <v-btn
      class="text-none mt-8"
      color="primary"
      :disabled="loading || error || !file"
      @click="importRecords"
    >
      Import
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';
import ReviewPlans from './validate-import/ReviewPlans.vue';

export default {
  name: 'ImportPlans',
  components: {
    ReviewPlans,
  },
  data() {
    return {
      fileImported: false,
      tags: null,
      file: null,
      message: '',
      error: false,
      loading: false,
      saving: false,
      records: null,
      reviewType: '',
      mappedTags: null,
      missingTags: null,
      missingData: null,
      importedRows: null,
      matchedColumns: null,
      importedColumns: null,
      invalidDataTypes: null,
      invalidPartMatrix: null,
      masterTags: [{
        tagName: 'partname',
        tagDescription: 'Part name',
        required: true,
        emgTagType: 'string',
      }, {
        tagName: 'machinename',
        tagDescription: 'Machine name',
        required: true,
        emgTagType: 'string',
      }, {
        tagName: 'equipmentname',
        tagDescription: 'Equipment name',
        required: true,
        emgTagType: 'string',
      }, {
        tagName: 'plannedquantity',
        tagDescription: 'Quantity',
        required: true,
        emgTagType: 'int',
      }, {
        tagName: 'scheduledstart',
        tagDescription: 'Scheduled start (DD-MM-YYYY HH:mm)',
        required: true,
        emgTagType: 'date',
      }],
    };
  },
  computed: {
    ...mapGetters('productionPlanning', ['partMatrixTags']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionPlanning', [
      'fetchPartMatrix',
      'fetchLastPlan',
      'getScheduledEnd',
      'createPlans',
    ]),
    async importRecords() {
      this.saving = true;
      const payload = await Promise.all(this.records.map(async ({ equipmentname, ...rec }) => ({
        ...rec,
        scheduledstart: new Date(rec.scheduledstart).getTime(),
        scheduledend: await this.fetchEstimatedEnd(rec),
      })));
      const created = await this.createPlans(payload);
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PLAN_IMPORTED',
        });
        this.$refs.fileupload.value = null;
        this.file = null;
        this.fileImported = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_CREATING_PLAN',
        });
      }
      this.saving = false;
    },
    async fetchEstimatedEnd(plan) {
      const {
        plannedquantity, scheduledstart, activecavity, stdcycletime,
      } = plan;
      if (plannedquantity && scheduledstart) {
        const runTime = (+plannedquantity / +activecavity)
          * (+stdcycletime * 1000);
        return this.getScheduledEnd({
          start: new Date(scheduledstart).getTime(),
          duration: runTime,
        });
      }
      return '';
    },
    generateCSV({ fields, data = [] }) {
      const csvParser = new CSVParser();
      const content = csvParser.unparse({ fields, data });
      return content;
    },
    downloadCSV() {
      const fileName = 'import-plans-template.csv';
      const fields = this.masterTags.map((t) => t.tagDescription);
      const content = this.generateCSV({ fields });
      const blob = new Blob([content]);
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob, { type: 'text/plain' });
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    async onFileChanged(e) {
      this.file = e && e !== undefined ? e : null;
      if (this.file) {
        this.fileImported = true;
        await this.processFileUpload();
      } else {
        this.fileImported = false;
      }
    },
    async processFileUpload() {
      this.loading = true;
      await this.mapFile();
      if (this.importedRows && this.importedRows.length
        && this.importedColumns && this.importedColumns.length) {
        this.mapColumns();
        this.validateColumns();
        if (this.mappedTags) {
          await this.mapData();
        }
      }
      this.loading = false;
    },
    async mapFile() {
      this.message = this.$i18n.t('planning.setup.importMaster.parsing');
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
            this.message = this.$i18n.t('planning.setup.importMaster.missingHeaders');
          } else if (this.importedRows && this.importedRows.length === 0) {
            this.error = true;
            this.file = null;
            this.message = this.$i18n.t('planning.setup.importMaster.missingData');
          }
        } catch (e) {
          this.error = true;
          this.message = this.$i18n.t('planning.setup.importMaster.fileUnparsable');
        }
      } else {
        this.error = true;
        this.message = this.$i18n.t('planning.setup.importMaster.fileNotFound', { file: this.expectedFileName });
        this.message = `File ${this.expectedFileName} not found!`;
      }
    },
    mapColumns() {
      this.message = this.$i18n.t('planning.setup.importMaster.mapping');
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
      this.invalidDataTypes = this.validateDataType();
      this.invalidPartMatrix = await this.validatePartMatrix();
      if (this.missingData && this.missingData.length) {
        this.error = true;
        this.reviewType = 'data';
        this.message = `Missing required data for ${this.missingData[0].tag}
          at row ${this.missingData[0].row} ${this.missingData.length > 1 ? 'and more' : ''}!`;
      } else if (this.invalidDataTypes && this.invalidDataTypes.length) {
        this.error = true;
        this.reviewType = 'data';
        this.message = `Invalid data type for ${this.invalidDataTypes[0]}
          ${this.invalidDataTypes.length > 1 ? 'and more' : ''}!`;
      } else if (this.invalidPartMatrix && this.invalidPartMatrix.length) {
        this.error = true;
        this.reviewType = 'data';
        this.message = `Invalid part matrix at ${this.invalidPartMatrix[0].row}
          ${this.invalidPartMatrix.length > 1 ? 'and more' : ''}!`;
      } else {
        this.message = 'Data successfully reviewed!';
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
    async setSortIndex() {
      const lastPlan = await this.fetchLastPlan();
      if (lastPlan) {
        return lastPlan.sortindex + 100;
      }
      return 100;
    },
    async validatePartMatrix() {
      const res = [];
      await Promise.all(this.records.map(async (rec, index) => {
        const partMatrixList = await this.fetchPartMatrix({ partname: rec.partname });
        if (partMatrixList && partMatrixList.length) {
          const selectedMatrix = partMatrixList.find((m) => (
            m.partname === rec.partname
            && m.machinename === rec.machinename
            && (m.equipmentname === rec.equipmentname)
          ));
          if (selectedMatrix) {
            const matrixTags = this.partMatrixTags(selectedMatrix.assetid);
            const partMatrix = matrixTags.reduce((acc, cur) => {
              acc[cur.tagName] = selectedMatrix[cur.tagName];
              return acc;
            }, {});
            let sortindex = 0;
            if (index === 0) {
              sortindex = await this.setSortIndex();
            } else {
              ({ sortindex } = this.records[index - 1]);
            }
            this.records[index] = {
              ...rec,
              ...partMatrix,
              sortindex,
              assetid: selectedMatrix.assetid,
              activecavity: partMatrix.cavity,
              starred: false,
              trial: false,
              status: 'notStarted',
            };
          } else {
            res.push({ row: index + 1 });
          }
        } else {
          res.push({ row: index + 1 });
        }
      }));
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
        } else if (t.emgTagType.toLowerCase() === 'date') {
          const isDateTime = (rec) => {
            const [date, time] = rec.toString().split(' ');
            if (date && time) {
              const [day, month, year] = date.split('-');
              const [hr, min] = time.split(':');
              return new Date(year, month - 1, day, hr, min, 0).toString() !== 'Invalid Date';
            }
            return false;
          };
          const invalid = matchedRecords.some((rec) => !isDateTime(rec));
          if (invalid) {
            res.push(`${t.tagDescription}`);
          }
        }
      });
      return res;
    },
    async createRecords() {
      this.message = this.$i18n.t('planning.setup.importMaster.importing');
      const recordsCreated = await this.createBulkRecords({
        element: this.masterElement,
        tags: [...this.tags, ...this.hiddenTags],
        records: this.records,
        assetId: this.assetId,
      });
      if (recordsCreated) {
        this.error = false;
        this.message = this.$i18n.tc('planning.setup.importMaster.recordsImported', this.records.length);
      } else {
        this.error = true;
        this.reviewType = 'connection';
        this.message = this.$i18n.t('planning.setup.importMaster.recordsNotCreated');
      }
    },
    async processColumnReview(matchedColumns) {
      this.loading = true;
      this.matchedColumns = matchedColumns;
      this.validateColumns();
      if (this.mappedTags) {
        await this.mapData();
      }
      this.loading = false;
    },
    async processDataReview(records) {
      this.loading = true;
      this.records = records;
      await this.validateData();
      this.loading = false;
    },
  },
};
</script>
