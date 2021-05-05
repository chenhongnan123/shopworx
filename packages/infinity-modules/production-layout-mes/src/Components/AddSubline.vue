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
        <v-text-field label="Name *"
        hint="For example, SUBLINE-01"
         v-model="newSubLine.name"
        :rules="nameRules"
        :counter="15"
         required></v-text-field>
        <v-text-field label="Number *"
          type="number"
          hint="For example, 11"
          v-model="newSubLine.numbers"
          :rules="numberRules"
          :counter="10"
          required></v-text-field>
        <v-text-field label="Description"
         type="text" v-model="newSubLine.description"></v-text-field>
         <v-text-field label="Expected OEE"
         type="number" v-model="newSubLine.expectedoee"></v-text-field>
        <v-text-field label="Expected Cycletime"
         type="number" v-model="newSubLine.expectedcycletime"></v-text-field>
         <v-text-field label="Edge Ip Address"
              :rules ="plcRules" required class="mb-3"
              hint="Hint: 127.168.1.1"
              v-model="newSubLine.ipaddress"  dense></v-text-field>
         <div>
         <v-checkbox v-model="checked" class="mx-2"
         label="Make this subline as MainLine"
         ></v-checkbox>
         </div>
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
      assetId: null,
      default: false,
      dialog: false,
      valid: true,
      name: '',
      numbers: '',
      numberRules: [(v) => v.length > 0 || 'number required',
        (v) => (v && v.length <= 10) || 'Number must be less than 10 characters'],
      nameRules: [(v) => !!v || 'Name required',
        (v) => (v && v.length <= 15) || 'Name must be less than 10 characters'],
      plcRules: [(v) => /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|(?=$))){4}$/.test(v) || 'Invalid format'],
      checked: false,
    };
  },
  props: {
    lineid: {
      type: [Number, String],
      required: true,
    },
  },
  created() {
    this.getAssets();
  },
  computed: {
    ...mapState('productionLayoutMes', ['sublines', 'addSublineDialog', 'assets']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutMes', ['createSubline', 'getSublines', 'getAssets']),
    async saveSubline() {
      const mainline = this.sublines
        .filter((m) => m.lineid === parseInt(this.lineid, 10)
         && m.ismainline === true
         && m.ismainline === this.checked);
      if (this.newSubLine.numbers === undefined) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'Number Required',
        });
      } else if (mainline.length > 0) {
        this.checked = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MAINLINE_EXISTIS',
        });
      } else {
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
          const getAssetId = this.assets.reduce((acc, item) => acc + item.id, 0);
          this.assetId = getAssetId;
          this.newSubLine = {
            ...this.newSubLine,
            lineid: this.lineid,
            assetid: this.assetId,
            ismainline: this.checked,
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
            this.assetId = this.getAssetId;
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
