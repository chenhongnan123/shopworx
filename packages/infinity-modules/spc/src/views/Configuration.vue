<template>
  <!-- eslint-disable max-len -->

  <v-container fluid class="py-0">
    <div justify="center" class="planScheduleView">
      <div class="py-0">
        <div class="stick">
          <div style="float: left; margin-bottom: 10px">
            <span v-if="lineList.length && !!lineValue" class="ml-2">
              line:
              <v-btn small color="normal" outlined class="text-none ml-2 text-truncate" @click="setLineValue('')">
                <v-icon small left>mdi-close</v-icon>
                <div class="text-truncate" style="max-width: 100px">
                  {{ lineList.filter((item) => item.id === lineValue)[0].name }}
                </div>
              </v-btn>
            </span>
            <span v-if="sublineList.length && !!sublineValue" class="ml-2">
              subline:
              <v-btn small color="normal" outlined class="text-none ml-2" @click="setSublineValue('')">
                <v-icon small left>mdi-close</v-icon>
                <div class="text-truncate" style="max-width: 100px">
                  {{ sublineList.filter((item) => item.id === sublineValue)[0].name }}
                </div>
              </v-btn>
            </span>
            <span v-if="stationList.length && !!stationValue" class="ml-2">
              station:
              <v-btn small color="normal" outlined class="text-none ml-2" @click="setStationValue('')">
                <v-icon small left>mdi-close</v-icon>
                <div class="text-truncate" style="max-width: 100px">
                  {{ stationList.filter((item) => item.id === stationValue)[0].name }}
                </div>
              </v-btn>
            </span>
            <span v-if="substationList.length && !!substationValue" class="ml-2">
              substation:
              <v-btn small color="normal" outlined class="text-none ml-2" @click="setSubstationValue('')">
                <v-icon small left>mdi-close</v-icon>
                <div class="text-truncate" style="max-width: 100px">
                  {{ substationList.filter((item) => item.id === substationValue)[0].name }}
                </div>
              </v-btn>
            </span>
          </div>
          <div style="float: right">
            <v-btn small color="primary" class="text-none" :disabled="isAddButtonOK" @click="setAddParameterDialog(true)">
              <v-icon small left>mdi-plus</v-icon>
              Add parameter configuration
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2" :disabled="!substationValue" @click="RefreshUI">
              <v-icon small left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
            <v-btn small color="error" outlined class="text-none ml-2" @click="confirmDialog = true" v-if="parameteranalysisList.length && parameterSelected.length">
              <v-icon small left>mdi-delete</v-icon>
              Delete
            </v-btn>
            <v-btn small color="primary" v-if="substationValue && parameterSelected.length > 0" outlined class="text-none ml-2" @click="exportData">
              Export
            </v-btn>
            <v-btn small color="primary" v-if="!(substationValue && parameterSelected.length > 0)" outlined class="text-none ml-2" @click="exportSampleData">
              Export Sample File
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2" :disabled="isAddButtonOK" @click="importData">
              Import
            </v-btn>
            <input multiple type="file" accept=".csv" ref="uploader" class="d-none" id="uploadFiles" @change="onFilesChanged" />
            <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
              <v-icon small left>mdi-filter-variant</v-icon>
              Filters
            </v-btn>
          </div>
        </div>
        <v-data-table v-model="parameterSelected" :headers="headers" item-key="_id" :items="parameteranalysisList" :options="{ itemsPerPage: 5 }" show-select>
          <template v-slot:item.usl="props">
            <v-edit-dialog :return-value.sync="props.item.usl" @save="saveTableParameter(props.item, 'usl')">
              {{ props.item.usl }}
              <v-icon small color="primary" :disabled="!substationValue">
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field :disabled="!substationValue" v-model="props.item.usl" label="Edit" single-line type="number"></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.lsl="props">
            <v-edit-dialog :return-value.sync="props.item.lsl" @save="saveTableParameter(props.item, 'lsl')">
              {{ props.item.lsl }}
              <v-icon small color="primary" :disabled="!substationValue">
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field :disabled="!substationValue" v-model="props.item.lsl" label="Edit" single-line type="number"></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.target="props">
            <v-edit-dialog :return-value.sync="props.item.target" @save="saveTableParameter(props.item, 'target')">
              {{ props.item.target }}
              <v-icon small color="primary" :disabled="substationValue ? false : true">
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field :disabled="substationValue ? false : true" v-model="props.item.target" label="Edit" single-line type="number"></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.max="props">
            <v-edit-dialog :return-value.sync="props.item.max" @save="saveTableParameter(props.item, 'max')">
              {{ props.item.max }}
              <v-icon small color="primary" :disabled="substationValue ? false : true">
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field :disabled="substationValue ? false : true" v-model="props.item.max" label="Edit" single-line type="number"></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.min="props">
            <v-edit-dialog :return-value.sync="props.item.min" @save="saveTableParameter(props.item, 'min')">
              {{ props.item.min }}
              <v-icon small color="primary" :disabled="substationValue ? false : true">
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field :disabled="substationValue ? false : true" v-model="props.item.min" label="Edit" single-line type="number"></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
        </v-data-table>
      </div>
    </div>
    <v-dialog persistent scrollable v-model="confirmDialog" max-width="500px">
      <v-card>
        <v-card-title primary-title>
          <span> Please confirm </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="confirmDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text> Are you sure to delete the items selected ? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="text-none" :loading="saving" @click="handleDeleteParameter">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <AddParameter :station="stationValue" :substation="substationValue" :line="lineValue" :subline="sublineValue" v-if="addParameterDialog" />
    <ParameterFilter :station="stationValue" :substation="substationValue" />
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
// import socketioclient from 'socket.io-client';
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
        { text: 'Number', value: 'number', width: 120 },
        { text: 'Line', value: 'line', width: 120 },
        { text: 'subline', value: 'subline', width: 120 },
        { text: 'station', value: 'station', width: 120 },
        { text: 'substation', value: 'substation', width: 120 },
        { text: 'Parameter', value: 'parametername', width: 120 },
        { text: 'Parameter Description', value: 'parameterdescription', width: 200 },
        { text: 'USL', value: 'usl', width: 100 },
        { text: 'LSL', value: 'lsl', width: 100 },
        { text: 'Target', value: 'target', width: 100 },
        { text: 'Max', value: 'max', width: 100 },
        { text: 'Min', value: 'min', width: 100 },
      ],
      parameterListSave: [],
      confirmDialog: false,
      socket: null,
      saving: false,
    };
  },
  async created() {
    this.zipService = ZipService;
    await this.getPageDataList();
    this.getParameteranalysisListRecords('?pagenumber=1&pagesize=10');
    // this.socket = socketioclient.connect('http://:10190');
    // this.socket.on('connect', () => {});
  },
  computed: {
    ...mapState('spc', ['addParameterDialog', 'parameterList', 'parameteranalysisList', 'isApply', 'lineList', 'sublineList', 'stationList', 'substationList', 'directionList', 'categoryList', 'datatypeList', 'lineValue', 'sublineValue', 'stationValue', 'substationValue', 'selectedParameterName', 'selectedParameterDirection', 'selectedParameterCategory', 'selectedParameterDatatype', 'subStationElementDeatils', 'createElementResponse']),
    isAddButtonOK() {
      // eslint-disable-next-line max-len
      if (this.lineValue && this.sublineValue && this.stationValue && this.substationValue && this.isApply) {
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
        this.getParameteranalysisListRecords('?query=substationid==null');
      }
    },
    sublineValue(val) {
      if (!val) {
        this.setStationValue('');
        this.setSubstationValue('');
        this.getParameteranalysisListRecords('?query=substationid==null');
      }
    },
    stationValue(val) {
      if (!val) {
        this.setSubstationValue('');
        this.getParameteranalysisListRecords('?query=substationid==null');
      }
    },
    substationValue(val) {
      if (!val) {
        this.setSubstationValue('');
        this.getParameteranalysisListRecords('?query=substationid==null');
      }
    },
    parameteranalysisList(parameteranalysisList) {
      this.parameterListSave = parameteranalysisList.map((item) => ({ ...item }));
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('spc', ['setAddParameterDialog', 'toggleFilter', 'setApply', 'setLineValue', 'setSublineValue', 'setStationValue', 'setSubstationValue', 'setSelectedParameterName', 'setSelectedParameterDirection', 'setSelectedParameterCategory', 'setSelectedParameterDatatype']),
    ...mapActions('spc', ['getPageDataList', 'getSublineList', 'getStationList', 'getSubstationList', 'getParameterListRecords', 'updateParameteranalysis', 'deleteParameteranalysis', 'createParameter', 'createParameteranalysisList', 'downloadToPLC', 'getSubStationIdElement', 'getSubStationIdElement', 'createTagElement', 'updateTagStatus', 'getParameteranalysisListRecords']),
    async saveTableParameter(item, type) {
      const value = item[type];
      const parameterListSave = [...this.parameterListSave];
      if (!value) {
        this.setAlert({
          show: true,
          type: 'error',
          message: `${type}_can_not_be_empty`,
        });
        await this.getParameteranalysisListRecords(this.getQuery());
        return;
      }
      if (type === 'usl') {
        if (value < 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'USL is is greater than zero',
          });
          await this.getParameteranalysisListRecords(this.getQuery());
          return;
        }
      }
      if (type === 'lsl') {
        if (value < 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'LSL is is greater than zero',
          });
          await this.getParameteranalysisListRecords(this.getQuery());
          return;
        }
      }
      if (type === 'target') {
        if (value < 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'Target is is greater than zero',
          });
          await this.getParameteranalysisListRecords(this.getQuery());
          return;
        }
      }
      if (type === 'max') {
        if (value < 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'Max is is greater than zero',
          });
          await this.getParameteranalysisListRecords(this.getQuery());
          return;
        }
      }
      if (type === 'min') {
        if (value < 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'Min is is greater than zero',
          });
          await this.getParameteranalysisListRecords(this.getQuery());
          return;
        }
      }
      const parameterItem = parameterListSave.filter((parameter) => item._id === parameter._id)[0];
      // let query = `?query=id=="${parameterItem.id}"`;
      const payload = {};
      payload[type] = value;
      this.saving = true;
      const updateResult = await this.updateParameteranalysis({ id: parameterItem._id, payload });
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: `update_${type}`,
        });
      }
      await this.getParameteranalysisListRecords(this.getQuery());
    },
    async handleDeleteParameter() {
      // eslint-disable-next-line max-len
      const results = await Promise.all(this.parameterSelected.map((parameter) => this.deleteParameteranalysis(parameter.parameterid)));
      if (results.every((bool) => bool === true)) {
        this.saving = true;
        const parameterList = await this.getParameteranalysisListRecords(this.getQuery());
        if (parameterList.length === 0) {
          this.setSelectedParameterName('');
          this.setSelectedParameterDirection('');
          this.setSelectedParameterCategory('');
          this.setSelectedParameterDatatype('');
          await this.getParameteranalysisListRecords(this.getQuery());
        }
        this.saving = false;
        this.confirmDialog = false;
        this.parameterSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'delete_parameter_configuration',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'delete_parameter_configuration',
        });
      }
    },
    async RefreshUI() {
      await this.getParameteranalysisListRecords(this.getQuery());
      // this.downloadFromPLC();
    },
    getQuery() {
      let query = '?query=';
      if (this.selectedParameterName) {
        query += `parametername=="${this.selectedParameterName}"%26%26`;
      }
      if (this.substationValue) {
        query += `substationid=="${this.substationValue || ''}"`;
      }
      return query;
    },
    async exportData() {
      const lineName = this.lineList.filter((item) => this.lineValue === item.id).length ? this.lineList.filter((item) => this.lineValue === item.id)[0].name : 'None';
      const sublineName = this.sublineList.filter((item) => this.sublineValue === item.id).length ? this.sublineList.filter((item) => this.sublineValue === item.id)[0].name : 'None';
      const stationName = this.stationList.filter((item) => this.stationValue === item.id).length ? this.stationList.filter((item) => this.stationValue === item.id)[0].name : 'None';
      const substationName = this.substationList.filter((item) => this.substationValue === item.id).length ? this.substationList.filter((item) => this.substationValue === item.id)[0].name : 'None';
      const fileName = `${lineName}-${sublineName}-${stationName}-${substationName}`;
      const parameterSelected = this.parameterSelected.map((item) => ({ ...item }));
      const csvContent = [];
      const column = ['lineid', 'sublineid', 'stationid', 'substationid', 'parameterid', 'parametername', 'parameterdescription', 'usl', 'lsl', 'target', 'max', 'min'];

      parameterSelected.forEach((parameter) => {
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
        message: 'export_parameter_configuration_list',
      });
      return content;
    },
    async exportSampleData() {
      const fileName = 'sample-file';
      const column = ['lineid', 'sublineid', 'stationid', 'substationid', 'parameterid', 'parametername', 'parameterdescription', 'usl', 'lsl', 'target', 'max', 'min'];
      const csvContent = [];
      const arr = [1, 'subline-277', 'station-226', 'substation-180', '5891', 'subprocessresult5', 'Result from SubProcess', 2, 2, 2, 2, 2];
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
      let bypass = true;
      let msg = '';
      data.forEach((item, index) => {
        item.parametername = item.parametername.toLowerCase().trim();
        item.assetid = 4;
        if (!(item.usl > 0)) {
          bypass = false;
          msg = `wrong_usl_value in Line ${index + 2}`;
        }
        if (!(item.lsl > 0)) {
          bypass = false;
          msg = `wrong_lsl_value in Line ${index + 2}`;
        }
        if (!(item.target > 0)) {
          bypass = false;
          msg = `wrong_target_value in Line ${index + 2}`;
        }
        if (!(item.max > 0)) {
          bypass = false;
          msg = `wrong_max_value in Line ${index + 2}`;
        }
        if (!(item.min > 0)) {
          bypass = false;
          msg = `wrong_min_value in Line ${index + 2}`;
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
      const dataList = data.concat(this.parameteranalysisList);
      const nameList = dataList.map((item) => item.parametername);
      if (new Set(nameList).size === nameList.length) {
        const createResult = await this.createParameteranalysisList(data);
        if (createResult) {
          await this.getParameteranalysisListRecords(this.getQuery());
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
          message: 'duplicate_parameter_confirguration',
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
  width: 100%;
  padding: 20px 0;
  overflow: hidden;
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
.planScheduleView .v-select {
  height: 30px;
}
.planScheduleView .v-input__slot {
  width: 150px;
}
.planScheduleView .v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
  min-height: 30px;
}
</style>
