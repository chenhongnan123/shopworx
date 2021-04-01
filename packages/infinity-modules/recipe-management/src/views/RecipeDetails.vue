<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Recipe Details</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn>
    </portal>
    <v-container fluid class="py-0">
      <v-btn icon @click="$router.push({ name: 'recipeManagement' })">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>{{ this.$t('Recipe name')}}</span>
      <span>{{recipename}}</span>
      <v-row justify="center">
        <v-col cols="12" xl="10" class="py-0">
          <v-toolbar flat dense class="stick" :color="$vuetify.theme.dark ? '#121212': ''">
            <v-spacer></v-spacer>
             <v-btn small color="primary" outlined class="text-none ml-2"
              :disabled="!saveBtnEnable"
              @click="saveVersion">
              {{ $t('Save') }}
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
              <v-icon small left>mdi-refresh</v-icon>
               {{ $t('Refresh') }}
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="btnUploadToPLC">
              <v-icon small left>mdi-upload</v-icon>
                {{ $t('Upload to PLC') }}
            </v-btn>
            <v-btn
              small
              color="primary"
              outlined
              class="text-none ml-2"
              @click="btnDownloadFromPLC"
            >
              <v-icon small left>mdi-download</v-icon>
              {{ $t('Download from PLC') }}
            </v-btn>
          </v-toolbar>
          <v-row justify="left">
            <v-col cols="12" md="2" class="py-2">
              <v-text-field :disabled="!toggleDisable"
               :label="this.$t('Line')"
                v-model="line"></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field :disabled="!toggleDisable"
              :label="this.$t('Subline')"
               v-model="subline"></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
                :disabled="!toggleDisable"
                :label="this.$t('Sub-Station name')"
                v-model="substationname"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2"
             class="py-2">
              <v-text-field :disabled="!toggleDisable"
              :label="this.$t('Recipe Name')"
               v-model="recipename"></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-select
                solo
                outline
                dense
                single-line
                v-model="filters"
                hide-details
                item-text="name"
                item-value="id"
                :items="recipeFilters"
                @change="changeRecipeList()"
              ></v-select>
            </v-col>
          </v-row>
          <v-data-table :headers="selectedHeader" :items="selectedList" item-key="tagname">
            <template v-slot:item="{ item, index }">
              <tr>
                <td>{{ index+1 }}</td>
                <td v-if="language === 'en'">{{ item.tagname }}</td>
                <td v-else>{{ item.chinesedescription }}</td>
                <td
                  v-if="datatypeList
                    .filter((d) => Number(d.id) === Number(item.datatype)).length > 0"
                >{{ datatypeList
                  .filter((d) => Number(d.id) === Number(item.datatype))[0].name }}</td>
                <td v-else>{{ item.datatype }}</td>
                <td>{{ item.parametervalue }}</td>
                <td>
                  <v-edit-dialog
                      :return-value.sync="item.upper"
                      @save="saveTableParameter(item, 'upper')"
                    >
                      {{ item.upper }}
                      <v-icon
                        small
                        color="primary"
                        :disabled="false"
                        v-if="Number(item.datatype) != 11 &&
                        Number(item.datatype) != 12"
                      > mdi-pencil </v-icon>
                      <template v-slot:input>
                        <v-text-field
                          :disabled="false"
                          v-model="item.upper"
                          label="Edit"
                          single-line
                          type="number"
                          @input="checkDatatype2(item.datatype, item, 'upper')"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                </td>
                <td>
                  <v-edit-dialog
                      :return-value.sync="item.lower"
                      @save="saveTableParameter(item, 'lower')"
                    >
                      {{ item.lower }}
                      <v-icon
                        small
                        color="primary"
                        v-if="Number(item.datatype) != 11 &&
                        Number(item.datatype) != 12"
                        :disabled="false"
                      > mdi-pencil </v-icon>
                      <template v-slot:input>
                        <v-text-field
                          :disabled="false"
                          v-model="item.lower"
                          label="Edit"
                          single-line
                          type="number"
                          @input="checkDatatype2(item.datatype, item, 'lower')"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                </td>
                <td>{{ item.monitorvalue }}</td>
                <td>
                  <v-row justify="center">
                    <v-btn
                      icon
                      small
                      color="primary"
                      @click="fnUpdateRecipeDetails(item)"
                      :loading="deleting"
                    >
                      <v-icon v-text="'$edit'"></v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      small
                      color="error"
                      @click="deleteRecipeDeatils(item)"
                      :loading="deleting"
                    >
                      <v-icon v-text="'$delete'"></v-icon>
                    </v-btn>
                  </v-row>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-dialog
        scrollable
        persistent
        v-model="dialog"
        max-width="500px"
        transition="dialog-transition"
        :fullscreen="$vuetify.breakpoint.smAndDown"
      >
        <v-card>
          <v-card-title primary-title>
            <span>Update parameter value</span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-text-field
              :disabled="saving"
              label="Value"
              prepend-icon="mdi-tray-plus"
              v-model="recipeValue"
              @input="checkDatatype(datatype)"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="text-none"
             :disabled="btnDisable"
             @click="fnUpdateRecipeValue">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        scrollable
        persistent
        v-model="dialogConfirm"
        max-width="500px"
        transition="dialog-transition"
        :fullscreen="$vuetify.breakpoint.smAndDown"
      >
        <v-card>
          <v-card-title primary-title>
            <span>Alert</span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="dialogConfirm = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <span>Are you sure you want to delete?</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="text-none" @click="fnDeleteOnYes">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import socketioclient from 'socket.io-client';

