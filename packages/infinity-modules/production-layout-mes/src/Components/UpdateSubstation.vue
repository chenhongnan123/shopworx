 <template>
<v-dialog v-model="dialog"  max-width="700px">
    <template v-slot:activator="{ on }">
    <v-icon v-on="on" v-text="'$edit'" color="primary"
    class="float-right"></v-icon>
    </template>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
    <v-card-title>
        <span class="headline">Update Sub-Station</span>
         <v-spacer></v-spacer>
          <v-btn icon small @click="(dialog = false); resetDialog();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
      <v-col cols="12" md="12">
        <v-text-field label="Name *" v-model="newSubstation.name"
         :rules ="nameRules"
         :counter="15"
          required
          hint="For example, SST_01"
         @keyup="validateName"></v-text-field>
         <v-text-field label="Number *" type="number"
         v-model="newSubstation.numbers" :rules ="numberRules"
         :counter="10"
          required
          hint="For example, 123"
         @keyup="validateNumber"></v-text-field>
         <v-text-field label="Serial Number *" type="number"
         hint="For example, 1,2,3,4"
         v-model="newSubstation.serialnumber"
         :rules ="numberRules"
         counter="10"
          required></v-text-field>
        <v-text-field label="Description" type="Description"
        hint="For example, Updated by Manager"
         v-model="newSubstation.description"></v-text-field>
        <v-textarea
        dense
        rows="3"
        outlined
        single-line
        v-model="newSubstation.jsondata"
        label="Paste JSON here"
        :rules="configRules"
      ></v-textarea>
        <v-switch
         v-model="newSubstation.serverlive"
         label="Server Live value"
        ></v-switch>
        <div>
        <v-switch
         v-model="newSubstation.initialsubstation"
         label="Initial Sub Station"
         @change="validateInitsst"
         :disabled="initialStationDisable || btnInitdisable"
        ></v-switch>
        </div>
        <v-switch
         v-model="newSubstation.finalsubstation"
         label="Final Sub Station"
         @change="validateFinalsst"
         :disabled="finalStationDisable || btnFindisable"
        ></v-switch>
      </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="btnDisable"
          @click="saveSubstation"
        >
          Save
        </v-btn>
    </v-card-actions>
    </v-card>
    </v-form>
