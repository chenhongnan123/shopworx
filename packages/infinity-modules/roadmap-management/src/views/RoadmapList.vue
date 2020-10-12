<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
        <v-spacer></v-spacer>
        <!-- <v-btn small color="primary" class="text-none" @click="addNewRoadmap">
            <v-icon small left>mdi-plus</v-icon>
            Add roadmap
          </v-btn> -->
          <AddRoadmapList />
          <v-btn v-if="roadmaps.length > 0"
            small color="primary" outlined class="text-none ml-2" @click="fnCreateDupRecipe">
            <v-icon small left>mdi-content-duplicate</v-icon>
            Duplicate
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            Refresh
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
            <v-icon small left>mdi-filter-variant</v-icon>
            Filters
          </v-btn>
        </v-toolbar>
        <v-data-table
        v-model="roadmaps"
        :headers="headers"
        :items="roadmapList"
        :single-select="true"
        item-key="id"
        show-select
        >
        <template v-slot:item.reworkdescription="{ item }">
          <v-tooltip top>
             <template v-slot:activator="{ on, attrs }">
               <v-btn
               text small
               v-bind="attrs"
                v-on="on"
              >{{ item.reworkdescription.substring(0,10)+"..." }}</v-btn>
             </template>
            <span>{{ item.reworkdescription }}</span>
            </v-tooltip>
        </template>
        <template v-slot:item.name="{ item }">
          <span @click="handleClick(item)"><a>{{ item.name }}</a></span>
        </template>
        <template v-slot:item.editedtime="{ item }">
          <span v-if="item.editedtime">{{ new Date(item.editedtime)
            .toLocaleString("en-GB") }}</span>
          <span v-else></span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-row justify="center"><v-btn
              icon
              small
              color="primary"
              @click="fnUpdateRoadmap(item)"
              :loading="deleting"
            >
              <v-icon v-text="'$edit'"></v-icon>
            </v-btn>
            <v-btn
              icon
              small
              color="error"
              @click="deleteRoadmapItem(item)"
              :loading="deleting"
            >
              <v-icon v-text="'$delete'"></v-icon>
            </v-btn></v-row>
        </template>
        <!-- <template v-slot:item="{ item, index }">
          <tr>
          <td>{{ index+1 }}</td>
          <td>{{ item.id}}</td>
          <td>{{ item.roadmaptype }}</td>
          <td>{{ item.versionnumber }}</td>
          <td>{{ item.createdTimestamp }}</td>
          <td>{{ item.createdby }}</td>
          <td>{{ item.editedby }}</td>
          <td><v-row justify="center"><v-btn
              icon
              small
              color="primary"
              @click="fnUpdateRoadmap(item)"
              :loading="deleting"
            >
              <v-icon v-text="'$edit'"></v-icon>
            </v-btn>
            <v-btn
              icon
              small
              color="error"
              @click="deleteRoadmapItem(item)"
              :loading="deleting"
            >
              <v-icon v-text="'$delete'"></v-icon>
            </v-btn></v-row></td>
          </tr>
        </template> -->
      </v-data-table>
      </v-col>
    </v-row>
  <v-dialog
    scrollable
    persistent
    v-model="dialogUpdate"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
  <v-form
    ref="formUpdate"
    v-model="validUpdate"
    lazy-validation>
    <v-card>
      <v-card-title primary-title>
        <span>
          Edit Roadmap
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="(dialogUpdate = false); updateDialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
            :disabled="saving"
            label="Roadmap name"
            prepend-icon="mdi-tray-plus"
            v-model="roadmap.name"
            :rules="updateRoadmNamerule"
            required
            :counter="10"
            @keyup="validName"
        ></v-text-field>
        <v-select
          hide-details
          label="Select Roadmap type"
          :items="roadmapTypeList"
          item-text="name"
          prepend-icon="$production"
          :rules="rMapTyperule"
          v-model="roadmap.roadmaptype"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          @click="updatesaveRoadmap"
          :disabled="!validUpdate"
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
    v-model="dialogDup"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
  <v-form
    ref="formduplicate"
    v-model="validDuplicate"
    lazy-validation>
    <v-card>
      <v-card-title primary-title>
        <span>
          Create Duplicate roadmap
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="(dialogDup = false); duplicateDialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
            :disabled="saving"
            label="roadmap Name"
            prepend-icon="mdi-tray-plus"
            v-model="dupRoadmapName"
            :rules="dupRoadmapNameRule"
            required
            :counter="10"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!validDuplicate"
          @click="fnSaveDuplicateRoadmap"
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
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import AddRoadmapList from '../components/AddRoadmapList.vue';

