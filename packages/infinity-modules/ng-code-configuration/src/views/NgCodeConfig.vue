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
          <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
            <v-icon small left>mdi-filter-variant</v-icon>
            {{ $t('displayTags.buttons.filtersRecipe') }}
          </v-btn>
        </v-toolbar>
        <v-data-table
        v-model="recipes"
        :headers="headers"
        :items="recipeList"
        item-key="recipenumber"
        show-select
        >
        <template v-slot:item="{ item, index }">
          <tr>
          <td>
            <v-checkbox
            v-model="recipes"
            :value ="item"
            primary
            hide-details
            @change="check($event)"
            ></v-checkbox>
          </td>
          <td>{{ index+1 }}</td>
          <td>{{ item.line }}</td>
          <td>{{ item.subline }}</td>
          <td>{{ item.machinename }}</td>
          <td @click="handleClick(item)"><a>{{ item.recipename }}</a></td>
          <td>{{ item.recipenumber}}</td>
          <td>{{ item.versionnumber }}</td>
          <td>{{ item.createdTimestamp }}</td>
          <td>{{ item.createdby }}</td>
          <td v-if="item.editedtime">{{ new Date(item.editedtime).toLocaleString() }}</td>
          <td v-else></td>
          <td>{{ item.editedby }}</td>
          <td><v-row><v-btn
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
          v-model="input.sublinename"
          :items="sublinesbylines"
          :disabled="saving"
          item-value="name"
          item-text="name"
          prepend-icon="$production"
          label="Select SubLine"/>
        <v-text-field
            label="NG Code"
            prepend-icon="mdi-tray-plus"
            type="number"
            v-model="ngConfigInput.ngcode"
        ></v-text-field>
        <v-select
          v-model="input.subStationname"
          :items="subStations"
          :disabled="saving"
          item-value="name"
          item-text="name"
          prepend-icon="$production"
          label="Select Sub-Station"/>
        <v-select
          v-model="input.processNgcode"
          :items="processNgcode"
          :disabled="saving"
          item-value="name"
          item-text="name"
          prepend-icon="$production"
          label="Process NG Code"/>
        <!-- <v-autocomplete
          clearable
          label="Select Sub-Line name"
          :items="subLineList"
          return-object
          :disabled="saving"
          item-text="name"
          v-model="subLineSelected"
          :loading="loadingParts"
          prepend-icon="$production"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete> -->
        <v-select
          v-model="input.machinename"
          :items="roadMaps"
          :disabled="saving"
          item-value="name"
          item-text="name"
          prepend-icon="$production"
          label="Select Rework roadmap"/>
        <v-text-field
            label="NG Description"
            prepend-icon="mdi-tray-plus"
            v-model="ngConfigInput.description"
        ></v-text-field>
        <v-text-field
            label="Rework Description"
            prepend-icon="mdi-tray-plus"
            v-model="ngConfigInput.reworkDescription"
        ></v-text-field>
        <!-- <v-autocomplete
          clearable
          label="Select Station name"
          :items="stationList"
          return-object
          :disabled="saving"
          item-text="name"
          v-model="stationSelected"
          :loading="loadingParts"
          prepend-icon="$production"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
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

export default {
  name: 'NgCodeConfig',
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
        {
          text: 'Sub-Station',
          value: 'substation',
        },
        { text: 'Process NG code', value: 'processngcode' },
        {
          text: 'Reworkable',
          value: 'reworkable',
        },
        {
          text: 'Rework roadmap',
          value: 'reworkroadmap',
        },
        {
          text: 'NG description',
          value: 'ngdescription',
        },
        { text: 'Rework description', value: 'reworkdescription' },
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
      ngConfigInput: {},
      input: {
        sublinename: '',
        machinename: '',
        subStationname: '',
        processNgcode: '',
      },
      processNgcode: [true, false],
    };
  },
  async created() {
    this.getSublines('');
    this.getStationbyline();
    // const success = await this.getLines();
    // if (success) {
    //   [this.selectedLine] = this.lines;
    // }
  },
  computed: {
    ...mapState('reworkOperation', ['lines', 'sublines', 'subStations', 'roadMaps', 'sublinesbylines', 'selectedLine']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('ngCodeConfiguration', ['setSelectedLine', 'toggleFilter']),
    ...mapActions('ngCodeConfiguration', ['getLines', 'getSublines', 'getSubStations', 'getroadMaps', 'getSublinebyline']),

    addNewNGCode() {
      this.dialog = true;
    },
    async getfilteredSubline(item) {
      debugger;
      await this.getSublinebyline(`?query=lineid==${item.id}`);
      console.log(this.sublinesbylines);
    },
    async RefreshUI() {
      this.getLines('');
    },
    async saveNgConfig() {
      debugger;
      if (!this.selectedLinenew) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'Select Line',
        });
      } else {
        this.saving = true;
        this.newNgConfig = {
          ...this.ngConfigInput,
          ...this.input,
          lineid: this.selectedLinenew.id,
          assetid: this.assetId,
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
          this.assetId = 4;
          this.newNgConfig = {};
          // this.$refs.form.reset();
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
  },
};
</script>
