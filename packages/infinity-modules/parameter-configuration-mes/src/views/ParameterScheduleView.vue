<template>
  <v-container fluid class="py-0" v-resize="setHeight">
    <portal to="app-extension">
      <v-row>
        <v-col cols="12" md="3">
          <v-responsive :max-width="200">
            <v-select
              filled
              dense
              hide-details
              :items="protocolList"
              item-value="name"
              v-model="selectedProtocol"
              item-text="name"
              @change="onSelectProtocol"
              label="Select Protocol"
            ></v-select>
          </v-responsive>
        </v-col>
        <v-col cols="12" md="9">
          <div style="float: right" class="mt-4">
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
            <v-btn
              small
              color="primary"
              class="text-none ml-1"
              :disabled="isAddButtonOK"
              @click="getMonitorValues"
            >
              Monitor
            </v-btn>
            <v-btn
              small
              color="primary"
              outlined
              class="text-none ml-2"
              :disabled="!substationValue"
              @click="RefreshUI"
            >
              <v-icon small left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
            <v-btn
              small
              color="error"
              outlined
              class="text-none ml-2"
              @click="confirmDialog = true"
              v-if="parameterList.length && parameterSelected.length"
            >
              <v-icon small left>mdi-delete</v-icon>
              Delete
            </v-btn>
            <v-btn
              small
              color="primary"
              v-if="substationValue && parameterSelected.length > 0"
              outlined
              class="text-none ml-2"
              @click="exportData"
            >
              Export
            </v-btn>
            <v-btn
              small
              color="primary"
              v-if="!(substationValue && parameterSelected.length > 0)"
              outlined
              class="text-none ml-2"
              :disabled="sampleDataBtn"
              @click="exportSampleData"
            >
              Export Sample File
            </v-btn>
            <v-btn
              small
              color="primary"
              outlined
              class="text-none ml-2"
              :disabled="isAddButtonOK"
              :loading="savingImport"
              @click="importData"
            >
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
            />
            <v-btn
              :disabled="!selectedProtocol"
              small
              color="primary"
              outlined
              class="text-none ml-2"
              @click="toggleFilter"
            >
              <v-icon small left>mdi-filter-variant</v-icon>
              Filters
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </portal>
    <v-row>
      <v-col cols="12" md="12">
        <span v-if="lineList.length && !!lineValue" class="ml-2">
          line:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setLineValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate" style="max-width: 100px">
              {{ lineList.filter((item) => item.id === lineValue)[0].name }}
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
            @click="setSublineValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate" style="max-width: 100px">
              {{
                sublineList.filter((item) => item.id === sublineValue)[0].name
              }}
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
            @click="setStationValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate" style="max-width: 100px">
              {{
                stationList.filter((item) => item.id === stationValue)[0].name
              }}
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
            @click="setSubstationValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate" style="max-width: 100px">
              {{
                substationList.filter((item) => item.id === substationValue)[0]
                  .name
              }}
            </div>
          </v-btn>
        </span>
        <proceed-dialog ref="ProceedDialog"
          :openDialog="openDialog"
          :responce="responce"
          :optionalRes="optionalRes"
          :duplicateBnum="duplicateBnum"
          :duplicateStartnum="duplicateStartnum"
          :dupDbAddress="dupDbAddress"
          :paramLength="paramLength"
          :dummyNames="dummyNames"
          :dummyParamsDb="dummyParamsDb"
          :dummyCombo="dummyCombo"
          :duplicateCombination="duplicateCombination"/>
      </v-col>
      <v-col cols="12" md="12"> </v-col>
    </v-row>
    <v-data-table
      v-if="parameterList.length"
      v-model="parameterSelected"
      :headers="headers"
      item-key="_id"
      :items="parameterList"
      :options="{ itemsPerPage: 5 }"
      fixed-header
      show-select
      :height="height"
      :loading="myLoadingVariable"
      :loading-text="this.initialMessage"
    >
      <template v-slot:[`item.name`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.name"
          @save="saveTableParameter(props.item, 'name')"
        >
          {{ props.item.name }}
          <v-icon
            small
            color="primary"
            :disabled="substationValue ? false : true"
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
      <template v-slot:[`item.description`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.description"
          large
          @save="saveTableParameter(props.item, 'description')"
        >
          <span>
            {{
              props.item.description.length > 10
                ? props.item.description.substr(0, 9) + "..."
                : props.item.description
            }}
          </span>
          <v-icon
            small
            color="primary"
            :disabled="substationValue ? false : true"
          >
            mdi-pencil
          </v-icon>
          <template v-slot:input>
            <v-textarea
              :disabled="substationValue ? false : true"
              v-model="props.item.description"
              label="Edit"
              single-line
            ></v-textarea>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:[`item.sequence`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.sequence"
          @save="saveTableParameter(props.item, 'sequence')"
        >
          {{ props.item.sequence }}
          <v-icon
            small
            color="primary"
            :disabled="substationValue ? false : true"
          >
            mdi-pencil
          </v-icon>
          <template v-slot:input>
            <v-text-field
              :disabled="substationValue ? false : true"
              v-model="props.item.sequence"
              label="Edit"
              single-line
              type="number"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:[`item.parametercategory`]="props">
        <v-select
          :disabled="(substationValue ? false : true) || saving"
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
      <template v-slot:[`item.datatype`]="props">
        <v-select
          :disabled="(substationValue ? false : true) || saving"
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
      <template v-slot:[`item.bitnumber`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.bitnumber"
          @save="saveTableParameter(props.item, 'bitnumber')"
        >
          {{ props.item.bitnumber }}
          <v-icon
            small
            color="primary"
            :disabled="!substationValue || props.item.datatype !== 12"
          >
            mdi-pencil
          </v-icon>
          <template v-slot:input>
            <v-text-field
              :disabled="!substationValue || props.item.datatype !== 12"
              v-model="props.item.bitnumber"
              label="Edit"
              single-line
              type="number"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:[`item.size`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.size"
          @save="saveTableParameter(props.item, 'size')"
        >
          {{ props.item.size }}
          <v-icon
            small
            color="primary"
            :disabled="!substationValue || props.item.datatype !== 11"
          >
            mdi-pencil
          </v-icon>
          <template v-slot:input>
            <v-text-field
              :disabled="!substationValue || props.item.datatype !== 11"
              v-model="props.item.size"
              label="Edit"
              single-line
              type="number"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:[`item.startaddress`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.startaddress"
          @save="saveTableParameter(props.item, 'startaddress')"
        >
          {{ props.item.startaddress }}
          <v-icon
            small
            color="primary"
            :disabled="substationValue ? false : true"
          >
            mdi-pencil
          </v-icon>
          <template v-slot:input>
            <v-text-field
              :disabled="substationValue ? false : true"
              v-model="props.item.startaddress"
              label="Edit"
              single-line
              type="number"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:[`item.dbaddress`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.dbaddress"
          @save="saveTableParameter(props.item, 'dbaddress')"
        >
          {{ props.item.dbaddress }}
          <v-icon
            small
            color="primary"
            :disabled="substationValue ? false : true"
          >
            mdi-pencil
          </v-icon>
          <template v-slot:input>
            <v-text-field
              :disabled="substationValue ? false : true"
              v-model="props.item.dbaddress"
              label="Edit"
              single-line
              type="number"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>
    <v-dialog
      persistent
      scrollable
      v-model="confirmDialog"
      max-width="500px"
      fixed-header
      :height="tableHeight - 168"
    >
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
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
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
      v-if="addParameterDialog"
    />
    <ParameterFilter :station="stationValue" :substation="substationValue" />
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import socketioclient from 'socket.io-client';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import AddParameter from '../components/AddParameter.vue';
import ParameterFilter from '../components/ParameterFilter.vue';
import ProceedDialog from '../components/ProceedDialog.vue';

export default {
  name: 'PlanScheduleView',
  data() {
    return {
      ProceedDialog: '',
      protocolList: [
        {
          name: 'SNAP7',
        },
        {
          name: 'MELSEC',
        },
        {
          name: 'ABPLC',
        },
        {
          name: 'OPCUA',
        },
      ],
      initialMessage: 'Please select protocol',
      myLoadingVariable: false,
      selectedProtocol: null,
      sampleDataBtn: true,
      parameterSelected: [],
      tableHeight: window.innerHeight,
      headers: [],
      headersSnap7: [
        { text: 'Number', value: 'number', width: 120 },
        { text: 'Line', value: 'line', width: 120 },
        { text: 'Subline', value: 'subline', width: 120 },
        { text: 'Station', value: 'station', width: 120 },
        { text: 'Substation', value: 'substation', width: 120 },
        { text: 'Parameter', value: 'name', width: 120 },
        { text: 'Parameter Description', value: 'description', width: 200 },
        { text: 'Sequence', value: 'sequence' },
        { text: 'Category', value: 'parametercategory' },
        { text: 'Data type', value: 'datatype' },
        { text: 'Size', value: 'size', width: 80 },
        { text: 'DB Address', value: 'dbaddress', width: 130 },
        { text: 'Start Address', value: 'startaddress', width: 140 },
        { text: 'Boolean Bit', value: 'bitnumber', width: 120 },
        { text: 'Monitor', value: 'monitorvalue', width: 130 },
        { text: 'Status', value: 'status', width: 130 },
      ],
      headersMelsec: [
        { text: 'Number', value: 'number', width: 120 },
        { text: 'Line', value: 'line', width: 120 },
        { text: 'Subline', value: 'subline', width: 120 },
        { text: 'Station', value: 'station', width: 120 },
        { text: 'Substation', value: 'substation', width: 120 },
        { text: 'Parameter', value: 'name', width: 120 },
        { text: 'Parameter Description', value: 'description', width: 200 },
        { text: 'Sequence', value: 'sequence' },
        { text: 'Category', value: 'parametercategory' },
        { text: 'Data type', value: 'datatype' },
        { text: 'Size', value: 'size', width: 80 },
        { text: 'Start Address', value: 'startaddress', width: 140 },
        { text: 'Boolean Bit', value: 'bitnumber', width: 120 },
        { text: 'Monitor', value: 'monitorvalue', width: 130 },
        { text: 'Status', value: 'status', width: 130 },
      ],
      headersAbPlc: [
        { text: 'Number', value: 'number', width: 120 },
        { text: 'Line', value: 'line', width: 120 },
        { text: 'Subline', value: 'subline', width: 120 },
        { text: 'Station', value: 'station', width: 120 },
        { text: 'Substation', value: 'substation', width: 120 },
        { text: 'Parameter', value: 'name', width: 120 },
        { text: 'Parameter Description', value: 'description', width: 200 },
        { text: 'Sequence', value: 'sequence' },
        { text: 'Category', value: 'parametercategory' },
        { text: 'Data type', value: 'datatype' },
        { text: 'Size', value: 'size', width: 80 },
        { text: 'PLC Parameter', value: 'plc_parameter', width: 140 },
        { text: 'Prefix', value: 'prefix', width: 120 },
        { text: 'Monitor', value: 'monitorvalue', width: 130 },
      ],
      headersOPCUA: [
        { text: 'Number', value: 'number', width: 120 },
        { text: 'Line', value: 'line', width: 120 },
        { text: 'Subline', value: 'subline', width: 120 },
        { text: 'Station', value: 'station', width: 120 },
        { text: 'Substation', value: 'substation', width: 120 },
        { text: 'Parameter', value: 'name', width: 120 },
        { text: 'Parameter Description', value: 'description', width: 200 },
        { text: 'Sequence', value: 'sequence' },
        { text: 'Category', value: 'parametercategory' },
        { text: 'Node ID', value: 'nodeid' },
        { text: 'Data type', value: 'datatype' },
        { text: 'Size', value: 'size', width: 80 },
        { text: 'Start Address', value: 'startaddress', width: 140 },
        { text: 'Boolean Bit', value: 'bitnumber', width: 120 },
        { text: 'Monitor', value: 'monitorvalue', width: 130 },
        { text: 'Status', value: 'status', width: 130 },
      ],
      parameterListSave: [],
      confirmDialog: false,
      socket: null,
      saving: false,
      height: window.innerHeight,
      openDialog: false,
      responce: [],
      optionalRes: [],
      resLen: [],
      paramLength: [],
      dataForCreation: [],
      duplicateBnum: [],
      duplicateStartnum: [],
      dupDbAddress: [],
      dummyCombo: [],
      dummyNames: [],
      dummyParamsDb: [],
      validateFlag: true,
      savingImport: false,
      duplicateCombination: [],
      importArray: [],
      emptyDataList: [],
      dataForTracebilityElement: [],
      tracibilityExecution: false,
      masterTags: [{
        tagName: 'name',
        tagDescription: 'Parameter Name',
        required: true,
        emgTagType: 'string',
      }, {
        tagName: 'description',
        tagDescription: 'Parameter Description',
        required: false,
        emgTagType: 'string',
      }, {
        tagName: 'protocol',
        tagDescription: 'Protcol Name',
        required: true,
        emgTagType: 'string',
      }, {
        tagName: 'datatype',
        tagDescription: 'Datatype',
        required: true,
        emgTagType: 'int',
      }, {
        tagName: 'bitnumber',
        tagDescription: 'BitnNumber',
        required: true,
        emgTagType: 'int',
      }, {
        tagName: 'dbaddress',
        tagDescription: 'DB Address',
        required: true,
        emgTagType: 'int',
      }, {
        tagName: 'size',
        tagDescription: 'Size',
        required: false,
        emgTagType: 'int',
      }, {
        tagName: 'multiplicationfactor',
        tagDescription: 'Mutiplication Factor',
        required: true,
        emgTagType: 'int',
      }, {
        tagName: 'parameterunit',
        tagDescription: 'Parameter Unit',
        required: false,
        emgTagType: 'int',
      }, {
        tagName: 'parametercategory',
        tagDescription: 'Parameter Category',
        required: true,
        emgTagType: 'int',
      }, {
        tagName: 'paid',
        tagDescription: 'Paid',
        required: true,
        emgTagType: 'int',
      }, {
        tagName: 'startaddress',
        tagDescription: 'Start Address',
        required: true,
        emgTagType: 'int',
      }, {
        tagName: 'maxdecimal',
        tagDescription: 'Max Decimal',
        required: false,
        emgTagType: 'int',
      }],
    };
  },
  async created() {
    this.setExtendedHeader(true);
    this.zipService = ZipService;
    await this.getPageDataList();
    this.socket = socketioclient.connect('http://:10190');
    this.socket.on('connect', () => {});
  },
  mounted() {
    this.setHeight();
    this.ProceedDialog = this.$refs.ProceedDialog;
    this.$root.$on('clearResponce', (data) => {
      const clear = data;
      if (clear) {
        document.getElementById('uploadFiles').value = null;
        this.responce = [];
        this.optionalRes = [];
        this.duplicateBnum = [];
        this.duplicateStartnum = [];
        this.dupDbAddress = [];
        this.paramLength = [];
        this.dummyNames = [];
        this.dummyParamsDb = [];
        this.dummyCombo = [];
        this.duplicateCombination = [];
        this.importArray = [];
      }
    });
    this.$root.$on('getListofParams', (data) => {
      const getList = data;
      if (getList) {
        this.getParameterListRecords(this.getQuery());
      }
    });
    this.$root.$on('passedFlagOfValidations', (data) => {
      const getTrue = data;
      if (getTrue) {
        this.tracibilityExecution = true;
        this.executeTracebilityLogic(getTrue);
      }
    });
  },
  destroyed() {
    this.setLineValue('');
    this.setSublineValue('');
    this.setStationValue('');
    this.setSubstationValue('');
    this.setParameterList([]);
    this.setProtocol('');
  },
  computed: {
    ...mapState('parameterConfigurationMes', [
      'addParameterDialog',
      'parameterList',
      'isApply',
      'lineList',
      'sublineList',
      'stationList',
      'substationList',
      'directionList',
      'categoryList',
      'datatypeList',
      'lineValue',
      'sublineValue',
      'stationValue',
      'substationValue',
      'selectedParameterName',
      'selectedParameterDirection',
      'selectedParameterCategory',
      'selectedParameterDatatype',
      'subStationElementDeatils',
      'createElementResponse',
      'protocol',
      'validationsPassed',
    ]),
    isAddButtonOK() {
      if (
        this.lineValue
        && this.sublineValue
        && this.stationValue
        && this.substationValue
        && this.isApply
      ) {
        return false;
      }
      return true;
    },
  },
  watch: {
    lineValue(val) {
      if (!val) {
        this.myLoadingVariable = true;
        this.setSublineValue('');
        this.setStationValue('');
        this.setSubstationValue('');
        this.getParameterListRecords(`?query=protocol=="${this.protocol}"&sortquery=sequence==1&pagenumber=1&pagesize=10`);
        this.myLoadingVariable = false;
      }
    },
    async sublineValue(val) {
      if (!val) {
        this.myLoadingVariable = true;
        this.setStationValue('');
        this.setSubstationValue('');
        let query = `?query=protocol=="${this.protocol}"`;
        if (this.lineValue && this.lineValue !== '') {
          query = `?query=lineid==${this.lineValue}"%26%26protocol=="${this.protocol}"`;
        }
        query += '&sortquery=sequence==1';
        await this.getParameterListRecords(query);
        this.myLoadingVariable = false;
      }
    },
    async stationValue(val) {
      if (!val) {
        this.myLoadingVariable = true;
        this.setSubstationValue('');
        let query = `?query=protocol=="${this.protocol}"`;
        if (this.lineValue && this.lineValue !== '') {
          query = `?query=lineid==${this.lineValue}"%26%26protocol=="${this.protocol}"`;
        }
        if (this.sublineValue && this.sublineValue !== '') {
          query = `?query=lineid==${this.lineValue}%26%26sublineid=="${this.sublineValue}"%26%26protocol=="${this.protocol}"`;
        }
        query += '&sortquery=sequence==1';
        await this.getParameterListRecords(query);
        this.myLoadingVariable = false;
      }
    },
    async substationValue(val) {
      if (!val) {
        this.myLoadingVariable = true;
        this.setSubstationValue('');
        let query = `?query=protocol=="${this.protocol}"`;
        if (this.lineValue && this.lineValue !== '') {
          query = `?query=lineid==${this.lineValue}"%26%26protocol=="${this.protocol}"`;
        }
        if (this.sublineValue && this.sublineValue !== '') {
          query = `?query=lineid==${this.lineValue}%26%26sublineid=="${this.sublineValue}"%26%26protocol=="${this.protocol}"`;
        }
        if (this.sublineValue && this.sublineValue !== '') {
          query = `?query=lineid==${this.lineValue}%26%26sublineid=="${this.sublineValue}"%26%26stationid=="${this.stationValue}"%26%26protocol=="${this.protocol}"`;
        }
        query += '&sortquery=sequence==1';
        await this.getParameterListRecords(query);
        this.myLoadingVariable = false;
      }
    },
    parameterList(parameterList) {
      this.parameterListSave = parameterList.map((item) => ({ ...item }));
    },
    async protocol(val) {
      if (val === 'SNAP7') {
        this.headers = this.headersSnap7;
        this.myLoadingVariable = true;
        let query = '?query=';
        if (this.lineValue && this.sublineValue && this.stationValue && this.substationValue) {
          query += `lineid==${this.lineValue}%26%26sublineid=="${this.sublineValue}"%26%26stationid=="${this.stationValue}"%26%26substationid=="${this.substationValue}"%26%26protocol=="${val}"&sortquery=sequence==1`;
          await this.getParameterListRecords(query);
          this.myLoadingVariable = false;
        } else {
          this.myLoadingVariable = true;
          await this.getParameterListRecords(`?query=protocol=="${val}"&sortquery=sequence==1&pagenumber=1&pagesize=10`);
          this.myLoadingVariable = false;
        }
      } else if (val === 'MELSEC') {
        this.headers = this.headersMelsec;
        this.myLoadingVariable = true;
        let query = '?query=';
        if (this.lineValue && this.sublineValue && this.stationValue && this.substationValue) {
          query += `lineid==${this.lineValue}%26%26sublineid=="${this.sublineValue}"%26%26stationid=="${this.stationValue}"%26%26substationid=="${this.substationValue}"%26%26protocol=="${val}"&sortquery=sequence==1`;
          await this.getParameterListRecords(query);
          this.myLoadingVariable = false;
        } else {
          this.myLoadingVariable = true;
          await this.getParameterListRecords(`?query=protocol=="${val}"&sortquery=sequence==1&pagenumber=1&pagesize=10`);
          this.myLoadingVariable = false;
        }
      } else if (val === 'OPCUA') {
        this.headers = this.headersOPCUA;
        this.myLoadingVariable = true;
        let query = '?query=';
        if (this.lineValue && this.sublineValue && this.stationValue && this.substationValue) {
          query += `lineid==${this.lineValue}%26%26sublineid=="${this.sublineValue}"%26%26stationid=="${this.stationValue}"%26%26substationid=="${this.substationValue}"%26%26protocol=="${val}"&sortquery=sequence==1`;
          await this.getParameterListRecords(query);
          this.myLoadingVariable = false;
        } else {
          this.myLoadingVariable = true;
          await this.getParameterListRecords(`?query=protocol=="${val}"&sortquery=sequence==1&pagenumber=1&pagesize=10`);
          this.myLoadingVariable = false;
        }
      } else {
        this.headers = this.headersAbPlc;
        this.myLoadingVariable = true;
        let query = '?query=';
        if (this.lineValue && this.sublineValue && this.stationValue && this.substationValue) {
          query += `lineid==${this.lineValue}%26%26sublineid=="${this.sublineValue}"%26%26stationid=="${this.stationValue}"%26%26substationid=="${this.substationValue}"%26%26protocol=="${val}"&sortquery=sequence==1`;
          await this.getParameterListRecords(query);
          this.myLoadingVariable = false;
        } else {
          this.myLoadingVariable = true;
          await this.getParameterListRecords(`?query=protocol=="${val}"&sortquery=sequence==1&pagenumber=1&pagesize=10`);
          this.myLoadingVariable = false;
        }
      }
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert', 'setExtendedHeader']),
    ...mapMutations('parameterConfigurationMes', [
      'setAddParameterDialog',
      'toggleFilter',
      'setLineValue',
      'setSublineValue',
      'setStationValue',
      'setSubstationValue',
      'setSelectedParameterName',
      'setSelectedParameterDirection',
      'setSelectedParameterCategory',
      'setSelectedParameterDatatype',
      'setParameterList',
      'setProtocol',
      'setCreateParam',
    ]),
    ...mapActions('parameterConfigurationMes', [
      'getPageDataList',
      'getSublineList',
      'getStationList',
      'getSubstationList',
      'getParameterListRecords',
      'updateParameter',
      'deleteParameter',
      'createParameter',
      'createParameterList',
      'downloadToPLC',
      'getSubStationIdElement',
      'getSubStationIdElement',
      'getElementDetails',
      'createTagElement',
      'updateTagStatus',
      'createElement',
    ]),
    setHeight() {
      this.height = window.innerHeight - 212;
    },
    onSelectProtocol(value) {
      this.initialMessage = 'Loading...please wait';
      this.setProtocol(value);
      if (this.protocol) {
        this.sampleDataBtn = false;
      } else {
        this.sampleDataBtn = true;
      }
    },
    async saveTableParameter(item, type) {
      if (type === 'sequence') {
        item[type] = Number(item[type]);
      }
      const value = item[type];
      const parameterListSave = [...this.parameterListSave];
      if (!value) {
        this.setAlert({
          show: true,
          type: 'error',
          message: `${type}_can_not_be_empty`,
        });
        await this.getParameterListRecords(this.getQuery());
        return;
      }
      if (type === 'name') {
        if (parameterListSave.some((parameter) => value.toLowerCase().split(' ').join('')
           === parameter.name.toLowerCase().split(' ').join(''))) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'parameter_name_is_present',
          });
          await this.getParameterListRecords(this.getQuery());
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
          await this.getParameterListRecords(this.getQuery());
          return;
        }
      }
      if (item.datatype !== 12) {
        if (type === 'dbaddress') {
          const isRepeat = parameterListSave.some(
            (parameter) => parameter.datatype !== 12
             && Number(item.dbaddress) === parameter.dbaddress
             && Number(item.startaddress) === parameter.startaddress,
          );
          if (isRepeat) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'parameter_dbaddress_is_present',
            });
            await this.getParameterListRecords(this.getQuery());
            return;
          }
        }
        if (type === 'startaddress') {
          const isRepeat = parameterListSave.some(
            (parameter) => parameter.datatype !== 12
              && Number(item.dbaddress) === parameter.dbaddress
              && Number(item.startaddress) === parameter.startaddress,
          );
          if (isRepeat) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'parameter_startaddress_is_present',
            });
            await this.getParameterListRecords(this.getQuery());
            return;
          }
        }
      } else {
        if (type === 'dbaddress') {
          const isRepeat = parameterListSave.some(
            (parameter) => parameter.datatype === 12
              && Number(item.dbaddress) === parameter.dbaddress
              && Number(item.startaddress) === parameter.startaddress
              && item.bitnumber === parameter.bitnumber,
          );
          if (isRepeat) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'parameter_dbaddress_is_present',
            });
            await this.getParameterListRecords(this.getQuery());
            return;
          }
        }
        if (type === 'startaddress') {
          const isRepeat = parameterListSave.some(
            (parameter) => parameter.datatype === 12
              && Number(item.dbaddress) === parameter.dbaddress
              && Number(item.startaddress) === parameter.startaddress
              && item.bitnumber === parameter.bitnumber,
          );
          if (isRepeat) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'parameter_startaddress_is_present',
            });
            await this.getParameterListRecords(this.getQuery());
            return;
          }
        }
        if (type === 'bitnumber') {
          const isRepeat = parameterListSave.some(
            (parameter) => parameter.datatype === 12
              && Number(item.dbaddress) === parameter.dbaddress
              && Number(item.startaddress) === parameter.startaddress
              && item.bitnumber === parameter.bitnumber,
          );
          if (isRepeat) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'Boolean_Bit_is_present',
            });
            await this.getParameterListRecords(this.getQuery());
            return;
          }
        }
      }
      let selectedDatatypeItem = {};
      const parameterItem = parameterListSave
        .filter((parameter) => item._id === parameter._id)[0];
      // let query = `?query=id=='${parameterItem.id}'`;
      const payload = {};
      if (type === 'datatype') {
        [selectedDatatypeItem] = this.datatypeList
          .filter((datatype) => value === datatype.id);
        // query = `?query=id=='${parameterItem.id}'&isbigendian==
        // ${selectedDatatypeItem.isbigendian === 1}
        // &isswapped==${selectedDatatypeItem.isswapped === 1}`;
        payload.isbigendian = selectedDatatypeItem.isbigendian === 1;
        payload.isswapped = selectedDatatypeItem.isswapped === 1;
        if (
          selectedDatatypeItem.name !== 'Boolean'
          && selectedDatatypeItem.name !== 'String'
        ) {
          payload.size = selectedDatatypeItem.size;
        }
      }
      payload[type] = value;
      this.saving = true;
      const updateResult = await this.updateParameter({
        id: parameterItem._id,
        payload,
      });
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: `update_${type}`,
        });
      }
      await this.getParameterListRecords(this.getQuery());
    },
    async handleDeleteParameter() {
      const results = await Promise.all(
        this.parameterSelected.map((parameter) => this.deleteParameter(parameter.id)),
      );
      const selectedSubStaionlist = this.parameterSelected.map((sl) => sl.substationid);
      await this.getSubStationIdElement(selectedSubStaionlist[0]);
      const listT = this.subStationElementDeatils;
      // const FilteredTags = listT.tags.map((t,e) => t.id, e.elementId);
      let FilteredTags = listT.tags.map((obj) => ({
        id: obj.id,
        elementId: obj.elementId,
      }));
      let payloadData = [];
      FilteredTags.forEach(async (tag) => {
        payloadData.push({
          tagId: tag.id,
          elementId: tag.elementId,
          status: 'INACTIVE',
        });
      });
      // on delete update the tags of traceability element
      const listTags = await this.getElementDetails('traceability');
      // const FilteredTags = listT.tags.map((t,e) => t.id, e.elementId);
      FilteredTags = listTags.tags.map((obj) => ({
        id: obj.id,
        elementId: obj.elementId,
      }));
      payloadData = [];
      FilteredTags.forEach(async (tag) => {
        payloadData.push({
          tagId: tag.id,
          elementId: tag.elementId,
          status: 'INACTIVE',
        });
      });
      await this.updateTagStatus(payloadData);
      if (results.every((bool) => bool === true)) {
        this.saving = true;
        const parameterList = await this.getParameterListRecords(this.getQuery());
        if (parameterList.length === 0) {
          this.setSelectedParameterName('');
          this.setSelectedParameterDirection('');
          this.setSelectedParameterCategory('');
          this.setSelectedParameterDatatype('');
          await this.getParameterListRecords(this.getQuery());
        }
        this.saving = false;
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
      let query = '?query=';
      if (this.selectedParameterName) {
        query += `name=="${this.selectedParameterName}"%26%26`;
      }
      if (this.selectedParameterDirection) {
        query += `parameterdirection=="${this.selectedParameterDirection}"%26%26`;
      }
      if (this.selectedParameterCategory) {
        query += `parametercategory=="${this.selectedParameterCategory}"%26%26`;
      }
      if (this.selectedParameterDatatype) {
        query += `datatype=="${this.selectedParameterDatatype}"%26%26`;
      }
      if (this.substationValue) {
        query += `substationid=="${this.substationValue}"`;
      } else {
        query += `stationid=="${this.stationValue || null}"`;
      }
      if (query === '?query=') {
        query = '?sortquery=sequence==1';
      } else {
        query += '&sortquery=sequence==1';
      }
      this.saving = true;
      await this.getParameterListRecords(query);
      this.saving = false;
    },
    getMonitorValues() {
      this.downloadFromPLC();
    },
    async downloadFromPLC() {
      const object = {
        lineid: Number(this.lineValue),
        sublineid: this.sublineValue,
        substationid: this.substationValue,
      };
      this.socket.on(
        `update_parameter_${object.lineid}_${object.sublineid}_${object.substationid}`,
        (data) => {
          // console.log('event received');
          if (data) {
            this.parameterList.forEach((element) => {
              this.$set(element, 'monitorvalue', data[element.name]);
            });
          }
        },
      );
      await this.downloadToPLC(object);
    },
    getQuery() {
      let query = '?query=';
      if (this.selectedParameterName) {
        query += `name=="${this.selectedParameterName}"%26%26`;
      }
      if (this.selectedParameterDirection) {
        query += `parameterdirection=="${this.selectedParameterDirection}"%26%26`;
      }
      if (this.selectedParameterCategory) {
        query += `parametercategory=="${this.selectedParameterCategory}"%26%26`;
      }
      if (this.selectedParameterDatatype) {
        query += `datatype=="${this.selectedParameterDatatype}"%26%26`;
      }
      if (this.substationValue) {
        query += `substationid=="${this.substationValue || ''}"`;
      }
      if (query === '?query=') {
        query = '?sortquery=sequence==1';
      } else {
        query += '&sortquery=sequence==1';
      }
      return query;
    },
    async exportData() {
      const lineName = this.lineList
        .filter((item) => this.lineValue === item.id).length
        ? this.lineList.filter((item) => this.lineValue === item.id)[0].name : 'None';
      const sublineName = this.sublineList
        .filter((item) => this.sublineValue === item.id).length
        ? this.sublineList.filter((item) => this.sublineValue === item.id)[0].name : 'None';
      const stationName = this.stationList
        .filter((item) => this.stationValue === item.id).length
        ? this.stationList.filter((item) => this.stationValue === item.id)[0].name : 'None';
      const substationName = this.substationList
        .filter((item) => this.substationValue === item.id).length
        ? this.substationList
          .filter((item) => this.substationValue === item.id)[0].name : 'None';
      const fileName = `${lineName}-${sublineName}-${stationName}-${substationName}`;
      const parameterSelected = this.parameterSelected.map((item) => ({
        ...item,
      }));
      const csvContent = [];
      let column = [];
      if (this.protocol === 'SNAP7') {
        column = [
          'name',
          'description',
          'chinesedescription',
          'sequence',
          'protocol',
          'datatype',
          'bitnumber',
          'dbaddress',
          'startaddress',
          'size',
          'multiplicationfactor',
          'parameterunit',
          'parametercategory',
          'plcaddress',
          'paid',
        ];
      } else if (this.protocol === 'ABPLC') {
        column = [
          'plc_parameter',
          'name',
          'description',
          1,
          'protocol',
          'datatype',
          'size',
          'parametercategory',
          'plcaddress',
          'paid',
          'prefix',
        ];
      } else if (this.protocol === 'OPCUA') {
        column = [
          'name',
          'description',
          'chinesedescription',
          'sequence',
          'protocol',
          'datatype',
          'bitnumber',
          'startaddress',
          'size',
          'multiplicationfactor',
          'parameterunit',
          'parametercategory',
          'plcaddress',
          'paid',
          'nodeid',
        ];
      } else {
        column = [
          'name',
          'description',
          'chinesedescription',
          1,
          'protocol',
          'datatype',
          'bitnumber',
          'startaddress',
          'size',
          'multiplicationfactor',
          'parameterunit',
          'parametercategory',
          'plcaddress',
          'paid',
        ];
      }
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
      this.zipService.removeFile({ fileName: `${fileName}.csv` });
      this.setAlert({
        show: true,
        type: 'success',
        message: 'EXPORT_PARAMETER_LIST',
      });
      const emptyContent = [];
      this.parameterSelected = emptyContent;
      // return content;
    },
    async exportSampleData() {
      const fileName = 'sample-file';
      let column = [];
      let csvContent = [];
      if (this.protocol === 'SNAP7') {
        column = [
          'name',
          'description',
          'chinesedescription',
          'sequence',
          'protocol',
          'datatype',
          'bitnumber',
          'dbaddress',
          'startaddress',
          'size',
          'multiplicationfactor',
          'parameterunit',
          'parametercategory',
          'plcaddress',
          'paid',
        ];
        csvContent = [
          'parametername',
          'description-text',
          '描述文字',
          1,
          'SNAP7',
          2,
          1,
          1002,
          1001,
          2,
          1,
          1,
          '35',
          '127.0.0.1',
          1,
        ];
      } else if (this.protocol === 'ABPLC') {
        column = [
          'plc_parameter',
          'name',
          'description',
          'sequence',
          'size',
          'protocol',
          'datatype',
          'parametercategory',
          'plcaddress',
          'paid',
          'prefix',
        ];
        csvContent = [
          'Shopworx.Handshake.PLCOnline',
          'PLCOnline',
          'description(optional)',
          1,
          2,
          'ABPLC',
          12,
          100,
          '192.168.2.10',
          1,
          'station1',
        ];
      } else if (this.protocol === 'OPCUA') {
        column = [
          'name',
          'description',
          'chinesedescription',
          'sequence',
          'protocol',
          'datatype',
          'bitnumber',
          'startaddress',
          'size',
          'multiplicationfactor',
          'parameterunit',
          'parametercategory',
          'plcaddress',
          'paid',
          'nodeid',
        ];
        csvContent = [
          'parametername',
          'description-text',
          '描述文字',
          1,
          'OPCUA',
          2,
          1,
          1002,
          1001,
          1,
          1,
          '35',
          '127.0.0.1',
          1,
          'ns=4;s=GVL_LinMesOPC.g_Beckhoff.Handshake.xPLCLive',
        ];
      } else {
        column = [
          'name',
          'description',
          'chinesedescription',
          'sequence',
          'protocol',
          'datatype',
          'bitnumber',
          'startaddress',
          'size',
          'multiplicationfactor',
          'parameterunit',
          'parametercategory',
          'plcaddress',
          'paid',
        ];
        csvContent = [
          'parametername',
          'description-text',
          '描述文字',
          1,
          'OPCUA',
          2,
          1,
          1002,
          1001,
          2,
          1,
          1,
          '35',
          '127.0.0.1',
          1,
        ];
      }
      // const arr = [
      //   'parametername',
      //   'description-text',
      //   '描述文字',
      //   12,
      //   '6',
      //   '6',
      //   '2',
      //   12,
      //   false,
      //   2,
      //   2,
      //   '2',
      //   '2',
      // ];
      // const arr2 = [
      //   'Shopworx.Handshake.PLCOnline',
      //   'PLCOnline',
      //   'description(optional)',
      //   '',
      //   'ethernet',
      //   12,
      //   100,
      //   '192.168.2.10',
      //   1,
      //   'station1',
      // ];
      // if (this.protocol === 'ABPLC') {
      //   csvContent.push(arr2);
      // } else if (this.protocol === 'OPCUA') {
      //   arr.push('ns=4;s=GVL_LinMesOPC.g_Beckhoff.Handshake.xPLCLive');
      //   csvContent.push(arr);
      // } else {
      //   csvContent.push(arr);
      // }
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
        message: 'SAMPLE_FILE_DOWNLOAD',
      });
      return content;
    },
    importData() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(e) {
      this.validateFlag = true;
      this.savingImport = true;
      const files = e && e !== undefined ? e.target.files : null;
      const ext = /^.+\.([^.]+)$/.exec(files[0].name);
      const getFileExtension = ext == null ? 'Null input from upload' : ext[1];
      if (getFileExtension !== 'csv' && getFileExtension !== 'CSV') {
        this.savingImport = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'UPLOAD_ONLY_CSV',
        });
        document.getElementById('uploadFiles').value = null;
        return;
      }
      const csvParser = new CSVParser();
      const { data } = await csvParser.parse(files[0]);
      this.dataForTracebilityElement = data;
      if (data.length > 0) {
        data.forEach((item) => {
          item.lineid = this.lineValue;
          item.sublineid = this.sublineValue;
          item.stationid = this.stationValue;
          item.substationid = this.substationValue;
          if (item.sequence) {
            item.sequence = Number(item.sequence);
          }
          if (this.stationList.length > 0) {
            item.plcaddress = this.stationList
              .filter((station) => this.stationValue === station.id)[0].plcipaddress;
          }
          if (this.datatypeList.length > 0) {
            item.isbigendian = this.datatypeList
              .filter((datatype) => Number(datatype.id) === Number(item.datatype))[0].isbigendian
              === 1;
            item.isswapped = this.datatypeList
              .filter((datatype) => Number(datatype.id) === Number(item.datatype))[0].isswapped
              === 1;
            // if (Number(item.datatypeList) === 11) {
            //   item.size = this.datatypeList
            //     .filter((datatype) => Number(datatype.id) === Number(item.datatype))[0].size;
            // }
            if (Number(item.datatype) !== 11) {
              item.size = this.datatypeList
                .filter((datatype) => Number(datatype.id) === Number(item.datatype))[0].size;
            }
          }
          item.protocol = item.protocol.toUpperCase();
          item.name = item.name.toLowerCase().replace(/\W/g, '');
          item.assetid = 4;
          delete item.monitorvalue;
          delete item.status;
        });
      } else {
        this.validateFlag = false;
        this.savingImport = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'IMPORT_EMPTY_FILE',
        });
      }
      const dataList = data.concat(this.parameterList);
      const importedDataList = data;
      const floatOrDoubles = dataList.filter((fd) => fd.maxdecimal === '' || fd.maxdecimal === undefined);
      floatOrDoubles.forEach((md) => {
        if (md.datatype === '9' || md.datatype === '10' || Number(md.datatype) === 9 || Number(md.datatype) === 10) {
          md.maxdecimal = 4;
        } else {
          md.maxdecimal = 0;
        }
      });
      const nameList = importedDataList.map((item) => item.name);
      const duplicateNames = nameList.map((item) => item)
        .filter((value, index, self) => self.indexOf(value) !== index);
      const duplicateParamsDB = [];
      nameList.forEach((pf) => {
        this.parameterList.forEach((pd) => {
          if (pf.toLowerCase().split(' ').join('') === pd.name.toLowerCase().split(' ').join('')) {
            duplicateParamsDB.push(pf);
          }
        });
      });
      // validations for required fields
      const res = [];
      importedDataList.forEach((d, r) => {
        this.masterTags.forEach((t) => {
          if (t.required) {
            const val = d[t.tagName];
            if (val === null || val === '' || val === undefined) {
              res.push({ row: r + 2, tag: t.tagDescription });
              this.responce = res;
            }
          }
        });
      });
      // validation for optional fields
      const resopt = [];
      importedDataList.forEach((d, r) => {
        this.masterTags.forEach((op) => {
          if (!op.required) {
            const val = d[op.tagName];
            if (val === null || val === '' || val === undefined) {
              resopt.push({ row: r + 2, tag: op.tagDescription });
              this.optionalRes = resopt;
            }
          }
        });
      });
      if (nameList) {
        const isBooleanList = dataList.filter((dataItem) => dataItem.datatype === 12 || dataItem.datatype === '12');
        const noBooleanList = dataList.filter((dataItem) => !(dataItem.datatype === 12 || dataItem.datatype === '12'));
        if (isBooleanList.length) {
          if (this.parameterList.length > 0) {
            Object.values(data).forEach((m) => {
              this.importArray.push(m);
            });
            this.parameterList.forEach((l) => {
              this.importArray.forEach((d) => {
                if (l.bitnumber === Number(d.bitnumber) && l.dbaddress === Number(d.dbaddress)
                  && l.datatype === Number(d.datatype)
                  && l.startaddress === Number(d.startaddress)) {
                  this.duplicateCombination.push(d.name);
                }
              });
            });
            if (this.duplicateCombination.length > 0) {
              this.validateFlag = false;
              this.savingImport = false;
              this.$root.$emit('parameterCreation', true);
            }
          }
          const combination = importedDataList.map((item, index) => (
            {
              dbaddress: item.dbaddress,
              startaddress: item.startaddress,
              bitnumber: item.bitnumber,
              datatype: item.datatype,
              index,
            }
          ));
          const dummyCombination = combination.filter((v, i, a) => a.findIndex((t) => (t.bitnumber
             === v.bitnumber && t.dbaddress === v.dbaddress
              && t.startaddress === v.startaddress && t.datatype === v.datatype)) !== i);
          if (dummyCombination.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            // this.setAlert({
            //   show: true,
            //   type: 'error',
            //   message: 'DUPLICATE_COMBINATION',
            // });
            dataList.push(this.emptyDataList);
            document.getElementById('uploadFiles').value = null;
          }
          if (dummyCombination.length > 0) {
            const combo = [];
            dummyCombination.forEach((p) => {
              combo.push(` (Duplicate combination) row : ${p.index + 2} `);
              this.dummyCombo = combo;
              this.$root.$emit('parameterCreation', true);
            });
          }
          if (duplicateNames.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'DUPLICATE_PARAMETER_NAME',
            });
            dataList.push(this.emptyDataList);
            document.getElementById('uploadFiles').value = null;
            // return;
          }
          if (duplicateNames.length > 0) {
            const resNames = [];
            duplicateNames.forEach((p) => {
              if (p.length > 0) {
                resNames.push(` name: ${p} `);
                this.dummyNames = resNames;
                this.$root.$emit('parameterCreation', true);
              }
            });
          }
          if (duplicateParamsDB.length > 0) {
            const paramNames = [];
            duplicateParamsDB.forEach((p) => {
              if (p.length > 0) {
                paramNames.push(` name: ${p} `);
                this.dummyParamsDb = paramNames;
                this.$root.$emit('parameterCreation', true);
              }
            });
          }
          if (nameList) {
            const resLen = [];
            nameList.forEach((p, index) => {
              if (p.length > 40) {
                resLen.push(` name: ${p} | row: ${index + 2} `);
                this.paramLength = resLen;
                this.savingImport = false;
                this.validateFlag = false;
                this.$root.$emit('parameterCreation', true);
                dataList.push(this.emptyDataList);
                document.getElementById('uploadFiles').value = null;
                // return;
              }
            });
            // return;
          }
          if (this.paramLength.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'PARAMETER_NAME_LENGTH_EXCEEDED',
            });
            dataList.push(this.emptyDataList);
            // this.paramLength = [];
            // return;
          }
          if (dataList.length > 1000) {
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ROW_LIMIT',
            });
            dataList.push(this.emptyDataList);
          }
          if (this.responce.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            // this.setAlert({
            //   show: true,
            //   type: 'error',
            //   message: 'EMPTY_FIELDS',
            // });
            this.$root.$emit('parameterCreation', true);
            dataList.push(this.emptyDataList);
          }
          if (this.validateFlag === true) {
            if (this.optionalRes.length > 0) {
              this.savingImport = false;
              this.$root.$emit('parameterCreation', true);
              this.$root.$emit('payload', data);
              this.dialog = true;
              this.setAlert({
                show: true,
                type: 'error',
                message: 'OPTIONAL_EMPTY_FIELDS',
              });
              document.getElementById('uploadFiles').value = null;
              // return;
            } else {
              this.$root.$emit('payload', data);
              this.$root.$emit('successPayload', true);
              dataList.push(this.emptyDataList);
            }
          }
        }
        if (noBooleanList.length) {
          if (duplicateNames.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'DUPLICATE_PARAMETER_NAME',
            });
            dataList.push(this.emptyDataList);
            document.getElementById('uploadFiles').value = null;
            // return;
          }
          if (duplicateNames.length > 0) {
            const resNames = [];
            duplicateNames.forEach((p) => {
              if (p.length > 0) {
                resNames.push(` name: ${p} `);
                this.dummyNames = resNames;
                this.$root.$emit('parameterCreation', true);
              }
            });
          }
          if (duplicateParamsDB.length > 0) {
            const paramNames = [];
            duplicateParamsDB.forEach((p) => {
              if (p.length > 0) {
                paramNames.push(` name: ${p} `);
                this.dummyParamsDb = paramNames;
                this.$root.$emit('parameterCreation', true);
              }
            });
          }
          if (nameList) {
            const resLen = [];
            nameList.forEach((p, index) => {
              if (p.length > 40) {
                resLen.push(` name: ${p} | row: ${index + 2} `);
                this.paramLength = resLen;
                this.savingImport = false;
                this.validateFlag = false;
                this.$root.$emit('parameterCreation', true);
                document.getElementById('uploadFiles').value = null;
                dataList.push(this.emptyDataList);
                // return;
              }
            });
            // return;
          }
          if (this.paramLength.length > 0) {
            this.validateFlag = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'PARAMETER_NAME_LENGTH_EXCEEDED',
            });
            dataList.push(this.emptyDataList);
            // this.paramLength = [];
            // return;
          }
          if (dataList.length > 1000) {
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ROW_LIMIT',
            });
            dataList.push(this.emptyDataList);
          }
          if (this.responce.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            this.$root.$emit('parameterCreation', true);
            dataList.push(this.emptyDataList);
          }
          if (this.validateFlag === true) {
            if (this.optionalRes.length > 0) {
              this.savingImport = false;
              this.$root.$emit('parameterCreation', true);
              this.$root.$emit('payload', data);
              this.dialog = true;
              dataList.push(this.emptyDataList);
            }
          }
        }
        // remove the parameter creation call
        // const createResult = await this.createParameterList(data);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'duplicate_parameter_name',
        });
        document.getElementById('uploadFiles').value = null;
      }
    },
    async executeTracebilityLogic(val) {
      if (val) {
        await this.getParameterListRecords(this.getQuery());
        const tagList = [];
        const traceabilityTagList = [];
        // get information of traceability element
        const traceabilityElementDetails = await this.getElementDetails('traceability');
        await this.getSubStationIdElement(`process_${this.substationValue}`);
        if (!traceabilityElementDetails) {
          const payloadElement = {
            categoryType: 'ASSET',
            collectionName: 'provisioning',
            elementName: 'traceability',
            elementDescription: 'traceability',
            status: 'ACTIVE',
            elementType: 'PROVISIONING',
            uniqueTagName: '',
            uniqueTagValue: 0,
            uniqueTagStartValue: 0,
            uniqueTagValuePrefix: '',
            uniqueTagValueSuffix: '',
            businessTimeTagsRequired: false,
            optional: false,
            assetBased: true,
            uniqueTag: false,
            assetId: 4,
          };
          const newElement = await this.createElement(payloadElement);
          // add by default mainid
          tagList.push({
            assetId: 4,
            tagName: 'mainid',
            tagDescription: 'mainid',
            emgTagType: 'String',
            tagOrder: 1,
            connectorId: 2,
            defaultValue: '',
            elementId: this.subStationElementDeatils.element.id,
            hide: false,
            identifier: true,
            interactionType: '',
            mode: '',
            required: true,
            sampling: true,
            lowerRangeValue: 1,
            upperRangeValue: 1,
            alarmFlag: true,
            alarmId: 1,
            derivedField: false,
            derivedFunctionName: '',
            derivedFieldType: '',
            displayType: true,
            displayUnit: 1,
            isFamily: true,
            familyQueryTag: '',
            filter: true,
            filterFromElementName: '',
            filterFromTagName: '',
            filterQuery: '',
          });
          this.dataForTracebilityElement.forEach((item) => {
            if (
              Number(item.parametercategory) === 15
                || Number(item.parametercategory) === 17
                || Number(item.parametercategory) === 18) {
              let dataTypeName = '';
              if (
                this.datatypeList
                  .filter((datatype) => Number(datatype.id) === Number(item.datatype))[0].name === 'String'
              ) {
                dataTypeName = 'String';
              } else {
                dataTypeName = 'Double';
              }
              const tagname = item.name;
              tagList.push({
                assetId: 4,
                tagName: tagname.toLowerCase().trim(),
                tagDescription: item.name,
                emgTagType: dataTypeName,
                tagOrder: 1,
                connectorId: 2,
                defaultValue: '',
                elementId: this.subStationElementDeatils.element.id,
                hide: false,
                identifier: true,
                interactionType: '',
                mode: '',
                required: true,
                sampling: true,
                lowerRangeValue: 1,
                upperRangeValue: 1,
                alarmFlag: true,
                alarmId: 1,
                derivedField: false,
                derivedFunctionName: '',
                derivedFieldType: '',
                displayType: true,
                displayUnit: 1,
                isFamily: true,
                familyQueryTag: '',
                filter: true,
                filterFromElementName: '',
                filterFromTagName: '',
                filterQuery: '',
              });
              // Add tags to Traceability element
              traceabilityTagList.push({
                assetId: 4,
                tagName: `${this.substationValue}_${tagname.toLowerCase().trim()}`,
                tagDescription: `${this.substationValue}_${item.name}`,
                emgTagType: dataTypeName,
                tagOrder: 1,
                connectorId: 2,
                defaultValue: '',
                elementId: newElement,
                hide: false,
                identifier: true,
                interactionType: '',
                mode: '',
                required: true,
                sampling: true,
                lowerRangeValue: 1,
                upperRangeValue: 1,
                alarmFlag: true,
                alarmId: 1,
                derivedField: false,
                derivedFunctionName: '',
                derivedFieldType: '',
                displayType: true,
                displayUnit: 1,
                isFamily: true,
                familyQueryTag: '',
                filter: true,
                filterFromElementName: '',
                filterFromTagName: '',
                filterQuery: '',
              });
            }
          });
        } else {
          // add by default mainid
          tagList.push({
            assetId: 4,
            tagName: 'mainid',
            tagDescription: 'mainid',
            emgTagType: 'String',
            tagOrder: 1,
            connectorId: 2,
            defaultValue: '',
            elementId: this.subStationElementDeatils.element.id,
            hide: false,
            identifier: true,
            interactionType: '',
            mode: '',
            required: true,
            sampling: true,
            lowerRangeValue: 1,
            upperRangeValue: 1,
            alarmFlag: true,
            alarmId: 1,
            derivedField: false,
            derivedFunctionName: '',
            derivedFieldType: '',
            displayType: true,
            displayUnit: 1,
            isFamily: true,
            familyQueryTag: '',
            filter: true,
            filterFromElementName: '',
            filterFromTagName: '',
            filterQuery: '',
          });
          this.dataForTracebilityElement.forEach((item) => {
            if (
              Number(item.parametercategory) === 15
                || Number(item.parametercategory) === 17
                || Number(item.parametercategory) === 18) {
              let dataTypeName = '';
              if (
                this.datatypeList
                  .filter((datatype) => Number(datatype.id) === Number(item.datatype))[0].name === 'String'
              ) {
                dataTypeName = 'String';
              } else {
                dataTypeName = 'Double';
              }
              const tagname = item.name;
              tagList.push({
                assetId: 4,
                tagName: tagname.toLowerCase().trim(),
                tagDescription: item.name,
                emgTagType: dataTypeName,
                tagOrder: 1,
                connectorId: 2,
                defaultValue: '',
                elementId: this.subStationElementDeatils.element.id,
                hide: false,
                identifier: true,
                interactionType: '',
                mode: '',
                required: true,
                sampling: true,
                lowerRangeValue: 1,
                upperRangeValue: 1,
                alarmFlag: true,
                alarmId: 1,
                derivedField: false,
                derivedFunctionName: '',
                derivedFieldType: '',
                displayType: true,
                displayUnit: 1,
                isFamily: true,
                familyQueryTag: '',
                filter: true,
                filterFromElementName: '',
                filterFromTagName: '',
                filterQuery: '',
              });
              // Add tags to Traceability element
              traceabilityTagList.push({
                assetId: 4,
                tagName: `${this.substationValue}_${tagname.toLowerCase().trim()}`,
                tagDescription: `${this.substationValue}_${item.name}`,
                emgTagType: dataTypeName,
                tagOrder: 1,
                connectorId: 2,
                defaultValue: '',
                elementId: traceabilityElementDetails.element.id,
                hide: false,
                identifier: true,
                interactionType: '',
                mode: '',
                required: true,
                sampling: true,
                lowerRangeValue: 1,
                upperRangeValue: 1,
                alarmFlag: true,
                alarmId: 1,
                derivedField: false,
                derivedFunctionName: '',
                derivedFieldType: '',
                displayType: true,
                displayUnit: 1,
                isFamily: true,
                familyQueryTag: '',
                filter: true,
                filterFromElementName: '',
                filterFromTagName: '',
                filterQuery: '',
              });
            }
          });
        }
        await this.createTagElement(tagList);
        // TODO - Check response "this.createElementResponse"
        if (this.createElementResponse && this.createElementResponse.length) {
          let payloadData = [];
          tagList.forEach((l) => {
            const tag = this.createElementResponse
              .filter((f) => f.tagName === l.tagName);
            if (!tag[0].created) {
              payloadData.push({
                elementId: l.elementId,
                tagId: tag[0].tagId,
                status: 'ACTIVE',
              });
            }
          });
          await this.updateTagStatus(payloadData);
          // updates tags of traceability elements
          await this.createTagElement(traceabilityTagList);
          payloadData = [];
          traceabilityTagList.forEach((l) => {
            const tag = this.createElementResponse
              .filter((f) => f.tagName === l.tagName);
            if (!tag[0].created) {
              payloadData.push({
                elementId: l.elementId,
                tagId: tag[0].tagId,
                status: 'ACTIVE',
              });
            }
          });
          await this.updateTagStatus(payloadData);
          this.setAlert({
            show: true,
            type: 'success',
            message: 'IMPORT_PARAMETER_LIST',
          });
          // this.setCreateParam(false);
          this.tracibilityExecution = false;
          document.getElementById('uploadFiles').value = null;
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ELEMENT_NOT_CREATED',
          });
        }
      }
      document.getElementById('uploadFiles').value = null;
    },
    addToZip(file) {
      this.zipService.addFile(file);
    },
  },
  components: {
    AddParameter,
    ParameterFilter,
    ProceedDialog,
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
.planScheduleView
  .v-text-field.v-text-field--solo.v-input--dense
  > .v-input__control {
  min-height: 30px;
}
</style>
