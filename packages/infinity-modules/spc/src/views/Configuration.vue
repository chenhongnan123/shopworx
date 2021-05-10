<template>
  <!-- eslint-disable max-len -->

  <v-container fluid class="py-0">
    <div justify="center" class="planScheduleView">
      <div class="py-0">
        <div class="stick">
          <div style="float: left; margin-bottom: 10px">
            <span v-if="elementList.length && !!elementValue" class="ml-2">
              Element:
              <v-btn small color="normal" outlined class="text-none ml-2 text-truncate" @click="setElementValue('')">
                <v-icon small left>mdi-close</v-icon>
                <div class="text-truncate" style="max-width: 100px">
                  {{ elementList.filter((item) => item.elementName === elementValue)[0].elementName }}
                </div>
              </v-btn>
            </span>
          </div>
          <div style="float: right">
            <v-btn small color="primary" class="text-none"  @click="setAddParameterDialog(true)">
              <v-icon small left>mdi-plus</v-icon>
              Add parameter analysis
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2"  @click="RefreshUI">
              <v-icon small left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
            <v-btn small color="error" outlined class="text-none ml-2" @click="confirmDialog = true" v-if="spcconfigurationList.length && parameterSelected.length">
              <v-icon small left>mdi-delete</v-icon>
              Delete
            </v-btn>
            <v-btn small color="primary" v-if="parameterSelected.length > 0" outlined class="text-none ml-2" @click="exportData">
              Export
            </v-btn>
            <v-btn small color="primary" v-if="!( parameterSelected.length > 0)" outlined class="text-none ml-2" @click="exportSampleData">
              Export Sample File
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2"  @click="importData">
              Import
            </v-btn>
            <input multiple type="file" accept=".csv" ref="uploader" class="d-none" id="uploadFiles" @change="onFilesChanged" />
            <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
              <v-icon small left>mdi-filter-variant</v-icon>
              Filters
            </v-btn>
          </div>
        </div>
        <v-data-table v-model="parameterSelected" :headers="headers" item-key="_id" :items="spcconfigurationList" :options="{ itemsPerPage: 10 }" show-select>
          <template v-slot:item.ucl="props">
            <v-edit-dialog :return-value.sync="props.item.ucl" @save="saveTableParameter(props.item, 'ucl')">
              {{ props.item.ucl }}
              <v-icon small color="primary">
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field  v-model="props.item.ucl" label="Edit" single-line type="number"></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.lcl="props">
            <v-edit-dialog :return-value.sync="props.item.lcl" @save="saveTableParameter(props.item, 'lcl')">
              {{ props.item.lcl }}
              <v-icon small color="primary" >
                mdi-pencil
              </v-icon>
              <template v-slot:input>
                <v-text-field  v-model="props.item.lcl" label="Edit" single-line type="number"></v-text-field>
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
    <AddParameter  v-if="addParameterDialog" />
    <ParameterFilter/>
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
  name: 'Configuration',
  data() {
    return {
      parameterSelected: [],
      headers: [
        { text: 'Number', value: 'number', width: 60 },
        { text: 'Element', value: 'elementname', width: 120 },
        { text: 'Element Description', value: 'elementdescription', width: 120 },
        { text: 'Tag', value: 'tagname', width: 120 },
        { text: 'Tag Description', value: 'tagdescription', width: 200 },
        { text: 'UCL', value: 'ucl', width: 100 },
        { text: 'LCL', value: 'lcl', width: 100 },
      ],
      parameterListSave: [],
      confirmDialog: false,
      socket: null,
      saving: false,
    };
  },
  async created() {
    this.getElements();
    this.zipService = ZipService;
    await this.getPageDataList();
    this.getSpcconfigurationListRecords('?pagenumber=1&pagesize=10');
    // this.socket = socketioclient.connect('http://:10190');
    // this.socket.on('connect', () => {});
  },
  computed: {
    ...mapState('masters', ['elements']),
    ...mapState('spc', ['addParameterDialog', 'parameterList', 'spcconfigurationList', 'isApply', 'elementValue']),
    isAddButtonOK() {
      return true;
    },
    elementList() {
      // eslint-disable-next-line
      return this.elements.map((element) => {
        return element.element;
      });
    },
  },
  watch: {
    elementValue(val) {
      if (!val) {
        this.getSpcconfigurationListRecords('?pagenumber=1&pagesize=10');
      }
    },
    spcconfigurationList(spcconfigurationList) {
      this.parameterListSave = spcconfigurationList.map((item) => ({ ...item }));
    },
  },
  methods: {
    ...mapActions('masters', ['getElements', 'getAssets']),
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('spc', ['setAddParameterDialog', 'toggleFilter', 'setApply', 'setElementValue']),
    ...mapActions('spc', ['getPageDataList', 'updateSpcconfiguration', 'deleteSpcconfiguration', 'createParameter', 'createSpcconfigurationList', 'downloadToPLC', 'getSubStationIdElement', 'getSubStationIdElement', 'createTagElement', 'updateTagStatus', 'getSpcconfigurationListRecords']),
    async saveTableParameter(item, type) {
      const value = item[type];
      const parameterListSave = [...this.parameterListSave];
      if (!value) {
        this.setAlert({
          show: true,
          type: 'error',
          message: `${type}_can_not_be_empty`,
        });
        await this.getSpcconfigurationListRecords(this.getQuery());
        return;
      }
      if (type === 'usl') {
        if (value < 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'USL is is greater than zero',
          });
          await this.getSpcconfigurationListRecords(this.getQuery());
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
          await this.getSpcconfigurationListRecords(this.getQuery());
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
          await this.getSpcconfigurationListRecords(this.getQuery());
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
          await this.getSpcconfigurationListRecords(this.getQuery());
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
          await this.getSpcconfigurationListRecords(this.getQuery());
          return;
        }
      }
      const parameterItem = parameterListSave.filter((parameter) => item._id === parameter._id)[0];
      // let query = `?query=id=="${parameterItem.id}"`;
      const payload = {};
      payload[type] = value;
      this.saving = true;
      const updateResult = await this.updateSpcconfiguration({ id: parameterItem._id, payload });
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: `update_${type}`,
        });
      }
      await this.getSpcconfigurationListRecords(this.getQuery());
    },
    async handleDeleteParameter() {
      // eslint-disable-next-line max-len
      const results = await Promise.all(this.parameterSelected.map((parameter) => this.deleteSpcconfiguration(parameter._id)));
      if (results.every((bool) => bool === true)) {
        this.saving = true;
        await this.getSpcconfigurationListRecords(this.getQuery());

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
      await this.getSpcconfigurationListRecords(this.getQuery());
    },
    getQuery() {
      let query = '?query=';
      if (this.elementValue) {
        query += `elementname=="${this.elementValue}"`;
      }
      return query;
    },
    async exportData() {
      const fileName = 'Parameter-Analyzer';
      const parameterSelected = this.parameterSelected.map((item) => ({ ...item }));
      const csvContent = [];
      const column = ['elementname', 'elementdescription', 'tagname', 'tagdescription', 'ucl', 'lcl'];

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
      const column = ['elementname', 'elementdescription', 'tagname', 'tagdescription', 'ucl', 'lcl'];
      const csvContent = [];
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
        item.key = item.elementname.toLowerCase().trim() + item.tagname.toLowerCase().trim();
        item.assetid = 4;
        if (Number.isNaN(Number(item.ucl))) {
          bypass = false;
          msg = `wrong_usl_value in Line ${index + 2}`;
        }
        if (Number.isNaN(Number(item.lcl))) {
          bypass = false;
          msg = `wrong_lsl_value in Line ${index + 2}`;
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
      const dataList = data.concat(this.spcconfigurationList);
      const nameList = dataList.map((item) => item.key);
      if (new Set(nameList).size === nameList.length) {
        const createResult = await this.createSpcconfigurationList(data);
        if (createResult) {
          await this.getSpcconfigurationListRecords(this.getQuery());
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
