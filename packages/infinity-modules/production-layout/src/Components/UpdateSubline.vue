 <template>
<v-dialog v-model="dialog"  max-width="700px">
    <template v-slot:activator="{ on }">
    <!-- <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
    <v-icon v-on="on" v-text="'$edit'" color="primary"
    class="float-right"></v-icon>
    </template>
    <v-card>
    <v-card-title>
        <span class="headline">Update Subline</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
      <!-- {{subline}} -->
      <v-row>
      <v-col cols="12" md="12">
        <v-text-field label="Name" v-model="sublineNew.name" required
        @keyup="validName"></v-text-field>
        <v-text-field label="Number"
         type="number" v-model="sublineNew.numbers" required
         @keyup="validNumber"></v-text-field>
        <v-text-field label="Description" type="Description"
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
    },
    async validNumber() {
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
        // this.newSubLine = {};
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_SUBLINE',
        });
      }
      this.saving = false;
    },
  },
};
</script>

<style>
</style>
