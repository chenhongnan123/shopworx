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
        <v-text-field label="Description" type="Description"
        hint="For example, Updated by Manager"
         v-model="newSubstation.description"></v-text-field>
        <v-switch
         v-model="newSubstation.initialsubstation"
         label="Initial Sub Station"
         @change="validateInitsst"
         :disabled="btnInitdisable"
        ></v-switch>
        <v-switch
         v-model="newSubstation.finalsubstation"
         label="Final Sub Station"
         @change="validateFinalsst"
         :disabled="btnFindisable"
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
      btnFindisable: false,
      valid: true,
      name: '',
      numbers: '',
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
  },
  computed: {
    ...mapState('productionLayout', ['subStations']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['updateSubstation']),
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
          this.btnDisable = false;
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
          // this.btnDisable = true;
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
          this.btnDisable = false;
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
      const payload = {
        query: `?query=id=="${this.substation.id}"`,
        payload: this.payload,
        stationid: this.substation.stationid,
      };
      created = this.updateSubstation(payload);
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'SUBSTATION_UPDATED',
        });
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
      this.sublineNew = { ...this.subline };
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
