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
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
    <v-card-title>
        <span class="headline">Add Subline</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); dialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
        <v-text-field label="Name" v-model="newSubLine.name"
        :rules="nameRules"
        :counter="15"
         required></v-text-field>
        <v-text-field label="Number"
         type="number" v-model="newSubLine.numbers"
          :rules="numberRules"
          :counter="10"
          required></v-text-field>
        <v-text-field label="Description"
         type="text" v-model="newSubLine.description"></v-text-field>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
        class="text-none"
        :disabled="!valid"
         @click="saveSubline">Save</v-btn>
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
      newSubLine: {},
      assetId: 4,
      default: false,
      dialog: false,
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
    ...mapActions('productionLayout', ['createSubline', 'getSublines']),
    async saveSubline() {
      this.$refs.form.validate();
      const sublineNameFlag = this.sublines
        .filter((o) => o.name.toLowerCase().split(' ').join('') === this.newSubLine.name.toLowerCase().split(' ').join(''));
      const sublineNumberFlag = this.sublines
        .filter((o) => o.numbers === parseInt(this.newSubLine.numbers, 10));
      if (sublineNumberFlag.length > 0) {
        this.newSubLine.numbers = '';
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST_NO',
        });
      } else if (sublineNameFlag.length > 0) {
        this.newSubLine.name = '';
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
          this.$refs.form.reset();
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
    async dialogReset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style>
</style>
