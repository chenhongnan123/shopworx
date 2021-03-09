<template>
  <div>
    <portal to="app-header">
      {{$t('calibration')}}
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
    </portal>
    <v-row class="px-2" no-gutters>
      <v-col cols="2">
        <v-autocomplete
          class="ml-4"
          clearable
          :label="$t('selectsubstation')"
          :items="subStationList"
          return-object
          item-text="name"
          v-model="substation"
          @change="handleChangeSubstation"
        >
        </v-autocomplete>
      </v-col>
      <v-col cols="2">
        <v-autocomplete
          class="ml-4"
          clearable
          :label="$t('selectmode')"
          :items="modeList"
          return-object
          item-text="description"
          v-model="mode"
          :disabled="!substation"
        >
        </v-autocomplete>
      </v-col>
      <v-col cols="3">
        <v-text-field
          class="ml-4"
          type="date"
          v-model="datefrom"
          :label="$t('startdate')"
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
          class="ml-4"
          type="date"
          v-model="dateto"
          :label="$t('enddate')"
        ></v-text-field>
      </v-col>
      <v-col>
         <v-btn
         small
         color="primary"
         class="text-none ml-5 mt-4"
         :loading="saving"
         :disabled="!datefrom || !dateto"
         @click="handleSearch">
         {{$t('searchbtn')}}
         </v-btn>
         <v-btn
         small
         color="primary"
         class="text-none ml-5 mt-4"
         :loading="saving"
         :disabled="calibrationDetailList.length === 1"
         @click="handleExport">
         {{$t('exportbtn')}}
         </v-btn>
      </v-col>
    </v-row>
    <ag-grid-vue
      :sideBar="true"
      multiSortKey="ctrl"
      :animateRows="true"
      :enableCharts="true"
      :rowData="calibrationDetailList"
      pivotPanelShow="always"
      :columnDefs="headers"
      rowGroupPanelShow="always"
      :enableRangeSelection="false"
      class="ag-theme-balham ma-5"
      style="width: 100%; height: calc(100vh - 150px);"
      :pagination="true"
      :defaultColDef="defaultColDef"
      :gridOptions="gridOptions"
    ></ag-grid-vue>
  </div>
</template>

<script>
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import CSVParser from '@shopworx/services/util/csv.service';
import ZipService from '@shopworx/services/util/zip.service';
import { AgGridVue } from 'ag-grid-vue';
import { mapActions } from 'vuex';

export default {
  name: 'CalibrationUI',
  data() {
    return {
      saving: false,
      subStationList: [],
      substation: '',
      modeList: [],
      mode: '',
      datefrom: '',
      dateto: '',
      calibrationDetailList: [],
      calibrationParameterList: [],
      defaultColDef: {},
      gridOptions: {},
      headers: [],
    };
  },
  components: {
    AgGridVue,
  },
  beforeMount() {
    this.defaultColDef = {
      filter: true,
      sortable: true,
      resizable: true,
      enableValue: true,
      enablePivot: true,
      enableRowGroup: true,
      floatingFilter: true,
    };
  },
  created() {
    this.zipService = ZipService;
    // this.timeout = null;
    this.init();
    // this.handleSearch();
  },
  computed: {
    currentLocale: {
      get() {
        return this.$i18n.locale;
      },
    },
  },
  methods: {
    ...mapActions('calibrationApp', ['getSubstationList', 'getModeList', 'getCalibrationDetail', 'getCalibrationParameter']),
    async init() {
      this.headers = [
        {
          headerName: this.$t('substation'),
          field: 'substationname',
          rowGroup: true,
        },
        {
          headerName: this.$t('calibrationmode'),
          field: 'calibrationmode',
          rowGroup: true,
        },
        {
          headerName: this.$t('id'),
          field: 'id',
          rowGroup: true,
        },
        {
          headerName: this.$t('parametervalue'),
          field: 'parametervalue',
        },
        {
          headerName: this.$t('modedescription'),
          field: 'modedescription',
        },
        {
          headerName: this.$t('parametername'),
          field: 'parametername',
          sortable: true,
        },
        {
          headerName: this.$t('parameterdescription'),
          field: 'parameterdescription',
        },
        {
          headerName: this.$t('createdTimestamp'),
          field: 'createdTimestamp',
        },
      ];
      this.subStationList = await this.getSubstationList();
      this.modeList = await this.getModeList();
      this.calibrationParameterList = await this.getCalibrationParameter();
      const nowdate = `${new Date().getFullYear()}-${this.addZero(new Date().getMonth() + 1)}-${this.addZero(new Date().getDate())}`;
      const beforedate = `${new Date().getFullYear()}-${this.addZero(new Date().getMonth() + 1)}-${this.addZero(new Date().getDate() - 1)}`;
      this.datefrom = beforedate;
      this.dateto = nowdate;
    },
    async handleChangeSubstation(obj) {
      if (obj) {
        this.modeList = await this.getModeList(`?query=substationid=="${obj.id}"`);
      } else {
        this.modeList = await this.getModeList();
      }
      this.mode = null;
    },
    async handleSearch() {
      this.saving = true;
      const datefrom = (new Date(`${this.datefrom} 00:00:00`)).getTime();
      const dateto = (new Date(`${this.dateto} 23:59:59`)).getTime();
      let query = '?query=';
      if (this.substation) {
        query += `substationid==%22${this.substation.id}%22`;
      }
      if (this.mode) {
        query += `%26%26calibrationmode==%22${this.mode.calibrationmode}%22`;
      }
      const calibrationDetailList = await this.getCalibrationDetail(
        `${query}&datefrom=${datefrom}&dateto=${dateto}&sortquery=modifiedtimestamp==-1`,
      );
      if (calibrationDetailList.length > 0) {
        calibrationDetailList.forEach((detail) => {
          const boolMode = this.modeList
            .find((mode) => detail.substationid === mode.substationid
            && detail.calibrationmode === mode.calibrationmode);
          if (boolMode) {
            detail.modedescription = boolMode.description;
          }
          const boolParameter = this.calibrationParameterList
            .find((parameter) => detail.substationid === parameter.substationid
            && detail.parametername === parameter.parametername);
          if (boolParameter) {
            detail.parameterdescription = boolParameter.parameterdescription;
          }
        });
      }
      this.calibrationDetailList = calibrationDetailList;
      // clearTimeout(this.timeout);
      // this.timeout = setTimeout(() => {
      //   this.gridOptions.api.expandAll();
      // }, 100);
      this.saving = false;
    },
    addToZip(file) {
      this.zipService.addFile(file);
    },
    addZero(num) {
      let newnum = '';
      if (num > 9) {
        newnum = num;
      } else {
        newnum = `0${num}`;
      }
      return newnum;
    },
    async handleExport() {
      this.saving = true;
      const columnKey = ['substationid', 'substationname', 'calibrationmode', 'parametervalue', 'parameterdescription', 'parametername', 'createdTimestamp'];
      const column = [`${this.$t('substation')} Id`, this.$t('substation'), this.$t('calibrationmode'), this.$t('parametervalue'), this.$t('parameterdescription'), this.$t('parametername'), this.$t('createdTimestamp')];
      // console.log(column);
      const csvContent = [];
      const fileName = 'calibration';
      this.calibrationDetailList.forEach((detail) => {
        const arr = [];
        columnKey.forEach((key) => {
          arr.push(detail[key]);
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
      this.saving = false;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
