<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="addmachineposition"
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card height="500px">
      <v-card-title class="primary">
        <span class="white--text">
          {{ $t('machine.position.dialogtitle') }}
        </span>
      </v-card-title>

      <v-card-text class="mt-4">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-file-input
            :disabled="saving"
            :label="$t('machine.position.image')"
            prepend-icon="mdi-file-pdf"
            v-if="!positionObj.image"
            accept="image/*"
            ref="upload"
            id="file"
            @change="uploaded($event)"
          ></v-file-input>
          <div v-else>
            <v-select
              :label="$t('machine.position.image')"
              prepend-icon="mdi-file-pdf"
              v-model="positionObj.image"
              :items="files"
              clearable
            ></v-select>
          </div>
          <v-text-field
            :disabled="saving"
            :rules="rules.name"
            :label="$t('machine.position.name')"
            prepend-icon="mdi-account-box-outline"
            v-model="positionObj.name"
          ></v-text-field>
          <v-text-field
            :disabled="saving"
            :label="$t('machine.position.description')"
            prepend-icon="mdi-badge-account-horizontal-outline"
            v-model="positionObj.description"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="onExit">
          {{ $t('machine.general.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!positionObj.name"
          :loading="saving"
          @click="saveMachinePosition"
        >
          {{ $t('machine.general.save') }}
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
  name: 'AddMachinePositionDialog',
  data() {
    return {
      positionObj: {},
      rules: {
        name: [(v) => !!v || 'Name is required'],
        description: [(v) => !!v || 'Badage Code is required'],
      },
      saving: false,
      valid: false,
      files: [],
    };
  },
  computed: {
    ...mapState('machine', ['addMachinePositionDialog']),
    ...mapState('user', ['me']),
    ...mapState('auth', ['sessionId']),
    ...mapState('machine', ['machineList']),
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
        return this.addMachinePositionDialog;
      },
      set(val) {
        this.setAddMachinePositionDialog(val);
      },
    },
  },
  created() {
    this.machineid = this.$route.params.id;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('machine', ['setAddMachinePositionDialog', 'setTab']),
    ...mapActions('machine', ['createMachinePosition', 'getPositionRecords', 'getDownloadLink']),
    async saveMachinePosition() {
      const { positionObj } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        positionObj.machineid = this.machineInfo.id;
        positionObj.machinename = this.machineInfo.name;
        const payload = {
          ...positionObj,
          assetid: 0,
        };
        this.saving = true;
        const position = await this.createMachinePosition(payload);
        this.saving = false;

        // eslint-disable-next-line max-len
        if (position) {
          await this.getPositionRecords(`?query=machineid=="${this.machineInfo.id}"`);
          this.setTab(0);
          Object.keys(this.positionObj).forEach((k) => {
            this.positionObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_STATION_POSITION',
          });
          this.onExit();
        }
      }
    },
    onExit() {
      this.positionObj = {};
      this.files = [];
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
            this.positionObj.image = downloadlink;
            this.files = [downloadlink];
          }
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'IMAGE_UPLOAD_FAILED',
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
