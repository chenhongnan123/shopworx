<template>
  <div id="operator">
    <portal to="app-header">
      <span>{{ $t('operator.name') }}</span>
      <!-- <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn> -->
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon small v-on="on" v-bind="attrs" class="ml-2 mb-1" @click="gotToSettings">
            <v-icon v-text="'$settings'"></v-icon>
          </v-btn>
        </template>
        Settings
      </v-tooltip>
    </portal>
    <v-container fluid class="py-0">
      <div class="stick">
        <div style="float: left; margin-bottom: 10px">
          <span v-if="departmentList.length && !!departmentValue" class="ml-2">
            {{ $t('operator.general.department') }}:
            <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2 text-truncate"
              @click="setDepartmentValue('')"
            >
              <v-icon small left>mdi-close</v-icon>
              <div class="text-truncate" style="max-width: 100px">
                {{ departmentList.filter((item) => item.id === departmentValue)[0].name }}
              </div>
            </v-btn>
          </span>
          <span v-if="positionList.length && !!positionValue" class="ml-2">
            {{ $t('operator.general.position') }}:
            <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2"
              @click="setPositionValue('')"
            >
              <v-icon small left>mdi-close</v-icon>
              <div class="text-truncate" style="max-width: 100px">
                {{ positionList.filter((item) => item.id === positionValue)[0].name }}
              </div>
            </v-btn>
          </span>
        </div>
        <div style="float: right">
          <v-btn small color="primary" class="text-none" @click="setAddOperatorDialog(true)">
            <v-icon small left>mdi-plus</v-icon>
            {{ $t('operator.general.add') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            {{ $t('operator.general.refresh') }}
          </v-btn>
          <v-btn
            small
            color="error"
            outlined
            class="text-none ml-2"
            v-if="operatorList.length && operatorSelected.length"
            @click="confirmDialog = true"
          >
            <v-icon small left>mdi-delete</v-icon>
            {{ $t('operator.general.delete') }}
          </v-btn>
          <v-btn
            small
            color="primary"
            outlined
            class="text-none ml-2"
            @click="exportData"
            v-if="operatorList.length && operatorSelected.length"
          >
            {{ $t('operator.general.export') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="exportSampleData">
            {{ $t('operator.general.exportsample') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="importData">
            {{ $t('operator.general.import') }}
          </v-btn>
          <input
            multiple
            type="file"
            accept=".csv"
            ref="uploader"
            class="d-none"
            id="uploadFiles"
            @change="onFilesChanged"
          />
          <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
            <v-icon small left>mdi-filter-variant</v-icon>
            {{ $t('operator.general.filter') }}
          </v-btn>
        </div>
      </div>
      <v-data-table
        v-model="operatorSelected"
        :headers="headers"
        item-key="id"
        :items="operatorList"
        :options="{ itemsPerPage: 5 }"
        show-select
      >
        <template v-slot:item.photo="{ item }">
          <div class="photo">
            <v-avatar>
              <img
                :src="item.photo"
                style="cursor: pointer"
                @click="
                  imgpre = item.photo;
                  showprev = true;
                "
              />
            </v-avatar>
            <v-edit-dialog
              :return-value.sync="item.image"
              class="xx"
              @save="saveTableParameter(item, 'image')"
            >
              <v-icon small color="primary"> mdi-pencil </v-icon>
              <template v-slot:input>
                <v-file-input
                  label="Photo*"
                  accept="image/png, image/jpeg, image/bmp"
                  @change="uploaded"
                  @keydown="stopEnter"
                ></v-file-input>
              </template>
            </v-edit-dialog>
          </div>
        </template>
        <template v-slot:item.name="props">
          <v-edit-dialog
            :return-value.sync="props.item.name"
            @save="saveTableParameter(props.item, 'name')"
          >
            {{ props.item.name }}
            <v-icon small color="primary" :disabled="false"> mdi-pencil </v-icon>
            <template v-slot:input>
              <v-text-field
                :disabled="false"
                v-model="props.item.name"
                label="Edit"
                single-line
                type="text"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.code="props">
          <v-edit-dialog
            :return-value.sync="props.item.code"
            @save="saveTableParameter(props.item, 'code')"
          >
            {{ props.item.code }}
            <v-icon small color="primary" :disabled="false"> mdi-pencil </v-icon>
            <template v-slot:input>
              <v-text-field
                :disabled="false"
                v-model="props.item.code"
                label="Edit"
                single-line
                type="text"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.positionname="props">
          <v-edit-dialog
            :return-value.sync="props.item.positionname"
            @save="saveTableParameter(props.item, 'position')"
          >
            {{ props.item.positionname }}
            <v-icon small color="primary" :disabled="false">
              mdi-pencil
            </v-icon>
            <template v-slot:input>
              <v-autocomplete
                clearable
                :items="positionList"
                return-object
                item-text="name"
                v-model="editposition"
                prepend-icon="mdi-account-supervisor-circle-outline"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                    <v-list-item-subtitle v-text="item.departmentname"></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.editedtime="props">
          <span>
            {{
              props.item.editedtime
                ? format(Number(props.item.editedtime), 'yyyy-MM-dd HH:mm:ss')
                : ''
            }}
          </span>
        </template>
        <template v-slot:item.createdtime="props">
          <span>{{
            props.item.createdtime
              ? format(Number(props.item.createdtime), 'yyyy-MM-dd HH:mm:ss')
              : ''
          }}</span>
        </template>
      </v-data-table>
      <v-dialog persistent scrollable v-model="confirmDialog" max-width="500px">
        <v-card>
          <v-card-title primary-title>
            <span> {{ $t('operator.general.confirmheader') }} </span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="confirmDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text> {{ $t('operator.general.confirmmessage') }} </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="text-none"
              :loading="saving"
              @click="handleDeleteOperator"
            >
              {{ $t('operator.general.yes') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <operator-filter />
      <add-operator />
    </v-container>
    <v-dialog
      v-model="showprev"
      scrollable
      :overlay="false"
      max-width="800px"
      transition="dialog-transition"
    >
      <v-img :src="imgpre"> </v-img>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import OperatorFilter from '../components/OperatorFilter.vue';
import AddOperator from '../components/AddOperator.vue';

export default {
  name: 'Operator',
  components: {
    OperatorFilter,
    AddOperator,
  },
  data() {
    return {
      headers: [
        { text: this.$t('operator.main.header.id'), value: 'id', width: 80 },
        { text: this.$t('operator.main.header.name'), value: 'operatorname' },
        { text: this.$t('operator.main.header.code'), value: 'operatorcode' },
        { text: this.$t('operator.main.header.department'), value: 'departmentname' },
        { text: this.$t('operator.main.header.position'), value: 'positionname' },
        { text: this.$t('operator.main.header.editedby'), value: 'editedby' },
        { text: this.$t('operator.main.header.editedtime'), value: 'editedtime' },
        { text: this.$t('operator.main.header.createdby'), value: 'createdby' },
        { text: this.$t('operator.main.header.createdtime'), value: 'createdtime' },

        { text: this.$t('operator.main.header.photo'), value: 'photo' },
      ],
      operatorSelected: [],
      imgpre: null,
      showprev: false,
      editposition: null,
      editdepartment: null,
      confirmDialog: false,
      saving: false,
      editphoto: null,
      format: formatDate,
    };
  },
  computed: {
    ...mapState('operator', [
      'assets',
      'filter',
      'addOperatorDialog',
      'isApply',
      'departmentList',
      'positionList',
      'operatorList',
      'departmentValue',
      'positionValue',
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
  },
  watch: {
    departmentValue(val) {
      if (!val) {
        this.setDepartmentValue('');
        this.getRecords(this.getQuery());
      }
    },
    positionValue(val) {
      if (!val) {
        this.setPositionValue('');
        this.getRecords(this.getQuery());
      }
    },
  },
  async created() {
    this.zipService = ZipService;
    await this.getAssets();
    await this.getDepartments();
    await this.getPositions();
    this.getRecords('');
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('operator', [
      'toggleFilter',
      'setAddOperatorDialog',
      'setApply',
      'setDepartmentList',
      'setPositionList',
      'setOperatorList',
      'setDepartmentValue',
      'setPositionValue',
    ]),
    ...mapActions('operator', [
      'updateOperator',
      'deleteOperator',
      'createOperator',
      'createOperatorList',
      'getDepartments',
      'getPositions',
      'getRecords',
      'getAssets',
    ]),
    getQuery() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.position) {
        query += `%26%26positionid=="${this.position}"`;
      }
      if (this.department) {
        query += `%26%26departmentid=="${this.department}"`;
      }
      return query;
    },
    async RefreshUI() {
      await this.getRecords(this.getQuery());
    },
    async exportData() {
      const deparmentName = this.departmentList.filter((item) => this.departmentValue === item.id)
        .length
        ? this.departmentList.filter((item) => this.departmentValue === item.id)[0].name
        : 'None';
      const positionName = this.positionList.filter((item) => this.positionValue === item.id).length
        ? this.positionList.filter((item) => this.positionValue === item.id)[0].name
        : 'None';
      // prettier-ignore
      // eslint-disable-next-line max-len
      const fileName = !this.positionValue && !this.departmentValue ? 'All_operator' : `${deparmentName}-${positionName}_operator`;
      const operatorSelected = this.operatorSelected.map((item) => ({ ...item }));
      const csvContent = [];
      const column = [
        'name',
        'code',
        'departmentid',
        'departmentname',
        'positionid',
        'positionname',
      ];

      operatorSelected.forEach((parameter) => {
        const arr = [];
        column.forEach((key) => {
          if (key === 'size') {
            arr.push(parameter.size);
          } else {
            arr.push(parameter[key]);
          }
        });
        csvContent.push(arr);
      });
      const csvParser = new CSVParser();
      const content = csvParser.unparse({
        fields: column,
        data: csvContent,
      });
      this.addToZip({
        fileName: `${fileName}.csv`,
        fileContent: content,
      });
      const zip = await this.zipService.generateZip();
      this.zipService.downloadFile(zip, `${fileName}.zip`);
      this.setAlert({
        show: true,
        type: 'success',
        message: 'export_operator_list',
      });
      return content;
    },
    async exportSampleData() {
      const fileName = 'operator-sample-file';
      const column = [
        'name',
        'code',
        'departmentid',
        'departmentname',
        'positionid',
        'positionname',
      ];
      const csvContent = [];
      const arr = ['tester', '1001', 'department-1', 'Maintenance', 'position-1', 'Operator'];
      csvContent.push(arr);
      const csvParser = new CSVParser();
      const content = csvParser.unparse({
        fields: column,
        data: csvContent,
      });
      this.addToZip({
        fileName: `${fileName}.csv`,
        fileContent: content,
      });
      const zip = await this.zipService.generateZip();
      this.zipService.downloadFile(zip, `${fileName}.zip`);
      this.setAlert({
        show: true,
        type: 'success',
        message: 'export_operator_sample_file',
      });
      return content;
    },
    importData() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(e) {
      const that = this;
      const files = e && e !== undefined ? e.target.files : null;
      const csvParser = new CSVParser();
      const { data } = await csvParser.parse(files[0]);
      let bypass = true;
      let msg = '';
      data.forEach((item, index) => {
        item.assetid = 4;
        item.createdby = that.userName;
        item.createdtime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
        // check department
        if (!item.departmentid) {
          bypass = false;
          msg = `wrong_departmentid in Line ${index + 2}`;
        } else {
          // eslint-disable-next-line no-lonely-if
          if (!that.departmentList.filter((i) => i.id === item.departmentid).length) {
            bypass = false;
            msg = `wrong_departmentid in Line ${index + 2}`;
          } else {
            // eslint-disable-next-line no-lonely-if
            if (!item.departmentname) {
              bypass = false;
              msg = `wrong_departmentname in Line ${index + 2}`;
            } else {
              // eslint-disable-next-line no-lonely-if
              if (!that.departmentList.filter((i) => i.name === item.departmentname).length) {
                bypass = false;
                msg = `wrong_departmentid in Line ${index + 2}`;
              } else {
                // prettier-ignore
                // eslint-disable-next-line max-len,no-lonely-if
                if (that.departmentList.filter((i) => i.name === item.departmentname)[0]._id !== that.departmentList.filter((i) => i.id === item.departmentid)[0]._id) {
                  bypass = false;
                  msg = `wrong_departmentid_with_departmentname in Line ${index + 2}`;
                } else {
                  // eslint-disable-next-line no-lonely-if
                }
              }
            }
          }
        }
        // check position
        if (!item.positionid) {
          bypass = false;
          msg = `wrong_positionid in Line ${index + 2}`;
        } else {
          // eslint-disable-next-line no-lonely-if
          if (!this.positionList.filter((i) => i.id === item.positionid).length) {
            bypass = false;
            msg = `wrong_positionid in Line ${index + 2}`;
          } else {
            // eslint-disable-next-line no-lonely-if
            if (!item.positionname) {
              bypass = false;
              msg = `wrong_positionname in Line ${index + 2}`;
            } else {
              // eslint-disable-next-line no-lonely-if
              if (!this.positionList.filter((i) => i.name === item.positionname).length) {
                bypass = false;
                msg = `wrong_positionname in Line ${index + 2}`;
              } else {
                // prettier-ignore
                // eslint-disable-next-line max-len,no-lonely-if
                if (this.positionList.filter((i) => i.name === item.positionname)[0]._id !== this.positionList.filter((i) => i.id === item.positionid)[0]._id) {
                  bypass = false;
                  msg = `wrong_positionid_with_positionname in Line ${index + 2}`;
                } else {
                  // eslint-disable-next-line no-lonely-if
                }
              }
            }
          }
        }
      });
      if (!bypass) {
        this.setAlert({
          show: true,
          type: 'error',
          message: msg,
        });
        document.getElementById('uploadFiles').value = null;
        return;
      }
      const dataList = data.concat(this.operatorList);
      const codeList = dataList.map((item) => item.code);
      if (new Set(codeList).size === codeList.length) {
        const createResult = await this.createOperatorList(data);
        if (createResult) {
          await this.getRecords(this.getQuery());
          this.setAlert({
            show: true,
            type: 'success',
            message: 'import_operator_list',
          });
        }
        document.getElementById('uploadFiles').value = null;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'duplicate_operator_code',
        });
        document.getElementById('uploadFiles').value = null;
      }
    },
    async saveTableParameter(item, type) {
      console.log(item, type);
      const payload = {
        editedby: this.userName,
        editedtime: new Date().getTime(),
      };
      if (type === 'position') {
        if (!this.editposition) {
          this.setAlert({
            show: true,
            type: 'error',
            message: `${type}_can_not_be_empty`,
          });
          await this.getRecords(this.getQuery());
          return;
        }
        payload.positionid = this.editposition.id;
        payload.positionname = this.editposition.name;
        payload.departmentid = this.editposition.departmentid;
        payload.departmentname = this.editposition.departmentname;
      } else if (type === 'department') {
        if (!this.editdepartment) {
          this.setAlert({
            show: true,
            type: 'error',
            message: `${type}_can_not_be_empty`,
          });
          await this.getRecords(this.getQuery());
          return;
        }
        payload.departmentid = this.editdepartment.id;
        payload.departmentname = this.editdepartment.name;
      } else if (type === 'photo') {
        if (!this.editphoto) {
          this.setAlert({
            show: true,
            type: 'error',
            message: `${type}_can_not_be_empty`,
          });
          await this.getRecords(this.getQuery());
          return;
        }
        payload.photo = this.editphoto;
      } else {
        if (!item[type]) {
          this.setAlert({
            show: true,
            type: 'error',
            message: `${type}_can_not_be_empty`,
          });
          await this.getRecords(this.getQuery());
          return;
        }
        payload[type] = item[type];
      }
      this.saving = true;
      const updateResult = await this.updateOperator({ id: item._id, payload });
      this.saving = false;
      if (updateResult) {
        this.editphoto = null;
        this.editdepartment = null;
        this.editposition = null;
        this.setAlert({
          show: true,
          type: 'success',
          message: `update_${type}`,
        });
      }
      await this.getRecords(this.getQuery());
    },
    async handleDeleteOperator() {
      // eslint-disable-next-line max-len
      const results = await Promise.all(
        this.operatorSelected.map((operator) => this.deleteOperator(operator.id)),
      );
      if (results.every((bool) => bool === true)) {
        this.saving = true;
        const operatorList = await this.getRecords(this.getQuery());
        if (operatorList.length === 0) {
          this.setDepartmentValue('');
          this.setPositionValue('');
          await this.getRecords(this.getQuery());
        }
        this.saving = false;
        this.confirmDialog = false;
        this.operatorSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'delete_operator',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'delete_operator',
        });
      }
    },
    addToZip(file) {
      this.zipService.addFile(file);
    },
    uploaded(e) {
      if (!e) return;
      const that = this;
      const reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = (event) => {
        console.log(event);
        that.editphoto = event.target.result;
      };
    },
    stopEnter(e) {
      e.preventDefault();
    },
    gotToSettings() {
      this.$router.push({ name: 'operatorSettings' });
    },
  },
};
</script>

<style lang="sass">
#operator
  height: 100%
  width: 100%
  .stick
    width: 100%
    padding: 20px 0
    overflow: hidden
    z-index: 1
.photo
  display: grid
  grid-template-rows: 1fr
  gap: 10px
  grid-template-columns: 48px 1fr
  align-items: center
  .v-small-dialog
    display: none
</style>
