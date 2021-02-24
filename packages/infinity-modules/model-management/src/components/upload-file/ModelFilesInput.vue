<template>
  <vue-dropzone
    id="dropzone"
    ref="fileInput"
    :useCustomSlot="true"
    :options="dropzoneOptions"
    class="file-input"
    @vdropzone-success="fileSuccess"
    @vdropzone-file-added="fileAdded"
    @vdropzone-removed-file="fileRemoved"
    @vdropzone-processing="processingUpload"
    @vdropzone-upload-progress="uploadProgress"
  >
    <div class="text-center py-2">
      <div>
        <v-icon x-large>mdi-paperclip</v-icon>
      </div>
      <span class="headline font-weight-bold secondary--text">
        Drag and drop to attach file!
      </span>
      <div class="subheading">
        ...or click to select a file from your computer
      </div>
    </div>
  </vue-dropzone>
</template>

<script>
import Vue from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import vue2Dropzone from 'vue2-dropzone';
import PreviewTemplate from './PreviewTemplate.vue';

const contentEnum = Object.freeze({
  image: 'image',
  audio: 'audio',
  video: 'video',
  application: 'file',
});

export default {
  name: 'ModelFilesInput',
  components: {
    vueDropzone: vue2Dropzone,
  },
  props: {
    modelId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dropzone: null,
      previewHtml: null,
      dropzoneOptions: {
        url: 'file/post/',
        maxFilesize: 7,
        addRemoveLinks: false,
        autoProcessQueue: false,
      },
    };
  },
  created() {
    const ComponentClass = Vue.extend(PreviewTemplate);
    const instance = new ComponentClass();
    instance.$mount();
    this.previewHtml = instance.$el.outerHTML;
    this.dropzoneOptions.previewTemplate = this.previewHtml;
  },
  mounted() {
    this.dropzone = this.$refs.fileInput;
  },
  computed: {
    ...mapState('modelManagement', ['files']),
    ...mapState('auth', ['sessionId']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('modelManagement', [
      'fetchModelDetails',
      'updateModelFile',
    ]),
    ...mapMutations('modelManagement', ['setFiles', 'setUploadingFiles']),
    fileAdded(file) {
      if (file.size > 7000000) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'FILE_SIZE_EXCEEDED',
        });
      } else {
        const { files } = this;
        files.push(file);
        this.setFiles(files);
      }
    },
    fileRemoved(file) {
      const { files } = this;
      const index = files.findIndex((f) => f.name === file.name);
      files.splice(index, 1);
      this.setFiles(files);
    },
    startQueueProcessing() {
      this.dropzone.processQueue();
    },
    getFileDetails(file) {
      const { name, type } = file;
      const lastIndex = name.lastIndexOf('.');
      const nameWithoutExt = name.substring(0, lastIndex);
      const extension = name.substring(lastIndex + 1);
      const temp = type.split('/');
      const content = contentEnum[temp[0]] || 'file';
      return { content, nameWithoutExt, extension };
    },
    setUrl(file) {
      const { content, nameWithoutExt, extension } = this.getFileDetails(file);
      const url = `/server/uploadfile/${content}/${nameWithoutExt}?elementName=modelfiles&extension=${extension}&assetId=4`;
      this.dropzone.setOption('url', url);
      this.dropzone.setOption('headers', {
        sessionId: this.sessionId,
      });
    },
    processingUpload(file) {
      this.setUrl(file);
    },
    uploadProgress(file, progress) {
      if (file.previewElement) {
        const prog = parseInt(progress, 10);
        const progressElement = file.previewElement.querySelector('[data-dz-uploadprogress]');
        progressElement.style.width = `${prog}%`;
        progressElement.querySelector('.progress-text').textContent = `${prog}%`;
      }
    },
    async fileSuccess(file, response) {
      const res = JSON.parse(response);
      await this.updateModelFile({
        modelId: this.modelId,
        id: res.id,
      });
      await this.fetchModelDetails(this.modelId);
      this.dropzone.removeAllFiles();
      this.setUploadingFiles(false);
    },
    async queueComplete() {
      // @vdropzone-queue-complete="queueComplete"
      await this.fetchModelDetails(this.modelId);
      this.dropzone.removeAllFiles();
      this.setUploadingFiles(false);
    },
  },
};
</script>

<style scoped>
.file-input {
  height: 50%;
  border: 1px dotted black;
  border-radius: 8px;
  overflow: hidden;
}
</style>
