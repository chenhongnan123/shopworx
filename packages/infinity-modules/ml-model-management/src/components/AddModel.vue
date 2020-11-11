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
        <span class="headline">Add Model</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false);">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
          <v-row>
            <v-col cols="6" md="12">
            <v-text-field
              outlined
              v-model="name"
              label="Name"
            ></v-text-field>
            <v-textarea outlined
              v-model="description">
              <template v-slot:label>
                <div>Description</div>
              </template>
            </v-textarea>
              <!-- <v-btn color="primary"
                class="text-none"
                @click="importFile">Select Model file</v-btn> -->
            </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
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
  },
  computed: {
    ...mapState('modelManagement', [
      'subStations',
    ]),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('modelManagement',
      ['addProcessModel', 'getModelRecords', 'uploadFile']),
    async saveModel() {
      const object = {
        lineid: this.payload.lineid,
        stationid: this.subStations.find((f) => f.id === this.payload.substationid).stationid,
        substationid: this.payload.substationid,
        subprocessid: this.payload.id,
        modelname: this.name,
        modeldescription: this.description,
        assetid: 4,
      };
      const response = await this.addProcessModel(object);
      if (response) {
        this.dialog = false;
        this.name = '';
        this.description = '';
        await this.getModelRecords(`?query=lineid==${object.lineid}%26%26stationid=="${object.stationid}"%26%26subprocessid=="${object.subprocessid}"`);
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
