<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="adddocument"
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card height="300px">
      <v-card-title class="primary">
        <span class="white--text">
          {{ $t("machine.document.addtitle") }}
        </span>
      </v-card-title>

      <v-card-text class="mt-4">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-file-input
            :disabled="saving"
            :label="$t('machine.document.file')"
            prepend-icon="mdi-file-pdf"
            v-if="!documentObj.file"
            accept="application/pdf"
            ref="upload"
            id="file"
            @change="uploaded($event)"
          ></v-file-input>
          <div v-else>
            <v-select
              :label="$t('machine.document.file')"
              prepend-icon="mdi-file-pdf"
              v-model="documentObj.file"
              :items="files"
              clearable
            ></v-select>
          </div>
          <v-text-field
            :disabled="saving"
            :rules="rules.name"
            :label="$t('machine.document.name')"
            prepend-icon="mdi-account-box-outline"
            v-model="documentObj.name"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="onExit">
          {{ $t("machine.general.cancel") }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!documentObj.name"
          :loading="saving"
          @click="saveMachineDocument"
        >
          {{ $t("machine.general.save") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  mapState,
  // mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';
import FileService from '@shopworx/services/api/file.service';

const contentEnum = Object.freeze({
  image: 'image',
  audio: 'audio',
  video: 'video',
  application: 'file',
});

export default {
  name: 'AddDocumentDialog',
  data() {
    return {
      documentObj: {
        name: null,
        file: null,
        machinetid: null,
        machinename: null,
        files: [],
      },
      rules: {
        name: [(v) => !!v || 'Name is required'],
        file: [(v) => !!v || 'File is required'],
      },
      saving: false,
      valid: false,
    };
  },
  computed: {
    ...mapState('machine', ['addDocumentDialog']),
    ...mapState('user', ['me']),
    ...mapState('machine', ['machineList']),
    ...mapState('auth', ['sessionId']),
    machineInfo: {
      get() {
        return this.machineList.filter((item) => item.id === this.machineid)[0];
      },
    },
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.addDocumentDialog;
      },
      set(val) {
        this.setAddDocumentDialog(val);
      },
    },
  },
  created() {
    this.machineid = this.$route.params.id;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('machine', ['setAddDocumentDialog']),
    ...mapActions('machine', [
      'createMachineDocument',
      'getDocumentRecords',
      'getDownloadLink',
    ]),
    getQuery() {
      let query = '?query=';
      if (this.position) {
        query += `positionid=="${this.position}"%26%26`;
      }
      if (this.department) {
        query += `departmentid=="${this.department}"%26%26`;
      }
      return query;
    },
    async saveMachineDocument() {
      const { documentObj } = this;
      if (this.$refs.form.validate() && documentObj.file) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        documentObj.machineid = this.machineInfo.id;
        documentObj.machinename = this.machineInfo.name;
        const payload = {
          ...documentObj,
          assetid: 0,
        };
        this.saving = true;
        const operator = await this.createMachineDocument(payload);
        this.saving = false;

        // eslint-disable-next-line max-len
        if (operator) {
          await this.getDocumentRecords(
            `?query=machineid=="${this.machineInfo.id}"`,
          );
          Object.keys(this.documentObj).forEach((k) => {
            this.documentObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_STATION_DOCUMENT',
          });
          this.onExit();
        }
      }
    },
    onExit() {
      this.documentObj = {
        name: null,
        file: null,
        machinetid: null,
        machinename: null,
        files: [],
      };
      this.dialog = false;
    },
    uploaded(e) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(e);
      reader.onload = async (event) => {
        const { content, nameWithoutExt, extension } = this.getFileDetails(e);
        const url = `${content}/${nameWithoutExt}?elementName=files&extension=${extension}`;
        const form = new FormData();
        form.append('file', new Blob([event.target.result]), {
          contentType: 'multipart/form-data',
        });
        form.append('assetid', 0);
        const response = await FileService.uploadFile(url, form);
        if (response.status === 200) {
          const link = await this.getDownloadLink(
            `?query=originalFilename=="${nameWithoutExt}"&sortquery=sortindex==-1&pagenumber=1&pagesize=1`,
          );
          if (link) {
            const { downloadlink } = link[0];
            this.documentObj.file = downloadlink;
            this.files = [downloadlink];
          }
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'FILE_UPLOAD_FAILED',
          });
        }
      };
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
  },
};
</script>
<style lang="sass">
#clicktoupload
  margin: 0 auto
  border: 2px dashed #00bcd4
  cursor: pointer
  height: 200px
  width: 200px
  line-height: 200px
  text-align: center
</style>