export default {
  name: 'RecipeDetails',
  data() {
    return {
      filters: {
        name: 'Recipe Parameters',
        id: 1,
        selectedHeader: [],
        totalRecipeDetails: [],
        caliberVal: [],
        recipeParamVal: [],
        selectedList: [],
        first: [],
        second: [],
      },
      recipeFilters: [
        {
          name: this.$t('Recipe Parameters'),
          id: 1,
        },
        {
          name: this.$t('Calibration'),
          id: 2,
          parametercategory: 58,
        },
      ],
      headersEn: [
        {
          text: this.$t('No.'),
          value: 'number',
        },
        {
          text: this.$t('Parameter.'),
          value: 'tagname',
        },
        {
          text: this.$t('Data type'),
          value: 'datatype',
        },
        { text: this.$t('Recipe value'), value: 'parametervalue' },
        { text: this.$t('Upper'), value: 'upper' },
        { text: this.$t('Lower'), value: 'lower' },
        { text: this.$t('Monitor value'), value: 'monitorvalue' },
        {
          text: this.$t('Actions'),
          align: 'center',
          sortable: false,
          value: 'actions',
        },
      ],
      headersCn: [
        {
          text: this.$t('No.'),
          value: 'number',
        },
        {
          text: this.$t('Parameter'),
          value: 'chinesedescription',
        },
        {
          text: this.$t('Data type'),
          value: 'datatype',
        },
        { text: this.$t('Recipe value'), value: 'parametervalue' },
        { text: this.$t('Upper'), value: 'upper' },
        { text: this.$t('Lower'), value: 'lower' },
        { text: this.$t('Monitor value'), value: 'monitorvalue' },
        {
          text: this.$t('Actions'),
          align: 'center',
          sortable: false,
          value: 'actions',
        },
      ],
      dialog: false,
      recipeValue: null,
      recipe: {},
      saving: false,
      line: null,
      subline: null,
      substationname: null,
      dialogConfirm: false,
      recipename: null,
      toggleDisable: true,
      itemToUpdate: {},
      itemForDelete: null,
      saveBtnEnable: false,
      btnDisable: false,
    };
  },
  async mounted() {
    await this.getRecipeListRecords(`?query=recipenumber=="${this.$route.params.id}"`);
    this.line = this.recipeList[0].linename;
    this.subline = this.recipeList[0].sublinename;
    this.substationname = this.recipeList[0].substationname;
    this.substationid = this.recipeList[0].substationid;
    this.recipename = this.recipeList[0].recipename;
  },
  watch: {
    recipeListDetails: {
      handler(val) {
        if (val.length > 0) {
          this.saveBtnEnable = true;
        } else {
          this.saveBtnEnable = false;
        }
      },
    },
  },
  async created() {
    this.language = this.currentLocale;
    if (this.language === 'zhHans') {
      this.selectedHeader = this.headersCn;
    } else {
      this.selectedHeader = this.headersEn;
    }
    const totalRecords = await this.getRecipeDetailListRecords(
      `?query=recipeid=="${this.$route.params.id}"%26%26versionnumber==${this.$route.params.versionnumber}`,
    );
    this.totalRecipeDetails = totalRecords;
    const first = this.totalRecipeDetails
      .filter((f) => f.parametercategory === '35' || f.parametercategory === '7');
    this.first = first;
    const second = this.totalRecipeDetails
      .filter((f) => f.parametercategory === '58');
    this.second = second;
    this.selectedList = first;
    await this.getDataTypes('');
    // this.substationname = this.$route.params.id.substationname;
    // this.recipename = this.$route.params.id.recipename;
    // this.line = this.$route.params.id.linename;
    // this.subline = this.$route.params.id.sublinename;
    this.toggleDisable = false;
    if (this.recipeListDetails.length === 0) {
      const payload = [];
      // %26%26%28parametercategory=="36"%7C%7Cparametercategory=="7"%29
      await this.getParametersRecords(
        `?query=substationid=="${this.substationid}"`,
      );
      this.parametersList.forEach((element) => {
        if (element.datatype === 11) {
          payload.push({
            tagname: element.name,
            chinesedescription: element.chinesedescription,
            datatype: element.datatype,
            recipeid: this.$route.params.id,
            parametercategory: element.parametercategory,
            parametervalue: '',
            lineid: this.$route.params.lineid,
            linename: this.$route.params.linename,
            sublineid: this.$route.params.sublineid,
            sublinename: this.$route.params.sublinename,
            assetid: 4,
            versionnumber: 1,
          });
        } else {
          payload.push({
            tagname: element.name,
            chinesedescription: element.chinesedescription,
            datatype: element.datatype,
            recipeid: this.$route.params.id,
            parametercategory: element.parametercategory,
            parametervalue: 0,
            lineid: this.$route.params.lineid,
            linename: this.$route.params.linename,
            sublineid: this.$route.params.sublineid,
            sublinename: this.$route.params.sublinename,
            assetid: 4,
            versionnumber: 1,
          });
        }
      });
      await this.createRecipeDetails(payload);
      await this.getRecipeDetailListRecords(
        `?query=recipeid=="${this.$route.params.id}"%26%26versionnumber==${this.$route.params.versionnumber}%26%26(parametercategory=="35"%7C%7Cparametercategory=="7")`,
      );
    }
    this.socket = socketioclient.connect('http://:10190');
    this.socket.on('connect', () => {
      // console.log('connected to socketwebhook');
    });
  },
  beforeDestroy() {
    this.socket.close();
    this.totalRecipeDetails = [];
  },
  computed: {
    ...mapState('recipeManagement', [
      'recipeListDetails', 'parametersList', 'datatypeList', 'recipeList',
    ]),
    ...mapState('user', ['me']),
    currentLocale: {
      get() {
        return this.$i18n.locale;
      },
    },
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
  },
  methods: {
    ...mapActions('recipeManagement', [
      'getRecipeDetailListRecords',
      'createRecipe',
      'deleteRecipeDetails',
      'updateRecipeDetails',
      'updateRecipe',
      'getParametersRecords',
      'createRecipeDetails',
      'getMonitorValues',
      'uploadToPLC',
      'downloadFromPLC',
      'getRecipeListRecords',
      'updateProductDetails',
      'getOrderRecords',
      'getProductDetails',
      'getDataTypes',
      'updateRecipeDetailById']),
    ...mapMutations('helper', ['setAlert']),
    addNewRecipe() {
      this.dialog = true;
    },
    async changeRecipeList() {
      const filterSelected = this.filters;
      if (filterSelected === 1) {
        this.selectedList = this.first;
      } else {
        this.selectedList = [];
        this.selectedList = this.second;
      }
    },
    checkDatatype(item) {
      if (item === '9') {
        const { lower, upper } = this.itemToUpdate;
        const n = this.recipeValue;
        if (n < lower || n > upper) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_VALUE',
          });
          this.btnDisable = true;
          return;
        }
        const t = function retStr() {
          const reg = /^[+-]?\d+(\.\d+)?$/;
          return reg.test(n);
        };
        const val = t();
        const val2 = n.toString();
        if (!val) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'NOT_FLOAT',
          });
          this.btnDisable = true;
        } else if (val2.length === 0 || val2.length > 8 || val2.charCodeAt(0) <= 32) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INPUT_LENGTH',
          });
        } else {
          this.btnDisable = false;
        }
      } else if (item === '3' || item === '5' || item === '7' || item === '2' || item === '4' || item === '8') {
        const { lower, upper } = this.itemToUpdate;
        const n = this.recipeValue;
        if (n < lower || n > upper) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_VALUE',
          });
          this.btnDisable = true;
          return;
        }
        const t = function retStr() {
          return n % 1 !== 0;
        };
        const val = t();
        const val2 = n.toString();
        if (val) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'NOT_INTEGER',
          });
          this.btnDisable = true;
        } else if (val2.length === 0 || val2.charCodeAt(0) <= 32) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INPUT_LENGTH_INTEGER',
          });
        } else {
          this.btnDisable = false;
        }
      } else if (item === '12') {
        const n = this.recipeValue;
        const t = function retStr() {
          return n % 1 !== 0;
        };
        const val = t();
        const val2 = n.toString();
        const val3 = n;
        if (val) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'BOOLEAN_NUMBER',
          });
          this.btnDisable = true;
        } else if (val2.length === 0 || val2.length > 1 || val2.charCodeAt(0) <= 32) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INPUT_LENGTH_BOOLEAN',
          });
        } else if (val3.charCodeAt(0) === 48) {
          this.btnDisable = false;
        } else if (val3.charCodeAt(0) >= 50 && val3.charCodeAt(0) <= 57) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ONLY_BOOLEAN',
          });
        } else {
          this.btnDisable = false;
        }
      } else if (item === '10') {
        const { lower, upper } = this.itemToUpdate;
        const n = this.recipeValue;
        if (n < lower || n > upper) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_VALUE',
          });
          this.btnDisable = true;
          return;
        }
        const t = function retStr() {
          return n % 1 !== 0;
        };
        const val = t();
        const val2 = n.toString();
        if (val) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'NOT_DOUBLE',
          });
          this.btnDisable = true;
        } else if (val2.length === 0 || val2.charCodeAt(0) <= 32) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INPUT_LENGTH_DOUBLE',
          });
        } else {
          this.btnDisable = false;
        }
      } else if (item === '11') {
        const n = this.recipeValue;
        if (n.length === 0 || n.charCodeAt(0) <= 32) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INPUT_LENGTH_STRING',
          });
        } else {
          this.btnDisable = false;
        }
      }
    },
    checkDatatype2(item, data, type) {
      const value = data[type];
      if (item === '9') {
        const n = value;
        const t = function retStr() {
          const reg = /^[+-]?\d+(\.\d+)?$/;
          return reg.test(n);
        };
        const val = t();
        const val2 = n.toString();
        if (!val) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'NOT_FLOAT',
          });
          this.btnDisable = true;
        } else if (val2.length === 0 || val2.length > 8 || val2.charCodeAt(0) <= 32) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INPUT_LENGTH',
          });
        } else {
          this.btnDisable = false;
        }
      } else if (item === '3' || item === '5' || item === '7' || item === '2' || item === '4' || item === '8') {
        const n = value;
        const t = function retStr() {
          return n % 1 !== 0;
        };
        const val = t();
        const val2 = n.toString();
        if (val) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'NOT_INTEGER',
          });
          this.btnDisable = true;
        } else if (val2.length === 0 || val2.charCodeAt(0) <= 32) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INPUT_LENGTH_INTEGER',
          });
        } else {
          this.btnDisable = false;
        }
      } else if (item === '12') {
        const n = value;
        const t = function retStr() {
          return n % 1 !== 0;
        };
        const val = t();
        const val2 = n.toString();
        const val3 = n;
        if (val) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'BOOLEAN_NUMBER',
          });
          this.btnDisable = true;
        } else if (val2.length === 0 || val2.length > 1 || val2.charCodeAt(0) <= 32) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INPUT_LENGTH_BOOLEAN',
          });
        } else if (val3.charCodeAt(0) === 48) {
          this.btnDisable = false;
        } else if (val3.charCodeAt(0) >= 50 && val3.charCodeAt(0) <= 57) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ONLY_BOOLEAN',
          });
        } else {
          this.btnDisable = false;
        }
      } else if (item === '10') {
        const n = value;
        const t = function retStr() {
          return n % 1 !== 0;
        };
        const val = t();
        const val2 = n.toString();
        if (val) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'NOT_DOUBLE',
          });
          this.btnDisable = true;
        } else if (val2.length === 0 || val2.charCodeAt(0) <= 32) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INPUT_LENGTH_DOUBLE',
          });
        } else {
          this.btnDisable = false;
        }
      } else if (item === '11') {
        const n = value;
        if (n.length === 0 || n.charCodeAt(0) <= 32) {
          this.btnDisable = true;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INPUT_LENGTH_STRING',
          });
        } else {
          this.btnDisable = false;
        }
      }
    },
    async RefreshUI() {
      const object = {
        lineid: Number(this.recipeList[0].lineid),
        sublineid: this.recipeList[0].sublineid,
        substationid: this.recipeList[0].substationid,
      };
      this.socket.on(`update_parameter_${object.lineid}_${object.sublineid}_${object.substationid}`, (data) => {
        console.log('event received');
        if (data) {
          this.recipeListDetails.forEach((element) => {
            this.$set(element, 'monitorvalue', data[element.tagname]);
          });
        }
      });
      await this.getMonitorValues(object);
    },
    async btnUploadToPLC() {
      const parameterList = [];
      this.recipeListDetails.forEach((element) => {
        if (element.datatype === '11') {
          parameterList.push({
            parametername: element.tagname,
            parametervalue: element.parametervalue,
          });
        } else if (element.datatype === '9') {
          parameterList.push({
            parametername: element.tagname,
            parametervalue: parseFloat(element.parametervalue, 10),
          });
        } else {
          parameterList.push({
            parametername: element.tagname,
            parametervalue: Number(element.parametervalue),
          });
        }
      });
      const object = {
        lineid: Number(this.recipeList[0].lineid),
        sublineid: this.recipeList[0].sublineid,
        substationid: this.recipeList[0].substationid,
        recipenumber: this.$route.params.id,
        // tagname, parametervalue
        recipeparameter: parameterList,
      };
      console.log(object);
      this.socket.on(`update_upload_${object.lineid}_${object.sublineid}_${object.substationid}`, () => {
      });
      await this.uploadToPLC(object);
    },
    async btnDownloadFromPLC() {
      const object = {
        lineid: Number(this.recipeList[0].lineid),
        sublineid: this.recipeList[0].sublineid,
        substationid: this.recipeList[0].substationid,
      };
      this.socket.off(`update_download_${object.lineid}_${object.sublineid}_${object.substationid}`, () => {
        // console.log('event closed - download');
      });
      this.socket.on(`update_download_${object.lineid}_${object.sublineid}_${object.substationid}`, (data) => {
        // console.log('event received - download');
        if (data) {
          this.recipeListDetails.forEach(async (element) => {
            if (data[element.tagname]) {
              this.$set(element, 'parametervalue', data[element.tagname]);
              // const request = {
              //   parametervalue: data[element.tagname],
              // };
              // const objectForUpdate = {
              //   payload: request,
              //   query: `?query=tagname=="${element.tagname}"%26
              // %26recipeid=="${this.$route.params.id}"`,
              // };
              // await this.updateRecipeDetails(objectForUpdate);
            }
          });
          // const recipe = {
          //   editedby: this.userName,
          //   editedtime: new Date().getTime(),
          //   versionnumber: this.recipeList[0].versionnumber + 1,
          // };
          // const object2 = {
          //   payload: recipe,
          //   query: `?query=recipenumber=="${this.$route.params.id}"`,
          // };
          // this.updateRecipe(object2);
        }
      });
      await this.downloadFromPLC(object);
    },
    async fnUpdateRecipeValue() {
      console.log(this.itemToUpdate);
      this.selectedList.forEach((f) => {
        if (f.tagname === this.itemToUpdate.tagname) {
          f.parametervalue = this.recipeValue;
        }
      });
      this.itemToUpdate = [];
      this.saveBtnEnable = true;
      this.dialog = false;
    },
    async saveVersion() {
      const runningorder = await this.getOrderRecords('?query=orderstatus=="Running"');
      const productNumber = await this.getProductDetails(`?query=productnumber=="${runningorder[0].productid}"`);
      if (productNumber[0].recipenumber === this.$route.params.id) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'RUNNING_ORDER',
        });
      } else {
        if (this.selectedList.length > 0) {
          this.totalRecipeDetails.forEach((item) => {
            if (item.tagname === this.itemToUpdate.tagname) {
              item.parametervalue = this.itemToUpdate.parametervalue;
            }
          });
        }
        const list = this.totalRecipeDetails;
        const currentRecipeId = this.$route.params.id;
        const currentVersion = this.$route.params.versionnumber;
        const payload = [];
        list.forEach((ls) => {
          const updatedlist = {
            assetid: 4,
            versionnumber: currentVersion + 1,
            tagname: ls.tagname,
            chinesedescription: ls.chinesedescription,
            datatype: ls.datatype,
            recipeid: ls.recipeid,
            parametercategory: ls.parametercategory,
            parametervalue: ls.parametervalue,
            lineid: ls.lineid,
            linename: ls.linename,
            sublineid: ls.sublineid,
            sublinename: ls.sublinename,
            upper: ls.upper,
            lower: ls.lower,
          };
          payload.push(updatedlist);
        });
        await this.createRecipeDetails(payload);
        const recipe = {
          versionnumber: currentVersion + 1,
          recipeversion: currentVersion + 1,
        };
        const object = {
          payload: recipe,
          query: `?query=recipenumber=="${currentRecipeId}"`,
        };
        const productDetailUpdate = {
          payload: recipe,
          id: currentRecipeId,
        };
        const updated = this.updateRecipe(object);
        await this.updateProductDetails(productDetailUpdate);
        this.saveBtnEnable = false;
        if (updated) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'VERSIONNUM_UPDATED',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'VERSIONNUM_NOT_UPDATED',
          });
        }
        // this.totalRecipeDetails = [];
      }
    },
    fnUpdateRecipeDetails(item) {
      this.dialog = true;
      this.itemToUpdate = item;
      this.recipeValue = item.parametervalue;
      this.datatype = item.datatype;
    },
    deleteRecipeDeatils(item) {
      this.itemForDelete = item;
      this.dialogConfirm = true;
    },
    async fnDeleteOnYes() {
      await this.deleteRecipeDetails(`?query=tagname=="${this.itemForDelete.tagname}"%26%26recipeid=="${this.$route.params.id}"`);
      const recipe = {
        editedby: this.userName,
        editedtime: new Date().getTime(),
        versionnumber: this.recipeList[0].versionnumber + 1,
      };
      const object = {
        payload: recipe,
        query: `?query=recipenumber=="${this.$route.params.id}"`,
      };
      await this.updateRecipe(object);
      this.dialogConfirm = false;
      await this.getRecipeDetailListRecords(`?query=recipeid=="${this.$route.params.id}"%26%26versionnumber==${this.$route.params.versionnumber}`);
    },
    async saveTableParameter(item, type) {
      if (this.btnDisable) return;
      if (type === 'lower') {
        if (item.upper) {
          if (Number(item.upper) < Number(item.lower)) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'LOWERBIGER',
            });
            const totalRecords = await this.getRecipeDetailListRecords(
              `?query=recipeid=="${this.$route.params.id}"%26%26versionnumber==${this.$route.params.versionnumber}`,
            );
            this.totalRecipeDetails = totalRecords;
            const first = this.totalRecipeDetails
              .filter((f) => f.parametercategory === '35' || f.parametercategory === '7');
            this.first = first;
            const second = this.totalRecipeDetails
              .filter((f) => f.parametercategory === '58');
            this.second = second;
            this.changeRecipeList();
            return;
          }
        }
      } else if (type === 'upper') {
        if (item.lower) {
          if (Number(item.upper) < Number(item.lower)) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'LOWERBIGER',
            });
            const totalRecords = await this.getRecipeDetailListRecords(
              `?query=recipeid=="${this.$route.params.id}"%26%26versionnumber==${this.$route.params.versionnumber}`,
            );
            this.totalRecipeDetails = totalRecords;
            const first = this.totalRecipeDetails
              .filter((f) => f.parametercategory === '35' || f.parametercategory === '7');
            this.first = first;
            const second = this.totalRecipeDetails
              .filter((f) => f.parametercategory === '58');
            this.second = second;
            this.changeRecipeList();
            return;
          }
        }
      }
      const payload = {
        assetid: 4,
        lower: item.lower,
        upper: item.upper,
      };
      this.saving = true;
      const updateResult = await this.updateRecipeDetailById({ id: item._id, payload });
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'RECIPE_UPDATED',
        });
      }
    },
  },
};
</script>
