<template>
  <div>
    <span>
      {{ message }}
    </span>
    <v-btn
      text
      small
      v-if="error"
      color="primary"
      class="text-none"
    >
      Review
    </v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';

export default {
  name: 'ReviewMasterData',
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
  data() {
    return {
      file: null,
      columns: [],
      message: '',
      error: false,
      reviewedData: [],
      reviewedTags: [],
      extractedData: null,
      matchedColumns: null,
    };
  },
  computed: {
    tagsNotInMatchedColumns() {
      const tagNames = this.columns.map((col) => col.tagName);
      return this.data.tags.filter((tag) => !tagNames.includes(tag.tagName));
    },
  },
  async created() {
    this.$emit('on-loading', {
      index: this.data.index,
      loading: true,
    });
    this.message = 'Starting...';
    const records = await this.getElementRecords({
      assetId: this.data.assetId,
      elementName: this.data.element.elementName,
    });
    if (records && records.length) {
      this.$emit('on-review', {
        index: this.data.index,
        success: true,
      });
      this.message = 'Records already exist!';
    } else {
      this.file = Array.from(this.files).find((f) => f.name === this.data.expectedFileName);
      await this.processData();
    }
    this.$emit('on-loading', {
      index: this.data.index,
      loading: false,
    });
  },
  methods: {
    ...mapActions('setup', ['getElementRecords']),
    ...mapActions('element', ['createBulkRecords']),
    async extractData(file) {
      this.message = 'Extracting...';
      if (file) {
        const csvParser = new CSVParser();
        try {
          this.extractedData = await csvParser.parse(file);
        } catch (e) {
          this.error = true;
          this.message = 'Cannot parse file!';
          this.$emit('on-review', {
            index: this.data.index,
            success: !this.error,
          });
        }
      } else {
        this.error = true;
        this.$emit('on-review', {
          index: this.data.index,
          success: !this.error,
        });
        this.message = 'No file found!';
      }
    },
    getKeysMap() {
      return this.columns
        .filter((item) => !item.ignore && item.tagName)
        .reduce((acc, cur) => {
          acc[cur.column] = cur.tagName;
          return acc;
        }, {});
    },
    isKeyMultiMapped() {
      const cols = Object.values(this.getKeysMap());
      const uniqueCols = [...new Set(cols)];
      return cols.length !== uniqueCols.length;
    },
    matchColumns(tags, columns) {
      this.message = 'Mappping...';
      this.columns = columns.map((column) => {
        const currentTag = tags.find((tag) => tag.tagDescription === column);
        let tagName = null;
        if (currentTag) {
          ({ tagName } = currentTag);
        }
        return {
          column,
          tagName,
          ignore: !tagName,
        };
      });
      if (this.tagsNotInMatchedColumns.some((tag) => tag.required)) {
        this.error = true;
        this.message = 'Missing required colunms!';
        this.$emit('on-review', {
          index: this.data.index,
          success: !this.error,
        });
      } else if (this.isKeyMultiMapped()) {
        this.error = true;
        this.message = 'Multiple columns with same name!';
        this.$emit('on-review', {
          index: this.data.index,
          success: !this.error,
        });
      } else {
        this.error = false;
        this.matchedColumns = this.getKeysMap();
      }
    },
    mapData(keysMap, obj) {
      return Object.keys(keysMap)
        .map((k) => (k in obj ? { [k]: obj[k] } : null))
        .reduce((res, o) => Object.assign(res, o), {});
    },
    renameKeys(keysMap, obj) {
      return Object.keys(obj).reduce((acc, key) => ({
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] },
      }), {});
    },
    validateRequiredData(data, tags) {
      let isValid = true;
      data.forEach((d) => {
        tags.forEach((t) => {
          if (t.required) {
            const val = d[t.tagName];
            if (val === null || val === '' || val === undefined) {
              isValid = false;
            }
          }
        });
      });
      return isValid;
    },
    reviewData(data, matchedColumns) {
      const mappedData = data.map((d) => this.mapData(this.matchedColumns, d));
      this.reviewedData = mappedData.map((d) => this.renameKeys(matchedColumns, d));
    },
    async processData() {
      await this.extractData(this.file);
      if (this.extractedData) {
        this.matchColumns(this.data.tags, this.extractedData.meta.fields);
        if (this.matchedColumns) {
          this.reviewData(this.extractedData.data, this.matchedColumns);
          this.reviewedTags = this.data.tags
            .filter((tag) => Object.values(this.matchedColumns).includes(tag.tagName));
          const valid = this.validateRequiredData(this.reviewedData, this.reviewedTags);
          if (!valid) {
            this.error = true;
            this.message = 'Missing required data!';
            this.$emit('on-review', {
              index: this.data.index,
              success: !this.error,
            });
          } else {
            this.message = 'Importing...';
            const recordsCreated = await this.createBulkRecords({
              element: this.data.element,
              tags: this.reviewedTags,
              records: this.reviewedData,
              assetId: this.data.assetId,
            });
            if (recordsCreated) {
              this.error = false;
              this.message = 'Imported!';
              this.$emit('on-review', {
                index: this.data.index,
                success: !this.error,
              });
            }
          }
        }
      }
    },
  },
};
</script>
