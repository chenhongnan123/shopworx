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
    <v-icon  v-text="'$plus'"
    class="float-right"></v-icon>
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
            :rules="nameRules"
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
      recipename: '',
      nameRules: [(v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters not Allowed',
        (v) => !!v || 'Name required'],
      input: {
        sublinename: '',
        machinename: '',
      },
    };
  },
  computed: {
    ...mapState('recipeManagement', ['recipeList', 'stationList', 'lineList', 'subLineList', 'filterLine', 'filterSubLine', 'filterStation']),
  },
  methods: {
    ...mapActions('recipeManagement', ['createRecipe', 'updateRecipe']),
    ...mapMutations('helper', ['setAlert']),
    // ...mapMutations('recipeManagement', ['toggleFilter', 'setFilterLine']),
    async saveRecipe() {
      if (!this.recipe.recipename) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'RECIPE_NAME_EMPTY',
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
  },
};
</script>

<style>

</style>
