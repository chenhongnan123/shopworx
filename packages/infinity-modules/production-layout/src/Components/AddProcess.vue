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
    <v-card>
    <v-card-title>
        <span class="headline">Add Process</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-select
              label="Sub Station"
              :items="subStations"
              item-text="name"
              return-object
              v-model="selectedSubstationLine"
            >
            </v-select>
              <v-text-field label="Name"
                v-model="newProcess.name" required type="text" ></v-text-field>
              <v-text-field label="Number" type="number"
                v-model="newProcess.numbers" required></v-text-field>
              <v-text-field label="Description" type="text"
                v-model="newProcess.description" required></v-text-field>
            </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
        class="text-none"
         @click="saveProcess">Save</v-btn>
    </v-card-actions>
    </v-card>
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
    };
  },
  props: {
  },
  created() {
    this.getSubStations('');
  },
  computed: {
    ...mapState('productionLayout', ['processes', 'addProcessDialog', 'subStations']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout',
      ['createSubline', 'getAllSublines', 'createProcess']),
    async saveProcess() {
      const processNameFlag2 = this.processes
        .filter((o) => o.numbers === this.newProcess.numbers);
      const stationNameFlag = this.processes
        .filter((o) => o.name.toLowerCase().split(' ').join('') === this.newProcess.name.toLowerCase().split(' ').join(''));
      if (processNameFlag2.length > 0) {
        this.newSubLine = {};
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST_NO',
        });
      } else if (stationNameFlag.length > 0) {
        this.newProcess.stationname = '';
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
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_PROCESS_STATION',
          });
        }
        this.saving = false;
      }
    },
  },
};
</script>

<style>
</style>
