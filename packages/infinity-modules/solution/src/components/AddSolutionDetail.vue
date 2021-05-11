<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="addsolutiondetail"
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card height="700px">
      <v-card-title class="primary">
        <span class="white--text">
          {{ $t('solution.detaillist.dialogtitle') }}
        </span>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            clearable
            :disabled="saving"
            :rules="rules.name"
            :label="$t('solution.detaillist.name')"
            prepend-icon="mdi-alpha-n-box"
            v-model="solutionObj.name"
            outlined
          ></v-text-field>
          <v-autocomplete
            clearable
            :label="$t('solution.detaillist.group')"
            :items="solutiondetailgroupList"
            :disabled="saving"
            v-model="solutionObj.group"
            item-text="name"
            item-value="name"
            outlined
            prepend-icon="mdi-account-supervisor-circle-outline"
            :rules="rules.group"
          >
          </v-autocomplete>
          <v-select
            clearable
            :disabled="saving"
            :items="type"
            :rules="rules.type"
            v-model="solutionObj.type"
            :label="$t('solution.detaillist.type')"
            outlined
            prepend-icon="mdi-form-select"
          ></v-select>
          <v-select
            v-if="solutionObj.type == 'value'"
            clearable
            :disabled="saving"
            :items="islimited"
            v-model="solutionObj.islimited"
            :label="$t('solution.detaillist.limited')"
            outlined
            prepend-icon="mdi-form-select"
          ></v-select>
          <v-text-field
            clearable
            :disabled="saving"
            :label="$t('solution.detaillist.lower')"
            prepend-icon="mdi-alpha-n-box"
            v-model="solutionObj.lower"
            outlined
            type="number"
          ></v-text-field>
          <v-text-field
            clearable
            :disabled="saving"
            :label="$t('solution.detaillist.upper')"
            prepend-icon="mdi-alpha-n-box"
            v-model="solutionObj.upper"
            outlined
            type="number"
          ></v-text-field>
          <v-textarea
            clearable
            :disabled="saving"
            :label="$t('solution.detaillist.description')"
            prepend-icon="mdi-note-text"
            v-model="solutionObj.description"
            outlined
          ></v-textarea>
          <v-file-input
            :disabled="saving"
            :label="$t('solution.detaillist.image')"
            prepend-icon="mdi-image"
            v-if="!solutionObj.image"
            accept="image/*"
            ref="upload"
            id="file"
            @change="uploaded($event)"
            outlined
          ></v-file-input>
          <div v-else>
            <v-select
              :label="$t('solution.detaillist.image')"
              prepend-icon="mdi-file-pdf"
              v-model="solutionObj.image"
              :items="files"
              clearable
            ></v-select>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          {{ $t('solution.general.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!solutionObj.name"
          :loading="saving"
          @click="saveSolutionDetail"
        >
          {{ $t('solution.general.save') }}
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
  name: 'AddSolutionDetailDialog',
  data() {
    return {
      solutionObj: {
        islimited: false,
      },
      rules: {
        name: [(v) => !!v || 'Name is required'],
        description: [(v) => !!v || 'Description is required'],
        type: [(v) => !!v || 'Type is required'],
        group: [(v) => !!v || 'Group is required'],
        lower: [(v) => !!v || 'Lower is required'],
        upper: [(v) => !!v || 'Upper is required'],
      },
      saving: false,
      valid: false,
      files: [],
      islimited: [true, false],
      type: ['value', 'attr'],
    };
  },
  props: {
    putrecord: {
      type: Object,
      required: false,
    },
  },
  watch: {
    putrecord(val) {
      if (val) {
        this.solutionObj = { ...val };
        this.files.push(val.image);
      }
    },
  },
  computed: {
    ...mapState('solution', ['addSolutionDetailDialog', 'solutionList', 'solutiondetailgroupList']),
    ...mapState('user', ['me']),
    ...mapState('auth', ['sessionId']),
    solutionInfo: {
      get() {
        return this.solutionList.filter((item) => item.id === this.solutionid)[0];
      },
    },
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.addSolutionDetailDialog;
      },
      set(val) {
        if (!val) {
          this.solutionObj = { islimited: false };
        }
        this.setAddSolutionDetailDialog(val);
      },
    },
  },
  created() {
    this.solutionid = this.$route.params.id;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('solution', ['setAddSolutionDetailDialog']),
    ...mapActions('solution', [
      'createSolutionDetail',
      'getSolutionDetailRecords',
      'updateSolutionDetail',
      'getDownloadLink',
    ]),
    async saveSolutionDetail() {
      const { solutionObj } = this;
      if (this.$refs.form.validate()) {
        if (solutionObj.islimited) {
          solutionObj.lower = Number(solutionObj.lower || 0);
          solutionObj.upper = Number(solutionObj.upper || 0);
          if (solutionObj.lower > solutionObj.upper) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'LOWER CAN NOT BIGGER THAN UPPER',
            });
            return;
          }
        }
        // prettier-ignore
        // eslint-disable-next-line max-len
        solutionObj.solutionid = this.solutionInfo.id;
        solutionObj.solutionname = this.solutionInfo.name;
        const payload = {
          ...solutionObj,
          assetid: 0,
        };
        this.saving = true;
        let result;
        if (payload._id) {
          result = await this.updateSolutionDetail({
            id: payload._id,
            payload,
          });
        } else {
          result = await this.createSolutionDetail(payload);
        }
        this.saving = false;

        // eslint-disable-next-line max-len
        if (result) {
          await this.getSolutionDetailRecords(`?query=solutionid=="${this.solutionInfo.id}"`);

          Object.keys(this.solutionObj).forEach((k) => {
            this.solutionObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'PUT_SOLUTION_DETAIL',
          });
        }
        this.dialog = false;
      }
    },
    uploaded(e) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(e);
      reader.onload = async (event) => {
        const { content, nameWithoutExt, extension } = this.getFileDetails(e);
        const url = `/server/uploadfile/${content}/${nameWithoutExt}?elementName=files&extension=${extension}`;
        const form = new FormData();
        form.append('file', new Blob([event.target.result]), {
          contentType: 'multipart/form-data',
        });
        form.append('assetid', 4);
        const config = {
          headers: {
            sessionId: this.sessionId,
          },
        };
        const response = await FileService.uploadFile(url, form, config);
        if (response.status === 200) {
          const link = await this.getDownloadLink(
            `?query=originalFilename=="${nameWithoutExt}"&sortquery=sortindex==-1&pagenumber=1&pagesize=1`,
          );
          if (link) {
            const { downloadlink } = link[0];
            this.solutionObj.image = downloadlink;
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
