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
          lazy-validation
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          Create Material
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="handleCloseDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
        <v-card-text>
          <v-text-field
              :disabled="saving"
              :rules="rules.name"
              label="Material Name"
              prepend-icon="mdi-tray-plus"
              v-model="materialObj.name"
              required
              :counter="10"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              :rules="rules.materialnumber"
              type="number"
              label="Material Number"
              prepend-icon="mdi-tray-plus"
              v-model="materialObj.materialnumber"
              required
              :counter="10"
          ></v-text-field>
          <v-autocomplete
            clearable
            label="Category"
            :items="categoryList"
            return-object
            :disabled="saving"
            item-text="name"
            prepend-icon="$production"
            v-model="materialObj.materialcategory"
            :rules="rules.materialcategory"
            required
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
              type="number"
              :disabled="saving"
              :rules="rules.lifetime"
              label="Lifetime(days)"
              prepend-icon="mdi-tray-plus"
              v-model="materialObj.lifetime"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              :rules="rules.materialtype"
              label="Material TypeID"
              prepend-icon="mdi-tray-plus"
              v-model="materialObj.materialtype"
              :counter="10"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              :rules="rules.manufacturer"
              label="Manufacturer"
              prepend-icon="mdi-tray-plus"
              v-model="materialObj.manufacturer"
              :counter="20"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
            @click="saveMaterial"
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
  // mapGetters,
  mapMutations,
} from 'vuex';

export default {
  data() {
    return {
      saving: false,
      materialObj: {
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
          (v) => !!v || 'Material Name is required',
          (v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters not Allowed (including space)',
          (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        materialnumber: [
          (v) => !!v || 'Material Number is required',
          (v) => v >= 0 || 'Material Number is bigger than 0',
          (v) => (v && v.length <= 10) || 'Number must be less than 10 digit',
        ],
        materialcategory: [
          (v) => !!v || 'Category is required',
        ],
        lifetime: [
          (v) => !!v || 'lifetime is required',
        ],
        materialtype: [
          (v) => !!v || 'Materialtype Typeid is required',
          (v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters not Allowed (including space)',
          (v) => (v && v.length <= 10) || 'id must be less than 10 alphanumeric characters',
        ],
        manufacturer: [
          (v) => !!v || 'Manufacturer is required',
          (v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters not Allowed (including space)',
          (v) => (v && v.length <= 20) || 'Manufacturer name must be less than 20 alphanumeric characters',
        ],
      },
    };
  },
  computed: {
    ...mapState('materialManagement', ['addMaterialDialog', 'materialList', 'lineList', 'sublineList', 'lineValue', 'sublineValue', 'categoryList']),
    dialog: {
      get() {
        return this.addMaterialDialog;
      },
      set(val) {
        this.setaddMaterialDialog(val);
      },
    },
  },
  created() {
    // await this.getPageDataList();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('materialManagement', ['setaddMaterialDialog']),
    ...mapActions('materialManagement', ['getMaterialListRecords', 'createMaterial', 'getSublineList']),
    handleChangeLine(obj) {
      const query = `?query=lineid==${obj}`;
      this.getSublineList(query);
    },
    async saveMaterial() {
      const { materialObj } = this;
      if (this.$refs.form.validate()) {
        const { name, materialnumber } = materialObj;
        if (this.materialList.length) {
          if (this.materialList.some(
            (material) => name.toLowerCase().split(' ').join('') === material.name.toLowerCase().split(' ').join(''),
          )) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'MATERIAL_NAME_PRESENT',
            });
            return;
          }
          if (this.materialList.some((material) => materialnumber === material.materialnumber)) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'MATERIAL_NUMBER_PRESENT',
            });
            return;
          }
        }
        const payload = {
          ...materialObj,
          assetid: 4,
          materialcategory: materialObj.materialcategory.id,
        };
        this.saving = true;
        const materialList = await this.createMaterial(payload);
        this.saving = false;
        if (materialList) {
          this.getMaterialListRecords('');
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATED_MATERIAL',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_CREATING_MATERIAL',
          });
        }
        this.materialObj = {};
        this.dialog = false;
        this.$refs.form.reset();
      }
    },
    handleCloseDialog() {
      this.materialObj = {};
      this.dialog = false;
      this.$refs.form.reset();
    },
  },
};
</script>
