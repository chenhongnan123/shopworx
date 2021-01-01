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
          @click="setaddBomDialog(true)"
          >
            <v-icon small left>mdi-plus</v-icon>
            Add BOM
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            Refresh
          </v-btn>
          <v-btn small color="error"
            outlined
            class="text-none ml-2"
            @click="confirmListDialog = true"
            v-if="bomList.length && bomSelected.length">
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
        v-model="bomSelected"
        :headers="headers"
        :items="bomList"
        item-key="bomnumber"
        >
        <template v-slot:item.editedtime="{ item }">
          <span v-if="item.editedtime">
            {{ new Date(item.editedtime).toLocaleString("en-GB") }}</span>
          <span v-else></span>
        </template>
        <template v-slot:item.name="props" >
          <router-link :to="{ name: 'bom-details', params: { query: props.item } }">
            <span style="cursor:pointer;">{{props.item.name}}</span>
          </router-link>
        </template>
        <template v-slot:top>
        <v-dialog
          persistent
          scrollable
          v-model="editDialog"
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
                Edit Bom
              </span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="(editDialog = false); editDialogReset();">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
              <v-card-text>
                <v-text-field
                    :rules="rules.name"
                    label="Bom Name"
                    prepend-icon="mdi-tray-plus"
                    v-model="bomObj.name"
                    required
                    :counter="10"
                ></v-text-field>
                <v-text-field
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
                  @click="handleUpdateBom"
                  :disabled="!valid"
                >
                  Save
                </v-btn>
              </v-card-actions>
          </v-card>
          </v-form>
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
    <add-bom v-if="addBomDialog"/>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import AddBom from '../components/AddBom.vue';

export default {
  name: 'BOMList',
  components: {
    AddBom,
  },
  data() {
    return {
      bomSelected: [],
      headers: [
        {
          text: 'Line',
          value: 'linename',
        },
        {
          text: 'BOM name',
          value: 'name',
        },
        {
          text: 'BOM Number',
          value: 'bomnumber',
        },
        { text: 'Last Edited By', value: 'editedby' },
        { text: 'Last Edited On', value: 'editedtime' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      bomObj: {
        name: null,
        bomnumber: null,
        materialcategory: null,
        lifetime: null,
        bomtype: null,
        manufacturer: null,
      },
      bomObjDefault: null,
      editDialog: false,
      confirmDialog: false,
      confirmListDialog: false,
      valid: true,
      saving: false,
      name: '',
      bomnumber: '',
      rules: {
        name: [
          (v) => !!v || 'Bom Name is required',
          (v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters not Allowed',
          (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        bomnumber: [
          (v) => !!v || 'Bom Number is required',
          (v) => v >= 0 || 'Bom Number is bigger than 0',
          (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
      },
    };
  },
  async created() {
    await this.getDefaultList();
    this.getBomListRecords('');
  },
  computed: {
    ...mapState('bomManagement', ['bomList', 'categoryList', 'lineList', 'sublineList', 'lineValue', 'sublineValue', 'addBomDialog']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('bomManagement', ['setaddBomDialog', 'toggleFilter', 'setLineValue', 'setSublineValue']),
    ...mapActions('bomManagement', ['getBomListRecords', 'getDefaultList', 'updateBom', 'deleteBom', 'deleteAllBomDetails']),
    async handleUpdateBom() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        const { bomObj, bomObjDefault } = this;
        const { name, bomnumber } = bomObj;
        const fetchObj = {};
        Object.keys(bomObj).forEach((k) => {
          if (bomObj[k] !== bomObjDefault[k]) {
            fetchObj[k] = bomObj[k];
          }
        });
        if (Object.keys(fetchObj).length) {
          if (fetchObj.name) {
            if (this.bomList.some((bom) => name === bom.name)) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'BOM_NAME_PRESENT',
              });
              return;
            }
          }
          if (fetchObj.bomnumber) {
            if (this.bomList.some((bom) => bomnumber === bom.bomnumber)) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'BOM_NUMBER_PRESENT',
              });
              return;
            }
          }
        } else {
          this.editDialog = false;
          return;
        }
        const query = `?query=name=="${bomObjDefault.name}"`;
        fetchObj.editedby = this.userName;
        fetchObj.editedtime = new Date().getTime();
        const payload = fetchObj;
        this.saving = true;
        const updateResult = await this.updateBom({ query, payload });
        this.saving = false;
        if (updateResult) {
          this.getBomListRecords('');
          this.setAlert({
            show: true,
            type: 'success',
            message: 'UPDATE_BOM',
          });
          this.$refs.form.reset();
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_UPDATING_BOM',
          });
        }
        this.editDialog = false;
      }
    },
    editItem(item) {
      this.bomObjDefault = item;
      this.editDialog = true;
      Object.keys(this.bomObj).forEach((k) => {
        this.bomObj[k] = item[k];
      });
    },
    deleteItem(item) {
      this.confirmDialog = true;
      this.bomObjDefault = item;
    },
    async handleDeleteItem() {
      this.saving = true;
      const deleteResult = await this.deleteBom(this.bomObjDefault.id);
      this.saving = false;
      if (deleteResult) {
        await this.deleteAllBomDetails(this.bomObjDefault.id);
        this.getBomListRecords('');
        this.setAlert({
          show: true,
          type: 'success',
          message: 'BOM_DELETED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_BOM',
        });
      }
      this.confirmDialog = false;
    },
    async handleDeleteItemList() {
      this.saving = true;
      const results = await Promise.all(this.bomSelected.map(
        (bom) => this.deleteBom(bom.id),
      ));
      if (results.every((bool) => bool === true)) {
        this.getBomListRecords('');
        this.bomSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'BOM_DELETED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_BOM',
        });
      }
      this.saving = false;
      this.confirmListDialog = false;
    },
    handleClick(value) {
      this.$router.push({ name: 'order-details', params: { id: value } });
    },
    async RefreshUI() {
      await this.getBomListRecords('');
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
  editDialogReset() {
    this.$refs.form.reset();
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
