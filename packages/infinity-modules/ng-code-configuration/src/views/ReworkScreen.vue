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
        <v-row justify="left"
        class="mt-10">
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
            label="Enter Query ID"
            v-model="line"
        ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
            label="Subline"
            v-model="subline"
        ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
            label="Station name"
            v-model="machinename"
        ></v-text-field>
            </v-col>
            </v-row>
        <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table
        class="mt-2"
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
          Recipe
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="input.sublinename"
          :items="subLineList"
          :disabled="saving"
          item-value="name"
          item-text="name"
          prepend-icon="$production"
          label="Select Sub-Line name"/>
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
          :items="stationList"
          :disabled="saving"
          item-value="name"
          item-text="name"
          prepend-icon="$production"
          label="Select Station name"/>
        <v-text-field
            label="Recipe Name"
            prepend-icon="mdi-tray-plus"
            v-model="recipe.recipename"
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
          @click="saveRecipe"
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
// import { mapActions, mapState, mapMutations } from 'vuex';

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
          text: 'Date',
          value: 'reworkdate',
        },
        {
          text: 'Query ID',
          value: 'queryid',
        },
        { text: 'NG Code', value: 'ngcode' },
        {
          text: 'Reworkable',
          value: 'reworkable',
        },
        {
          text: 'NG Description',
          value: 'ngdescription',
        },
        {
          text: 'Status',
          value: 'status',
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
      input: {
        sublinename: '',
        machinename: '',
      },
    };
  },
  created() {
  },
  computed: {
  },
  methods: {
  },
};
</script>
