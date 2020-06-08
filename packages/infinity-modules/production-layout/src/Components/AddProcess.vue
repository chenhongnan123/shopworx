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
        <span class="headline">Add Process</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); dialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-select
              label="Sub Station *"
              :items="subStations"
              item-text="name"
              return-object
              v-model="selectedSubstationLine"
            >
            </v-select>
              <v-text-field label="Name *"
                hint="For example, Process_01"
                v-model="newProcess.name"
                :rules="nameRules"
                counter="15"
                 required type="text" ></v-text-field>
              <v-text-field label="Number *" type="number"
              hint="For example, 11111"
              :rules="numberRules"
              counter="10"
                v-model="newProcess.numbers" required></v-text-field>
              <v-text-field label="Description" type="text"
                hint="For example, added by Manager"
                v-model="newProcess.description" required></v-text-field>
            </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
        class="text-none"
        :disabled="!valid"
         @click="saveProcess">Save</v-btn>
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
      newProcess: {},
      assetId: 4,
      dialog: false,
      selectedSubstationLine: null,
      valid: true,
      name: '',
      numbers: '',
      numberRules: [(v) => v.length > 0 || 'number required',
        (v) => (v && v.length <= 10) || 'Number must be less than 10 characters'],
      nameRules: [(v) => !!v || 'Name required',
        (v) => (v && v.length <= 15) || 'Name must be less than 10 characters'],
    };
  },
  props: {
  },
  created() {
    // this.getSubStations('');
  },
  computed: {
    ...mapState('productionLayout', ['processes', 'addProcessDialog', 'subStations']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout',
      ['createSubline', 'getAllSublines', 'createProcess']),
    async saveProcess() {
      if (this.newProcess.numbers === undefined) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'Number Required',
        });
      } else {
        this.$refs.form.validate();
        const processNumberFlag = this.processes
          .filter((o) => o.numbers === this.newProcess.numbers);
        const processNameFlag = this.processes
          .filter((o) => o.name.toLowerCase().split(' ').join('') === this.newProcess.name.toLowerCase().split(' ').join(''));
        if (processNumberFlag.length > 0) {
          this.newProcess.numbers = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_NO',
          });
        } else if (processNameFlag.length > 0) {
          this.newProcess.name = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST',
          });
        } else {
          this.saving = true;
          this.newProcess = {
            ...this.newProcess,
            lineid: this.lineid,
            substationid: this.selectedSubstationLine.id,
            sublineid: this.selectedSubstationLine.sublineid,
            assetid: this.assetId,
          };
          let created = false;
          const payload = this.newProcess;
          created = this.createProcess(payload);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'PROCESS_CREATED',
            });
            this.dialog = false;
            this.assetId = 4;
            this.newProcess = {};
            this.$refs.form.reset();
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_PROCESS_STATION',
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
