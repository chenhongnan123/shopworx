<template>
  <v-dialog persistent v-model="dialog" transition="dialog-transition" max-width="700px">
    <template #activator="{ on }">
      <v-icon v-on="on" v-text="'$plus'" class="float-right"></v-icon>
    </template>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title>
          <span class="headline">Add Machine</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            small
            @click="
              dialog = false;
              dialogReset();
            "
          >
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
              <v-text-field
                label="Code *"
                hint="For example, M01"
                v-model="newMachine.machinecode"
                counter="15"
                :rules="nameRules"
                required
                type="text"
              ></v-text-field>
              <v-text-field
                label="Name *"
                hint="For example, MACHINE-01"
                v-model="newMachine.machinename"
                counter="15"
                :rules="nameRules"
                required
                type="text"
              ></v-text-field>
              <v-text-field
                label="Cell *"
                v-model="newMachine.machinecell"
                counter="15"
                :rules="nameRules"
                required
                type="text"
              ></v-text-field>
              <v-text-field
                label="Description"
                type="text"
                hint="For example, Machine added by Manager"
                v-model="newMachine.description"
              ></v-text-field>
              <v-text-field
                label="Expected OEE %"
                type="number"
                hint="For example, 42"
                v-model="newMachine.expectedoee"
              ></v-text-field>
              <v-text-field
                label="Expected CT Sec"
                type="number"
                hint="For example, 45"
                v-model="newMachine.expectedcycletime"
              ></v-text-field>
              <v-text-field
                label="Manufacturing Date"
                type="date"
                hint="select Date"
                v-model="newMachine.manufacturingdate"
              ></v-text-field>
            </v-col>
            <v-col cols="6" md="6">
              <v-text-field
                label="Weight"
                type="number"
                v-model="newMachine.weight"
                hint="For example, 36"
              ></v-text-field>
              <v-text-field
                label="Size"
                type="number"
                v-model="newMachine.size"
                hint="For example, 40"
                dense
              ></v-text-field>
              <v-text-field
                label="Voltage"
                type="number"
                v-model="newMachine.voltage"
                hint="For example, 49"
                dense
              ></v-text-field>
              <v-text-field
                label="Power"
                type="number"
                v-model="newMachine.power"
                hint="For example, 42"
                dense
              ></v-text-field>
              <v-text-field
                label="Supplier"
                type="text"
                v-model="newMachine.supplier"
                hint="For example, Entrib Analytics Solution"
                dense
              ></v-text-field>
              <v-text-field
                label="Life time"
                type="text"
                v-model="newMachine.lifetime"
                hint="For example, 4"
                dense
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-text-field
                label="Usg Start Date"
                type="date"
                v-model="newMachine.usagestartdate"
                hint="select Date which is Greater than Manfacturing Date"
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
          <v-btn color="primary" class="text-none" :disabled="!valid" @click="saveMachine"
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
  data() {
    return {
      newMachine: {},
      assetId: null,
      selectedSubLine: null,
      default: false,
      dialog: false,
      valid: true,
      name: '',
      numbers: '',
      plcipaddress: '',
      nameRules: [
        (v) => !!v || 'Name required',
        (v) => (v && v.length <= 15) || 'Name must be less than 15 characters',
      ],
      statusRules: [
        (v) => !!v || 'Status required',
        (v) => (v && v.length <= 15) || 'Status must be less than 15 characters',
      ],
      numberRules: [(v) => !!v || 'number required',
        (v) => (v && v >= 0) || 'Number must be bigger than 0'],
      plcRules: [
        (v) =>
          // eslint-disable-next-line
          /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|(?=$))){4}$/.test(v) || 'Invalid format',
      ],
    };
  },
  props: {
    lineid: {
      type: Number,
      required: true,
    },
    linename: {
      type: String,
      required: true,
    },
  },
  created() {
    this.getAssets();
  },
  computed: {
    ...mapState('productionLayoutSF', ['machines', 'sublines', 'allSublines', 'assets']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutSF', [
      'createSubline',
      'getAllSublines',
      'createMachine',
      'getAssets',
    ]),
    async saveMachine() {
      this.$refs.form.validate();
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
      const machineNumberFlag = this.machines.filter(
        (o) => o.numbers === parseInt(this.newMachine.numbers, 10),
      );
      if (machineNumberFlag.length > 0) {
        this.newMachine.numbers = '';
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST_NO',
        });
      } else if (machineNameFlag.length > 0) {
        this.newMachine.machinename = '';
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST',
        });
      } else {
        this.saving = true;
        const getAssetId = this.assets
          .filter((item) => item.status === 'ACTIVE')
          .reduce((acc, item) => acc + item.id, 0);
        this.assetId = getAssetId;
        this.newMachine = {
          ...this.newMachine,
          lineid: this.lineid,
          linename: this.linename,
          sublineid: this.selectedSubLine.id,
          sublinename: this.selectedSubLine.name,
          assetid: this.assetId,
          initcount: Number(this.newMachine.initcount),
        };
        let created = false;
        const payload = this.newMachine;
        created = this.createMachine(payload);
        if (created) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'MACHINE_CREATED',
          });
          this.dialog = false;
          this.assetId = this.getAssetId;
          this.newMachine = {};
          this.$refs.form.reset();
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_CREATING_MACHINE',
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

<style></style>
