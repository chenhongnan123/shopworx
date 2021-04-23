<template>
  <v-dialog v-model="dialog" max-width="700px">
    <template #activator="{ on }">
      <v-icon v-on="on" v-text="'$edit'" color="primary" class="float-right"></v-icon>
    </template>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title>
          <span class="headline">Update Machine</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            small
            @click="
              dialog = false;
              resetDialog();
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6" md="6">
              <v-text-field
                label="Name *"
                v-model="newMachine.machinename"
                :rules="nameRules"
                :counter="15"
                required
                hint="For example, ST_01"
                @keyup="nameValid"
              ></v-text-field>
              <v-text-field
                label="Description"
                type="Description"
                hint="For example, Updated by Manager"
                v-model="newMachine.description"
              ></v-text-field>
              <v-text-field
                label="Expected OEE %"
                type="number"
                v-model="newMachine.expectedoee"
              ></v-text-field>
              <v-text-field
                label="Expected CT Sec"
                v-model="newMachine.expectedcycletime"
              ></v-text-field>
              <v-text-field
                label="Manufacturing Date"
                type="date"
                v-model="newMachine.manufacturingdate"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6" md="6">
              <v-text-field
                label="Weight"
                type="number"
                v-model="newMachine.weight"
                dense
              ></v-text-field>
              <v-text-field label="Size" v-model="newMachine.size" dense></v-text-field>
              <v-text-field
                label="Voltage"
                type="number"
                v-model="newMachine.voltage"
                dense
              ></v-text-field>
              <v-text-field
                label="Power"
                type="Description"
                v-model="newMachine.power"
                dense
              ></v-text-field>
              <v-text-field
                label="Supplier"
                type="Description"
                v-model="newMachine.supplier"
                dense
              ></v-text-field>
              <v-text-field
                label="Life time"
                type="text"
                v-model="newMachine.lifetime"
                dense
              ></v-text-field>
              <v-text-field
                label="PLC Ip Address"
                mask="###.###.###-##"
                :rules="plcRules"
                required
                class="mb-3"
                hint="Hint: 127.168.1.1"
                v-model="newMachine.plcipaddress"
                dense
              ></v-text-field>
              <v-text-field
                label="Usg Start Date"
                type="date"
                v-model="newMachine.usagestartdate"
                dense
              ></v-text-field>
              <v-text-field
                label="Init Count"
                type="number"
                v-model="newMachine.initcount"
                dense
                :rules="numberRules"
              ></v-text-field>
               <v-text-field
                label="Status"
                v-model="newMachine.status"
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="text-none" :disabled="btnDisable" @click="saveMachine"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  props: {
    machine: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      newMachine: {},
      btnDisable: false,
      valid: true,
      name: '',
      numbers: '',
      plcipaddress: '',
      numberRules: [
        (value) => !!value || 'Number required',
        (v) => (v && v.length <= 10) || 'Number must be less than 10 characters',
      ],
      nameRules: [
        (value) => !!value || 'Name required',
        (v) => (v && v.length <= 15) || 'Name must be less than 15 characters',
      ],
      plcRules: [
        (v) => !!v || 'Required',
        (v) =>
          // eslint-disable-next-line
          /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|(?=$))){4}$/.test(v) || 'Invalid format',
      ],
    };
  },
  created() {
    this.newMachine = { ...this.machine };
  },
  computed: {
    ...mapState('productionLayoutSF', ['machines', 'subMachinesForIP']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutSF', ['updateMachine', 'updateIpAddressForParameters']),
    async nameValid() {
      if (this.newMachine.machinename === '' || this.newMachine.machinename.length > 15) {
        this.btnDisable = true;
      } else {
        const machineNameFlag = this.machines.filter(
          (o) =>
            // eslint-disable-next-line
            o.machinename
              .toLowerCase()
              .split(' ')
              // eslint-disable-next-line
              .join('') ===
            this.newMachine.machinename
              .toLowerCase()
              .split(' ')
              .join(''),
        );
        if (machineNameFlag.length > 0) {
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
      if (this.newMachine.numbers === '' || this.newMachine.numbers.length > 10) {
        this.btnDisable = true;
      } else {
        const machineNumberFlag = this.machines.filter(
          (o) => o.numbers === parseInt(this.newMachine.numbers, 10),
        );
        if (machineNumberFlag.length > 0) {
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
    async saveMachine() {
      this.saving = true;
      this.newMachine = {
        machinename: this.newMachine.machinename,
        description: this.newMachine.description,
        numbers: this.newMachine.numbers,
        expectedoee: this.newMachine.expectedoee,
        expectedcycletime: this.newMachine.expectedcycletime,
        manufacturingdate: this.newMachine.manufacturingdate,
        weight: this.newMachine.weight,
        size: this.newMachine.size,
        voltage: this.newMachine.voltage,
        power: this.newMachine.power,
        supplier: this.newMachine.supplier,
        usagestartdate: this.newMachine.usagestartdate,
        lifetime: this.newMachine.lifetime,
        process: this.newMachine.process,
        plcipaddress: this.newMachine.plcipaddress,
        initcount: Number(this.newMachine.initcount),
        status: this.newMachine.status,
      };
      let created = false;
      const payload = {
        query: `?query=id=="${this.machine.id}"`,
        payload: this.newMachine,
      };
      created = this.updateMachine(payload);
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

<style></style>