export default {
  name: 'RoadmapList',
  components: {
    AddRoadmapList,
  },
  data() {
    return {
      headers: [
        {
          text: 'No.',
          value: 'numberIndex',
        },
        {
          text: 'Roadmap name',
          value: 'name',
        },
        {
          text: 'Roadmap number',
          value: 'id',
        },
        {
          text: 'Roadmap type',
          value: 'roadmaptype',
        },
        {
          text: 'Rework description',
          value: 'reworkdescription',
        },
        {
          text: 'Version',
          value: 'versionnumber',
        },
        { text: 'Created time', value: 'createdTimestamp' },
        { text: 'Created By', value: 'createdby' },
        { text: 'Edited time', value: 'editedtime' },
        { text: 'Edited By', value: 'editedby' },
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'actions',
        },
      ],
      deleting: false,
      dialog: false,
      dialogUpdate: false,
      dialogConfirm: false,
      dialogDup: false,
      roadmap: {},
      roadmaps: [],
      saving: false,
      hover: true,
      lineSelected: null,
      subLineSelected: null,
      stationSelected: null,
      showLineFilter: true,
      itemForDelete: null,
      flagNewUpdate: false,
      updateRoadmapId: 0,
      editedVersionNumber: 0,
      validUpdate: true,
      valid: true,
      validupdate: true,
      validDuplicate: true,
      dupRoadmapName: '',
      name: '',
      roadmaptype: '',
      dupRoadmapNameRule: [(v) => !!v || 'Required RoadMap Name',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        (v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters ( including space ) not allowed'],
      updateRnamerule: [(v) => !!v || 'Required RoadMap Name',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        (v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters ( including space ) not allowed'],
      roadmapTyperule: [(v) => !!v || 'Selection Required'],
      updateRoadmNamerule: [(v) => !!v || 'Required RoadMap Name',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        (v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters ( including space ) not allowed'],
      rMapTyperule: [(v) => !!v || 'Selection Required'],
    };
  },
  async created() {
    await this.getRecords('');
    await this.getRoadmapTypeList('');
  },
  computed: {
    ...mapState('roadmapManagement', ['roadmapList', 'roadmapTypeList', 'createdRoadmap']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
  },
  methods: {
    ...mapActions('roadmapManagement', ['getRecords',
      'createRoadmap',
      'getRoadmapTypeList',
      'deleteRoadmapById',
      'updateRoadmap',
      'getDetailsRecords',
      'createBulkRoadmapDetails']),
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('roadmapManagement', ['toggleFilter']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
    deleteRoadmapItem(item) {
      this.dialogConfirm = true;
      this.itemForDelete = item;
    },
    fnDeleteOnYes() {
      let deleted = false;
      deleted = this.deleteRoadmapById(this.itemForDelete.id);
      if (deleted) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'ROADMAP_RECORD_DELETED',
        });
        this.dialog = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_ROADMAP',
        });
      }
      this.dialogConfirm = false;
    },
    fnUpdateRoadmap(item) {
      this.dialogUpdate = true;
      // this.saving = true;
      this.updateRoadmapId = item.id;
      this.flagNewUpdate = true;
      this.roadmap.name = item.name;
      this.editedVersionNumber = item.versionnumber;
      this.roadmap.roadmaptype = item.roadmaptype;
      this.roadmap.reworkdescription = item.reworkdescription;
    },
    // addNewRoadmap() {
    //   this.dialog = true;
    //   this.flagNewUpdate = false;
    // },
    async RefreshUI() {
      await this.getRecords('');
    },
    handleClick(value) {
      this.$router.push({ name: 'roadmap-details', params: { id: value } });
    },
    fnLineModel() {
      this.showLineFilter = false;
    },
    async fnSaveDuplicateRoadmap() {
      this.$refs.formduplicate.validate();
      if (!this.dupRoadmapName) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ROADMAP_NAME_EMPTY',
        });
      } else {
        const recipeFlag = this.roadmapList
          .filter((o) => o.name.toLowerCase().split(' ').join('') === this.dupRoadmapName.toLowerCase().split(' ').join(''));
        if (recipeFlag.length > 0) {
          this.roadmap.name = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_ROADMAP',
          });
        } else {
          this.roadmap = {
            name: this.dupRoadmapName,
            roadmaptype: this.roadmaps[0].roadmaptype,
            reworkdescription: this.roadmaps[0].reworkdescription,
            versionnumber: 1,
            assetid: 4,
            createdby: this.userName,
          };
          let created = false;
          const payload = this.roadmap;
          created = await this.createRoadmap(payload);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'ROADMAP_CREATED',
            });
            this.dialogDup = false;
            this.roadmap = {};
            this.$refs.formduplicate.reset();
            // duplicate also the details of selected row
            const roadmapDetailsList = await this.getDetailsRecords(`?query=roadmapid=="${this.roadmaps[0].id}"`);
            const payloadDetails = [];
            roadmapDetailsList.forEach((roadmapDetail) => {
              payloadDetails.push({
                lineid: roadmapDetail.lineid,
                linename: roadmapDetail.linename,
                sublinename: roadmapDetail.sublinename,
                sublineid: roadmapDetail.sublineid,
                machinename: roadmapDetail.machinename,
                stationid: roadmapDetail.stationid,
                substationname: roadmapDetail.substationname,
                substationid: roadmapDetail.substationid,
                process: roadmapDetail.process,
                amtpresubstation: roadmapDetail.amtpresubstation,
                presublineid: roadmapDetail.presublineid,
                presublinename: roadmapDetail.presublinename,
                prestationname: roadmapDetail.prestationname,
                prestationid: roadmapDetail.prestationid,
                presubstationname: roadmapDetail.presubstationname,
                presubstationid: roadmapDetail.presubstationid,
                assetid: 4,
                roadmapid: this.roadmapList[0].id,
                familyName: roadmapDetail.machinename,
              });
            });
            await this.createBulkRoadmapDetails(payloadDetails);
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_ROADMAP',
            });
          }
        }
      }
    },
    fnCreateDupRecipe() {
      if (this.roadmaps.length > 0) {
        this.dialogDup = true;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_ROADMAP_FIRST',
        });
      }
    },
    async updatesaveRoadmap() {
      this.$refs.formUpdate.validate();
      if (!this.roadmap.name) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ROADMAP_NAME_EMPTY',
        });
      } else if (!this.roadmap.roadmaptype) {
        this.roadmap.roadmaptype = '';
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ROADMAP_TYPE_NOT_SELECTED',
        });
      } else {
        if (this.flagNewUpdate) {
          this.saving = true;
          this.roadmap = {
            ...this.roadmap,
            editedby: this.userName,
            editedtime: new Date().getTime(),
            versionnumber: this.editedVersionNumber + 1,
          };
          let created = false;
          const request = this.roadmap;
          const object = {
            payload: request,
            query: `?query=id=="${this.updateRoadmapId}"`,
          };
          created = await this.updateRoadmap(object);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'ROADMAP_UPDATED',
            });
            this.dialogUpdate = false;
            this.roadmap = {};
            this.$refs.formUpdate.reset();
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_ROADMAP',
            });
          }
        }
        this.saving = false;
      }
    },
    async updateDialogReset() {
      this.$refs.formUpdate.reset();
    },
    async duplicateDialogReset() {
      this.$refs.formduplicate.reset();
    },
    async validName() {
      const roadmapFlag = this.roadmapList
        .filter((o) => o.name.toLowerCase().split(' ').join('') === this.roadmap.name.toLowerCase().split(' ').join(''));
      if (roadmapFlag.length > 0) {
        // this.roadmap.name = '';
        this.validUpdate = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST',
        });
      } else {
        // this.valid = true;
        this.validUpdate = true;
      }
    },
  },
};
</script>
