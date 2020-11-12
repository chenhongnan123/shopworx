<template>
  <v-card flat>
    <v-card-text>
      <v-data-table
        :items="modelFiles"
        :headers="headers"
        :loading="deleting"
        hide-default-footer
        class="mb-2"
      >
        <template #item.name="{ item }">
          {{ item.originalFilename }}.{{item.extension}}
        </template>
        <template #item.actions="{ item }">
          <v-tooltip bottom>
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
          </v-tooltip>
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
        :modelId="model._id"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        block
        color="primary"
        class="text-none"
        @click="uploadFiles"
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
    ...mapState('modelManagement', ['files']),
    modelFiles() {
      return this.modelDetails && this.modelDetails.modelFiles;
    },
  },
  methods: {
    ...mapActions('file', ['downloadFile', 'deleteFile']),
    ...mapActions('modelManagement', ['fetchModelDetails']),
    ...mapMutations('helper', ['setAlert']),
    async uploadFiles() {
      this.$refs.dropzone.startQueueProcessing();
    },
    async downloadModelFile(link) {
      this.downloadFile(link);
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
          // eslint-disable-next-line
          id: file.id,
        });
        if (deleted) {
          // eslint-disable-next-line
          await this.fetchModelDetails(this.model._id);
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
