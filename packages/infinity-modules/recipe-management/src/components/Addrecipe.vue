<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
  <template v-slot:activator="{ on }">
    <v-btn v-on="on" small color="primary" class="text-none ml-2">
    <v-icon small left>mdi-plus</v-icon>
    {{ $t('displayTags.buttons.addNewRecipe') }}
    </v-btn>
    </template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
      <v-card-title primary-title>
        <span>
          Recipe
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); dialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="input.sublinename"
          :items="subLineList"
          :disabled="saving"
          item-text="name"
          return-object
          :rules="sublineSelect"
          required
          prepend-icon="$production"
          label="Select Sub-Line name"
          @change="getfilteredStationNames"/>
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
          :items="stationNamebySubline"
          :disabled="saving"
          item-value="name"
          item-text="name"
          :rules="stationSelect"
          required
          prepend-icon="$production"
          label="Select Station name"/>
        <v-text-field
            label="Recipe Name"
            prepend-icon="mdi-tray-plus"
            v-model="recipe.recipename"
            :rules="nameRules"
            :counter="10"
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
          :disabled="!valid"
          @click="saveRecipe"
        >
          {{ $t('displayTags.buttons.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'AddRecipe',
  data() {
    return {
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
      valid: true,
      sublinename: '',
      recipename: '',
      nameRules: [(v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters not Allowed',
        (v) => !!v || 'Name required',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'],
      sublineSelect: [(v) => !!v || 'required'],
      stationSelect: [(v) => !!v || 'required'],
      input: {
        sublinename: '',
        machinename: '',
      },
    };
  },
  computed: {
    ...mapState('recipeManagement', ['recipeList', 'stationList', 'lineList', 'subLineList', 'filterLine', 'filterSubLine', 'filterStation', 'stationNamebySubline']),
  },
  methods: {
    ...mapActions('recipeManagement', ['createRecipe', 'updateRecipe', 'getStationNamesbysubline']),
    ...mapMutations('helper', ['setAlert']),
    // ...mapMutations('recipeManagement', ['toggleFilter', 'setFilterLine']),
    async saveRecipe() {
      this.$refs.form.validate();
      const recipeNameFlag = this.recipeList
        .filter((rn) => rn.recipename.toLowerCase().split(' ').join('') === this.recipe.recipename.toLowerCase().split(' ').join(''));
      if (!this.recipe.recipename) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'RECIPE_NAME_EMPTY',
        });
      } else if (recipeNameFlag.length > 0) {
        this.recipe.recipename = '';
        this.setAlert({
          show: true,
          type: 'error',
          message: 'RECIPE_NAME_ALLREADY_EXISIST',
        });
      } else if (!this.input.sublinename) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'RECIPE_SUBLINE_NAME_EMPTY',
        });
      } else if (!this.input.machinename) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'RECIPE_STATION_NAME_EMPTY',
        });
      } else {
        const recipeFlag = this.recipeList.filter((o) => o.recipename === this.recipe.recipename
        && o.machinename === this.input.machinename);
        //  && !this.flagNewUpdate
        if (recipeFlag.length > 0) {
          this.recipe.recipename = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_RECIPE',
          });
        } else if (this.flagNewUpdate) {
          // update recipe
          this.saving = true;
          this.recipe = {
            ...this.recipe,
            line: 'Line1',
            subline: this.input.sublinename,
            machinename: this.input.machinename,
            editedby: 'admin',
            editedtime: new Date().getTime(),
            versionnumber: this.editedVersionNumber + 1,
          };
          let created = false;
          const request = this.recipe;
          const object = {
            payload: request,
            query: `?query=recipenumber=="${this.updateRecipeNumber}"`,
          };
          created = await this.updateRecipe(object);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'RECIPE_UPDATED',
            });
            this.dialog = false;
            this.recipe = {};
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_UPDATING_RECIPE',
            });
          }
          this.saving = false;
        } else {
          // add new recipe
          this.saving = true;
          this.recipe = {
            ...this.recipe,
            line: 'Line1',
            subline: this.input.sublinename,
            versionnumber: 1,
            assetid: 4,
            machinename: this.input.machinename,
            createdby: 'admin',
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
            this.dialog = false;
            this.recipe = {};
            this.$refs.form.reset();
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_RECIPE',
            });
          }
          this.saving = false;
        }
      }
    },
    async dialogReset() {
      this.$refs.form.reset();
    },
    async getfilteredStationNames(item) {
      await this.getStationNamesbysubline(`?query=sublineid=="${item.id}"`);
    },
  },
};
</script>

<style>

</style>
