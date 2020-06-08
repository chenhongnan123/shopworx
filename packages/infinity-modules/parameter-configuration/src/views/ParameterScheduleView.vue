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
            <span v-if="lineList.length && !!lineValue" class="ml-2">
              line:
              <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2 text-truncate"
              @click="setLineValue('')">
                <v-icon small left>mdi-close</v-icon>
                <div class="text-truncate" style="max-width: 100px;">
                {{lineList.filter((item) => item.id === lineValue)[0].name}}
                </div>
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
                <div class="text-truncate" style="max-width: 100px;">
                {{sublineList.filter((item) => item.id === sublineValue)[0].name}}
                </div>
              </v-btn>
            </span>
            <span v-if="stationList.length && !!stationValue" class="ml-2">
              station:
              <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2"
              @click="setStationValue('')">
                <v-icon small left>mdi-close</v-icon>
                <div class="text-truncate" style="max-width: 100px;">
                {{stationList.filter((item) => item.id === stationValue)[0].name}}
                </div>
              </v-btn>
            </span>
            <span v-if="substationList.length && !!substationValue" class="ml-2">
              substation:
              <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2"
              @click="setSubstationValue('')">
                <v-icon small left>mdi-close</v-icon>
                <div class="text-truncate" style="max-width: 100px;">
                {{substationList.filter((item) => item.id === substationValue)[0].name}}
                </div>
              </v-btn>
            </span>
            <v-spacer></v-spacer>
            <v-btn
            small
            color="primary"
            class="text-none"
            :disabled="isAddButtonOK"
            @click="setAddParameterDialog(true)"
            >
              <v-icon small left>mdi-plus</v-icon>
              Add parameter
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
              <v-icon small left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
            <v-btn small color="error"
              outlined
              class="text-none ml-2"
              @click="confirmDialog = true"
              v-if="parameterList.length && parameterSelected.length">
              <v-icon small left>mdi-delete</v-icon>
              Delete
            </v-btn>
            <v-btn
            small
            color="primary"
            :disabled="!substationValue || parameterSelected.length === 0"
            outlined
            class="text-none ml-2"
            @click="exportData">
              Export
            </v-btn>
            <v-btn
            small
            color="primary"
            outlined
            class="text-none ml-2"
            :disabled="isAddButtonOK"
            @click="importData">
              Import
            </v-btn>
            <input
              multiple
              type="file"
              accept=".csv"
              ref="uploader"
              class="d-none"
              id="uploadFiles"
              @change="onFilesChanged"
            >
            <v-btn
            small
            color="primary"
            outlined
            class="text-none ml-2"
            @click="toggleFilter"
            >
              <v-icon small left>mdi-filter-variant</v-icon>
              Filters
            </v-btn>
          </v-toolbar>
        </div>
        <v-data-table
        v-model="parameterSelected"
        :headers="headers"
        item-key="_id"
        :items="parameterList"
        show-select
        >
          <template v-slot:item.name="props">
            <v-edit-dialog
              :return-value.sync="props.item.name"
              @save="saveTableParameter(props.item, 'name')"
            >
              {{ props.item.name }}
              <v-icon
                small
                color="primary"
              >
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field
                  :disabled="substationValue ? false : true"
                  v-model="props.item.name"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.description="props">
            <v-edit-dialog
              :return-value.sync="props.item.description"
              @save="saveTableParameter(props.item, 'description')"
            > {{ props.item.description }}
              <v-icon
                small
                color="primary"
              >
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field
                  :disabled="substationValue ? false : true"
                  v-model="props.item.description"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.parameterdirection="props">
            <v-select
              :disabled="substationValue ? false : true"
              :items="directionList"
              v-model="props.item.parameterdirection"
              label="-"
              @change="saveTableParameter(props.item, 'parameterdirection')"
              item-text="name"
              item-value="id"
              solo
              dense
              depressed
            ></v-select>
          </template>
          <template v-slot:item.parametercategory="props">
            <v-select
              :disabled="substationValue ? false : true"
              :items="categoryList"
              v-model="props.item.parametercategory"
              label="-"
              @change="saveTableParameter(props.item, 'parametercategory')"
              item-text="name"
              item-value="id"
              solo
              dense
              depressed
            ></v-select>
          </template>
          <template v-slot:item.datatype="props">
            <v-select
              :disabled="substationValue ? false : true"
              :items="datatypeList"
              v-model="props.item.datatype"
              label="-"
              @change="saveTableParameter(props.item, 'datatype')"
              item-text="name"
              item-value="id"
              solo
              dense
              depressed
            ></v-select>
          </template>
          <template v-slot:item.size="props">
            <v-edit-dialog
              :return-value.sync="props.item.size"
              @save="saveTableParameter(props.item, 'size')"
            > {{ props.item.size }}
              <template v-slot:input>
                <v-text-field
                  :disabled="!substationValue
                  || (props.item.datatype !== 12 && props.item.datatype !== 11)"
                  v-model="props.item.size"
                  label="Edit"
                  single-line
                  type='number'
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.startaddress="props">
            <v-edit-dialog
              :return-value.sync="props.item.startaddress"
              @save="saveTableParameter(props.item, 'startaddress')"
            > {{ props.item.startaddress }}
              <v-icon
                small
                color="primary"
              >
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field
                  :disabled="substationValue ? false : true"
                  v-model="props.item.startaddress"
                  label="Edit"
                  single-line
                  type='number'
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.dbaddress="props">
            <v-edit-dialog
              :return-value.sync="props.item.dbaddress"
              @save="saveTableParameter(props.item, 'dbaddress')"
            > {{ props.item.dbaddress }}
              <v-icon
                small
                color="primary"
              >
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field
                  :disabled="substationValue ? false : true"
                  v-model="props.item.dbaddress"
                  label="Edit"
                  single-line
                  type='number'
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
        </v-data-table>
      </div>
    </div>
    <v-dialog
      persistent
      scrollable
      v-model="confirmDialog"
      max-width="500px"
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
          Are you sure to delete the items selected ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="handleDeleteParameter"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <AddParameter
    :station="stationValue"
    :substation="substationValue"
    :line="lineValue"
    :subline="sublineValue"
    v-if="addParameterDialog"/>
    <ParameterFilter :station="stationValue"  :substation="substationValue"/>
  </v-container>
