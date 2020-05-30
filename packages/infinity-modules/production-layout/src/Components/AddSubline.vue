 <template>
<v-dialog
 persistent
 v-model="dialog"
 transition="dialog-transition"
 max-width="600px">
    <template v-slot:activator="{ on }">
    <v-icon v-on="on" v-text="'$plus'"
    class="float-right"></v-icon>
    </template>
    <v-card>
    <v-card-title>
        <span class="headline">Add Subline</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
        <v-text-field label="Name" v-model="newSubLine.name" required></v-text-field>
        <v-text-field label="Number"
         type="number" v-model="newSubLine.numbers" required></v-text-field>
        <v-text-field label="Description"
         type="text" v-model="newSubLine.description"></v-text-field>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
        class="text-none"
         @click="saveSubline">Save</v-btn>
    </v-card-actions>
    </v-card>
</v-dialog>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      newSubLine: {},
      assetId: 4,
      // myResult: [],
      // getLastInserTedData: [],
      default: false,
      dialog: false,
    };
  },
  props: {
    lineid: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    ...mapState('productionLayout', ['sublines', 'addSublineDialog']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    // ...mapMutations('productionLayout', ['setAddSublineDialog']),
    ...mapActions('productionLayout', ['createSubline', 'getSublines']),
    // close() {
    //   this.$emit('update:dialog', false);
    // },
    async saveSubline() {
      const sublineNameFlag1 = this.sublines
        .filter((o) => o.name.toLowerCase().split(' ').join('') === this.newSubLine.name.toLowerCase().split(' ').join(''));
      const sublineNameFlag2 = this.sublines
        .filter((o) => o.numbers === parseInt(this.newSubLine.numbers, 10));
      if (sublineNameFlag2.length > 0) {
        this.newSubLine = {};
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST_NO',
        });
      } else if (sublineNameFlag1.length > 0) {
        this.newSubLine = {};
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST',
        });
      } else {
        this.saving = true;
        this.newSubLine = {
          ...this.newSubLine,
          lineid: this.lineid,
          assetid: this.assetId,
          // id: autoIncrementId,
          // usagestartdate: new Date(this.plan.usagestartdate).getTime(),
          // manufacturingdate: new Date().getTime(),
        };
        let created = false;
        const payload = this.newSubLine;
        created = this.createSubline(payload);
        if (created) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'SUBLINE_CREATED',
          });
          this.dialog = false;
          this.assetId = 4;
          this.newSubLine = {};
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_CREATING_SUBLINE',
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
