<template>
<v-dialog v-model="dialog"  max-width="700px">
    <template v-slot:activator="{ on }">
    <v-icon v-on="on" v-text="'$edit'" color="primary"
    class="float-right"></v-icon>
    </template>
    <v-card>
    <v-card-title>
        <span class="headline">Update Sub-Station</span>
         <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
      <v-col cols="12" md="12">
        <v-text-field label="Name" v-model="newSubstation.name" :rules ="nameRules" required
         @keyup="validateName"></v-text-field>
         <v-text-field label="Number" type="number"
         v-model="newSubstation.numbers" :rules ="numberRules" required
         @keyup="validateNumber"></v-text-field>
        <v-text-field label="Description" type="Description"
         v-model="newSubstation.description"></v-text-field>
        <v-switch
         v-model="newSubstation.initialsubstation"
         label="Initial Sub Station"
         @click="validateInitsst"
        ></v-switch>
        <v-switch
         v-model="newSubstation.finalsubstation"
         label="Final Sub Station"
         @click="validateFinalsst"
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
  },
  data() {
    return {
      dialog: false,
      disabled: false,
      newSubstation: {},
      payload: {},
      btnDisable: false,
      numberRules: [(value) => !!value || 'Number required'],
      nameRules: [(value) => !!value || 'Name required'],
    };
  },
  created() {
    console.log(this.substation);
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
      console.log(this.payload);
    },
    async validateInitsst() {
      debugger;
      const initialSubstationFlag = this.subStations
        .filter((item) => item.sublineid === this.newSubstation.sublineid
        && item.initialsubstation === true);
      const changeInitFlag = this.subStations
        .filter((o) => o.initialsubstation === this.newSubstation.initialsubstation === true);
      if (initialSubstationFlag.length > 0) {
        this.newSubstation.initialsubstation = '';
        // this.btnDisable = true;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST_INITIAL_SUBSTATION',
        });
        this.btnDisable = true;
        this.saving = false;
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
    },
    async validateFinalsst() {
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
        this.btnDisable = true;
        this.saving = false;
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
    },
    async validateName() {
      const substationNameFlag = this.subStations
        .filter((o) => o.name.toLowerCase().split(' ').join('') === this.newSubstation.name.toLowerCase().split(' ').join(''));
      if (substationNameFlag.length > 0) {
        // this.newSubstation.name = '';
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
    },
    async validateNumber() {
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
    },
    async saveSubstation() {
      this.saving = true;
      let created = false;
      debugger;
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
