<template>
  <v-card flat>
    <v-card-text class="pt-0">
      <v-data-table
        :items="modelFiles"
        :headers="headers"
        :loading="deleting"
        hide-default-footer
        class="mb-2"
      >
        <template #no-data>
          No file available
        </template>
        <template #item.name="{ item }">
          {{ item.originalFilename }}.{{item.extension}}
        </template>
        <template #item.actions="{ item }">
          <!-- <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-on="on"
                color="primary"
                v-bind="attrs"
                :disabled="deleting"
                @click="downloadModelFile(item.downloadLink)"
              >
                <v-icon>mdi-cloud-download-outline</v-icon>
              </v-btn>
            </template>
            <span>Download file</span>
          </v-tooltip> -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-on="on"
                color="error"
                v-bind="attrs"
                :disabled="deleting"
                @click="deleteModelFile(item)"
              >
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </template>
            <span>Delete file</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <model-files-input
        ref="dropzone"
        :modelId="model.id"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        block
        color="primary"
        class="text-none"
        @click="uploadFiles"
        :disabled="!files.length"
        :loading="uploadingFiles"
      >
        <v-icon left>mdi-cloud-upload-outline</v-icon>
        Upload attached files
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import ModelFilesInput from '../upload-file/ModelFilesInput.vue';

export default {
  name: 'ModelFiles',
  props: {
    modelDetails: {
      type: Object,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
  },
  components: {
    ModelFilesInput,
  },
  data() {
    return {
      deleting: false,
      headers: [
        { text: 'Name', value: 'name' },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          filterable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('modelManagement', ['files', 'uploadingFiles']),
    modelFiles() {
      return this.modelDetails && this.modelDetails.modelFiles;
    },
  },
  methods: {
    ...mapActions('file', ['downloadFile', 'deleteFile']),
    ...mapActions('modelManagement', ['fetchModelDetails']),
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('modelManagement', ['setUploadingFiles']),
    async uploadFiles() {
      this.setUploadingFiles(true);
      this.$refs.dropzone.startQueueProcessing();
    },
    async downloadModelFile(link) {
      console.log(link);
      await this.downloadFile(link);
    },
    async deleteModelFile(file) {
      if (await this.$root.$confirm.open(
        'Delete model file',
        `Are you sure you want to delete "${file.originalFilename}.${file.extension}"?
        This action cannot be reverted.`,
      )) {
        this.deleting = true;
        const deleted = await this.deleteFile({
          elementName: 'modelfiles',
          id: file.id,
        });
        if (deleted) {
          await this.fetchModelDetails(this.model.id);
          this.setAlert({
            show: true,
            type: 'success',
            message: 'FILE_DELETE',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'FILE_DELETE',
          });
        }
        this.deleting = false;
      }
    },
  },
};
</script>
