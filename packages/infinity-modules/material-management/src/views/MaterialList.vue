<template>
  <v-container fluid class="py-0">
    <v-row>
      <v-col cols="12" xl="12" class="py-0">
        <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
          <span v-if="lineList.length && !!lineValue" class="ml-2">
            line:
            <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2"
            @click="setLineValue('')">
              <v-icon small left>mdi-close</v-icon>
              {{lineList.filter((item) => item.id === lineValue)[0].name}}
            </v-btn>
          </span>
          <span v-if="sublineList.length && !!sublineValue" class="ml-2">
            subline:
            <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2"
            @click="setSublineValue('')">
              <v-icon small left>mdi-close</v-icon>
              {{sublineList.filter((item) => item.id === sublineValue)[0].name}}
            </v-btn>
          </span>
          <v-spacer></v-spacer>
          <v-btn
          small
          color="primary"
          class="text-none"
          @click="setaddMaterialDialog(true)"
          >
            <v-icon small left>mdi-plus</v-icon>
            Add material
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            Refresh
          </v-btn>
          <v-btn small color="error"
            outlined
            class="text-none ml-2"
            @click="confirmListDialog = true"
            v-if="materialList.length && materialSelected.length">
            <v-icon small left>mdi-delete</v-icon>
            Delete
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
            <v-icon small left>mdi-filter-variant</v-icon>
            Filters
          </v-btn>
        </v-toolbar>
        <v-data-table
        show-select
        v-model="materialSelected"
        :headers="headers"
        :items="materialList"
        item-key="id"
        >
        <template v-slot:item.category="props" v-if="categoryList.length">
        {{categoryList.filter((category) => Number(props.item.materialcategory) === category.id)[0]
        && categoryList.filter((category) => Number(props.item.materialcategory) === category.id)
        [0].name}}
        </template>
        <template v-slot:top>
        <v-dialog
          persistent
          scrollable
          v-model="editDialog"
          max-width="500px"
          transition="dialog-transition"
        >
          <v-card>
            <v-card-title primary-title>
              <span>
                Edit Material
              </span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="editDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
              <v-card-text>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-text-field
                    :rules="rules.name"
                    label="Material Name"
                    prepend-icon="mdi-tray-plus"
                    v-model="materialObj.name"
                ></v-text-field>
                <v-text-field
                    :rules="rules.materialnumber"
                    type="number"
                    label="Material Number"
                    prepend-icon="mdi-tray-plus"
                    v-model="materialObj.materialnumber"
                ></v-text-field>
                <v-autocomplete
                  clearable
                  label="Category"
                  :items="categoryList"
                  item-text="name"
                  item-value="id"
                  prepend-icon="$production"
                  v-model="materialObj.materialcategory"
                  :rules="rules.materialcategory"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                      <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
                <v-text-field
                    :rules="rules.lifetime"
                    label="Lifetime(days)"
                    prepend-icon="mdi-tray-plus"
                    v-model="materialObj.lifetime"
                ></v-text-field>
                <v-text-field
                    :rules="rules.materialtype"
                    label="Material TypeID"
                    prepend-icon="mdi-tray-plus"
                    v-model="materialObj.materialtype"
                ></v-text-field>
                <v-text-field
                    :rules="rules.manufacturer"
                    label="Manufacturer"
                    prepend-icon="mdi-tray-plus"
                    v-model="materialObj.manufacturer"
                ></v-text-field>
              </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  class="text-none"
                  :loading="saving"
                  @click="handleUpdateMaterial"
                >
                  Save
                </v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          persistent
          scrollable
          v-model="confirmDialog"
          max-width="500px"
          transition="dialog-transition"
        >
          <v-card>
            <v-card-title primary-title>
              <span>
                Please confirm
              </span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="confirmDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              Are you sure to delete the item?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="text-none"
                :loading="saving"
                @click="handleDeleteItem"
              >
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-btn
              icon
              small
              color="primary"
              @click="editItem(item)"
            >
              <v-icon v-text="'$edit'"></v-icon>
            </v-btn>
            <v-btn
              icon
              small
              color="error"
              @click="deleteItem(item)"
            >
              <v-icon v-text="'$delete'"></v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-table>
      </v-col>
    </v-row>
    <v-dialog
      persistent
      scrollable
      v-model="confirmListDialog"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          <span>
            Please confirm
          </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="confirmListDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          Are you sure to delete the items?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
            @click="handleDeleteItemList"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <add-material v-if="addMaterialDialog"/>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import AddMaterial from '../components/AddMaterial.vue';

