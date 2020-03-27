<template>
  <v-card flat class="transparent text-justify">
    <v-window v-model="window">
      <v-window-item :value="0">
        <div class="headline mb-4">
          Connect master data with ShopWorx to get better
          <span class="primary--text font-weight-medium">
            insights
          </span>
          of your machines, operators, products and more.
        </div>
        <v-btn
          block
          color="primary"
          class="text-none"
          @click="uploadFiles"
        >
          <v-icon left>mdi-cloud-upload-outline</v-icon>
          Import master data
        </v-btn>
        <input
          multiple
          type="file"
          accept=".csv"
          ref="uploader"
          class="d-none"
          @change="onFilesChanged"
        >
        <div class="subheading my-2" v-if="downloading">
          <v-progress-circular indeterminate></v-progress-circular>
          <span>Generating templates...</span>
        </div>
        <div class="subheading my-2" v-else-if="error">
          Could not download the master data templates.
          <a
            @click="downloadZip"
            class="primary--text font-weight-medium"
          >
            Retry
          </a>
          download.
        </div>
        <div class="subheading my-2" v-else>
          You can download the master data templates
          <a
            @click="downloadZip"
            class="primary--text font-weight-medium"
          >
            here.
          </a>
        </div>
      </v-window-item>
      <v-window-item :value="1">
        <process-master-data
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
import ProcessMasterData from './ProcessMasterData.vue';

export default {
  name: 'ImportMasterData',
  components: {
    ProcessMasterData,
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
    ...mapState('setup', ['masterData']),
  },
  methods: {
    ...mapActions('setup', ['getMasterData']),
    uploadFiles() {
      this.$refs.uploader.click();
    },
    onFilesChanged(e) {
      this.files = e && e !== undefined ? e.target.files : null;
      // e.target.value = '';
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
        const content = this.generateCSV({ fields: file.fields });
        this.addToZip({
          fileName: file.fileName,
          fileContent: content,
        });
      })]);
      const zip = await this.zipService.generateZip();
      this.zipService.downloadFile(zip, 'master-templates.zip');
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
