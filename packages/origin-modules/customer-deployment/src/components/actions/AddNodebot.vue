<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs"></slot>
    </template>
    <v-form ref="form" v-model="isValid">
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          Add new nodebot
        </v-card-title>
        <v-card-text>
          <v-text-field
            dense
            outlined
            v-model="name"
            class="mt-1"
            :rules="nameRules"
            label="Package name"
            prepend-icon="mdi-rocket-outline"
            :disabled="saving"
            :loading="loading"
          ></v-text-field>
          <v-textarea
            dense
            outlined
            label="Description (optional)"
            v-model="description"
            prepend-icon="mdi-file-document-multiple-outline"
            rows="3"
            auto-grow
            :disabled="saving"
          ></v-textarea>
          <v-text-field
            dense
            outlined
            v-model="releaseversion"
            label="Version"
            :rules="versionRules"
            prepend-icon="mdi-history"
            :disabled="saving"
            :loading="loading"
          ></v-text-field>
          <v-textarea
            dense
            outlined
            label="Configuration"
            v-model="configuration"
            prepend-icon="mdi-file-settings-outline"
            rows="7"
            :rules="configRules"
            auto-grow
            :disabled="saving"
          ></v-textarea>
          <v-file-input
            dense
            outlined
            show-size
            accept=".deb"
            v-model="nodebotfile"
            label="Debian file"
            :rules="fileRules"
            prepend-icon="mdi-attachment"
            :disabled="saving"
            :loading="loading"
          ></v-file-input>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text :disabled="saving" class="text-none" @click="cancel">
            Exit
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="primary"
            class="text-none"
            :loading="saving"
            :disabled="!isValid"
            @click="addNewNodebot"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AddNodebot',
  data() {
    return {
      dialog: false,
      isValid: false,
      loading: false,
      saving: false,
      name: '',
      description: '',
      releaseversion: '',
      configuration: '',
      nodebotfile: null,
      nameRules: [
        (v) => !!v || 'Package name is required.',
      ],
      versionRules: [
        (v) => !!v || 'Version is required.',
      ],
      fileRules: [
        (v) => !!v || 'Debian is required.',
        (v) => this.isValidDebFile(v) || 'Attach valid debian file',
      ],
      configRules: [
        (v) => !!v || 'Configuration is required',
        (v) => this.isValidJsonString(v) || 'Input valid JSON configuration',
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', ['nodebots']),
  },
  methods: {
    ...mapActions('customerDeployment', ['createNodebot', 'updateNodebotFile']),
    ...mapActions('file', ['uploadFile']),
    getFileDetails(file) {
      const { name } = file;
      const lastIndex = name.lastIndexOf('.');
      const nameWithoutExt = name.substring(0, lastIndex);
      const extension = name.substring(lastIndex + 1);
      const content = 'file';
      return { content, nameWithoutExt, extension };
    },
    isValidJsonString(jsonString) {
      if (!(jsonString && typeof jsonString === 'string')) {
        return false;
      }
      try {
        JSON.parse(jsonString);
        return true;
      } catch (error) {
        return false;
      }
    },
    isValidDebFile(file) {
      if (!file) {
        return false;
      }
      try {
        const { extension } = this.getFileDetails(file);
        return extension === 'deb';
      } catch (error) {
        return false;
      }
    },
    setUrl(file) {
      const { content, nameWithoutExt, extension } = this.getFileDetails(file);
      return `${content}/${nameWithoutExt}?elementName=nodebotfile&extension=${extension}&assetId=0`;
    },
    clear() {
      this.name = '';
      this.description = '';
      this.releaseversion = '';
      this.configuration = '';
      this.nodebotfile = null;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    cancel() {
      this.clear();
      this.dialog = false;
    },
    async addNewNodebot() {
      this.saving = true;
      const fileParam = this.setUrl(this.nodebotfile);
      const formData = new FormData();
      formData.append('file', this.nodebotfile);
      const payload = {
        name: this.name,
        packagename: this.name,
        description: this.description,
        releaseversion: this.releaseversion,
        configuration: this.configuration,
      };
      const createdNodebot = await this.createNodebot(payload);
      const uploadedFile = await this.uploadFile({ fileParam, formData });
      if (uploadedFile && uploadedFile.id) {
        const updated = await this.updateNodebotFile({
          id: uploadedFile.id,
          payload: { nodebotmasterid: createdNodebot.id },
        });
        if (updated) {
          this.cancel();
          this.$emit('on-create');
        }
      }
      this.saving = false;
    },
  },
};
</script>
