<template>
  <v-card flat>
    <v-card-text>
      <v-data-table
        :items="modelFiles"
        :headers="headers"
        hide-default-footer
      >
        <template #item.download>
          <a
            color="primary"
            class="text-decoration-underline"
          >
            Download
          </a>
        </template>
        <template #item.actions>
          <v-icon>mdi-delete</v-icon>
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
import { mapState, mapGetters } from 'vuex';
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
      headers: [
        { text: 'Name', value: 'originalFilename' },
        { text: 'Extension', value: 'extension' },
        {
          text: 'Download',
          value: 'download',
          sortable: false,
        },
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
    ...mapGetters('modelManagement', ['getFileDetails']),
    modelFiles() {
      return this.modelDetails && this.modelDetails.modelFiles;
    },
  },
  methods: {
    async uploadFiles() {
      this.$refs.dropzone.startQueueProcessing();
    },
  },
};
</script>
