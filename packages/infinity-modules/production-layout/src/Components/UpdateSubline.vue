 <template>
<v-dialog v-model="dialog"  max-width="700px">
    <template v-slot:activator="{ on }">
    <!-- <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
    <v-icon v-on="on" v-text="'$edit'" color="primary"
    class="float-right"></v-icon>
    </template>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
    <v-card-title>
        <span class="headline">Update Subline</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); resetDialog();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
      <!-- {{subline}} -->
      <v-row>
      <v-col cols="12" md="12">
        <v-text-field label="Name *" v-model="sublineNew.name"
        :rules="nameRules"
        :counter="15"
         required
         hint="For example, Subline_01"
        @keyup="validName"></v-text-field>
        <v-text-field label="Number *"
         type="number" v-model="sublineNew.numbers"
         :rules="numberRules"
         :counter="10"
         hint="For example, 12"
          required
         @keyup="validNumber"></v-text-field>
        <v-text-field label="Description" type="Description"
        hint="For example, Updated by Manager"
         v-model="sublineNew.description"></v-text-field>
      </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn> -->
        <v-btn color="primary"
        class="text-none"
        :disabled="btnDisable"
        @click="saveSubline">Save</v-btn>
    </v-card-actions>
    </v-card>
    </v-form>
</v-dialog>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  props: {
    subline: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      sublineNew: {},
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
    this.sublineNew = { ...this.subline };
  },
  computed: {
    ...mapState('productionLayout', ['sublines']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    // ...mapMutations('productionLayout', ['setAddSublineDialog']),
    ...mapActions('productionLayout', ['updateSubline', 'getSublines']),
    // close() {
    //   this.$emit('update:dialog', false);
    // },
    async validName() {
      if (this.sublineNew.name === '' || this.sublineNew.name.length > 15) {
        this.btnDisable = true;
      } else {
        const sublineNameFlag = this.sublines
          .filter((o) => o.name.toLowerCase().split(' ').join('') === this.sublineNew.name.toLowerCase().split(' ').join(''));
        if (sublineNameFlag.length > 0) {
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
    async validNumber() {
      if (this.sublineNew.numbers === '' || this.sublineNew.numbers.length > 10) {
        this.btnDisable = true;
      } else {
        const sublineNumberFlag = this.sublines
          .filter((o) => o.numbers === parseInt(this.sublineNew.numbers, 10));
        if (sublineNumberFlag.length > 0) {
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
    async saveSubline() {
      this.saving = true;
      this.newSubLine = {
        name: this.sublineNew.name,
        numbers: this.sublineNew.numbers,
        description: this.sublineNew.description,
      };
      let created = false;
      const payload = {
        query: `?query=id=="${this.subline.id}"`,
        payload: this.newSubLine,
        lineid: this.subline.lineid,
      };
      created = this.updateSubline(payload);
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'SUBLINE_UPDATED',
        });
        this.dialog = false;
        this.assetId = 4;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_SUBLINE',
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
