<template>
<div style="height:100%">
  <portal to="app-header">
      <span>Roadmap Details</span>
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
  <v-container fluid class="py-0">
    <v-btn icon @click="$router.push({ name: 'roadmapManagement' })">
    <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <span>Roadmap name: </span>
    <span>{{$route.params.name}}</span>
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
          <v-spacer></v-spacer>
          <v-btn small color="primary" class="text-none" @click="addNewRoadmapDetails">
            <v-icon small left>mdi-plus</v-icon>
            Add Entry
          </v-btn>
        </v-toolbar>
        <v-row justify="left">
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
              :disabled="!toggleDisable"
            label="Roadmap ID"
            v-model="roadmapnumber"
        ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
              :disabled="!toggleDisable"
            label="Roadmap name"
            v-model="roadmapname"
        ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
              :disabled="!toggleDisable"
            label="Roadmap type"
            v-model="roadmaptype"
        ></v-text-field>
            </v-col>
            </v-row>
        <v-data-table
        :headers="headers"
        :items="roadmapDetails"
        item-key="substationname"
        >
        <template v-slot:item="{ item, index }">
          <tr>
          <td>{{ index+1 }}</td>
          <td>{{ item.linename }}</td>
          <td>{{ item.sublinename }}</td>
          <td>{{ item.machinename }}</td>
          <td>{{ item.substationname }}</td>
          <td>{{ item.process }}</td>
          <td>{{ item.amtpresubstation }}</td>
          <td>{{ item.presublinename }}</td>
          <td>{{ item.prestationname }}</td>
          <td>{{ item.presubstationname }}</td>
          <td v-if="item.editedtime">{{ new Date(item.editedtime).toLocaleString("en-gb") }}</td>
          <td v-else></td>
          <td><v-row justify="center"><v-btn
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
            </v-btn></v-row></td>
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
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
      <v-card-title primary-title>
        <span>
          Add details
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); dialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select
          hide-details
          label="Select Line name"
          :items="lineList"
          item-text="name"
          return-object
          prepend-icon="$production"
          v-model="roadmapDetail.linename"
          @change="handleLineClick"/>
        <v-select
          hide-details
          label="Select Subline name"
          :items="subLineList"
          item-text="name"
          return-object
          prepend-icon="$production"
          :rules="rmdetailName"
          required
          v-model="roadmapDetail.sublinename"
          @change="handleSubLineClick"/>
        <v-select
          class="mt-2"
          hide-details
          label="Select Station name"
          :items="stationList"
          item-text="name"
          return-object
          prepend-icon="$production"
          :rules="rmdetailStName"
          required
          v-model="roadmapDetail.machinename"
          @change="handleStationClick"/>
        <v-select
          class="mt-2"
          hide-details
          label="Select Sub-Station name"
          :items="subStationList"
          item-text="name"
          return-object
          prepend-icon="$production"
          :rules="rmdetailSstName"
          required
          v-model="roadmapDetail.substationname"/>
        <v-text-field
            :disabled="saving"
            label="Process code"
            prepend-icon="mdi-tray-plus"
            v-model="roadmapDetail.process"
            :rules="rmdProcesscode"
            :counter="6"
        ></v-text-field>
        <v-text-field
            type="number"
            :disabled="saving"
            label="Pre-SubStations before"
            prepend-icon="mdi-tray-plus"
            v-model="roadmapDetail.amtpresubstation"
            @keyup="checkProcessCode"
        ></v-text-field>
        <v-select
          class="mt-2"
          hide-details
          label="Select Pre-Subline name"
          :items="subLineList"
          item-text="name"
          return-object
          prepend-icon="$production"
          v-model="roadmapDetail.presubline"
          @change="handlePreSubLineClick"/>
          <v-select
          class="mt-2"
          hide-details
          label="Select Pre-Station name"
          :items="preStationList"
          item-text="name"
          return-object
          prepend-icon="$production"
          v-model="roadmapDetail.prestationname"
          @change="handlePreStationClick"/>
        <v-select
          hide-details
          label="Select Pre-Substation name"
          :items="preSubStationList"
          item-text="name"
          return-object
          prepend-icon="$production"
          :disabled="fieldDisabled"
          v-model="roadmapDetail.presubstationname"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!valid"
          @click="fnAddRoadmapDetails"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
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
        <span>
          Alert
        </span>
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
        <v-btn
          color="primary"
          class="text-none"
          @click="fnDeleteOnYes"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-container>
