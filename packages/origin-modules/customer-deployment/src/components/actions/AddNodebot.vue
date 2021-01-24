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
          <v-autocomplete
            filled
            dense
            clearable
            label="Select deployment manager"
            :loading="fetching"
            :disabled="saving"
            v-model="service"
            item-text="name"
            return-object
            class="mt-1"
            :rules="serviceRules"
            :items="deploymentServices"
          >
            <template #item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.ipaddr"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-file-input
            dense
            outlined
            show-size
            accept=".deb"
            v-model="nodebotfile"
            label="Debian file*"
            :rules="fileRules"
            prepend-icon="mdi-attachment"
            :disabled="saving || !service"
            :loading="loading"
            @change="onFileChange"
          ></v-file-input>
          <div
            class="caption ml-8"
            v-if="!nodebotfile"
            v-html="nameHelpText"
          ></div>
          <div v-else class="ml-8">
            <div>
              Package name: <strong>{{ name }}</strong>
            </div>
            <div>
              Release version: <strong>v{{ releaseversion }}</strong>
            </div>
          </div>
          <v-textarea
            dense
            outlined
            label="Description (optional)"
            v-model="description"
            prepend-icon="mdi-file-document-multiple-outline"
            rows="3"
            class="mt-4"
            auto-grow
            counter="200"
            :rules="descRules"
            :disabled="saving"
          ></v-textarea>
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
            Add & install
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'AddNodebot',
  data() {
    return {
      dialog: false,
      isValid: false,
      loading: false,
      fetching: false,
      saving: false,
      name: '',
      description: '',
      releaseversion: '',
      configuration: '',
      nodebotfile: null,
      service: null,
      nameHelpText: '*File name should follow: <strong>swx-bot-{packagename}_{version}-{buildnumber}*.deb</strong>',
      nameRules: [
        (v) => !!v || 'Package name is required.',
      ],
      versionRules: [
        (v) => !!v || 'Version is required.',
      ],
      descRules: [
        (v) => (v && v.length <= 200) || 'Max length 200 characters.',
      ],
      fileRules: [
        (v) => !!v || 'Debian is required.',
        (v) => this.isValidDebFile(v) || 'Attach valid debian file.',
        () => this.isValidFileName()
          || 'Package already exists. Try updating the exiting package.',
      ],
      configRules: [
        (v) => !!v || 'Configuration is required.',
        (v) => this.isValidJsonString(v) || 'Input valid JSON configuration.',
      ],
      serviceRules: [
        (v) => !!v || 'Deployment service is required.',
      ],
    };
  },
  computed: {
    ...mapState('customerDeployment', ['nodebots', 'deploymentServices']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('customerDeployment', [
      'createNodebot',
      'updateNodebotFile',
      'createDeploymentOrder',
      'fetchDeploymentServices',
    ]),
    ...mapActions('file', ['uploadFile']),
    isValidFileName() {
      try {
        const nodebot = this.nodebots.find((n) => (
          this.service.id === n.deploymentserviceid
          && n.name === this.name
        ));
        if (nodebot) {
          return false;
        }
        return true;
      } catch (error) {
        return false;
      }
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
      this.description = '';
      this.releaseversion = '';
      this.configuration = '';
      this.nodebotfile = null;
      this.service = null;
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
        deploymentserviceid: this.service.id,
        packagename: this.name,
        description: this.description,
        releaseversion: this.releaseversion,
        configuration: this.configuration,
        isinstalled: false,
        assetid: 0,
      };
      const createdNodebot = await this.createNodebot(payload);
      const uploadedFile = await this.uploadFile({ fileParam, formData });
      if (uploadedFile && uploadedFile.id) {
        const updated = await this.updateNodebotFile({
          id: uploadedFile.id,
          payload: { nodebotmasterid: createdNodebot.id },
        });
        if (updated) {
          const orderPayload = {
            deploymentserviceid: this.service.id,
            deploymentservicename: this.service.name,
            nodebotmasterid: createdNodebot.id,
            nodebotmastername: createdNodebot.name,
            operationname: 'upgrade-nodebot',
            status: 'Pending',
            assetid: 0,
          };
          const order = await this.createDeploymentOrder(orderPayload);
          if (order) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'INSTALL_DEBIAN',
            });
            this.cancel();
            this.$emit('on-create');
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'INSTALL_DEBIAN',
            });
          }
        }
      }
      this.saving = false;
    },
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.fetching = true;
        await this.fetchDeploymentServices();
        this.fetching = false;
      }
    },
  },
};
</script>
