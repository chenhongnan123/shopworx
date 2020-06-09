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
        <span class="headline">Update Process</span>
         <v-spacer></v-spacer>
          <v-btn icon small @click="(dialog = false); resetDialog();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
      <v-col cols="12" md="12">
        <v-text-field label="Name" v-model="processNew.name"
          :rules="nameRules"
          :counter="15"
           required
           hint="For example, Process_01"
          @keyup="nameValid" ></v-text-field>
         <v-text-field label="Number" type="number"
          v-model="processNew.numbers"
          :rules="numberRules"
          :counter="10"
           required
           hint="For example, 1231"
          @keyup="numberValid"></v-text-field>
        <v-text-field label="Description" type="Description"
        hint="For example, Updated by Manager"
         v-model="processNew.description"></v-text-field>
      </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
        class="text-none"
        :disabled="btnDisable"
        @click="saveProcess">Save</v-btn>
    </v-card-actions>
    </v-card>
    </v-form>
</v-dialog>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  props: {
    process: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      processNew: {},
      btnDisable: false,
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
    console.log(this.process);
    this.processNew = { ...this.process };
  },
  computed: {
    ...mapState('productionLayout', ['processes']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['updateProcess']),
    async nameValid() {
      if (this.processNew.name === '' || this.processNew.name.length > 15) {
        this.btnDisable = true;
      } else {
        const processNameFlag = this.processes
          .filter((o) => o.name.toLowerCase().split(' ').join('') === this.processNew.name.toLowerCase().split(' ').join(''));
        if (processNameFlag.length > 0) {
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
      if (this.processNew.numbers === '' || this.processNew.numbers.length > 10) {
        this.btnDisable = true;
      } else {
        const processNumberFlag = this.processes
          .filter((o) => o.numbers === this.processNew.numbers);
        if (processNumberFlag.length > 0) {
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
    async saveProcess() {
      this.saving = true;
      this.newProcess = {
        name: this.processNew.name,
        numbers: this.processNew.numbers,
        description: this.processNew.description,
      };
      let created = false;
      const payload = {
        query: `?query=id=="${this.process.id}"`,
        payload: this.newProcess,
        substationid: this.process.substationid,
      };
      console.log(payload);
      created = this.updateProcess(payload);
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PROCESS_UPDATED',
        });
        this.dialog = false;
        this.assetId = 4;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_PROCESS',
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
