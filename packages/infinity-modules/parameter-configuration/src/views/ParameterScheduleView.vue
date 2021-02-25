<template>
  <v-container fluid class="py-0">
    <div justify="center" class="planScheduleView">
      <div class="py-0">
        <div class="stick">
          <div style="float:left;margin-bottom:10px;">
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
          </div>
          <proceed-dialog ref="ProceedDialog"
            :openDialog="openDialog"
            :responce="responce"
            :optionalRes="optionalRes"
            :duplicateBnum="duplicateBnum"
            :duplicateStartnum="duplicateStartnum"
            :dupDbAddress="dupDbAddress"
            :paramLength="paramLength"
            :dummyNames="dummyNames"/>
          <div style="float:right;">
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
            outlined class="text-none ml-2" :disabled="!substationValue" @click="RefreshUI">
              <v-icon small left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
            <v-btn small color="error"
              outlined
              class="text-none ml-2"
              :disabled="isAddButtonOK"
              @click="confirmDialog = true">
              <v-icon small left>mdi-delete</v-icon>
              Delete
            </v-btn>
            <v-btn
            small
            color="primary"
            v-if="substationValue && parameterSelected.length > 0"
            outlined
            class="text-none ml-2"
            @click="exportData">
              Export
            </v-btn>
            <v-btn
            small
            color="primary"
            v-if="!(substationValue && parameterSelected.length > 0)"
            outlined
            class="text-none ml-2"
            @click="exportSampleData">
              Export Sample File
            </v-btn>
            <v-btn
            small
            color="primary"
            outlined
            class="text-none ml-2"
            :disabled="isAddButtonOK"
            :loading="savingImport"
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
          </div>
        </div>
        <v-data-table
        v-model="parameterSelected"
        :headers="headers"
        item-key="_id"
        :items="parameterList"
        :footer-props="{
        'items-per-page-options': [100, 300, 500, 1000]}"
        :items-per-page="100"
        show-select
        >
          <template #item.name="props">
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
              <template #input>
                <v-text-field
                  :disabled="substationValue ? false : true"
                  v-model="props.item.name"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template #item.description="props">
            <v-edit-dialog
              :return-value.sync="props.item.description"
              large
              @save="saveTableParameter(props.item, 'description')"
            >
              <span>
                {{ props.item.description.length > 10
                  ? props.item.description.substr(0,9) + '...' :  props.item.description}}
              </span>
              <v-icon
                small
                color="primary"
                :disabled="substationValue ? false : true"
              >
                mdi-pencil
              </v-icon>
              <template #input>
                <v-textarea
                  :disabled="substationValue ? false : true"
                  v-model="props.item.description"
                  label="Edit"
                  single-line
                ></v-textarea>
              </template>
            </v-edit-dialog>
          </template>
          <template #item.parametercategory="props">
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
          <template #item.datatype="props">
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
          <template #item.bitnumber="props">
            <v-edit-dialog
              :return-value.sync="props.item.bitnumber"
              @save="saveTableParameter(props.item, 'bitnumber')"
            > {{ props.item.bitnumber }}
              <v-icon
                small
                color="primary"
                :disabled="!substationValue
                || props.item.datatype !== 12"
              >
              mdi-pencil
              </v-icon>
              <template #input>
                <v-text-field
                  :disabled="!substationValue
                  || props.item.datatype !== 12"
                  v-model="props.item.bitnumber"
                  label="Edit"
                  single-line
                  type='number'
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template #item.size="props">
            <v-edit-dialog
              :return-value.sync="props.item.size"
              @save="saveTableParameter(props.item, 'size')"
            > {{ props.item.size }}
              <v-icon
                small
                color="primary"
                :disabled="!substationValue
                || props.item.datatype !== 11"
              >
              mdi-pencil
              </v-icon>
              <template #input>
                <v-text-field
                  :disabled="!substationValue
                  || props.item.datatype !== 11"
                  v-model="props.item.size"
                  label="Edit"
                  single-line
                  type='number'
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template #item.startaddress="props">
            <v-edit-dialog
              :return-value.sync="props.item.startaddress"
              @save="saveTableParameter(props.item, 'startaddress')"
            > {{ props.item.startaddress }}
              <v-icon
                small
                color="primary"
                :disabled="substationValue ? false : true"
              >
                mdi-pencil
              </v-icon>
              <template #input>
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
          <template #item.dbaddress="props">
            <v-edit-dialog
              :return-value.sync="props.item.dbaddress"
              @save="saveTableParameter(props.item, 'dbaddress')"
            > {{ props.item.dbaddress }}
              <v-icon
                small
                color="primary"
                :disabled="substationValue ? false : true"
              >
                mdi-pencil
              </v-icon>
              <template #input>
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
          Are you sure to delete all the Parameters ?
        </v-card-text>
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
      parameterSelected: [],
      dialog: false,
      openDialog: false,
      responce: [],
      optionalRes: [],
      resLen: [],
      paramLength: [],
      dataForCreation: [],
      duplicateBnum: [],
      duplicateStartnum: [],
      dupDbAddress: [],
      dummyNames: [],
      validateFlag: true,
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
        required: true,
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
      headers: [
        { text: 'Number', value: 'number', width: 120 },
        { text: 'Line', value: 'line', width: 120 },
        { text: 'subline', value: 'subline', width: 120 },
        { text: 'station', value: 'station', width: 120 },
        { text: 'substation', value: 'substation', width: 120 },
        // { text: 'Show Real/Non Real', value: 'showparameter', width: 120 },
        { text: 'Parameter', value: 'name', width: 120 },
        { text: 'Parameter Description', value: 'description', width: 200 },
        { text: 'Category', value: 'parametercategory' },
        { text: 'Data type', value: 'datatype' },
        { text: 'Size', value: 'size', width: 80 },
        { text: 'DB Address', value: 'dbaddress', width: 130 },
        { text: 'Start Address', value: 'startaddress', width: 140 },
        { text: 'Boolean Bit', value: 'bitnumber', width: 120 },
        { text: 'Monitor', value: 'monitorvalue', width: 130 },
        { text: 'Status', value: 'status', width: 130 },
      ],
      parameterListSave: [],
      confirmDialog: false,
      socket: null,
      saving: false,
      savingImport: false,
    };
  },
  async mounted() {
    this.ProceedDialog = this.$refs.ProceedDialog;
    this.$root.$on('confirmationSignal', (data) => {
      this.dialog = data;
    });
    this.$root.$on('clearResponce', (data) => {
      const clear = data;
      if (clear) {
        document.getElementById('uploadFiles').value = null;
        this.responce = [];
        this.duplicateBnum = [];
        this.duplicateStartnum = [];
        this.dupDbAddress = [];
        this.paramLength = [];
        this.dummyNames = [];
      }
    });
    this.$root.$on('getListofParams', (data) => {
      const getList = data;
      if (getList) {
        this.getParameterListRecords(this.getQuery());
      }
    });
  },
  async created() {
    this.zipService = ZipService;
    await this.getPageDataList();
    this.getParameterListRecords('?pagenumber=1&pagesize=10');
    this.socket = socketioclient.connect('http://:10190');
    this.socket.on('connect', () => {
    });
  },
  destroyed() {
    this.setLineValue('');
    this.setSublineValue('');
    this.setStationValue('');
    this.setSubstationValue('');
  },
  computed: {
    ...mapState('parameterConfiguration', [
      'addParameterDialog', 'parameterList', 'isApply', 'lineList', 'sublineList', 'stationList', 'substationList', 'directionList', 'categoryList', 'datatypeList', 'lineValue', 'sublineValue', 'stationValue', 'substationValue', 'selectedParameterName', 'selectedParameterDirection', 'selectedParameterCategory', 'selectedParameterDatatype',
      'subStationElementDeatils', 'createElementResponse', 'createResult']),
    isAddButtonOK() {
      if (this.lineValue
        && this.sublineValue
        && this.stationValue
        && this.substationValue
        && this.isApply) {
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
        this.getParameterListRecords('?pagenumber=1&pagesize=10');
      }
    },
    sublineValue(val) {
      if (!val) {
        this.setStationValue('');
        this.setSubstationValue('');
        this.getParameterListRecords('?pagenumber=1&pagesize=10');
      }
    },
    stationValue(val) {
      if (!val) {
        this.setSubstationValue('');
        this.getParameterListRecords('?pagenumber=1&pagesize=10');
      }
    },
    substationValue(val) {
      if (!val) {
        this.setSubstationValue('');
        this.getParameterListRecords('?pagenumber=1&pagesize=10');
      }
    },
    parameterList(parameterList) {
      this.parameterListSave = parameterList.map((item) => ({ ...item }));
    },
    createResult: {
      handler(val) {
        if (val) {
          this.executeCreateFunction(val);
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('parameterConfiguration', ['setAddParameterDialog', 'toggleFilter', 'setLineValue', 'setSublineValue', 'setStationValue', 'setSubstationValue', 'setSelectedParameterName', 'setSelectedParameterDirection', 'setSelectedParameterCategory', 'setSelectedParameterDatatype', 'setCreateParam']),
    ...mapActions('parameterConfiguration', ['getPageDataList', 'getSublineList', 'getStationList', 'getSubstationList', 'getParameterListRecords', 'updateParameter', 'deleteParameter', 'createParameter', 'createParameterList', 'downloadToPLC', 'getSubStationIdElement',
      'getSubStationIdElement', 'createTagElement', 'updateTagStatus']),
    async executeCreateFunction(val) {
      if (val) {
        this.responce = [];
        this.savingImport = false;
        await this.getParameterListRecords(this.getQuery());
        let tagList = [];
        await this.getSubStationIdElement(`production_${this.substationValue}`);
        // add by default timestamp
        tagList.push({
          assetId: 4,
          tagName: 'timestamp',
          tagDescription: 'timestamp',
          emgTagType: 'Long',
          lineid: 777,
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
        },
        {
          assetId: 4,
          tagName: 'lineid',
          tagDescription: 'lineid',
          emgTagType: 'Int',
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
        },
        {
          assetId: 4,
          tagName: 'sublineid',
          tagDescription: 'subline ID',
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
        },
        {
          assetId: 4,
          tagName: 'stationid',
          tagDescription: 'Station ID',
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
        },
        {
          assetId: 4,
          tagName: 'substationid',
          tagDescription: 'Substation ID',
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
        this.dataForCreation.forEach((item) => {
          if (Number(item.parametercategory) === 15
          || Number(item.parametercategory) === 17
          || Number(item.parametercategory) === 18
          || Number(item.parametercategory) === 2) {
            let dataTypeName = '';
            if (this.datatypeList.filter((datatype) => Number(datatype.id) === Number(item.datatype))[0].name === 'String') {
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
          }
        });
        await this.createTagElement(tagList);
        let payloadData = [];
        tagList.forEach((l) => {
          const tag = this.createElementResponse.filter((f) => f.tagName === l.tagName);
          if (!tag[0].created) {
            payloadData.push({
              elementId: l.elementId,
              tagId: tag[0].tagId,
              status: 'ACTIVE',
            });
          }
        });
        await this.updateTagStatus(payloadData);
        // add tags to real parameters
        tagList = [];
        await this.getSubStationIdElement(`process_${this.substationValue}`);
        // add by default timestamp
        tagList.push({
          assetId: 4,
          tagName: 'timestamp',
          tagDescription: 'timestamp',
          emgTagType: 'Long',
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
        },
        {
          assetId: 4,
          tagName: 'lineid',
          tagDescription: 'lineid',
          emgTagType: 'Int',
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
        },
        {
          assetId: 4,
          tagName: 'sublineid',
          tagDescription: 'subline ID',
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
        },
        {
          assetId: 4,
          tagName: 'stationid',
          tagDescription: 'Station ID',
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
        },
        {
          assetId: 4,
          tagName: 'substationid',
          tagDescription: 'Substation ID',
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
        this.dataForCreation.forEach((item) => {
          if (Number(item.parametercategory) === 42
          || Number(item.parametercategory) === 45
          || Number(item.parametercategory) === 38
          || Number(item.parametercategory) === 11
          || Number(item.parametercategory) === 2) {
            let dataTypeName = '';
            if (this.datatypeList.filter((datatype) => Number(datatype.id) === Number(item.datatype))[0].name === 'String') {
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
          }
        });
        await this.createTagElement(tagList);
        payloadData = [];
        tagList.forEach((l) => {
          const tag = this.createElementResponse.filter((f) => f.tagName === l.tagName);
          if (!tag[0].created) {
            payloadData.push({
              elementId: l.elementId,
              tagId: tag[0].tagId,
              status: 'ACTIVE',
            });
          }
        });
        await this.updateTagStatus(payloadData);
        this.savingImport = false;
        this.setAlert({
          show: true,
          type: 'success',
          message: 'IMPORT_PARAMETER_LIST',
        });
        this.savingImport = false;
        this.setCreateParam(false);
        document.getElementById('uploadFiles').value = null;
      }
    },
    async showParameters(event, item) {
      const object = {
        id: item._id,
        payload: {
          showparameter: event,
        },
      };
      const updateResult = await this.updateParameter(object);
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'Data Updated',
        });
      }
    },
    async saveTableParameter(item, type) {
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
        if (parameterListSave.some((parameter) => value === parameter.name)) {
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
          const isRepeat = parameterListSave
            .some((parameter) => parameter.datatype !== 12
            && Number(item.dbaddress) === parameter.dbaddress
            && Number(item.startaddress) === parameter.startaddress);
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
          const isRepeat = parameterListSave
            .some((parameter) => parameter.datatype !== 12
            && Number(item.dbaddress) === parameter.dbaddress
            && Number(item.startaddress) === parameter.startaddress);
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
          const isRepeat = parameterListSave
            .some((parameter) => parameter.datatype === 12
            && Number(item.dbaddress) === parameter.dbaddress
            && Number(item.startaddress) === parameter.startaddress
            && item.bitnumber === parameter.bitnumber);
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
          const isRepeat = parameterListSave
            .some((parameter) => parameter.datatype === 12
            && Number(item.dbaddress) === parameter.dbaddress
            && Number(item.startaddress) === parameter.startaddress
            && item.bitnumber === parameter.bitnumber);
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
          const isRepeat = parameterListSave
            .some((parameter) => parameter.datatype === 12
            && Number(item.dbaddress) === parameter.dbaddress
            && Number(item.startaddress) === parameter.startaddress
            && item.bitnumber === parameter.bitnumber);
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
      const parameterItem = parameterListSave.filter((parameter) => item._id === parameter._id)[0];
      const payload = {};
      if (type === 'datatype') {
        [selectedDatatypeItem] = this.datatypeList.filter((datatype) => value === datatype.id);
        payload.isbigendian = selectedDatatypeItem.isbigendian === 1;
        payload.isswapped = selectedDatatypeItem.isswapped === 1;
        if (selectedDatatypeItem.name !== 'Boolean' && selectedDatatypeItem.name !== 'String') {
          payload.size = selectedDatatypeItem.size;
        }
      }
      payload[type] = value;
      this.saving = true;
      const updateResult = await this.updateParameter({ id: parameterItem._id, payload });
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
      // const results = await Promise.all(this.parameterSelected.map(
      //   (parameter) => this.deleteParameter(parameter.id),
      // ));
      const results = await this.deleteParameter(this.substationValue);
      await this.getSubStationIdElement(`process_${this.substationValue}`);
      const listT = this.subStationElementDeatils;
      const FilteredTags = listT.tags.map((obj) => ({ id: obj.id, elementId: obj.elementId }));
      const payloadData = [];
      FilteredTags.forEach(async (tag) => {
        payloadData.push({
          tagId: tag.id,
          elementId: tag.elementId,
          status: 'INACTIVE',
        });
      });
      await this.updateTagStatus(payloadData);
      await this.getSubStationIdElement(`production_${this.substationValue}`);
      const listProcess = this.subStationElementDeatils;
      const FilteredTagsProcess = listProcess.tags
        .map((obj) => ({ id: obj.id, elementId: obj.elementId }));
      const payloadDataProcess = [];
      FilteredTagsProcess.forEach(async (tag) => {
        payloadDataProcess.push({
          tagId: tag.id,
          elementId: tag.elementId,
          status: 'INACTIVE',
        });
      });
      await this.updateTagStatus(payloadDataProcess);
      if (results) {
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
    RefreshUI() {
      this.downloadFromPLC();
    },
    async downloadFromPLC() {
      const object = {
        lineid: Number(this.lineValue),
        sublineid: this.sublineValue,
        substationid: this.substationValue,
      };
      this.socket.on(`update_parameter_${object.lineid}_${object.sublineid}_${object.substationid}`, (data) => {
        if (data) {
          this.parameterList.forEach((element) => {
            if (data[element.name] || data[element.name] === 0) {
              this.$set(element, 'monitorvalue', data[element.name]);
            }
          });
        }
      });
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
      return query;
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
      const csvContent = [];
      const column = [
        'name',
        'description',
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
        message: 'export_parameter_list',
      });
      return content;
    },
    async exportSampleData() {
      const fileName = 'sample-file';
      const column = [
        'name',
        'description',
        'protocol',
        'datatype',
        'bitnumber',
        'dbaddress',
        'startaddress',
        'size',
        'multiplicationfactor',
        'parameterunit',
        'parametercategory',
        'paid',
      ];
      const csvContent = [];
      const arr = [
        'parametername',
        '2',
        '2',
        12,
        '6',
        '6',
        '2',
        12,
        false,
        2,
        2,
        '2',
        '2',
        2,
      ];
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
      data.forEach((item) => {
        item.lineid = this.lineValue;
        item.sublineid = this.sublineValue;
        item.stationid = this.stationValue;
        item.substationid = this.substationValue;
        if (this.stationList.length > 0) {
          item.plcaddress = this.stationList
            .filter((station) => this.stationValue === station.id)[0].plcipaddress;
        }
        if (this.datatypeList.length > 0) {
          item.isbigendian = this.datatypeList
            .filter((datatype) => Number(datatype.id) === Number(item.datatype))[0]
            .isbigendian === 1;
          item.isswapped = this.datatypeList
            .filter((datatype) => Number(datatype.id) === Number(item.datatype))[0]
            .isswapped === 1;
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
      const dataList = data.concat(this.parameterList);
      const nameList = dataList.map((item) => item.name);
      const duplicateNames = nameList.map((item) => item)
        .filter((value, index, self) => self.indexOf(value) !== index);
      const res = [];
      dataList.forEach((d, r) => {
        this.masterTags.forEach((t) => {
          if (t.required) {
            const val = d[t.tagName];
            if (val === null || val === '' || val === undefined || val === ' ') {
              res.push({ row: r + 2, tag: t.tagDescription });
              this.responce = res;
            }
          }
        });
      });
      const resopt = [];
      dataList.forEach((d, r) => {
        this.masterTags.forEach((op) => {
          if (!op.required) {
            const val = d[op.tagName];
            if (val === null || val === '' || val === undefined || val === ' ') {
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
          const listDbaddress = dataList.map((item) => item.dbaddress);
          const duplicatedbAddress = listDbaddress.map((item) => item)
            .filter((value, index, self) => self.indexOf(value) !== index);
          if (duplicatedbAddress.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'DUPLICATE_DBADDRESS',
            });
            document.getElementById('uploadFiles').value = null;
            // return;
          }
          if (duplicatedbAddress) {
            const dbresponce = [];
            duplicatedbAddress.forEach((p) => {
              if (p.length > 0) {
                dbresponce.push(` value( dbaddress ): ${p} `);
                this.dupDbAddress = dbresponce;
                this.$root.$emit('parameterCreation', true);
              }
            });
          }
          const listStartAdd = dataList.map((item) => item.startaddress);
          const duplicatestartAddress = listStartAdd.map((item) => item)
            .filter((value, index, self) => self.indexOf(value) !== index);
          if (duplicatestartAddress.length > 0) {
            this.$root.$emit('parameterCreation', true);
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'DUPLICATE_START_ADDRESS',
            });
            document.getElementById('uploadFiles').value = null;
            // return;
          }
          if (duplicatestartAddress) {
            const resStartNum = [];
            duplicatestartAddress.forEach((p) => {
              if (p.length > 0) {
                resStartNum.push(` value( startaddress ): ${p} `);
                this.duplicateStartnum = resStartNum;
                this.$root.$emit('parameterCreation', true);
              }
            });
          }
          const listBitNum = dataList.map((item) => item.bitnumber);
          const duplicateBitnumber = listBitNum.map((item) => item)
            .filter((value, index, self) => self.indexOf(value) !== index);
          if (duplicateBitnumber.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'DUPLICATE_BIT_NUMBER',
            });
            document.getElementById('uploadFiles').value = null;
            // return;
          }
          if (duplicateBitnumber) {
            const resBitNum = [];
            duplicateBitnumber.forEach((p) => {
              if (p.length > 0) {
                resBitNum.push(` value( bitnumber ): ${p} `);
                this.duplicateBnum = resBitNum;
                this.$root.$emit('parameterCreation', true);
              }
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
          if (nameList) {
            const resLen = [];
            nameList.forEach((p, index) => {
              if (p.length > 15) {
                resLen.push(` name: ${p} | row: ${index + 2} `);
                this.paramLength = resLen;
                this.savingImport = false;
                this.validateFlag = false;
                this.$root.$emit('parameterCreation', true);
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
              message: 'PARAMETER_NAME_LENGTH',
            });
            // this.paramLength = [];
            // return;
          }
          if (this.responce.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'EMPTY_FIELDS',
            });
            this.$root.$emit('parameterCreation', true);
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
              // document.getElementById('uploadFiles').value = null;
              // return;
            } else {
              this.$root.$emit('payload', data);
              this.$root.$emit('successPayload', true);
            }
          }
        }
        if (noBooleanList.length) {
          const listDbaddress = dataList.map((item) => item.dbaddress);
          const duplicatedbAddress = listDbaddress.map((item) => item)
            .filter((value, index, self) => self.indexOf(value) !== index);
          if (duplicatedbAddress.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'DUPLICATE_DBADDRESS',
            });
            document.getElementById('uploadFiles').value = null;
            // return;
          }
          if (duplicatedbAddress) {
            const dbresponce = [];
            duplicatedbAddress.forEach((p) => {
              if (p.length > 0) {
                dbresponce.push(` value( dbaddress ): ${p} `);
                this.dupDbAddress = dbresponce;
                this.$root.$emit('parameterCreation', true);
              }
            });
          }
          const listStartAdd = dataList.map((item) => item.startaddress);
          const duplicatestartAddress = listStartAdd.map((item) => item)
            .filter((value, index, self) => self.indexOf(value) !== index);
          if (duplicatestartAddress.length > 0) {
            this.$root.$emit('parameterCreation', true);
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'DUPLICATE_START_ADDRESS',
            });
            document.getElementById('uploadFiles').value = null;
            // return;
          }
          if (duplicatestartAddress) {
            const resStartNum = [];
            duplicatestartAddress.forEach((p) => {
              if (p.length > 0) {
                resStartNum.push(` value( startaddress ): ${p} `);
                this.duplicateStartnum = resStartNum;
                this.$root.$emit('parameterCreation', true);
              }
            });
          }
          const listBitNum = dataList.map((item) => item.bitnumber);
          const duplicateBitnumber = listBitNum.map((item) => item)
            .filter((value, index, self) => self.indexOf(value) !== index);
          if (duplicateBitnumber.length > 0) {
            this.validateFlag = false;
            this.savingImport = false;
            this.setAlert({
              show: true,
              type: 'error',
              message: 'DUPLICATE_BIT_NUMBER',
            });
            document.getElementById('uploadFiles').value = null;
            // return;
          }
          if (duplicateBitnumber) {
            const resBitNum = [];
            duplicateBitnumber.forEach((p) => {
              if (p.length > 0) {
                resBitNum.push(` value( bitnumber ): ${p} `);
                this.duplicateBnum = resBitNum;
                this.$root.$emit('parameterCreation', true);
              }
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
          if (nameList) {
            const resLen = [];
            nameList.forEach((p, index) => {
              if (p.length > 15) {
                resLen.push(` name: ${p} | row: ${index + 2} `);
                this.paramLength = resLen;
                this.savingImport = false;
                this.validateFlag = false;
                this.$root.$emit('parameterCreation', true);
                document.getElementById('uploadFiles').value = null;
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
              message: 'PARAMETER_NAME_LENGTH',
            });
            // this.paramLength = [];
            // return;
          }
          if (this.validateFlag === true) {
            if (this.responce.length > 0) {
              this.savingImport = false;
              this.$root.$emit('parameterCreation', true);
              this.$root.$emit('payload', data);
              this.dialog = true;
              this.setAlert({
                show: true,
                type: 'error',
                message: 'EMPTY_FIELDS',
              });
              // document.getElementById('uploadFiles').value = null;
              // return;
            }
          }
        }
      }
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
