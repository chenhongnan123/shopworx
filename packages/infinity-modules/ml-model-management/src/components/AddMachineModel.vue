 <template>
<v-dialog
 persistent
 v-model="dialog"
 transition="dialog-transition"
 max-width="500px">
   <template v-slot:activator="{ on }">
    <v-icon v-on="on" v-text="'$plus'"
    class="float-right"></v-icon>
    </template>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
    <v-card-title>
        <span class="headline">Add Files</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false);">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
          <v-row>
            <v-col cols="6" md="12">
              <!-- <v-btn color="primary"
                class="text-none"
                @click="importFile">Select Model file</v-btn> -->
            </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn
                block
                id="importFiles"
                color="primary"
                class="text-none"
                @click="uploadFiles"
              >
                <v-icon
                  left
                  v-text="'$upload'"
                ></v-icon>
                Select Model files
              </v-btn>
              <input
              multiple
              type="file"
              ref="uploader"
              class="d-none"
              id="uploadFiles"
              @change="onFilesChanged"
            > -->
        <v-btn color="primary"
        class="text-none">Upload file</v-btn>
        <v-btn color="primary"
        class="text-none"
         @click="saveModel">Save</v-btn>
    </v-card-actions>
    </v-card>
    </v-form>
</v-dialog>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex';

const contentEnum = Object.freeze({
  image: 'image',
  audio: 'audio',
  video: 'video',
  application: 'file',
});

export default {
  data() {
    return {
      files: [],
      name: null,
      description: null,
      assetId: null,
      getAssetId: '',
      dialog: false,
    };
  },
  props: {
    payload: {
      required: true,
    },
    selectedmodel: {
      required: true,
    },
  },
  computed: {
    ...mapState('modelManagement', ['processModelList']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('modelManagement',
      ['addModelFiles', 'getModelRecords', 'uploadFile', 'getInputRecords', 'getOutputRecords', 'getModelFiles']),
    uploadFiles() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(e) {
      this.files = e && e !== undefined ? e.target.files : null;
      // e.target.value = '';
      console.log(this.files);
      await Promise.all([this.files.forEach(async (file) => {
        const { content, nameWithoutExt, extension } = this.getFileDetails(file);
        const object = {
          filename: nameWithoutExt,
          fileextension: extension,
          filecontent: content,
          elementname: 'processmodels',
          assetid: 4,
        };
        await this.uploadFile(object);
      })]);
    },
    getFileDetails(file) {
      const { name, type } = file;
      const [nameWithoutExt] = name.split('.');
      const temp = type.split('/');
      console.log(temp);
      const content = contentEnum[temp[0]] || 'file';
      const extension = temp[1];
      return { content, nameWithoutExt, extension };
    },
    async saveModel() {
      const object = {
        lineid: this.payload.lineid,
        stationid: this.payload.stationid,
        subprocessid: this.payload.processid,
        modelid: this.selectedmodel._id,
        assetid: 4,
      };
      const response = await this.addModelFiles(object);
      if (response) {
        this.dialog = false;
        await this.getModelRecords(`?query=lineid==${object.lineid}%26%26stationid=="${object.stationid}"%26%26subprocessid=="${object.subprocessid}"`);
        // add new logic
        this.processModelList.forEach(async (model) => {
          model.inputlist = await this.getInputRecords(`?query=lineid==${object.lineid}%26%26stationid=="${object.stationid}"
          %26%26subprocessid=="${object.subprocessid}"%26%26modelid=="${this.selectedmodel._id}"`);
          model.outputlist = await this.getOutputRecords(`?query=lineid==${object.lineid}%26%26stationid=="${object.stationid}"
          %26%26subprocessid=="${object.subprocessid}"%26%26modelid=="${this.selectedmodel._id}"`);
          model.filelist = await this.getModelFiles(`?query=lineid==${object.lineid}%26%26stationid=="${object.stationid}"
          %26%26subprocessid=="${object.subprocessid}"%26%26modelid=="${this.selectedmodel._id}"`);
        });
        // this.name = '';
        // this.description = '';
        // await this.getModelRecords(`?query=lineid==$
        // {this.payload.lineid}
        // %26%26stationid=="${this.payload.stationid}"
        // %26%26processid=="${this.payload.processid}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'MODEL_ADDED',
        });
        this.dialog = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MODEL_ADDED',
        });
      }
    },
    async dialogReset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style>
</style>
