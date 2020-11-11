<template>
  <v-card flat class="transparent text-justify">
    <v-window v-model="window">
      <v-window-item :value="0">
        <div class="headline mb-4">
          {{ $t('production.setup.importMaster.title1') }}
          <span class="primary--text font-weight-medium">
            {{ $t('production.setup.importMaster.title2') }}
          </span>
          {{ $t('production.setup.importMaster.title3') }}
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
          {{ $t('production.setup.importMaster.import') }}
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
          {{ $t('production.setup.importMaster.downloading') }}
        </div>
        <div class="subheading my-2" v-else-if="error">
          {{ $t('production.setup.importMaster.downloadError') }}
          <a
            @click="downloadZip"
            id="downloadTemplates"
            class="primary--text font-weight-medium"
          >
            {{ $t('production.setup.importMaster.retryDownload') }}
          </a>
        </div>
        <div class="subheading my-2" v-else>
          {{ $t('production.setup.importMaster.download') }}
          <a
            @click="downloadZip"
            class="primary--text font-weight-medium"
          >
            {{ $t('production.setup.importMaster.downloadLink') }}
          </a>
        </div>
      </v-window-item>
      <v-window-item :value="1">
        <process-production
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
import ProcessProduction from './import/ProcessProduction.vue';

export default {
  name: 'ImportReasons',
  components: {
    ProcessProduction,
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
    ...mapState('productionLog', ['masterData']),
  },
  methods: {
    ...mapActions('productionLog', ['getMasterData']),
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
      const success = await this.getMasterData();
      if (success) {
        this.masterList = this.masterData;
        const files = this.masterList.map((list) => ({
          data: [],
          fields: list.tags.map((t) => t.tagDescription),
          fileName: `${list.element.elementName}.csv`,
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
      this.zipService.downloadFile(zip, 'production-log-template.zip');
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
