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
        <div class="subheading my-2">
          You can download the master data templates
          <a class="primary--text font-weight-medium">
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
import ProcessMasterData from '@/components/onboarding/import/ProcessMasterData.vue';

export default {
  name: 'ImportMasterData',
  components: {
    ProcessMasterData,
  },
  data() {
    return {
      files: [],
      window: 0,
    };
  },
  methods: {
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
  },
};
</script>