</template>

<script>
import {
  mapActions,
  mapMutations,
  mapState,
} from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import AddParameter from '../components/AddParameter.vue';
import ParameterFilter from '../components/ParameterFilter.vue';

export default {
  name: 'PlanScheduleView',
  data() {
    return {
      parameterSelected: [],
      headers: [
        { text: 'Number', value: 'number' },
        { text: 'Protocol', value: 'protocol' },
        { text: 'Parameter', value: 'name' },
        { text: 'Parameter Description', value: 'description' },
        { text: 'Parameter ID', value: 'id' },
        { text: 'Direction', value: 'parameterdirection' },
        { text: 'Category', value: 'parametercategory' },
        { text: 'Data type', value: 'datatype' },
        { text: 'Size', value: 'size' },
        { text: 'DB Address', value: 'dbaddress' },
        { text: 'Start Address', value: 'startaddress' },
        { text: 'Monitor', value: 'monitor' },
        { text: 'Status', value: 'status' },
      ],
      parameterListSave: [],
      confirmDialog: false,
    };
  },
  async created() {
    this.zipService = ZipService;
    await this.getPageDataList();
  },
  computed: {
    ...mapState('parameterConfiguration', ['addParameterDialog', 'parameterList', 'lineList', 'sublineList', 'stationList', 'substationList', 'directionList', 'categoryList', 'datatypeList', 'lineValue', 'sublineValue', 'stationValue', 'substationValue']),
    isAddButtonOK() {
      if (this.lineValue && this.sublineValue && this.stationValue && this.substationValue) {
        return false;
      }
      return true;
    },
  },
  watch: {
    lineValue(val) {
      if (!val) {
        this.setSublineValue('');
        this.setStationValue('');
        this.setSubstationValue('');
        this.getParameterListRecords('?query=stationid==null');
      }
    },
    sublineValue(val) {
      if (!val) {
        this.setStationValue('');
        this.setSubstationValue('');
        this.getParameterListRecords('?query=stationid==null');
      }
    },
    stationValue(val) {
      if (!val) {
        this.setSubstationValue('');
        this.getParameterListRecords('?query=stationid==null');
      }
    },
    substationValue(val) {
      if (!val) {
        this.setSubstationValue('');
        this.getParameterListRecords('?query=stationid==null');
      }
    },
    parameterList(parameterList) {
      console.log(parameterList, 'parameterList');
      this.parameterListSave = parameterList.map((item) => ({ ...item }));
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('parameterConfiguration', ['setAddParameterDialog', 'toggleFilter', 'setLineValue', 'setSublineValue', 'setStationValue', 'setSubstationValue']),
    ...mapActions('parameterConfiguration', ['getPageDataList', 'getSublineList', 'getStationList', 'getSubstationList', 'getParameterListRecords', 'updateParameter', 'deleteParameter', 'createParameter', 'createParameterList']),
    async saveTableParameter(item, type) {
      const value = item[type];
      const parameterListSave = [...this.parameterListSave];
      if (!value) {
        this.setAlert({
          show: true,
          type: 'error',
          message: `${type}_can_not_be_empty`,
        });
        await this.getParameterListRecords(`?query=${this.substationValue ? 'sub' : ''}stationid=="${this.substationValue || this.stationValue}"`);
        return;
      }
      if (type === 'name') {
        if (parameterListSave.some((parameter) => value === parameter.name)) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'parameter_name_is_present',
          });
          await this.getParameterListRecords(`?query=${this.substationValue ? 'sub' : ''}stationid=="${this.substationValue || this.stationValue}"`);
          return;
        }
      }
      if (type === 'size') {
        if (value <= 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'Size is Integer',
          });
          await this.getParameterListRecords(`?query=${this.substationValue ? 'sub' : ''}stationid=="${this.substationValue || this.stationValue}"`);
          return;
        }
        if (item.datatype === 12 && value > 8) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'Size is less than 9',
          });
          await this.getParameterListRecords(`?query=${this.substationValue ? 'sub' : ''}stationid=="${this.substationValue || this.stationValue}"`);
          return;
        }
      }
      if (type === 'dbaddress') {
        if (parameterListSave.some((parameter) => item.startaddress === parameter.startaddress)) {
          if (parameterListSave.some((parameter) => item.dbaddress === parameter.dbaddress)) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'parameter_dbadress_is_present',
            });
            await this.getParameterListRecords(`?query=${this.substationValue ? 'sub' : ''}stationid=="${this.substationValue || this.stationValue}"`);
            return;
          }
        }
      }
      if (type === 'startaddress') {
        if (parameterListSave.some((parameter) => item.dbaddress === parameter.dbaddress)) {
          if (parameterListSave.some((parameter) => item.startaddress === parameter.startaddress)) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'parameter_startaddress_is_present',
            });
            await this.getParameterListRecords(`?query=${this.substationValue ? 'sub' : ''}stationid=="${this.substationValue || this.stationValue}"`);
            return;
          }
        }
      }
      let selectedDatatypeItem = {};
      const parameterItem = parameterListSave.filter((parameter) => item._id === parameter._id)[0];
      let query = `?query=name=="${parameterItem.name}"&${type}=="${value}"`;
      const payload = {};
      if (type === 'datatype') {
        [selectedDatatypeItem] = this.datatypeList.filter((datatype) => value === datatype.id);
        query = `?query=name=="${parameterItem.name}"&${type}=="${value}"&isbigendian==${selectedDatatypeItem.isbigendian === 1}&isswapped==${selectedDatatypeItem.isswapped === 1}`;
        payload.isbigendian = selectedDatatypeItem.isbigendian === 1;
        payload.isswapped = selectedDatatypeItem.isswapped === 1;
        if (selectedDatatypeItem.name !== 'Boolean' && selectedDatatypeItem.name !== 'String') {
          payload.size = selectedDatatypeItem.size;
        }
      }
      payload[type] = value;
      const updateResult = await this.updateParameter({ query, payload });
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: `update_${type}`,
        });
      }
      await this.getParameterListRecords(`?query=${this.substationValue ? 'sub' : ''}stationid=="${this.substationValue || this.stationValue}"`);
    },
    async handleDeleteParameter() {
      const results = await Promise.all(this.parameterSelected.map(
        (parameter) => this.deleteParameter(parameter.id),
      ));
      if (results.every((bool) => bool === true)) {
        await this.getParameterListRecords(`?query=${this.substationValue ? 'sub' : ''}stationid=="${this.substationValue || this.stationValue}"`);
        this.confirmDialog = false;
        this.parameterSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'delete_parameter',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'delete_parameter',
        });
      }
    },
    async RefreshUI() {
      const query = `?query=${this.substationValue ? 'sub' : ''}stationid=="${this.substationValue || this.stationValue}"`;
      await this.getParameterListRecords(query);
    },
    async exportData() {
      const lineName = this.lineList.filter((item) => this.lineValue === item.id).length
        ? this.lineList.filter((item) => this.lineValue === item.id)[0].name : 'None';
      const sublineName = this.sublineList.filter((item) => this.sublineValue === item.id).length
        ? this.sublineList.filter((item) => this.sublineValue === item.id)[0].name : 'None';
      const stationName = this.stationList.filter((item) => this.stationValue === item.id).length
        ? this.stationList.filter((item) => this.stationValue === item.id)[0].name : 'None';
      const substationName = this.substationList.filter(
        (item) => this.substationValue === item.id,
      ).length
        ? this.substationList.filter((item) => this.substationValue === item.id)[0].name : 'None';
      const fileName = `${lineName}-${sublineName}-${stationName}-${substationName}`;
      const parameterSelected = this.parameterSelected.map((item) => ({ ...item }));
      const column = parameterSelected[0].questions;
      const csvContent = [];
      parameterSelected.forEach((parameter) => {
        const arr = [];
        column.forEach((key) => {
          arr.push(parameter[key]);
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
        message: 'export_parameter_list',
      });
      return content;
    },
    importData() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(e) {
      const files = e && e !== undefined ? e.target.files : null;
      const csvParser = new CSVParser();
      const { data } = await csvParser.parse(files[0]);
      data.forEach((item) => {
        item.lineid = this.lineValue;
        item.sublineid = this.sublineValue;
        item.stationid = this.stationValue;
        item.substationid = this.substationValue;
        item.assetid = 4;
        delete item.monitor;
        delete item.status;
      });
      const dataList = data.concat(this.parameterList);
      const nameList = dataList.map((item) => item.name);
      if (new Set(nameList).size === nameList.length) {
        for (let i = 0; i < dataList.length; i += 1) {
          for (let k = i + 1; k < dataList.length; k += 1) {
            if (
              dataList[i].dbaddress === dataList[k].dbaddress
              && dataList[i].startaddress === dataList[k].startaddress
            ) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'duplicate_parameter_startaddress',
              });
              document.getElementById('uploadFiles').value = null;
              return;
            }
          }
        }
        const createResult = await this.createParameterList(data);
        console.log(createResult, 'createResult');
        if (createResult) {
          await this.getParameterListRecords(`?query=${this.substationValue ? 'sub' : ''}stationid=="${this.substationValue || this.stationValue}"`);
          this.setAlert({
            show: true,
            type: 'success',
            message: 'import_parameter_list',
          });
        }
        document.getElementById('uploadFiles').value = null;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'duplicate_parameter_name',
        });
        document.getElementById('uploadFiles').value = null;
      }
    },
    addToZip(file) {
      this.zipService.addFile(file);
    },
  },
  components: {
    AddParameter,
    ParameterFilter,
  },
};
</script>

<style>
.planScheduleView .stick {
  /* position: sticky;
  position: -webkit-sticky;
  top: 60px; */
  z-index: 1;
}
.planScheduleView .card-border {
  border-left: 4px solid green;
}
.planScheduleView .orange {
  text-emphasis-color: orange;
}
.planScheduleView .green {
  background-color: green;
}
.planScheduleView .v-select{
  height: 30px;
}
.planScheduleView .v-input__slot{
  width: 150px;
}
.planScheduleView .v-text-field.v-text-field--solo.v-input--dense > .v-input__control{
  min-height: 30px;
}
</style>