</v-dialog>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  props: {
    substation: {
      type: Object,
      required: true,
    },
    lineid: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      disabled: false,
      newSubstation: {},
      payload: {},
      btnDisable: false,
      btnInitdisable: false,
      initialStationDisable: false,
      btnFindisable: false,
      finalStationDisable: false,
      valid: true,
      name: '',
      numbers: '',
      configRules: [
        (v) => !!v || 'Configuration is required.',
        (v) => this.isValidJsonString(v) || 'Input valid JSON configuration.',
      ],
      numberRules: [(value) => !!value || 'Number required',
        (v) => (v && v.length <= 10) || 'Number must be less than 10 characters',
      ],
      nameRules: [(value) => !!value || 'Name required',
        (v) => (v && v.length <= 15) || 'Name must be less than 15 characters',
      ],
    };
  },
  created() {
    this.newSubstation = { ...this.substation };
    this.disabled = true;
    this.btnDisable = false;
  },
  computed: {
    ...mapState('productionLayoutMes', ['subStations']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutMes', ['updateSubstation']),
    isValidJsonString(jsonString) {
      if (!(jsonString && typeof jsonString === 'string')) {
        return false;
      }
      try {
        JSON.parse(jsonString);
        return true;
      } catch (error) {
        return false;
      }
    },
    compareValues(val) {
      if (val.name !== this.substation.name) {
        this.payload.name = val.name;
      } else {
        delete this.payload.name;
      }
      if (parseInt(val.numbers, 10) !== this.substation.numbers) {
        this.payload.numbers = val.numbers;
      } else {
        delete this.payload.numbers;
      }
      if (val.initialsubstation !== this.substation.initialsubstation) {
        this.payload.initialsubstation = val.initialsubstation;
      } else {
        delete this.payload.initialsubstation;
      }
      if (val.finalsubstation !== this.substation.finalsubstation) {
        this.payload.finalsubstation = val.finalsubstation;
      } else {
        delete this.payload.finalsubstation;
      }
      if (this.payload !== {}) {
        this.disabled = false;
      }
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
    async validateInitsst() {
      if (this.newSubstation.initialsubstation === true) {
        const initialSubstationFlag = this.subStations
          .filter((item) => item.sublineid === this.newSubstation.sublineid
          && item.initialsubstation === true);
        const changeInitFlag = this.subStations
          .filter((o) => o.initialsubstation
           === this.newSubstation.initialsubstation === true);
        if (initialSubstationFlag.length > 0) {
          this.newSubstation.initialsubstation = '';
          this.initialStationDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_INITIAL_SUBSTATION',
          });
        } else if (changeInitFlag.length > 0) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'INITIAL_SUBSTATION_ASSIGNED',
          });
        } else {
          this.initialStationDisable = false;
          this.saving = true;
        }
      } else {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'INITIAL_SUBSTATION_REMOVED',
        });
      }
    },
    async validateFinalsst() {
      if (this.newSubstation.finalsubstation === true) {
        const finalSubstationFlag = this.subStations
          .filter((item) => item.sublineid === this.newSubstation.sublineid
          && item.finalsubstation === true);
        const changeFinalFlag = this.subStations
          .filter((o) => o.finalsubstation === this.newSubstation.finalsubstation === true);
        if (finalSubstationFlag.length > 0) {
          this.newSubstation.finalsubstation = '';
          this.finalStationDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_FINAL_SUBSTATION',
          });
        } else if (changeFinalFlag.length > 0) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'FINAL_SUBSTATION_ASSIGNED',
          });
        } else {
          this.finalStationDisable = false;
          this.saving = true;
        }
      } else {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'FINAL_SUBSTATION_REMOVED',
        });
      }
    },
    async validateName() {
      if (this.newSubstation.name === '' || this.newSubstation.name.length > 15) {
        this.btnDisable = true;
      } else {
        const substationNameFlag = this.subStations
          .filter((o) => o.name.toLowerCase().split(' ').join('') === this.newSubstation.name.toLowerCase().split(' ').join(''));
        if (substationNameFlag.length > 0) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST',
          });
        } else {
          this.btnDisable = false;
          this.saving = true;
        }
      }
    },
    async validateNumber() {
      if (this.newSubstation.numbers === '' || this.newSubstation.numbers.length > 10) {
        this.btnDisable = true;
      } else {
        const substationNumberFlag = this.subStations
          .filter((o) => o.numbers === parseInt(this.newSubstation.numbers, 10));
        if (substationNumberFlag.length > 0) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_NO',
          });
        } else {
          this.btnDisable = false;
          this.saving = true;
        }
      }
    },
    async saveSubstation() {
      this.saving = true;
      let created = false;
      // if (this.newSubstation.serialnumber) {
      //   this.payload.serialnumber = this.newSubstation.serialnumber;
      // }
      // if (this.newSubstation.description) {
      //   this.payload.description = this.newSubstation.description;
      // }
      // if (this.newSubstation.jsondata) {
      //   this.payload.jsondata = this.newSubstation.jsondata;
      // }
      // if (this.newSubstation.serverlive) {
      //   this.payload.serverlive = this.newSubstation.serverlive;
      // }
      const payload = {
        query: `?query=id=="${this.substation.id}"`,
        payload: this.newSubstation,
        stationid: this.substation.stationid,
      };
      created = this.updateSubstation(payload);
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'SUBSTATION_UPDATED',
        });
        this.finalStationDisable = false;
        this.btnDisable = false;
        this.dialog = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_SUBSTATION',
        });
        this.saving = false;
      }
    },
    async resetDialog() {
      this.$refs.form.resetValidation();
      this.newSubstation = { ...this.substation };
      this.initialStationDisable = false;
      this.finalStationDisable = false;
      this.btnDisable = false;
    },
  },
  watch: {
    newSubstation: {
      handler(val) {
        this.compareValues(val);
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>
