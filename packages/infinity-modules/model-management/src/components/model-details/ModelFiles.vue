<template>
  <v-card flat>
    <v-card-text class="pt-0">
      <v-data-table
        :items="fileList"
        :headers="headers"
        :loading="deleting"
        hide-default-footer
        class="mb-2"
      >
        <template #no-data>
          No file available
        </template>
        <template #item.name="{ item }">
          {{ item.originalFilename }}.{{ item.extension }}
        </template>
        <template #item.actions="{ item }">
          <!-- <v-tooltip bottom>
            <template #activator="{ on, attrs }">
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
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                v-on="on"
                color="error"
                v-bind="attrs"
                :disabled="deleting"
                @click="deleteModelFile(item)"
              >
                <v-icon v-text="'$delete'"></v-icon>
              </v-btn>
            </template>
            <span>Delete file</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <model-files-input
        ref="dropzone"
        :modelId="model.modelid"
      />
      <v-row
        class="mt-2"
        no-gutters
      >
      <v-col cols="6" md="6" lg="6">
      <v-text-field
        dense
        outlined
        type="datetime-local"
        v-model="trainStartTime"
        label="Train data start date-time*"
      ></v-text-field>
      </v-col>
      <v-col cols="6" md="6" lg="6">
      <v-text-field
        dense
        class="ml-2"
        outlined
        type="datetime-local"
        v-model="trainEndTime"
        label="Train data end date-time*"
      ></v-text-field>
      </v-col>
      </v-row>
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
      fileList: [],
      deleting: false,
      trainStartTime: '',
      trainEndTime: '',
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
  async created() {
    this.fileList = this.modelFiles;
  },
  watch: {
    modelFiles: {
      handler(val) {
        if (val && val.length) {
          val.forEach((v, i) => {
            this.$set(this.fileList, i, v);
          });
        } else {
          this.fileList = [];
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState('modelManagement', ['files', 'uploadingFiles']),
    modelFiles() {
      return this.modelDetails && this.modelDetails.modelFiles;
    },
  },
  methods: {
    ...mapActions('file', ['downloadFile', 'deleteFile']),
    ...mapActions('modelManagement', ['fetchModelDetails', 'updateModelDates']),
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('modelManagement', ['setUploadingFiles']),
    async updateProps(val) {
      this.fileList.push(val.modelFiles);
    },
    async uploadFiles() {
      console.log('file click');
      // update start date and end date to Model element
      const startTime = new Date(this.trainStartTime);
      const endTime = new Date(this.trainEndTime);
      const request = {
        payload: {
          trainstarttime: `${startTime.getDay()}-${startTime.getMonth() + 1}-${startTime.getFullYear()}:${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`,
          trainendtime: `${endTime.getDay()}-${endTime.getMonth() + 1}-${endTime.getFullYear()}:${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()}`,
        },
        query: `?query=modelid=="${this.model.modelid}"`,
      };
      await this.updateModelDates(request);
      let flag = false;
      const demolList = [];
      for (let i = 0; i < this.$refs.dropzone.files.length; i += 1) {
        if (demolList.includes(this.$refs.dropzone.files[i].name)) {
          flag = true;
        } else {
          demolList.push(this.$refs.dropzone.files[i].name);
          const list = this.modelFiles.filter((f) => `${f.originalFilename}.${f.extension}` === this.$refs.dropzone.files[i].name);
          if (list.length > 0) {
            flag = true;
          }
        }
      }
      if (flag) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'FILES_DEPLICATE',
        });
      } else {
        this.setUploadingFiles(true);
        this.$refs.dropzone.startQueueProcessing();
      }
    },
    async downloadModelFile(link) {
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
          await this.fetchModelDetails(this.model.modelid);
          this.fileList = this.modelFiles;
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
