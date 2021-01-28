<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
      <v-card-title primary-title>
        <span>
          Create Bom
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="handleBomDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
        <v-card-text>
        <v-autocomplete
            clearable
            label="Line"
            :items="lineList"
            :disabled="saving"
            item-text="name"
            return-object
            prepend-icon="$production"
            v-model="selectedLine"
            :rules="rules.line"
            @change="handleChangeLine"
          >
            <template #item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
              :disabled="saving"
              :rules="rules.name"
              label="Bom Name"
              prepend-icon="mdi-tray-plus"
              v-model="bomObj.name"
              required
              :counter="10"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              :rules="rules.bomnumber"
              type="number"
              label="Bom Number"
              prepend-icon="mdi-tray-plus"
              v-model="bomObj.bomnumber"
              required
              :counter="10"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
            @click="saveBom"
            :disabled="!valid"
          >
            Save
          </v-btn>
        </v-card-actions>
    </v-card>
  </v-form>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
} from 'vuex';

export default {
  data() {
    return {
      selectedLine: null,
      saving: false,
      name: '',
      bomnumber: '',
      bomObj: {},
      valid: true,
      rules: {
        line: [
          (v) => !!v || 'Line is required',
        ],
        subline: [
          (v) => !!v || 'Subline is required',
        ],
        name: [
          (v) => !!v || 'Bom Name is required',
          (v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters not Allowed (including space)',
          (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        bomnumber: [
          (v) => !!v || 'Bom Number is required',
          (v) => v >= 0 || 'Bom Number is bigger than 0',
          (v) => (v && v.length <= 10) || 'Number must be less than 10 digit',
        ],
      },
    };
  },
  computed: {
    ...mapState('bomManagement', ['addBomDialog', 'bomList', 'lineList', 'sublineList', 'categoryList', 'lineValue', 'sublineValue']),
    dialog: {
      get() {
        return this.addBomDialog;
      },
      set(val) {
        this.setaddBomDialog(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('bomManagement', ['setaddBomDialog']),
    ...mapActions('bomManagement', ['getBomListRecords', 'createBom', 'getSublineList']),
    handleChangeLine(obj) {
      const query = `?query=lineid==${obj}`;
      this.getSublineList(query);
    },
    async saveBom() {
      this.$refs.form.validate();
      const { bomObj } = this;
      if (this.$refs.form.validate()) {
        const { name, bomnumber } = bomObj;
        if (this.bomList.length) {
          if (this.bomList.some(
            (bom) => name.toLowerCase().split(' ').join('') === bom.name.toLowerCase().split(' ').join(''),
          )) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'BOM_NAME_PRESENT',
            });
            return;
          }
          if (this.bomList.some((bom) => bomnumber === bom.bomnumber)) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'BOM_NUMBER_PRESENT',
            });
            return;
          }
        }
        const payload = {
          ...bomObj,
          lineid: this.selectedLine.id,
          linename: this.selectedLine.name,
          assetid: 4,
        };
        this.saving = true;
        const bomList = await this.createBom(payload);
        this.saving = false;
        if (bomList) {
          this.getBomListRecords('');
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATED_BOM',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_CREATING_BOM',
          });
        }
        this.bomObj = {};
        this.dialog = false;
        this.$refs.form.reset();
      }
    },
    handleBomDialog() {
      this.bomObj = {};
      this.dialog = false;
      this.$refs.form.reset();
    },
  },
};
</script>
