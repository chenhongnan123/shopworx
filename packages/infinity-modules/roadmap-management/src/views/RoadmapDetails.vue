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
    <span>{{$route.params.id.name}}</span>
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
            <!-- <v-col cols="12" md="2" class="py-2">
              <v-text-field
            :disabled="!toggleDisable"
            label="Line"
            v-model="line"
        ></v-text-field>
            </v-col> -->
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
          <td>{{ item.sublinename }}</td>
          <td>{{ item.machinename }}</td>
          <td>{{ item.substationname }}</td>
          <td>{{ item.process }}</td>
          <td>{{ item.amtpresubstation }}</td>
          <td>{{ item.prestationname }}</td>
          <td>{{ item.presubstationname }}</td>
          <td>{{ item.presubline }}</td>
          <td v-if="item.editedtime">{{ new Date(item.editedtime).toLocaleString() }}</td>
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
        <!-- <v-text-field
            :disabled="saving"
            label="Sub-Station name"
            prepend-icon="mdi-tray-plus"
            v-model="roadmapDetail.substationname"
        ></v-text-field> -->
        <v-select
          hide-details
          label="Select Subline name"
          :items="subLineList"
          item-text="name"
          prepend-icon="$production"
          :rules="rmdetailName"
          required
          v-model="roadmapDetail.sublinename"/>
        <v-select
          class="mt-2"
          hide-details
          label="Select Station name"
          :items="stationList"
          item-text="name"
          prepend-icon="$production"
          :rules="rmdetailStName"
          required
          v-model="roadmapDetail.machinename"/>
        <v-select
          class="mt-2"
          hide-details
          label="Select Sub-Station name"
          :items="subStationList"
          item-text="name"
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
        <!-- <v-text-field
            :disabled="saving"
            label="Pre-Substation name"
            prepend-icon="mdi-tray-plus"
            v-model="roadmapDetail.presubstationname"
        ></v-text-field> -->
        <v-select
          class="mt-2"
          hide-details
          label="Select Pre-Station name"
          :items="stationList"
          item-text="name"
          prepend-icon="$production"
          v-model="roadmapDetail.prestationname"/>
        <v-select
          hide-details
          label="Select Pre-Substation name"
          :items="subStationList"
          item-text="name"
          prepend-icon="$production"
          :disabled="fieldDisabled"
          v-model="roadmapDetail.presubstationname"/>
        <!-- <v-text-field
            :disabled="saving"
            label="Station name"
            prepend-icon="mdi-tray-plus"
            v-model="roadmapDetail.machinename"
        ></v-text-field> -->
        <!-- <v-text-field
            :disabled="saving"
            label="Pre-Station name"
            prepend-icon="mdi-tray-plus"
            v-model="roadmapDetail.prestationname"
        ></v-text-field> -->
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
        { text: 'Previous station', value: 'prestationname' },
        { text: 'Pre-Substation name', value: 'presubstationname' },
        { text: 'Previous subline', value: 'presubline' },
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
    await this.getSubStationList('');
    await this.getStationList('');
    await this.getSubLineList('');
  },
  computed: {
    ...mapState('roadmapManagement', ['roadmapDetails',
      'subStationList',
      'stationList',
      'subLineList',
      'productList']),
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
      'updateRoadmap',
      'deleteRoadmapDetails',
      'updateRoadmapDetails',
      'createProductDetails',
      'getProductListFromRoadmapName']),
    ...mapMutations('helper', ['setAlert']),
    async checkProcessCode() {
      debugger;
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
    async fnAddRoadmapDetails() {
      debugger;
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
          editedtime: new Date().getTime(),
        };
        await this.updateRoadmapDetails({
          payload: this.roadmapDetail,
          query: `?query=id==${this.itemToUpdate.id}`,
        });
        await this.getDetailsRecords(`?query=roadmapid=="${this.$route.params.id.id}"`);
        this.dialog = false;
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
        // this.roadmapDetail = {};
          this.roadmapDetail = {
            ...this.roadmapDetail,
            assetid: 4,
            roadmapid: this.$route.params.id.id,
          };
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
            // this.roadmapDetail = {};
            await this.getProductListFromRoadmapName(`?query=roadmapname=="${this.$route.params.id.name}"`);
            if (this.productList.length) {
              this.productList.forEach(async (products) => {
                const object = {
                  productname: products.productname,
                  productnumber: products.productnumber,
                  sublinename: this.roadmapDetail.sublinename,
                  sublineid: this.roadmapDetail.sublineid,
                  stationname: this.roadmapDetail.machinename,
                  stationid: this.roadmapDetail.stationid,
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
  },
};
</script>
