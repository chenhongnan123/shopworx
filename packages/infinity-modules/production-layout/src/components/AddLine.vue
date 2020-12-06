 <template>
<v-dialog
 persistent
 v-model="dialog"
 transition="dialog-transition"
 max-width="700px">
   <template #activator="{ on }">
    <!-- <v-icon v-on="on" v-text="'$plus'"
    class="float-right"></v-icon> -->
    <v-btn
      v-on="on"
      small
      color="primary"
      class="text-none ml-2"
      @click="toggleFilter"
    >
    <v-icon small left>mdi-plus</v-icon>
    Add new Line
    </v-btn>
    </template>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
    <v-card-title>
        <span class="headline">Add Line</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); dialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field label="Line ID"
                v-model="id"
                type="number"
                required>
                </v-text-field>
              <v-text-field label="Line Name"
              counter="10"
              v-model="name" required>
              </v-text-field>
            </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
        class="text-none"
        :disabled="!valid"
         @click="saveLine">Save</v-btn>
    </v-card-actions>
    </v-card>
    </v-form>
</v-dialog>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      id: null,
      assetId: null,
      getAssetId: '',
      dialog: false,
      name: null,
      valid: true,
    };
  },
  props: {
  },
  created() {
    this.getAssets();
  },
  computed: {
    ...mapState('productionLayout', ['selectedLine', 'substationsbylines', 'processes', 'addProcessDialog', 'subStations', 'assets']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout',
      ['createSubline', 'getAllSublines', 'createLine', 'getSubStationbyline', 'getAssets']),
    async saveLine() {
      this.saving = true;
      const getAssetId = this.assets.reduce((acc, item) => acc + item.id, 0);
      this.assetId = getAssetId;
      this.newProcess = {
        id: this.id,
        name: this.name,
        assetid: this.assetId,
      };
      let created = false;
      const payload = this.newProcess;
      created = this.createLine(payload);
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PROCESS_CREATED',
        });
        this.dialog = false;
        this.assetId = this.getAssetId;
        this.id = null;
        this.name = null;
        this.$refs.form.reset();
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_PROCESS_STATION',
        });
      }
      this.saving = false;
    },
    async dialogReset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style>
</style>
