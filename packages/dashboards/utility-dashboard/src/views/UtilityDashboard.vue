<template>
  <div>
    <v-container fluid style="height: 100%" class="grey lighten-5">
      <portal to="dashboard-title"> Utility dashboard </portal>
      <portal to="dashboard-actions" v-if="showSaveButton">
        <v-btn
          class="text-none mr-2"
          color="primary"
          exact
          small
          outlined
          @click="saveData"
        >
          <v-icon left>mdi-content-save</v-icon>
          Save
        </v-btn>
      </portal>
      <portal to="dashboard-upload-layout">
        <div>
          <label for="file" style="cursor: pointer">
            <v-icon left color="primary">mdi-cloud-upload-outline</v-icon>
            Upload layout
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            id="file"
            class="fileinput"
            @change="onChange"
          />
        </div>
      </portal>

      <div v-if="url">
        <image-marker
          :imgurl="url"
          @showBtn="showBtn"
          ref="marker"
          :mappings="meters"
        />
      </div>

      <div
        class="d-flex justify-center align-center"
        style="min-height: 100vh; margin-top: -64px"
        v-else
      >
        <div class="fileinput-box">
          <label class="inputlable" for="file">
            <v-icon left color="primary">mdi-cloud-upload-outline</v-icon>
            Upload layout
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            id="file"
            class="fileinput"
            @change="onChange"
          />
        </div>
      </div>
    </v-container>
    <v-snackbar v-model="error" color="red darken-2" right>
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="error = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import {
  mapActions,
  mapMutations,
  mapState,
  mapGetters,
} from 'vuex';
import ImageMarker from '../components/ImageMarker.vue';

const contentEnum = Object.freeze({
  image: 'image',
  audio: 'audio',
  video: 'video',
  application: 'file',
});

export default {
  name: 'UtilityDashboard',
  components: {
    ImageMarker,
  },
  data() {
    return {
      file: null,
      url: '',
      showSaveButton: false,
      error: false,
      snackbar: false,
      text: 'Please upload minimum (width 1024px) image.',
    };
  },
  async created() {
    this.setShowHeaderButtons(false);
    await this.fetchMeters();
    this.setActiveDashboard();
    // TODO: fetch dashboard schema
    await this.getAppSchema();
    console.log(this.appSchema);
    // TODO: if found -> render schema (download file)
    // TODO: else -> upload schema
  },
  computed: {
    ...mapState('utilityDashboard', ['meters', 'showSaveBtn']),
    ...mapState('webApp', ['appSchema']),
    ...mapGetters('user', ['myDashboards']),
  },
  methods: {
    ...mapActions('utilityDashboard', ['fetchMeters']),
    ...mapActions('file', ['uploadFile']),
    ...mapActions('webApp', ['getAppSchema', 'updateAppSchema']),
    ...mapActions('element', ['getRecordById']),
    ...mapMutations('utilityDashboard', ['setShowSaveBtn']),
    ...mapMutations('helper', ['setShowHeaderButtons']),
    ...mapMutations('webApp', ['setActiveAppId']),
    setActiveDashboard() {
      const routeName = this.$route.name;
      const dashboard = this.myDashboards.find((d) => d.title === routeName);
      const id = dashboard ? dashboard.id : undefined;
      this.setActiveAppId(id);
    },
    onChange(e) {
      this.url = '';
      const img = new Image();
      [this.file] = e.target.files;
      img.src = URL.createObjectURL(this.file);
      img.onload = () => {
        if (img.width >= 1024) {
          this.url = URL.createObjectURL(this.file);
        } else {
          this.error = true;
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
    setUrl(file) {
      const { content, nameWithoutExt, extension } = this.getFileDetails(file);
      return `${content}/${nameWithoutExt}?elementName=appfiles&extension=${extension}&assetId=0`;
    },
    showBtn(value) {
      this.showSaveButton = value;
    },
    async saveData() {
      const fileId = await this.uploadLayoutImage();
      if (fileId) {
        const file = await this.getRecordById({
          elementName: 'appfiles',
          id: fileId,
        });
        if (file) {
          const schema = {
            downloadLink: file.downloadlink,
            areaMap: this.$refs.marker.locations,
          };
          await this.updateAppSchema(schema);
        }
      }
    },
    async uploadLayoutImage() {
      const fileParam = this.setUrl(this.file);
      const formData = new FormData();
      formData.append('file', this.file);
      const uploadedFile = await this.uploadFile({ fileParam, formData });
      return uploadedFile && uploadedFile.id;
    },
  },
};
</script>

<style>
.fileinput {
  position: absolute;
  opacity: 0;
  height: 0;
}
.inputlable {
  color: #354493;
  display: flex;
  justify-content: center;
  align-content: center;
  cursor: pointer;
  padding: 20px;
}
.fileinput-box {
  width: 200px;
  border: 1px solid #354493;
  border-radius: 6px;
  margin-bottom: 30px;
}
</style>
