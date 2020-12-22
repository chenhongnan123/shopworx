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
        <v-btn small color="primary" class="text-none ml-2" @click="addNewNGCode">
            <v-icon small left>mdi-plus</v-icon>
            {{ $t('displayTags.buttons.addNewRecipe') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            {{ $t('displayTags.buttons.refreshRecipe') }}
          </v-btn>
        </v-toolbar>
        <v-data-table
        v-model="recipes"
        :headers="headers"
        :items="ngCodeConfigRecord"
        item-key="id"
        >
        <template #item="{ item, index }">
          <tr>
          <td>{{ index+1 }}</td>
          <td>{{ item.ngcode }}</td>
          <td>{{ item.processngcode }}</td>
          <td>{{ item.reworkable}}</td>
          <td>{{ item.ngdescription }}</td>
          <td>{{ item.createdby }}</td>
          <td>{{ item.createdTimestamp }}</td>
          <td>{{ item.editedby }}</td>
          <td v-if="item.editedtime">{{ new Date(item.editedtime).toLocaleString("EN-US") }}</td>
          <td v-else></td>
          <td><v-row><v-btn
              icon
              small
              color="primary"
              @click="fnUpdateNgCode(item)"
              :loading="deleting"
            >
              <v-icon v-text="'$edit'"></v-icon>
            </v-btn>
            <DeleteNgCode  :item="item" />
            </v-row></td>
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
        <span>
          NG Code
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
         <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
        <v-select
          v-model="selectedLinenew"
          :items="lines"
          :disabled="saving"
          item-value="name"
          item-text="name"
          return-object
          prepend-icon="$production"
          label="Select Line"
          @change="getfilteredSubline"/>
        <v-select
          v-model="ngConfigInput.sublinename"
          :items="sublinesbylines"
          :disabled="saving"
          item-text="name"
          return-object
          prepend-icon="$production"
          label="Select SubLine"
          @change="getfilteredSubstation"/>
        <v-text-field
            label="NG Code"
            prepend-icon="mdi-tray-plus"
            type="number"
            v-model="ngConfigInput.ngcode"
            :rules="rules.ngcode"
            :counter="6"
        ></v-text-field>
        <v-select
          v-model="ngConfigInput.processNgcode"
          :items="processNgcode"
          :disabled="saving"
          item-value="name"
          item-text="name"
          prepend-icon="$production"
          label="Process NG Code"/>
           <v-select
          v-model="ngConfigInput.reWorkable"
          :items="reWorkable"
          :disabled="saving"
          return-object
          item-value="name"
          item-text="name"
          prepend-icon="$production"
          label="Reworkable"/>
        <v-text-field
            label="NG Description"
            prepend-icon="mdi-tray-plus"
            v-model="ngConfigInput.description"
        ></v-text-field>
         </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!valid"
          @click="saveNgConfig"
        >
          {{ $t('displayTags.buttons.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    scrollable
    persistent
    v-model="updateDialog"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          Update Ng Code
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="updateDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="formUpdate"
          v-model="valid"
          lazy-validation
        >
        <v-select
          v-model="newNgCode.selectedLinenew"
          :items="lines"
          :disabled="saving"
          item-value="name"
          item-text="name"
          return-object
          prepend-icon="$production"
          label="Select Line"
          @change="getfilteredSubline"/>
        <v-select
          v-model="newNgCode.sublinename"
          :items="sublinesbylines"
          :disabled="saving"
          item-text="name"
          return-object
          prepend-icon="$production"
          label="Select SubLine"
          @change="getfilteredSubstation"/>
        <v-text-field
            label="NG Code"
            prepend-icon="mdi-tray-plus"
            type="number"
            v-model="newNgCode.ngcode"
        ></v-text-field>
        <v-select
          v-model="newNgCode.processNgcode"
          :items="processNgcode"
          :disabled="saving"
          prepend-icon="$production"
          label="Process NG Code"/>
          <v-select
          v-model="newNgCode.reWorkable"
          :items="reWorkable"
          return-object
          :disabled="saving"
          prepend-icon="$production"
          label="Reworkable"/>
        <v-text-field
            label="NG Description"
            prepend-icon="mdi-tray-plus"
            v-model="newNgCode.description"
        ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          @click="updateSaveNgConfig"
        >
          {{ $t('displayTags.buttons.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    scrollable
    persistent
    v-model="dialogDup"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          {{ $t('displayTags.duplicate_title') }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialogDup = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
            :disabled="saving"
            label="Recipe Name"
            prepend-icon="mdi-tray-plus"
            v-model="dupRecipeName"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          @click="fnSaveDuplicateRecipe"
        >
          {{ $t('displayTags.buttons.save') }}
        </v-btn>
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
import DeleteNgCode from '../components/DeleteNgCode.vue';

export default {
  name: 'NgCodeConfig',
  components: {
    DeleteNgCode,
  },
  data() {
    return {
      headers: [
        {
          text: 'No.',
          value: 'number',
        },
        {
          text: 'NG Code',
          value: 'ngcode',
        },
        { text: 'Process NG code', value: 'processngcode' },
        {
          text: 'Reworkable',
          value: 'reworkable',
        },
        {
          text: 'NG description',
          value: 'ngdescription',
        },
        { text: 'Created By', value: 'createdby' },
        { text: 'Created time', value: 'createdTimestamp' },
        { text: 'Edited By', value: 'editedby' },
        { text: 'Edited time', value: 'editedtime' },
        {
          text: 'Actions',
          align: 'start',
          sortable: false,
          value: 'actions',
        },
      ],
      selectedLinenew: null,
      assetId: null,
      visible: false,
      updateDialog: false,
      dialog: false,
      dialogDup: false,
      dialogConfirm: false,
      dupRecipeName: null,
      newNgCode: {},
      recipe: {},
      recipes: [],
      saving: false,
      hover: true,
      lineSelected: null,
      subLineSelected: null,
      stationSelected: null,
      showLineFilter: true,
      flagNewUpdate: false,
      updateRecipeNumber: '',
      editedVersionNumber: 0,
      updateNgCodeId: 0,
      itemForDelete: null,
      ngConfigInput: {
        sublinename: '',
        roadmap: '',
        subStationname: '',
        processNgcode: '',
        reWorkable: '',
      },
      processNgcode: ['true', 'false'],
      reWorkable: [true, false],
      valid: true,
      rules: {
        ngcode: [
          (v) => !!v || 'NG Code is required (digits)',
          (v) => v >= 0 || 'NG Code is bigger than 0',
          (v) => (v && v.length <= 6) || 'NG Code must be less than 7 Digits',
        ],
      },
    };
  },
  async created() {
    this.getAssets();
    this.getLines('');
    this.getSublinebyline('');
    this.getSubstationbySubline('');
    this.getNgCodeConfig('');
    this.getroadMapsList('');
  },
  computed: {
    ...mapState('ngCodeConfiguration', ['lines', 'sublines', 'subStations', 'roadMaps', 'sublinesbylines', 'selectedLine', 'subStationbySubline', 'ngCodeConfigRecord', 'assets']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('ngCodeConfiguration', ['setSelectedLine', 'toggleFilter']),
    ...mapActions('ngCodeConfiguration', ['getLines', 'getSublines', 'getSubStations', 'getroadMaps', 'getSublinebyline', 'getSubstationbySubline', 'createNgConfig', 'getNgCodeConfig', 'getroadMapsList', 'updateNgConfig', 'getAssets']),

    addNewNGCode() {
      this.dialog = true;
    },
    async getfilteredSubline(item) {
      await this.getSublinebyline(`?query=lineid==${item.id}`);
    },
    async getfilteredSubstation(item) {
      await this.getSubstationbySubline(`?query=sublineid=="${item.id}"`);
    },
    async RefreshUI() {
      this.getNgCodeConfig('');
    },
    async saveNgConfig() {
      let ngNumberFlag = [];
      if (this.ngCodeConfigRecord.lenght > 0) {
        ngNumberFlag = this.ngCodeConfigRecord
          .filter((o) => o.ngcode === parseInt(this.ngConfigInput.ngcode, 10));
      }
      if (!this.selectedLinenew) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_LINE',
        });
      } else if (ngNumberFlag.length > 0) {
        this.ngConfigInput.ngcode = '';
        this.setAlert({
          show: true,
          type: 'error',
          message: 'NG_CODE_PRESENT',
        });
      } else if (!this.ngConfigInput.sublinename) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_SUBLINE',
        });
      } else {
        this.saving = true;
        const getAssetId = this.assets.reduce((acc, item) => acc + item.id, 0);
        this.assetId = getAssetId;
        this.newNgConfig = {
          ngcode: this.ngConfigInput.ngcode,
          processngcode: this.ngConfigInput.processNgcode,
          reworkable: this.ngConfigInput.reWorkable,
          lineid: this.selectedLinenew.id,
          linename: this.selectedLinenew.name,
          assetid: this.assetId,
          sublinename: this.ngConfigInput.sublinename.name,
          sublineid: this.ngConfigInput.sublinename.id,
          ngdescription: this.ngConfigInput.description,
          createdby: this.userName,
        };
        let created = false;
        const payload = this.newNgConfig;
        created = this.createNgConfig(payload);
        if (created) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'NG_CONFIGURATION_CREATED',
          });
          this.dialog = false;
          this.assetId = this.getAssetId;
          this.newNgConfig = {};
          this.ngConfigInput = {};
          this.$refs.form.reset();
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_CREATING_NG_CONFIG',
          });
        }
        this.saving = false;
      }
    },
    async fnDeleteOnYes() {
      // console.log('write code for delete the record');
    },
    async fnSaveDuplicateRecipe() {
      // console.log('write code for create Duplicate the record');
    },
    async fnUpdateNgCode(item) {
      this.updateDialog = true;
      this.updateNgCodeId = item._id;
      this.newNgCode.selectedLinenew = item.linename;
      this.newNgCode.sublinename = item.sublinename;
      this.newNgCode.processNgcode = item.processngcode;
      this.newNgCode.reWorkable = item.reworkable;
      this.newNgCode.ngcode = item.ngcode;
      this.newNgCode.description = item.ngdescription;
    },
    async updateSaveNgConfig() {
      if (!this.newNgCode.selectedLinenew) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_LINE',
        });
      } else {
        this.saving = true;
        const getAssetId = this.assets.reduce((acc, item) => acc + item.id, 0);
        this.assetId = getAssetId;
        this.newNgConfig = {
          ngcode: this.newNgCode.ngcode,
          processngcode: this.newNgCode.processNgcode,
          reworkable: this.newNgCode.reWorkable,
          linename: this.newNgCode.selectedLinenew,
          assetid: this.assetId,
          sublinename: this.newNgCode.sublinename,
          ngdescription: this.newNgCode.description,
          editedby: this.userName,
          editedtime: new Date().getTime(),
        };
        let created = false;
        const request = this.newNgConfig;
        const object = {
          payload: request,
          query: this.updateNgCodeId,
        };
        created = this.updateNgConfig(object);
        if (created) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'NG_CONFIGURATION_UPDATED',
          });
          this.updateDialog = false;
          this.assetId = this.getAssetId;
          this.newNgConfig = {};
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_UPDATING_NG_CONFIG',
          });
        }
        this.saving = false;
      }
    },
  },
};
</script>
