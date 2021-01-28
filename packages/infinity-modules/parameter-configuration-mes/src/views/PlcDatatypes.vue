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
              Add Datatype
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
        :items="dataTypeList"
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
              Create datatype
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
                  label="Datatype"
                  prepend-icon="mdi-tray-plus"
                  v-model="parameterObj.name"
                  :rules="rules.name"
              ></v-text-field>
              <v-text-field
                  label="Datatype number"
                  prepend-icon="mdi-tray-plus"
                  v-model="parameterObj.id"
                  :rules="rules.id"
                  type="number"
              ></v-text-field>
              <v-text-field
                  label="Size"
                  prepend-icon="mdi-tray-plus"
                  v-model="parameterObj.size"
                  :rules="rules.size"
                  type="number"
              ></v-text-field>
              <v-autocomplete
                clearable
                label="isBigendian"
                :items="boolList"
                :disabled="saving"
                item-text="name"
                prepend-icon="$production"
                v-model="parameterObj.isbigendian"
                :rules="rules.isbigendian"
              >
              </v-autocomplete>
              <v-autocomplete
                clearable
                label="isSwapped"
                :items="boolList"
                :disabled="saving"
                item-text="name"
                prepend-icon="$production"
                v-model="parameterObj.isswapped"
                :rules="rules.isswapped"
              >
              </v-autocomplete>
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
  name: 'PlcDatatypes',
  data() {
    return {
      headers: [
        { text: 'PLC', value: 'plc' },
        { text: 'Protocol', value: 'protocol' },
        { text: 'Data type', value: 'name' },
        { text: 'Data type number', value: 'id' },
        { text: 'Size', value: 'size' },
        { text: 'isBigendian', value: 'isbigendian' },
        { text: 'isSwapped', value: 'isswapped' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      rules: {
        name: [
          (v) => !!v || 'Data type is required',
        ],
        id: [
          (v) => !!v || 'Data type number is required',
          (v) => v % 1 === 0 || 'Data type number is Integer',
          (v) => v > 0 || 'Data type number is greater than zero',
        ],
        size: [
          (v) => !!v || 'Sizee is required',
          (v) => v % 1 === 0 || 'Size is Integer',
          (v) => v > 0 || 'Size is greater than zero',
        ],
        isbigendian: [
          (v) => !!v || 'isBigendian is required',
        ],
        isswapped: [
          (v) => !!v || 'isSwapped is required',
        ],
      },
      valid: true,
      dialog: false,
      confirmDialog: false,
      saving: false,
      parameterObj: {
        name: null,
        id: null,
        size: null,
        isbigendian: null,
        isswapped: null,
      },
      boolList: ['1', '0'],
      datatypeObjDefault: null,
      isUpdate: false,
    };
  },
  async created() {
    await this.getDataTypes();
  },
  computed: {
    ...mapState('parameterConfigurationMes', ['dataTypeList']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('parameterConfigurationMes', ['getDataTypes', 'addDataType', 'deleteDatatype', 'updateDataType']),
    editItem(item) {
      this.datatypeObjDefault = item;
      this.dialog = true;
      this.isUpdate = true;
      Object.keys(this.parameterObj).forEach((k) => {
        this.parameterObj[k] = item[k].toString();
      });
    },
    deleteItem(item) {
      this.confirmDialog = true;
      this.datatypeObjDefault = item;
    },
    handleClose() {
      this.parameterObj = {
        name: null,
        id: null,
        size: null,
        isbigendian: null,
        isswapped: null,
      };
      this.dialog = false;
    },
    async handleDeleteItem() {
      this.saving = true;
      const deleteResult = await this.deleteDatatype(this.datatypeObjDefault.id);
      this.saving = false;
      if (deleteResult) {
        this.getDataTypes();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'delete datatype success',
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
      await this.getDataTypes();
    },
    async saveDataType() {
      const { parameterObj, datatypeObjDefault } = this;
      const { name, id } = parameterObj;
      if (this.$refs.form.validate()) {
        const payload = {
          ...parameterObj,
          assetid: 4,
        };
        if (!this.isUpdate) {
          if (this.dataTypeList.some((datatype) => name === datatype.name)) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'Datatype is present',
            });
            return;
          }
          if (this.dataTypeList.some((datatype) => id === datatype.id.toString())) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'Datatype Number is present',
            });
            return;
          }
          const createdResult = this.addDataType(payload);
          if (createdResult) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'CREATE_DATATYPE',
            });
          }
        } else {
          const fetchObj = {};
          Object.keys(parameterObj).forEach((k) => {
            if (parameterObj[k] !== datatypeObjDefault[k].toString()) {
              fetchObj[k] = parameterObj[k];
            }
          });
          if (Object.keys(fetchObj).length) {
            if (fetchObj.name) {
              if (this.dataTypeList.some((datatype) => name === datatype.name)) {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'Datatype is present',
                });
                return;
              }
            }
            if (fetchObj.id) {
              if (this.dataTypeList.some((datatype) => id === datatype.id.toString())) {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'Datatype Number is present',
                });
                return;
              }
            }
          } else {
            this.dialog = false;
            this.parameterObj = {
              name: null,
              id: null,
              size: null,
              isbigendian: null,
              isswapped: null,
            };
            return;
          }
          const query = `?query=id==${datatypeObjDefault.id}`;
          const updateResult = await this.updateDataType({ query, payload: fetchObj });
          if (updateResult) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'update_datatype',
            });
          }
        }
        this.getDataTypes();
        this.parameterObj = {
          name: null,
          id: null,
          size: null,
          isbigendian: null,
          isswapped: null,
        };
        this.dialog = false;
      }
    },
  },
  components: {
  },
};
</script>
