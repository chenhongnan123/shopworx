 <template>
<v-dialog v-model="dialog"  max-width="700px">
     <template v-slot:activator="{ on }">
    <v-icon v-on="on" v-text="'$edit'" color="primary"
    class="float-right"></v-icon>
    </template>
    <v-card>
    <v-card-title>
        <span class="headline">Update Process</span>
         <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
      <v-col cols="12" md="12">
        <v-text-field label="Name" v-model="processNew.name" required
          @keyup="nameValid" ></v-text-field>
         <v-text-field label="Number" type="number"
          v-model="processNew.numbers" required
          @keyup="numberValid"></v-text-field>
        <v-text-field label="Description" type="Description"
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
    };
  },
  created() {
    this.processNew = { ...this.process };
  },
  computed: {
    ...mapState('productionLayout', ['processes']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['updateProcess']),
    async nameValid() {
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
    },
    async numberValid() {
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
      created = this.updateProcess(payload);
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PROCESS_UPDATED',
        });
        this.dialog = false;
        this.assetId = 4;
        // this.newProcess = {};
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_PROCESS',
        });
      }
      this.saving = false;
    },
  },
};
</script>

<style>
</style>