export default {
  name: 'MaterialList',
  data() {
    return {
      materialSelected: [],
      headers: [
        {
          text: 'Material',
          value: 'name',
          width: 120,
        },
        {
          text: 'Material Number',
          value: 'materialnumber',
          width: 180,
        },
        { text: 'Category', value: 'category', width: 120 },
        { text: 'Lifetime(days)', value: 'lifetime', width: 140 },
        { text: 'Material TypeID', value: 'materialtype', width: 180 },
        { text: 'Manufacturer', value: 'manufacturer', width: 140 },
        { text: 'Last Edited By', value: 'editedby', width: 140 },
        { text: 'Last Edited On', value: 'modifiedtimestamp', width: 140 },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      materialObj: {
        name: null,
        materialnumber: null,
        materialcategory: null,
        lifetime: null,
        materialtype: null,
        manufacturer: null,
      },
      materialObjDefault: null,
      editDialog: false,
      confirmDialog: false,
      confirmListDialog: false,
      valid: true,
      saving: false,
      rules: {
        line: [
          (v) => !!v || 'Line is required',
        ],
        subline: [
          (v) => !!v || 'Subline is required',
        ],
        name: [
          (v) => !!v || 'Material Name is required',
        ],
        materialnumber: [
          (v) => !!v || 'Material Number is required',
          (v) => v >= 0 || 'Material Number is bigger than 0',
        ],
        materialcategory: [
          (v) => !!v || 'Category is required',
        ],
        // lifetime: [
        //   (v) => !!v || 'lifetime is required',
        // ],
        // materialtype: [
        //   (v) => !!v || 'Materialtype Typeid is required',
        // ],
        // manufacturer: [
        //   (v) => !!v || 'Manufacturer is required',
        // ],
      },
    };
  },
  async created() {
    await this.getMaterialListRecords('');
    this.getDefaultList();
  },
  computed: {
    ...mapState('materialManagement', ['materialList', 'lineList', 'sublineList', 'lineValue', 'sublineValue', 'addMaterialDialog', 'categoryList']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
  },
  components: {
    AddMaterial,
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('materialManagement', ['setaddMaterialDialog', 'toggleFilter', 'setLineValue', 'setSublineValue']),
    ...mapActions('materialManagement', ['getMaterialListRecords', 'getDefaultList', 'updateMaterial', 'deleteMaterial']),
    async handleUpdateMaterial() {
      if (this.$refs.form.validate()) {
        const { materialObj, materialObjDefault } = this;
        const { name, materialnumber } = materialObj;
        const fetchObj = {};
        Object.keys(materialObj).forEach((k) => {
          if (materialObj[k] !== materialObjDefault[k]) {
            fetchObj[k] = materialObj[k];
          }
        });
        if (Object.keys(fetchObj).length) {
          if (fetchObj.name) {
            if (this.materialList.some((material) => name === material.name)) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'MATERIAL_NAME_PRESENT',
              });
              return;
            }
          }
          if (fetchObj.materialnumber) {
            if (this.materialList.some((material) => materialnumber === material.materialnumber)) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'MATERIAL_NUMBER_PRESENT',
              });
              return;
            }
          }
        } else {
          this.editDialog = false;
          return;
        }
        const query = `?query=name=="${materialObjDefault.name}"`;
        fetchObj.editedby = this.userName;
        const payload = fetchObj;
        this.saving = true;
        const updateResult = await this.updateMaterial({ query, payload });
        this.saving = false;
        if (updateResult) {
          this.getMaterialListRecords('');
          this.setAlert({
            show: true,
            type: 'success',
            message: 'UPDATE_MATERIAL',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_UPDATING_MATERIAL',
          });
        }
        this.editDialog = false;
      }
    },
    editItem(item) {
      this.materialObjDefault = item;
      this.editDialog = true;
      Object.keys(this.materialObj).forEach((k) => {
        this.materialObj[k] = item[k];
      });
    },
    deleteItem(item) {
      this.confirmDialog = true;
      this.materialObjDefault = item;
    },
    async handleDeleteItem() {
      this.saving = true;
      const deleteResult = await this.deleteMaterial(this.materialObjDefault.id);
      this.saving = false;
      if (deleteResult) {
        this.getMaterialListRecords('');
        this.setAlert({
          show: true,
          type: 'success',
          message: 'MATERIAL_DELETED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_MATERIAL',
        });
      }
      this.confirmDialog = false;
    },
    async handleDeleteItemList() {
      this.saving = true;
      const results = await Promise.all(this.materialSelected.map(
        (material) => this.deleteMaterial(material.id),
      ));
      if (results.every((bool) => bool === true)) {
        this.getMaterialListRecords('');
        this.materialSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'MATERIAL_DELETED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_MATERIAL',
        });
      }
      this.saving = false;
      this.confirmListDialog = false;
    },
    handleClick(value) {
      this.$router.push({ name: 'order-details', params: { id: value } });
    },
    async RefreshUI() {
      await this.getMaterialListRecords('');
      // this.parameterListSave = this.parameterList.map((item) => ({ ...item }));
    },
    btnSaveData() {
      this.setAlert({
        show: true,
        type: 'success',
        message: 'DATA_SAVED',
      });
    },
  },
};
</script>

<style scoped>
.stick {
  position: -webkit-sticky;
  position: sticky;
  top: 104px;
  z-index: 1;
}
.card-border {
  border-left: 4px solid green;
}
.orange {
  text-emphasis-color: orange;
}
.green {
  background-color: green;
}
.v-data-table__wrapper{height:calc(100vh - 150px) !important;}
</style>
