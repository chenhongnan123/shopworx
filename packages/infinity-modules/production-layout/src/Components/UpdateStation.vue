 <template>
<v-dialog v-model="dialog"  max-width="700px">
    <template v-slot:activator="{ on }">
    <!-- <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
    <v-icon v-on="on" v-text="'$edit'" color="primary"
    class="float-right"></v-icon>
    </template>
    <v-card>
    <v-card-title>
        <span class="headline">Update Station</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
      <!-- {{station}} -->
      <v-row>
      <v-col cols="6" md="6">
        <v-text-field label="Name" v-model="newStation.name" required
        @keyup="nameValid" ></v-text-field>
        <v-text-field label="Number" type="number"
         v-model="newStation.numbers" required
         @keyup="numberValid"></v-text-field>
        <v-text-field label="Description" type="Description"
         v-model="newStation.description" ></v-text-field>
        <v-text-field label="Expected OEE %" type="number"
         v-model="newStation.expectedoee" ></v-text-field>
        <v-text-field label="Expected CT Sec"
         v-model="newStation.expectedcycletime" ></v-text-field>
        <v-text-field label="Manuf Date" type="date"
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
        <v-text-field label="Usg StartDate" type="date"
         v-model="newStation.usagestartdate"   dense></v-text-field>
        <v-text-field label="Life time" type="text"
        v-model="newStation.lifetime"   dense></v-text-field>
        <v-text-field label="Process" type="text"
        v-model="newStation.process"  dense></v-text-field>
        <v-text-field label="PLC Ip Address" type="text"
        v-model="newStation.plcipaddress"  dense></v-text-field>
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
    };
  },
  created() {
    this.newStation = { ...this.station };
  },
  computed: {
    ...mapState('productionLayout', ['stations']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['updateStation']),
    async nameValid() {
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
    },
    async numberValid() {
      const stationNumberFlag = this.stations
        .filter((o) => o.numbers === parseInt(this.newStation.numbers, 10));
      if (stationNumberFlag.length > 0) {
        this.btnDisable = true;
        // this.newSubLine = {};
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST_NO',
        });
      } else {
        this.btnDisable = false;
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
        // this.newStation = {};
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_SUBSTATION',
        });
      }
      this.saving = false;
    },
  },
};
</script>

<style>
</style>
