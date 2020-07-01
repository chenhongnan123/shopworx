  <template>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
    <template v-slot:activator="{ on }">
    <v-icon v-on="on" v-text="'$delete'"
    class="float-right" color="error"></v-icon>
    </template>
      <v-card>
        <v-card-title class="headline">Delete Process?
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
        Do you really want to Delete this Process?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnDeleteProcess"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      // plan: {},
      default: false,
      dialog: false,
    };
  },
  props: {
    process: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['deleteProcess']),
    async btnDeleteProcess() {
      // const deleted = false;
      await this.deleteProcess(this.process.id);
      // if (deleted) {
      //   this.setAlert({
      //     show: true,
      //     type: 'success',
      //     message: 'PROCESS_DELETED',
      //   });
      //   this.dialog = false;
      // } else {
      //   this.setAlert({
      //     show: true,
      //     type: 'error',
      //     message: 'ERROR_DELETING_PROCESS',
      //   });
      // }
      this.dialog = false;
    },
  },
};
</script>
