<template>
  <v-container fluid class="py-0">
    <div justify="center" class="planScheduleView">
      <div class="py-0">
        <div class="stick">
          <v-toolbar
            flat
            dense
            :color="$vuetify.theme.dark ? '#121212': ''"
          >
            <v-spacer></v-spacer>
            <v-btn
            small
            color="primary"
            class="text-none"
            @click="dialog = true,isUpdate = false;"
            >
              <v-icon small left>mdi-plus</v-icon>
              Add Category
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
              <v-icon small left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
          </v-toolbar>
        </div>
        <v-data-table
        :headers="headers"
        item-key="_id"
        :items="categoryDataList"
        >
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
      </div>
    </div>
    <div v-if="dialog">
      <v-dialog
      persistent
      scrollable
      v-model="dialog"
      transition="dialog-transition"
      max-width="500px"
      >
        <v-card>
          <v-card-title primary-title>
            <span>
              Create Category
            </span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="handleClose">
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
                  label="Category"
                  prepend-icon="mdi-tray-plus"
                  v-model="parameterObj.name"
                  :rules="rules.name"
              ></v-text-field>
              <v-text-field
                  label="Category ID"
                  prepend-icon="mdi-tray-plus"
                  v-model="parameterObj.id"
                  :rules="rules.id"
                  type="number"
              ></v-text-field>
            </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="text-none"
                :loading="saving"
                :disabled="Object.keys(parameterObj).some((k) => !parameterObj[k]) || saving"
                @click="saveDataType"
              >
                Save
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import {
  mapMutations,
  mapActions,
  mapState,
} from 'vuex';

export default {
  name: 'PlcCategory',
  data() {
    return {
      headers: [
        { text: 'PLC', value: 'plc' },
        { text: 'Protocol', value: 'protocol' },
        { text: 'Category', value: 'name' },
        { text: 'Category ID', value: 'id' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      rules: {
        name: [
          (v) => !!v || 'Category is required',
        ],
        id: [
          (v) => !!v || 'Data type number is required',
          (v) => v % 1 === 0 || 'Data type number is Integer',
          (v) => v > 0 || 'Data type number is greater than zero',
        ],
      },
      valid: true,
      dialog: false,
      confirmDialog: false,
      saving: false,
      parameterObj: {
        name: null,
        id: null,
      },
      categoryObjDefault: null,
      isUpdate: false,
    };
  },
  async created() {
    await this.getCategory();
  },
  computed: {
    ...mapState('parameterConfiguration', ['categoryDataList']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('parameterConfiguration', ['getCategory', 'addCategory', 'deleteCategory', 'updateCategory']),
    editItem(item) {
      this.categoryObjDefault = item;
      this.dialog = true;
      this.isUpdate = true;
      Object.keys(this.parameterObj).forEach((k) => {
        this.parameterObj[k] = item[k];
      });
    },
    deleteItem(item) {
      this.confirmDialog = true;
      this.categoryObjDefault = item;
    },
    handleClose() {
      this.parameterObj = {
        name: null,
        id: null,
      };
      this.dialog = false;
    },
    async handleDeleteItem() {
      this.saving = true;
      const deleteResult = await this.deleteCategory(this.categoryObjDefault.id);
      this.saving = false;
      if (deleteResult) {
        this.getCategory();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'delete category success',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'network error',
        });
      }
      this.confirmDialog = false;
    },
    async RefreshUI() {
      await this.getCategory();
    },
    async saveDataType() {
      const { parameterObj, categoryObjDefault } = this;
      const { name, id } = parameterObj;
      if (this.$refs.form.validate()) {
        const payload = {
          ...parameterObj,
          assetid: 4,
        };
        if (!this.isUpdate) {
          if (this.categoryDataList.some((category) => name === category.name)) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'Category is present',
            });
            return;
          }
          if (this.categoryDataList.some((category) => id === category.id.toString())) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'Category ID is present',
            });
            return;
          }
          const createdResult = this.addCategory(payload);
          if (createdResult) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'Create Category',
            });
          }
        } else {
          const fetchObj = {};
          Object.keys(parameterObj).forEach((k) => {
            if (parameterObj[k] !== categoryObjDefault[k]) {
              fetchObj[k] = parameterObj[k];
            }
          });
          if (Object.keys(fetchObj).length) {
            if (fetchObj.name) {
              if (this.categoryDataList.some((category) => name === category.name)) {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'Category is present',
                });
                return;
              }
            }
            if (fetchObj.id) {
              if (this.categoryDataList.some((category) => id === category.id.toString())) {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'Category ID is present',
                });
                return;
              }
            }
          } else {
            this.dialog = false;
            this.parameterObj = {
              name: null,
              id: null,
            };
            return;
          }
          const query = `?query=id==${categoryObjDefault.id}`;
          const updateResult = await this.updateCategory({ query, payload: fetchObj });
          if (updateResult) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'update_category',
            });
          }
        }
        this.getCategory();
        this.parameterObj = {
          name: null,
          id: null,
        };
        this.dialog = false;
      }
    },
  },
  components: {
  },
};
</script>
