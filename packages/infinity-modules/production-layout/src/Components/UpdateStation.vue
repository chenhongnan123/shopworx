 <template>
<v-dialog v-model="dialog"  max-width="700px">
    <template v-slot:activator="{ on }">
    <!-- <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
    <v-icon v-on="on" v-text="'$edit'" color="primary"
    class="float-right"></v-icon>
    </template>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
    <v-card-title>
        <span class="headline">Update Station</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); resetDialog();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
      <!-- {{station}} -->
      <v-row>
      <v-col cols="6" md="6">
        <v-text-field label="Name *" v-model="newStation.name"
        :rules="nameRules"
        :counter="15"
         required
         hint="For example, ST_01"
        @keyup="nameValid" ></v-text-field>
        <v-text-field label="Number *" type="number"
         v-model="newStation.numbers"
         :rules="numberRules"
         :counter="10"
          required
          hint="For example, 122"
         @keyup="numberValid"></v-text-field>
        <v-text-field label="Description" type="Description"
        hint="For example, Updated by Manager"
         v-model="newStation.description" ></v-text-field>
        <v-text-field label="Expected OEE %" type="number"
         v-model="newStation.expectedoee" ></v-text-field>
        <v-text-field label="Expected CT Sec"
         v-model="newStation.expectedcycletime" ></v-text-field>
        <v-text-field label="Manufacturing Date" type="date"
         v-model="newStation.manufacturingdate"  dense></v-text-field>
      </v-col>
      <v-col cols="6" md="6">
        <v-text-field label="Weight" type="number"
         v-model="newStation.weight"  dense></v-text-field>
        <v-text-field label="Size"
        v-model="newStation.size"   dense></v-text-field>
        <v-text-field label="Voltage" type="number"
        v-model="newStation.voltage"   dense></v-text-field>
        <v-text-field label="Power" type="Description"
        v-model="newStation.power"   dense></v-text-field>
        <v-text-field label="Supplier" type="Description"
        v-model="newStation.supplier"   dense></v-text-field>
        <v-text-field label="Life time" type="text"
        v-model="newStation.lifetime"   dense></v-text-field>
        <!-- <v-text-field label="Process" type="text"
        v-model="newStation.process"  dense></v-text-field> -->
        <v-text-field label="PLC Ip Address" mask="###.###.###-##"
        :rules ="plcRules" required
        class="mb-3"
        hint="Hint: 127.168.1.1"
        v-model="newStation.plcipaddress"  dense></v-text-field>
        <v-text-field label="Usg Start Date" type="date"
         v-model="newStation.usagestartdate"   dense></v-text-field>
      </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
        class="text-none"
        :disabled="btnDisable"
        @click="saveStation">Save</v-btn>
    </v-card-actions>
    </v-card>
    </v-form>
</v-dialog>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  props: {
    station: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      newStation: {},
      btnDisable: false,
      valid: true,
      name: '',
      numbers: '',
      plcipaddress: '',
      numberRules: [(value) => !!value || 'Number required',
        (v) => (v && v.length <= 10) || 'Number must be less than 10 characters',
      ],
      nameRules: [(value) => !!value || 'Name required',
        (v) => (v && v.length <= 15) || 'Name must be less than 15 characters',
      ],
      plcRules: [(v) => !!v || 'Required', (v) => /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|(?=$))){4}$/.test(v) || 'Invalid format'],
    };
  },
  created() {
    this.newStation = { ...this.station };
  },
  computed: {
    ...mapState('productionLayout', ['stations', 'subStationsForIP']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['updateStation', 'updateIpAddressForParameters']),
    async nameValid() {
      if (this.newStation.name === '' || this.newStation.name.length > 15) {
        this.btnDisable = true;
      } else {
        const stationNameFlag = this.stations
          .filter((o) => o.name.toLowerCase().split(' ').join('') === this.newStation.name.toLowerCase().split(' ').join(''));
        if (stationNameFlag.length > 0) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST',
          });
        } else {
          this.btnDisable = false;
        }
      }
    },
    async numberValid() {
      if (this.newStation.numbers === '' || this.newStation.numbers.length > 10) {
        this.btnDisable = true;
      } else {
        const stationNumberFlag = this.stations
          .filter((o) => o.numbers === parseInt(this.newStation.numbers, 10));
        if (stationNumberFlag.length > 0) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_NO',
          });
        } else {
          this.btnDisable = false;
        }
      }
    },
    async saveStation() {
      this.saving = true;
      this.newStation = {
        name: this.newStation.name,
        description: this.newStation.description,
        numbers: this.newStation.numbers,
        expectedoee: this.newStation.expectedoee,
        expectedcycletime: this.newStation.expectedcycletime,
        manufacturingdate: this.newStation.manufacturingdate,
        weight: this.newStation.weight,
        size: this.newStation.size,
        voltage: this.newStation.voltage,
        power: this.newStation.power,
        supplier: this.newStation.supplier,
        usagestartdate: this.newStation.usagestartdate,
        lifetime: this.newStation.lifetime,
        process: this.newStation.process,
        plcipaddress: this.newStation.plcipaddress,
      };
      let created = false;
      const payload = {
        query: `?query=id=="${this.station.id}"`,
        payload: this.newStation,
        stationid: this.station.stationid,
      };
      created = this.updateStation(payload);
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'SUBSTATION_UPDATED',
        });
        this.dialog = false;
        const ipaddress = this.newStation.plcipaddress;
        const object = {
          query: `?query=stationid=="${this.station.id}"`,
          payload: {
            plcaddress: ipaddress,
          },
        };
        await this.updateIpAddressForParameters(object);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_SUBSTATION',
        });
      }
      this.saving = false;
    },
    async resetDialog() {
      this.$refs.form.resetValidation();
      this.sublineNew = { ...this.subline };
    },
  },
};
</script>

<style>
</style>
