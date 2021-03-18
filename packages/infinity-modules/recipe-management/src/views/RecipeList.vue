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
        <div v-if="filterLine.name != null">
          <span :style="{ cursor: 'pointer'}" @click="toggleFilter">
          {{ $t('displayTags.lineName') }}</span>
        <v-btn small color="info" outlined class="text-none ml-1" @click="fnLineModel">
            <v-icon small left
            >mdi-close</v-icon>
            {{filterLine.name}}
          </v-btn>
        </div>
        <div v-if="filterSubLine.name != null" class="text-none ml-2">
          <v-btn text
          v-if="chipforSubline"
         >
         {{ $t('displayTags.sublineName') }}
         </v-btn>
          <v-chip
            v-if="chipforSubline"
            class="ma-2"
            close
            close-icon="mdi-close"
            color="info"
            label
            outlined
            @click:close="(chipforSubline = false); btnReset();"
           >
           {{filterSubLine.name}}
         </v-chip>
        </div>
        <div v-if="filterStation.name != null" class="text-none ml-2">
          <v-btn text
          v-if="chipforStation"
         >
           {{ $t('displayTags.stationName') }}
         </v-btn>
          <v-chip
            v-if="chipforStation"
            class="ma-2"
            close
            close-icon="mdi-close"
            color="info"
            label
            outlined
            @click:close="(chipforStation = false); btnReset();"
           >
           {{filterStation.name}}
         </v-chip>
        </div>
        <div v-if="filterRecipe.recipename != null" class="text-none ml-2">
          <v-btn text
          v-if="chipforRecipe"
         >
           {{ $t('displayTags.recipeName') }}
         </v-btn>
          <v-chip
            v-if="chipforRecipe"
            class="ma-2"
            close
            close-icon="mdi-close"
            color="info"
            label
            outlined
            @click:close="(chipforRecipe = false); btnReset();"
           >
           {{filterRecipe.recipename}}
         </v-chip>
        </div>
        <v-spacer></v-spacer>
        <!-- <v-btn small color="primary" class="text-none ml-2"> -->
                        <AddRecipe ref="addUpdateRecipe"/>
            <!-- {{ $t('displayTags.buttons.addNewRecipe') }} -->
          <!-- </v-btn> -->
          <v-btn v-if="recipes.length > 0"
          small color="primary" outlined class="text-none ml-2" @click="fnCreateDupRecipe">
            <v-icon small left>mdi-content-duplicate</v-icon>
            {{ $t('duplicateRecipe') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2"
            @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            {{ $t('refreshRecipe') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
            <v-icon small left>mdi-filter-variant</v-icon>
            {{ $t('filtersRecipe') }}
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>
        <v-data-table
        v-model="recipes"
        :headers="headers"
        :items="recipeList"
        item-key="recipenumber"
        :single-select="true"
        show-select
        fixed-header
        :height="tableHeight - 168"
        >
        <!-- eslint-disable-next-line -->
        <template v-slot:item.recipename="{ item }">
          <span @click="handleClick(item)"><a>{{ item.recipename }}</a></span>
        </template>
        <!-- eslint-disable-next-line -->
        <template v-slot:item.editedtime="{ item }">
          <span v-if="item.editedtime">
            {{ new Date(item.editedtime).toLocaleString("en-GB") }}</span>
          <span v-else></span>
        </template>
        <!-- eslint-disable-next-line -->
        <template v-slot:item.actions="{ item }">
          <v-row><v-btn
              icon
              small
              color="primary"
              @click="fnUpdateRecipe(item)"
              :loading="deleting"
            >
              <v-icon v-text="'$edit'"></v-icon>
            </v-btn>
            <v-btn
              icon
              small
              color="error"
              @click="deleteRecipe(item)"
              :loading="deleting"
            >
              <v-icon v-text="'$delete'"></v-icon>
            </v-btn></v-row>
        </template>
      </v-data-table>
    <!-- <AddRecipe /> -->
  <v-dialog
    scrollable
    persistent
    v-model="dialogDup"
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
            :rules="nameRules"
            :counter="10"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!valid"
          @click="fnSaveDuplicateRecipe"
        >
          {{ $t('displayTags.buttons.save') }}
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
import AddRecipe from '../components/Addrecipe.vue';

export default {
  name: 'RecipeList',
  components: {
    AddRecipe,
  },
  data() {
    return {
      sublines: null,
      stations: null,
      recipesfilter: null,
      deleting: false,
      headers: [
        {
          text: 'No.',
          value: 'numberIndex',
        },
        {
          text: 'Line',
          value: 'linename',
        },
        {
          text: 'Sub-Line',
          value: 'sublinename',
        },
        { text: 'Station name', value: 'stationname' },
        { text: 'Sub-Station name', value: 'substationname' },
        {
          text: 'Recipe',
          value: 'recipename',
        },
        {
          text: 'Recipe number',
          value: 'recipenumber',
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
          align: 'start',
          sortable: false,
          value: 'actions',
        },
      ],
      chipforSubline: true,
      chipforStation: true,
      chipforRecipe: true,
      visible: false,
      dialog: false,
      dialogDup: false,
      dialogConfirm: false,
      dupRecipeName: null,
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
      itemForDelete: null,
      tableHeight: window.innerHeight,
      valid: true,
      recipename: '',
      nameRules: [(v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters not Allowed',
        (v) => !!v || 'Name required',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'],
      input: {
        linename: '',
        sublinename: '',
        stationname: '',
        substationname: '',
      },
    };
  },
  async created() {
    this.setExtendedHeader(true);
    await this.getRecipeListRecords('');
  },
  async mounted() {
    this.$root.$on('filteredSubline', (data) => {
      this.sublines = data;
    });
    this.$root.$on('filteredStation', (data) => {
      this.stations = data;
    });
    this.$root.$on('filteredRecipe', (data) => {
      this.recipesfilter = data;
    });
  },
  async beforeDestroy() {
    await this.btnReset();
    this.chipforSubline = false;
  },
  computed: {
    ...mapState('recipeManagement', ['recipeList', 'stationList',
      'lineList', 'subLineList', 'filterLine', 'filterSubLine',
      'filterStation', 'subStationList', 'filterRecipe']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
  },
  methods: {
    ...mapActions('recipeManagement', ['getRecipeListRecords', 'createRecipe', 'updateRecipe', 'deleteRecipeByRecipeNumber', 'btnReset', 'btnApply']),
    ...mapActions('recipeManagement',
      ['getRecipeListRecords',
        'createRecipe',
        'updateRecipe',
        'deleteRecipeByRecipeNumber',
        'getSubLines',
        'getStations',
        'getSubStations']),
    ...mapMutations('helper', ['setAlert', 'setExtendedHeader']),
    ...mapMutations('recipeManagement', ['toggleFilter', 'setFilterLine', 'setFilterSubLine', 'setFilterStation']),
    async handleLineClick(item) {
      const query = `?query=lineid==${item.id}`;
      await this.getSubLines(query);
    },
    async handleSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getStations(query);
    },
    async handleStationClick(item) {
      const query = `?query=stationid=="${item.id}"`;
      await this.getSubStations(query);
    },
    addNewRecipe() {
      this.dialog = true;
      this.flagNewUpdate = false;
    },
    async RefreshUI() {
      let param = '';
      if (this.sublines && !this.stations) {
        param += `?query=sublineid=="${this.sublines.id || null}"`;
      }
      if (this.stations && !this.sublines) {
        param += `?query=stationid=="${this.stations.id || null}"`;
      }
      if (this.sublines && this.stations) {
        param += `?query=sublineid=="${this.sublines.id}%26%26stationid==${this.stations.id}"`;
      }
      await this.getRecipeListRecords(param);
    },
    handleClick(value) {
      this.$router.push({
        name: 'recipe-details',
        params: {
          id: value.recipenumber,
          versionnumber: value.versionnumber,
          lineid: value.lineid,
          linename: value.linename,
          sublineid: value.sublineid,
          sublinename: value.sublinename,
          substationname: value.substationname,
          recipename: value.recipename,
        },
      });
    },
    fnLineModel() {
      this.showLineFilter = false;
    },
    async fnSaveDuplicateRecipe() {
      if (!this.dupRecipeName) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'RECIPE_NAME_EMPTY',
        });
      } else {
        const recipeFlag = this.recipeList.filter((o) => o.recipename === this.dupRecipeName);
        if (recipeFlag.length > 0) {
          this.recipe.recipename = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_RECIPE',
          });
        } else {
          this.recipe = {
            recipename: this.dupRecipeName,
            linename: this.recipes[0].linename,
            lineid: this.recipes[0].lineid,
            sublinename: this.recipes[0].sublinename,
            sublineid: this.recipes[0].sublineid,
            stationid: this.recipes[0].stationid,
            stationname: this.recipes[0].stationname,
            substationid: this.recipes[0].substationid,
            substationname: this.recipes[0].substationname,
            versionnumber: 1,
            assetid: 4,
            createdby: this.userName,
          };
          let created = false;
          const payload = this.recipe;
          created = await this.createRecipe(payload);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'RECIPE_CREATED',
            });
            this.dialogDup = false;
            this.dupRecipeName = null;
            this.recipe = {};
            this.recipes = [];
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_RECIPE',
            });
          }
        }
      }
    },
    fnCreateDupRecipe() {
      if (this.recipes.length > 0) {
        this.dialogDup = true;
        this.saving = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_RECIPE_FIRST',
        });
      }
    },
    fnUpdateRecipe(item) {
      this.$refs.addUpdateRecipe.dialog = true;
      this.$refs.addUpdateRecipe.saving = true;
      this.$refs.addUpdateRecipe.flagNewUpdate = true;
      this.$refs.addUpdateRecipe.input.linename = item.linename;
      this.$refs.addUpdateRecipe.input.sublinename = item.sublinename;
      this.$refs.addUpdateRecipe.updateRecipeNumber = item.recipenumber;
      this.$refs.addUpdateRecipe.lineSelected = this.lineList;
      this.$refs.addUpdateRecipe.editedVersionNumber = item.versionnumber;
      this.$refs.addUpdateRecipe.recipe.recipename = item.recipename;
      this.$refs.addUpdateRecipe.input.stationname = item.stationname;
      this.$refs.addUpdateRecipe.input.substationname = item.substationname;
      this.$refs.addUpdateRecipe.input.substationid = item.substationid;
      this.recipes = [];
      this.getSubLines('');
      this.getStations('');
      this.getSubStations('');
    },
    deleteRecipe(item) {
      this.dialogConfirm = true;
      this.itemForDelete = item;
      this.recipes = [];
    },
    fnDeleteOnYes() {
      let deleted = false;
      deleted = this.deleteRecipeByRecipeNumber(this.itemForDelete.recipenumber);
      if (deleted) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'RECIPE_RECORD_DELETED',
        });
        this.dialogConfirm = false;
        this.recipes = {};
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_RECIPE',
        });
      }
      this.dialogConfirm = false;
    },
    // async saveRecipe() {
    //   if (!this.recipe.recipename) {
    //     this.setAlert({
    //       show: true,
    //       type: 'error',
    //       message: 'RECIPE_NAME_EMPTY',
    //     });
    //   } else {
    //     const recipeFlag = this.recipeList.filter((o) => o.recipename === this.recipe.recipename
    //     && o.machinename === this.input.machinename);
    //     //  && !this.flagNewUpdate
    //     if (recipeFlag.length > 0) {
    //       this.recipe.recipename = '';
    //       this.setAlert({
    //         show: true,
    //         type: 'error',
    //         message: 'ALREADY_EXSIST_RECIPE',
    //       });
    //     } else if (this.flagNewUpdate) {
    //       // update recipe
    //       this.saving = true;
    //       this.recipe = {
    //         ...this.recipe,
    //         line: 'Line1',
    //         subline: this.input.sublinename,
    //         machinename: this.input.machinename,
    //         editedby: 'admin',
    //         editedtime: new Date().getTime(),
    //         versionnumber: this.editedVersionNumber + 1,
    //       };
    //       let created = false;
    //       const request = this.recipe;
    //       const object = {
    //         payload: request,
    //         query: `?query=recipenumber=="${this.updateRecipeNumber}"`,
    //       };
    //       created = await this.updateRecipe(object);
    //       if (created) {
    //         this.setAlert({
    //           show: true,
    //           type: 'success',
    //           message: 'RECIPE_UPDATED',
    //         });
    //         this.dialog = false;
    //         this.recipe = {};
    //       } else {
    //         this.setAlert({
    //           show: true,
    //           type: 'error',
    //           message: 'ERROR_UPDATING_RECIPE',
    //         });
    //       }
    //       this.saving = false;
    //     } else {
    //       // add new recipe
    //       this.saving = true;
    //       this.recipe = {
    //         ...this.recipe,
    //         line: 'Line1',
    //         subline: this.input.sublinename,
    //         versionnumber: 1,
    //         assetid: 4,
    //         machinename: this.input.machinename,
    //         createdby: 'admin',
    //       };
    //       let created = false;
    //       const payload = this.recipe;
    //       created = await this.createRecipe(payload);
    //       if (created) {
    //         this.setAlert({
    //           show: true,
    //           type: 'success',
    //           message: 'RECIPE_CREATED',
    //         });
    //         this.dialog = false;
    //         this.recipe = {};
    //       } else {
    //         this.setAlert({
    //           show: true,
    //           type: 'error',
    //           message: 'ERROR_CREATING_RECIPE',
    //         });
    //       }
    //       this.saving = false;
    //     }
    //   }
    // },
    async btnReset() {
      await this.getRecipeListRecords('');
      // this.setRecipeList(this.filterBList);
      this.sublines = [];
      this.stations = [];
      this.setFilterSubLine(this.sublines);
      this.setFilterStation(this.stations);
    },
  },
  async btnApply() {
    if (this.sublines != null) {
      this.setFilterSubLine(this.sublines);
      const newarray = this.filterBList.filter((o) => o.subline === this.sublines.name);
      this.setRecipeList(newarray);
      if (this.stations != null) {
        this.setFilterStation(this.stations);
        this.setRecipeList(this.newarray.filter((o) => o.machinename === this.stations.name));
      }
    } else if (this.stations != null) {
      this.setFilterStation(this.stations);
      this.setRecipeList(this.filterBList.filter((o) => o.machinename === this.stations.name));
    } else if (this.recipesfilter != null) {
      this.setRecipeList(this.filterBList.filter(
        (o) => o.recipename === this.recipesfilter.recipename,
      ));
    }
    this.toggleFilter();
  },
};
</script>
