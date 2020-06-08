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
        :rules ="nameRules" required></v-text-field>
         <v-text-field label="Number" type="number"
         v-model="newSubstation.numbers"
         :rules ="numberRules"
          required></v-text-field>
        <v-text-field label="Description"
         type="text" v-model="newSubstation.description"></v-text-field>
         <v-switch
        v-model="newSubstation.initialsubstation"
        label="Initial Sub Station"
        ></v-switch>
        <v-switch
        v-model="newSubstation.finalsubstation"
        label="Final Sub Station"
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
      valid: true,
      name: '',
      numbers: '',
      numberRules: [(v) => v.length > 0 || 'number required'],
      nameRules: [(v) => !!v || 'Name required'],
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
    async saveSubstation() {
      this.$refs.form.validate();
      const initialSubstationFlag = this.subStations
        .filter((item) => item.sublineid === this.selectedSubstationLine.sublineid
        && item.initialsubstation === true
        && item.initialsubstation === this.newSubstation.initialsubstation);
      // if (initialSubstationFlag && initialSubstationFlag.length > 0) {
      //   console.log('found');
      // }
      const finalSubstationFlag = this.subStations
        .filter((item) => item.sublineid === this.selectedSubstationLine.sublineid
        && item.finalsubstation === true
        && item.finalsubstation === this.newSubstation.finalsubstation);
      // const initialSubstationCompare = this.initialSubstationFlag
      //   .filter((o) => o.initialsubstation === this.newSubstation.initialsubstation);
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
        created = this.createSubstation(payload);
        if (created) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'SUB-STATION_CREATED',
          });
          this.dialog = false;
          this.assetId = 4;
          this.newSubstation = {};
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
    },
    async dialogReset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style>
</style>
