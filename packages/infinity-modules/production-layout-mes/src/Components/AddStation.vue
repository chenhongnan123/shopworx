 <template>
<v-dialog
 persistent
 v-model="dialog"
 transition="dialog-transition"
 max-width="700px">
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
        <span class="headline">Add Station</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); dialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
          <v-row>
            <v-col cols="6" md="6">
              <v-select
              label="Select Subline *"
              :items="sublines"
              item-text="name"
              return-object
              v-model="selectedSubLine"
            >
            </v-select>
              <v-text-field label="Name *"
                hint="For example, STATION-01"
                v-model="newStation.name"
                counter="15"
                :rules ="nameRules" required type="text" ></v-text-field>
              <v-text-field label="Number *"
                type="number"
                hint="For example, 111"
                v-model="newStation.numbers"
                counter="10"
                :rules ="numberRules" required></v-text-field>
              <v-text-field label="Description" type="text"
                hint="For example, Station added by Manager"
                v-model="newStation.description" ></v-text-field>
              <v-text-field label="Expected OEE %" type="number"
                hint="For example, 42"
                v-model="newStation.expectedoee" ></v-text-field>
              <v-text-field label="Expected CT Sec" type="number"
                hint="For example, 45"
                v-model="newStation.expectedcycletime" ></v-text-field>
              <v-text-field label="Manufacturing Date" type="date"
              hint="select Date"
              v-model="newStation.manufacturingdate" ></v-text-field>
            </v-col>
            <v-col cols="6" md="6">
              <v-text-field label="Weight" type="number"
              v-model="newStation.weight"
              hint="For example, 36" ></v-text-field>
              <v-text-field label="Size" type="number"
              v-model="newStation.size"
              hint="For example, 40"   dense></v-text-field>
              <v-text-field label="Voltage" type="number"
              v-model="newStation.voltage"
              hint="For example, 49"   dense></v-text-field>
              <v-text-field label="Power" type="number"
              v-model="newStation.power"
              hint="For example, 42"   dense></v-text-field>
              <v-text-field label="Supplier" type="text"
              v-model="newStation.supplier"
              hint="For example, Entrib Analytics Solution"   dense></v-text-field>
              <v-text-field label="Life time" type="text"
              v-model="newStation.lifetime"
              hint="For example, 4"   dense></v-text-field>
              <v-spacer></v-spacer>
              <!-- <v-text-field label="Process" type="text"
              v-model="newStation.process"
              hint="For example, Night Shift"  dense></v-text-field> -->
              <v-text-field label="PLC Ip Address"
              :rules ="plcRules" required class="mb-3"
              hint="Hint: 127.168.1.1"
              v-model="newStation.plcipaddress"  dense></v-text-field>
              <v-text-field label="Usg Start Date" type="date"
               v-model="newStation.usagestartdate"
               :disabled="usgDateDisabled"
               return-object
               @input="comapareDates"
               hint="select Date which is Greater than Manfacturing Date"   dense></v-text-field>
            </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn> -->
        <v-btn color="primary"
        class="text-none"
        :disabled="!valid"
         @click="saveStation">Save</v-btn>
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
      usgDateDisabled: true,
      newStation: {},
      assetId: null,
      selectedSubLine: null,
      default: false,
      dialog: false,
      valid: true,
      name: '',
      numbers: '',
      plcipaddress: '',
      numberRules: [(v) => (v && v.length) > 0 || 'number required',
        (v) => (v && v.length <= 10) || 'Number must be less than 10 characters'],
      nameRules: [(v) => !!v || 'Name required',
        (v) => (v && v.length <= 15) || 'Name must be less than 15 characters',
        (v) => /^\S+$/.test(v) || 'Space not allowed'],
      plcRules: [(v) => /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|(?=$))){4}$/.test(v) || 'Invalid format'],
    };
  },
  props: {
    lineid: {
      type: String,
      required: true,
    },
  },
  created() {
    // this.getAllSublines('');
    this.getAssets();
  },
  computed: {
    ...mapState('productionLayoutMes', ['stations', 'sublines', 'allSublines', 'assets']),
  },
  watch: {
    newStation: {
      handler(val) {
        if (val.manufacturingdate === undefined || !val.manufacturingdate) {
          this.usgDateDisabled = true;
        } else {
          this.usgDateDisabled = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutMes', ['createSubline', 'getAllSublines', 'createStation', 'getAssets']),
    async comapareDates(item) {
      this.newStation.usagestartdate = '';
      const fromdate = this.newStation.manufacturingdate;
      const todate = item;
      const from = new Date(fromdate);
      const to = new Date(todate);
      if (to < from) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'GREATER_DATE',
        });
        this.valid = false;
      } else {
        this.valid = true;
      }
    },
    async saveStation() {
      if (this.newStation.numbers === undefined) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'Number Required',
        });
      } else {
        this.$refs.form.validate();
        const stationNameFlag = this.stations
          .filter((o) => o.name.toLowerCase().split(' ').join('') === this.newStation.name.toLowerCase().split(' ').join(''));
        const stationNumberFlag = this.stations
          .filter((o) => o.numbers === parseInt(this.newStation.numbers, 10));
        if (stationNumberFlag.length > 0) {
          this.newStation.numbers = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_NO',
          });
        } else if (stationNameFlag.length > 0) {
          this.newStation.name = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST',
          });
        } else {
          this.saving = true;
          const getAssetId = this.assets.reduce((acc, item) => acc + item.id, 0);
          this.assetId = getAssetId;
          this.newStation = {
            ...this.newStation,
            lineid: this.lineid,
            sublineid: this.selectedSubLine.id,
            assetid: this.assetId,
          };
          let created = false;
          const payload = this.newStation;
          created = this.createStation(payload);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'STATION_CREATED, Now Next you can Add SUBSTATION',
            });
            this.dialog = false;
            this.assetId = this.getAssetId;
            this.newStation = {};
            this.$refs.form.reset();
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_STATION',
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
};
</script>

<style>
</style>
