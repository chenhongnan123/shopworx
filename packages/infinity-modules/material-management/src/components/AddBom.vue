<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          Create Bom
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
        <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
        <v-autocomplete
            clearable
            label="Line"
            :items="lineList"
            :disabled="saving"
            item-text="name"
            item-value="id"
            prepend-icon="$production"
            v-model="bomObj.lineid"
            :rules="rules.line"
            @change="handleChangeLine"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <!-- <v-autocomplete
            clearable
            label="Subine"
            :items="sublineList"
            :disabled="saving"
            item-text="name"
            item-value="id"
            prepend-icon="$production"
            v-model="bomObj.sublineid"
            :rules="rules.subline"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete> -->
          <v-text-field
              :disabled="saving"
              :rules="rules.name"
              label="Bom"
              prepend-icon="mdi-tray-plus"
              v-model="bomObj.name"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              :rules="rules.bomnumber"
              type="number"
              label="Bom Number"
              prepend-icon="mdi-tray-plus"
              v-model="bomObj.bomnumber"
          ></v-text-field>
        </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
            @click="saveBom"
          >
            Save
          </v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';

export default {
  data() {
    return {
      saving: false,
      bomObj: {
      },
      valid: true,
      rules: {
        line: [
          (v) => !!v || 'Line is required',
        ],
        subline: [
          (v) => !!v || 'Subline is required',
        ],
        name: [
          (v) => !!v || 'Bom is required',
        ],
        bomnumber: [
          (v) => !!v || 'Bom Number is required',
          (v) => v >= 0 || 'Bom Number is bigger than 0',
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
  created() {
    // await this.getPageDataList();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('bomManagement', ['setaddBomDialog']),
    ...mapActions('bomManagement', ['getBomListRecords', 'createBom', 'getSublineList']),
    handleChangeLine(obj) {
      console.log(obj);
      const query = `?query=lineid==${obj}`;
      this.getSublineList(query);
    },
    async saveBom() {
      const { bomObj } = this;
      console.log(this.bomObj);
      if (this.$refs.form.validate()) {
        console.log(this.$refs.form.validate());
        const { name, bomnumber } = bomObj;
        if (this.bomList.length) {
          if (this.bomList.some((bom) => name === bom.name)) {
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
        console.log(bomObj, 'bomObj');
        const payload = {
          ...bomObj,
          assetid: 4,
        };
        console.log(payload);
        this.saving = true;
        const bomList = await this.createBom(payload);
        this.saving = false;
        console.log(bomList);
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
        this.dialog = false;
      }
    },
  },
};
</script>