</div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'RecipeDetails',
  data() {
    return {
      headers: [
        {
          text: 'No.',
          value: 'number',
        },
        { text: 'Line', value: 'linename' },
        { text: 'Subline', value: 'sublinename' },
        { text: 'Station', value: 'machinename' },
        {
          text: 'Sub-Station name',
          value: 'substationname',
        },
        {
          text: 'Process code',
          value: 'process',
        },
        { text: 'Pre-Subtations before', value: 'amtpresubstation' },
        { text: 'Previous subline', value: 'presublinename' },
        { text: 'Previous station', value: 'prestationname' },
        { text: 'Pre-Substation name', value: 'presubstationname' },
        { text: 'Edited time', value: 'editedtime' },
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'actions',
        },
      ],
      deleting: false,
      dialog: false,
      recipeValue: null,
      roadmapDetail: {},
      saving: false,
      line: null,
      valid: true,
      roadmapnumber: null,
      roadmaptype: null,
      dialogConfirm: false,
      roadmapname: null,
      toggleDisable: true,
      itemToUpdate: {},
      itemForDelete: null,
      flagEdit: false,
      fieldDisabled: false,
      sublinename: '',
      machinename: '',
      substationname: '',
      process: '',
      rmdetailName: [(v) => !!v || 'Subline Name Required'],
      rmdetailStName: [(v) => !!v || 'Station Name Required'],
      rmdetailSstName: [(v) => !!v || 'Sub-Station Name Required'],
      rmdProcesscode: [(v) => !!v || 'Process Code Required',
        (v) => (v && v.length <= 6) || 'Name must be less than 10 characters'],
    };
  },
  async created() {
    await this.getDetailsRecords(`?query=roadmapid=="${this.$route.params.id.id}"`);
    this.roadmaptype = this.$route.params.id.roadmaptype;
    this.roadmapname = this.$route.params.id.name;
    this.line = this.$route.params.id.line;
    this.roadmapnumber = this.$route.params.id.id;
    this.toggleDisable = false;
    await this.getLineList('');
  },
  computed: {
    ...mapState('roadmapManagement', ['roadmapDetails',
      'subStationList',
      'stationList',
      'subLineList',
      'productList',
      'preSubStationList',
      'preStationList',
      'lineList',
      'stationNamebySubline',
      'subStationNamebyStation']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
  },
  methods: {
    ...mapActions('roadmapManagement', ['getDetailsRecords',
      'createRoadmapDetails',
      'getSubStationList',
      'getStationList',
      'getSubLineList',
      'getLineList',
      'getPreSubStationList',
      'updateRoadmap',
      'deleteRoadmapDetails',
      'updateRoadmapDetails',
      'createProductDetails',
      'getProductListFromRoadmapName',
      'getStationNamesbysubline',
      'getSubStationNamesbyStation',
      'getPreStationList']),
    ...mapMutations('helper', ['setAlert', 'setCurrentPath']),
    async checkProcessCode() {
      const preSubstBefor = this.roadmapDetail.amtpresubstation;
      const zero = '0';
      if (preSubstBefor === zero) {
        this.fieldDisabled = true;
      } else {
        this.fieldDisabled = false;
      }
    },
    addNewRoadmapDetails() {
      this.dialog = true;
      this.flagEdit = false;
    },
    async RefreshUI() {
      await this.getRecipeDetailListRecords('');
    },
    async handleLineClick(item) {
      const query = `?query=lineid==${item.id}`;
      await this.getSubLineList(query);
    },
    async handlePreSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getPreStationList(query);
    },
    async handleSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getStationList(query);
    },
    async handleStationClick(item) {
      const query = `?query=stationid=="${item.id}"`;
      await this.getSubStationList(query);
    },
    async handlePreStationClick(item) {
      const query = `?query=stationid=="${item.id}"`;
      await this.getPreSubStationList(query);
    },
    async fnAddRoadmapDetails() {
      this.$refs.form.validate();
      if (!this.roadmapDetail.sublinename) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SUBLINE_NOT_SELECTED_ROADMAPDETAILS',
        });
      } else if (!this.roadmapDetail.machinename) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'STATION_NOT_SELECTED_ROADMAPDETAILS',
        });
      } else if (!this.roadmapDetail.substationname) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SUBSTATION_NOT_SELECTED_ROADMAPDETAILS',
        });
      } else if (!this.roadmapDetail.process) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PROCESS_CODE_EMPTY',
        });
      } else if (this.flagEdit) {
        this.roadmapDetail = {
          ...this.roadmapDetail,
          lineid: Number(this.roadmapDetail.linename.id),
          linename: this.roadmapDetail.linename.name,
          sublinename: this.roadmapDetail.sublinename.name,
          sublineid: this.roadmapDetail.sublinename.id,
          machinename: this.roadmapDetail.machinename.name,
          stationid: this.roadmapDetail.machinename.id,
          substationname: this.roadmapDetail.substationname.name,
          substationid: this.roadmapDetail.substationname.id,
          prestationname: this.roadmapDetail.prestationname.name,
          prestationid: this.roadmapDetail.prestationname.id,
          presubstationname: this.roadmapDetail.presubstationname.name,
          presubstationid: this.roadmapDetail.presubstationname.id,
          editedtime: new Date().getTime(),
        };
        await this.updateRoadmapDetails({
          payload: this.roadmapDetail,
          query: `?query=id==${this.itemToUpdate.id}`,
        });
        await this.getDetailsRecords(`?query=roadmapid=="${this.$route.params.id.id}"`);
        this.dialog = false;
        this.roadmapDetail = {};
      } else {
        const processcodeFlag = this.roadmapDetails
          .filter((o) => o.process.toLowerCase().split(' ').join('')
        === this.roadmapDetail.process.toLowerCase().split(' ').join(''));
        if (processcodeFlag.length > 0) {
          this.roadmapDetail.process = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'PROCESS_CODE_EXISTS',
          });
        } else {
          if (this.roadmapDetail.prestationname && this.roadmapDetail.presubstationname) {
            this.roadmapDetail = {
              ...this.roadmapDetail,
              lineid: Number(this.roadmapDetail.linename.id),
              linename: this.roadmapDetail.linename.name,
              sublinename: this.roadmapDetail.sublinename.name,
              sublineid: this.roadmapDetail.sublinename.id,
              machinename: this.roadmapDetail.machinename.name,
              stationid: this.roadmapDetail.machinename.id,
              substationname: this.roadmapDetail.substationname.name,
              substationid: this.roadmapDetail.substationname.id,
              presublineid: this.roadmapDetail.presubline.id,
              presublinename: this.roadmapDetail.presubline.name,
              prestationname: this.roadmapDetail.prestationname.name,
              prestationid: this.roadmapDetail.prestationname.id,
              presubstationname: this.roadmapDetail.presubstationname.name,
              presubstationid: this.roadmapDetail.presubstationname.id,
              assetid: 4,
              roadmapid: this.$route.params.id.id,
            };
          } else {
            this.roadmapDetail = {
              ...this.roadmapDetail,
              lineid: Number(this.roadmapDetail.linename.id),
              linename: this.roadmapDetail.linename.name,
              sublinename: this.roadmapDetail.sublinename.name,
              sublineid: this.roadmapDetail.sublinename.id,
              machinename: this.roadmapDetail.machinename.name,
              stationid: this.roadmapDetail.machinename.id,
              substationname: this.roadmapDetail.substationname.name,
              substationid: this.roadmapDetail.substationname.id,
              presublineid: '',
              presublinename: '',
              prestationname: '',
              prestationid: '',
              presubstationname: '',
              presubstationid: '',
              assetid: 4,
              roadmapid: this.$route.params.id.id,
            };
          }
          let created = false;
          const payload = this.roadmapDetail;
          created = await this.createRoadmapDetails(payload);
          await this.getDetailsRecords(`?query=roadmapid=="${this.$route.params.id.id}"`);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'ROADMAP_DETAILS_CREATED',
            });
            this.dialog = false;
            await this.getProductListFromRoadmapName(`?query=roadmapname=="${this.$route.params.id.name}"`);
            if (this.productList.length) {
              this.productList.forEach(async (products) => {
                const object = {
                  productname: products.productname,
                  productnumber: products.productnumber,
                  sublinename: this.roadmapDetail.sublinename,
                  sublineid: this.roadmapDetail.sublineid,
                  machinename: this.roadmapDetail.machinename,
                  stationid: this.roadmapDetail.stationid,
                  presublineid: this.roadmapDetail.presubline.id,
                  presublinename: this.roadmapDetail.presubline.name,
                  substationname: this.roadmapDetail.substationname,
                  substationid: this.roadmapDetail.substationid,
                  roadmapname: this.$route.params.id.name,
                  roadmapid: this.$route.params.id.id,
                  assetid: 4,
                };
                await this.createProductDetails(object);
                this.$refs.form.reset();
              });
            }
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_ROADMAP_DETAILS',
            });
          }
        }
      }
      const roadmap = {
        editedby: this.userName,
        editedtime: new Date().getTime(),
        versionnumber: this.$route.params.id.versionnumber + 1,
      };
      const object = {
        payload: roadmap,
        query: `?query=id=="${this.$route.params.id.id}"`,
      };
      await this.updateRoadmap(object);
    },
    fnUpdateRecipeDetails(item) {
      this.flagEdit = true;
      this.dialog = true;
      this.itemToUpdate = item;
      this.roadmapDetail.linename = item.linename;
      this.roadmapDetail.sublinename = item.sublinename;
      this.roadmapDetail.machinename = item.machinename;
      this.roadmapDetail.substationname = item.substationname;
      this.roadmapDetail.process = item.process;
      this.roadmapDetail.amtpresubstation = item.amtpresubstation;
      this.roadmapDetail.prestationname = item.prestationname;
      this.roadmapDetail.presubstationname = item.presubstationname;
      this.recipeValue = item.parametervalue;
    },
    deleteRecipeDeatils(item) {
      this.itemForDelete = item;
      this.dialogConfirm = true;
    },
    async fnDeleteOnYes() {
      await this.deleteRoadmapDetails({
        id: this.itemForDelete.id,
        roadmapid: this.$route.params.id.id,
      });
      const roadmap = {
        editedby: this.userName,
        editedtime: new Date().getTime(),
        versionnumber: this.$route.params.id.versionnumber + 1,
      };
      const object = {
        payload: roadmap,
        query: `?query=id=="${this.$route.params.id.id}"`,
      };
      await this.updateRoadmap(object);
      this.dialogConfirm = false;
    },
    async dialogReset() {
      this.$refs.form.reset();
    },
    async getfilteredStationNames(item) {
      await this.getStationNamesbysubline(`?query=sublineid=="${item.id}"`);
    },
    async getfilteredSubStationNames(item) {
      await this.getSubStationNamesbyStation(`?query=stationid=="${item.id}"`);
    },
  },
};
</script>
