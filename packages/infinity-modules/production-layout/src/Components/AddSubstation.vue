 <template>
<v-dialog
 persistent
 v-model="dialog"
 transition="dialog-transition"
 max-width="600px">
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
        <span class="headline">Add Substation</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); dialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
        <v-select
              label="Station"
              :items="stations"
              item-text="name"
              return-object
              v-model="selectedSubstationLine"
            >
            </v-select>
        <v-text-field label="Name" v-model="newSubstation.name"
        :rules ="nameRules"
        counter="15"
         required></v-text-field>
         <v-text-field label="Number" type="number"
         v-model="newSubstation.numbers"
         :rules ="numberRules"
         counter="10"
          required></v-text-field>
        <v-text-field label="Description"
         type="text" v-model="newSubstation.description"></v-text-field>
         <v-switch
        v-model="newSubstation.initialsubstation"
        label="Initial Sub Station"
        :disabled="btnInitdisable"
        ></v-switch>
        <v-switch
        v-model="newSubstation.finalsubstation"
        label="Final Sub Station"
        :disabled="btnFindisable"
        ></v-switch>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
        class="text-none"
        :disabled="!valid"
         @click="saveSubstation">Save</v-btn>
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
      newSubstation: {},
      assetId: 4,
      selectedSubstationLine: null,
      default: false,
      dialog: false,
      btnInitdisable: false,
      btnFindisable: false,
      valid: true,
      name: '',
      numbers: '',
      numberRules: [(v) => v.length > 0 || 'number required',
        (v) => (v && v.length <= 10) || 'Number must be less than 10 characters'],
      nameRules: [(v) => !!v || 'Name required',
        (v) => (v && v.length <= 15) || 'Name must be less than 10 characters'],
    };
  },
  props: {
  },
  created() {
    this.getAllStations('');
    this.newSubstation = { ...this.substation };
  },
  computed: {
    ...mapState('productionLayout', ['sublines', 'allStations', 'stations', 'subStations']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['createSubstation', 'getSubStations', 'getAllStations']),
    compareValues(val) {
      if (val.initialsubstation === true) {
        this.btnFindisable = true;
      } else {
        this.btnFindisable = false;
      }
      if (val.finalsubstation === true) {
        this.btnInitdisable = true;
      } else {
        this.btnInitdisable = false;
      }
    },
    async saveSubstation() {
      if (this.newSubstation.numbers === undefined) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'Number Required',
        });
      } else {
        this.$refs.form.validate();
        const initialSubstationFlag = this.subStations
          .filter((item) => item.sublineid === this.selectedSubstationLine.sublineid
          && item.initialsubstation === true
          && item.initialsubstation === this.newSubstation.initialsubstation);
        const finalSubstationFlag = this.subStations
          .filter((item) => item.sublineid === this.selectedSubstationLine.sublineid
          && item.finalsubstation === true
          && item.finalsubstation === this.newSubstation.finalsubstation);
        const substationNumberFlag = this.subStations
          .filter((o) => o.numbers === parseInt(this.newSubstation.numbers, 10));
        const substationNameFlag = this.subStations
          .filter((o) => o.name.toLowerCase().split(' ').join('') === this.newSubstation.name.toLowerCase().split(' ').join(''));
        if (substationNumberFlag.length > 0) {
          this.newSubstation.numbers = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_NO',
          });
        } else if (initialSubstationFlag.length > 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_INITIAL_SUBSTATION',
          });
        } else if (finalSubstationFlag.length > 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_FINAL_SUBSTATION',
          });
        } else if (substationNameFlag.length > 0) {
          this.newSubstation.name = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST',
          });
        } else {
          this.saving = true;
          this.newSubstation = {
            ...this.newSubstation,
            stationid: this.selectedSubstationLine.id,
            sublineid: this.selectedSubstationLine.sublineid,
            assetid: this.assetId,
          };
          let created = false;
          const payload = this.newSubstation;
          console.log(payload);
          created = this.createSubstation(payload);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'SUB-STATION_CREATED',
            });
            this.newSubstation = {};
            this.dialog = false;
            this.assetId = 4;
            this.$refs.form.reset();
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_SUB-STATION',
            });
          }
          this.saving = false;
        }
      }
    },
    async dialogReset() {
      this.$refs.form.reset();
    },
  },
  watch: {
    newSubstation: {
      handler(val) {
        console.log('changed');
        this.compareValues(val);
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>
