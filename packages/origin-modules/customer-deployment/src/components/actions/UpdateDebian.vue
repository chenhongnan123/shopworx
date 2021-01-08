<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip bottom>
        <template #activator="{ on: tooltip }">
          <v-btn
            icon
            v-on="{ ...tooltip, ...dialog }"
            v-bind="attrs"
          >
            <v-icon>mdi-autorenew</v-icon>
          </v-btn>
        </template>
        <span>Update debian</span>
      </v-tooltip>
    </template>
    <v-form ref="form" v-model="isValid">
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          Update {{ nodebot.name }} debian
        </v-card-title>
        <v-card-text>
          <v-file-input
            dense
            outlined
            class="mt-1"
            show-size
            accept=".deb"
            v-model="nodebotfile"
            label="Debian file*"
            :rules="fileRules"
            prepend-icon="mdi-attachment"
            :disabled="saving"
            @change="onFileChange"
          ></v-file-input>
          <div
            class="caption ml-8 mb-2"
            v-if="!nodebotfile"
            v-html="nameHelpText"
          ></div>
          <div class="ml-8">
            <div>
              Package name: <strong>{{ nodebot.name }}</strong>
            </div>
            <div>
              Current version: <strong>v{{ nodebot.releaseversion }}</strong>
            </div>
            <div v-if="nodebotfile">
              New version: <strong>v{{ releaseversion }}</strong>
            </div>
          </div>
          <v-textarea
            dense
            outlined
            class="mt-4"
            label="Configuration"
            v-model="configuration"
            prepend-icon="mdi-file-settings-outline"
            rows="7"
            :rules="configRules"
            auto-grow
            :disabled="saving"
          ></v-textarea>
        </v-card-text>
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
            @click="updateDebian"
            :disabled="!isValid"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'UpdateDebain',
  props: {
    nodebot: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nodebotfile: null,
      configuration: '',
      name: '',
      releaseversion: '',
      isValid: false,
      dialog: false,
      saving: false,
      nameHelpText: '*File name should follow: <strong>swx-bot-{packagename}_{version}-{buildnumber}*.deb</strong>',
      fileRules: [
        (v) => !!v || 'Debian is required.',
        (v) => this.isValidDebFile(v) || 'Attach valid debian file.',
        () => this.isValidFileName()
          || 'Existing package name does not match the file name.',
        () => this.isValidVersion()
          || 'This version is installed already.',
      ],
      configRules: [
        (v) => !!v || 'Configuration is required',
        (v) => this.isValidJsonString(v) || 'Input valid JSON configuration',
      ],
    };
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('customerDeployment', [
      'deleteNodebotFile',
      'updateNodebot',
      'updateNodebotInstances',
      'updateNodebotFile',
      'createDeploymentOrder',
    ]),
    ...mapActions('file', ['uploadFile']),
    isValidFileName() {
      return this.nodebot.name === this.name;
    },
    isValidVersion() {
      return this.nodebot.name === this.name
        && this.nodebot.releaseversion !== this.releaseversion;
    },
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
    onFileChange() {
      if (this.nodebotfile) {
        const { nameWithoutExt } = this.getFileDetails(this.nodebotfile);
        try {
          const pkg = nameWithoutExt.replace('swx-bot-', '');
          const [file, build] = pkg.split('_');
          const [version] = build.split('-');
          this.name = file;
          this.releaseversion = version;
        } catch (e) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'DEBIAN_PARSE_ERROR',
          });
        }
      }
    },
    setUrl(file) {
      const { content, nameWithoutExt, extension } = this.getFileDetails(file);
      return `${content}/${nameWithoutExt}?elementName=nodebotfile&extension=${extension}&assetId=0`;
    },
    clear() {
      this.name = '';
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
    async updateDebian() {
      this.saving = true;
      // eslint-disable-next-line
      const deleted = this.deleteNodebotFile(this.nodebot.file._id);
      if (deleted) {
        const fileParam = this.setUrl(this.nodebotfile);
        const formData = new FormData();
        formData.append('file', this.nodebotfile);
        const payload = {
          releaseversion: this.releaseversion,
          configuration: this.configuration,
          isinstalled: false,
          assetid: 0,
        };
        const updatedNodebot = await this.updateNodebot({
          // eslint-disable-next-line
          id: this.nodebot._id,
          payload,
        });
        if (updatedNodebot) {
          const uploadedFile = await this.uploadFile({ fileParam, formData });
          if (uploadedFile && uploadedFile.id) {
            const updated = await this.updateNodebotFile({
              id: uploadedFile.id,
              payload: { nodebotmasterid: this.nodebot.id },
            });
            if (updated) {
              const orderPayload = {
                deploymentserviceid: this.nodebot.deploymentserviceid,
                nodebotmasterid: this.nodebot.id,
                operationname: 'upgrade-nodebot',
                status: 'Pending',
                assetid: 0,
              };
              const order = await this.createDeploymentOrder(orderPayload);
              if (order) {
                await this.updateNodebotInstances({
                  nodebotmasterid: this.nodebot.id,
                  payload: {
                    isdeployed: false,
                    isreconfigured: true,
                  },
                });
                this.setAlert({
                  show: true,
                  type: 'success',
                  message: 'INSTALL_DEBIAN',
                });
                this.cancel();
                this.$emit('on-update');
              } else {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'INSTALL_DEBIAN',
                });
              }
            }
          }
        }
      }
      this.saving = false;
    },
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.configuration = this.nodebot.configuration;
      } else {
        this.configuration = '';
      }
    },
  },
};
</script>
