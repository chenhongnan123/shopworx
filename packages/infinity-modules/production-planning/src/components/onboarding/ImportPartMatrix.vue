<template>
  <v-card flat class="transparent text-justify">
    <v-window v-model="window">
      <v-window-item :value="0">
        <div class="headline mb-4">
          {{ $t('planning.setup.importMaster.title1') }}
          <span class="primary--text font-weight-medium">
            {{ $t('planning.setup.importMaster.title2') }}
          </span>
          {{ $t('planning.setup.importMaster.title3') }}
        </div>
        <v-btn
          block
          rounded
          id="importData"
          color="primary"
          class="text-none"
          @click="uploadFiles"
        >
          <v-icon
            left
            v-text="'$upload'"
          ></v-icon>
          {{ $t('planning.setup.importMaster.import') }}
        </v-btn>
        <input
          multiple
          type="file"
          accept=".csv"
          ref="uploader"
          class="d-none"
          id="uploadFiles"
          @change="onFilesChanged"
        >
        <div class="subheading my-2" v-if="downloading">
          <v-progress-circular indeterminate></v-progress-circular>
          {{ $t('planning.setup.importMaster.downloading') }}
        </div>
        <div class="subheading my-2" v-else-if="error">
          {{ $t('planning.setup.importMaster.downloadError') }}
          <a
            @click="downloadZip"
            id="downloadTemplates"
            class="primary--text font-weight-medium"
          >
            {{ $t('planning.setup.importMaster.retryDownload') }}
          </a>
        </div>
        <div class="subheading my-2" v-else>
          {{ $t('planning.setup.importMaster.download') }}
          <a
            @click="downloadZip"
            class="primary--text font-weight-medium"
          >
            {{ $t('planning.setup.importMaster.downloadLink') }}
          </a>
        </div>
      </v-window-item>
      <v-window-item :value="1">
        <process-part-matrix
          @back="window = 0"
          @success="$emit('update-step')"
          :files="files"
        />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import ProcessPartMatrix from './import/ProcessPartMatrix.vue';

export default {
  name: 'ImportPartMatrix',
  components: {
    ProcessPartMatrix,
  },
  data() {
    return {
      files: [],
      window: 0,
      error: false,
      masterList: [],
      zipService: null,
      downloading: false,
    };
  },
  created() {
    this.zipService = ZipService;
  },
  computed: {
    ...mapState('productionPlanning', ['partMatrixMaster']),
  },
  methods: {
    ...mapActions('productionPlanning', ['getPartMatrixMaster']),
    uploadFiles() {
      this.$refs.uploader.click();
    },
    onFilesChanged(e) {
      this.files = e && e !== undefined ? e.target.files : null;
      if (this.files && this.files.length) {
        this.window = 1;
        this.filesImported = true;
      } else {
        this.window = 0;
        this.filesImported = false;
      }
    },
    async downloadZip() {
      this.downloading = true;
      const success = await this.getPartMatrixMaster({ generateData: true });
      if (success) {
        this.masterList = this.partMatrixMaster;
        const files = this.masterList.map((list) => ({
          data: list.data,
          fields: list.tags.map((t) => t.tagDescription),
          fileName: list.expectedFileName,
        }));
        try {
          await this.addFilesToZip(files);
        } catch (e) {
          this.downloading = false;
          this.error = true;
        }
      }
      this.downloading = false;
      this.error = !success;
    },
    async addFilesToZip(files) {
      await Promise.all([files.forEach((file) => {
        const content = this.generateCSV({ fields: file.fields, data: file.data });
        this.addToZip({
          fileName: file.fileName,
          fileContent: content,
        });
      })]);
      const zip = await this.zipService.generateZip();
      this.zipService.downloadFile(zip, 'part-matrix-templates.zip');
    },
    generateCSV({ fields, data = [] }) {
      const csvParser = new CSVParser();
      const content = csvParser.unparse({ fields, data });
      return content;
    },
    addToZip(file) {
      this.zipService.addFile(file);
    },
  },
};
</script>
