<template>
  <v-dialog v-model="dialog" max-width="700px">
    <template #activator="{ on }">
      <v-icon v-on="on" v-text="'$edit'" color="primary" class="float-right"></v-icon>
    </template>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title>
          <span class="headline">Update Subline</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            small
            @click="
              dialog = false;
              resetDialog();
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                label="Name *"
                v-model="sublineNew.name"
                :rules="nameRules"
                :counter="15"
                required
                hint="For example, Subline_01"
                @keyup="validName"
              ></v-text-field>
              <v-text-field
                label="Number *"
                type="number"
                v-model="sublineNew.numbers"
                :rules="numberRules"
                :counter="10"
                hint="For example, 12"
                required
                @keyup="validNumber"
              ></v-text-field>
              <v-text-field
                label="Description"
                type="Description"
                v-model="sublineNew.description"
              ></v-text-field>
              <v-text-field
                label="Expected OEE"
                type="number"
                v-model="sublineNew.expectedoee"
              ></v-text-field>
              <v-text-field
                label="Expected Cycletime"
                type="number"
                v-model="sublineNew.expectedcycletime"
              ></v-text-field>
              <v-checkbox
                v-model="sublineNew.ismainline"
                class="mx-2"
                v-bind:label="
                  this.sublineNew.ismainline ? 'This is MainSubline' : 'Not  MainSubline'
                "
                @change="changeInMainline"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="text-none" :disabled="btnDisable" @click="saveSubline"
            >Save</v-btn
          >
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
    lineid: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      sublineNew: {},
      btnDisable: false,
      assetId: null,
      valid: true,
      name: '',
      numbers: '',
      numberRules: [
        (value) => !!value || 'Number required',
        (v) => (v && v.length <= 10) || 'Number must be less than 10 characters',
      ],
      nameRules: [
        (value) => !!value || 'Name required',
        (v) => (v && v.length <= 15) || 'Name must be less than 15 characters',
      ],
    };
  },
  created() {
    this.sublineNew = { ...this.subline };
    this.getAssets();
  },
  computed: {
    ...mapState('productionLayoutSF', ['sublines', 'selectedLine', 'assets']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutSF', ['updateSubline', 'getSublines', 'getAssets']),
    async validName() {
      if (this.sublineNew.name === '' || this.sublineNew.name.length > 15) {
        this.btnDisable = true;
      } else {
        const sublineNameFlag = this.sublines.filter(
          (o) =>
            // eslint-disable-next-line
            o.name
              .toLowerCase()
              .split(' ')
              // eslint-disable-next-line
              .join('') ===
            this.sublineNew.name
              .toLowerCase()
              .split(' ')
              .join(''),
        );
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
        const sublineNumberFlag = this.sublines.filter(
          (o) => o.numbers === parseInt(this.sublineNew.numbers, 10),
        );
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
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      this.assetId = getAssetId;
      this.newSubLine = {
        name: this.sublineNew.name,
        numbers: this.sublineNew.numbers,
        description: this.sublineNew.description,
        expectedoee: this.sublineNew.expectedoee,
        expectedcycletime: this.sublineNew.expectedcycletime,
        ismainline: this.sublineNew.ismainline,
        assetid: this.assetId,
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
    async changeInMainline() {
      if (this.sublineNew.ismainline === true) {
        const isMainlineFlag = this.sublines.filter(
          (o) => o.lineid === parseInt(this.lineid, 10) && o.ismainline === true,
        );
        const changeMainline = this.sublines.filter(
          (o) => (o.ismainline === this.sublineNew.ismainline) === true,
        );
        if (isMainlineFlag.length > 0) {
          this.sublineNew.ismainline = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'MAINLINE_EXISTIS',
          });
        } else if (changeMainline.length > 0) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'MAINLINE_ASSIGNED',
          });
        } else {
          this.btnDisable = false;
          this.saving = true;
          this.setAlert({
            show: true,
            type: 'success',
            message: 'MAINLINE_ASSIGNED',
          });
        }
      } else {
        this.sublineNew.ismainline = false;
        this.setAlert({
          show: true,
          type: 'success',
          message: 'MAINLINE_REMOVED',
        });
      }
    },
  },
};
</script>

<style></style>
