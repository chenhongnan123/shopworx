<template>
<div style="height:100%">
  <portal to="app-header">
      <span>Recipe Details</span>
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
    <v-btn icon @click="$router.push({ name: 'recipeManagement' })">
    <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <span>Recipe name: </span>
    <span>{{$route.params.id.recipename}}</span>
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
          <v-spacer></v-spacer>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            Refresh
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="uploadToPLC">
            <v-icon small left>mdi-upload</v-icon>
            Upload to PLC
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="downloadFromPLC">
            <v-icon small left>mdi-download</v-icon>
            Download from PLC
          </v-btn>
        </v-toolbar>
        <v-row justify="left">
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
            :disabled="!toggleDisable"
            label="Line"
            v-model="line"
        ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
              :disabled="!toggleDisable"
            label="Subline"
            v-model="subline"
        ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
              :disabled="!toggleDisable"
            label="Station name"
            v-model="machinename"
        ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
              :disabled="!toggleDisable"
            label="Recipe Name"
            v-model="recipename"
        ></v-text-field>
            </v-col>
            </v-row>
        <v-data-table
        :headers="headers"
        :items="recipeListDetails"
        item-key="tagname"
        >
        <template v-slot:item="{ item, index }">
          <tr>
          <td>{{ index+1 }}</td>
          <td>{{ item.tagname }}</td>
          <td>{{ item.datatype }}</td>
          <td>{{ item.parametervalue }}</td>
          <td v-if="index == 0">566778</td>
          <td v-else-if="index == 1" style="background: red">0</td>
          <td v-else-if="index == 2">2</td>
          <td v-else style="background: red">0</td>
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
    <v-card>
      <v-card-title primary-title>
        <span>
          Update parameter value
        </span>
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
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          @click="fnUpdateRecipeValue"
        >
          Save
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
        {
          text: 'Parameter',
          value: 'tagname',
        },
        {
          text: 'Data type',
          value: 'datatype',
        },
        { text: 'Recipe value', value: 'parametervalue' },
        { text: 'Monitor value', value: 'monitorvalue' },
        {
          text: 'Actions',
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
      machinename: null,
      dialogConfirm: false,
      recipename: null,
      toggleDisable: true,
      itemToUpdate: {},
      itemForDelete: null,
    };
  },
  async created() {
    await this.getRecipeDetailListRecords('');
    this.machinename = this.$route.params.id.machinename;
    this.recipename = this.$route.params.id.recipename;
    this.line = this.$route.params.id.line;
    this.subline = this.$route.params.id.subline;
    this.toggleDisable = false;
  },
  computed: {
    ...mapState('recipeManagement', ['recipeListDetails']),
  },
  methods: {
    ...mapActions('recipeManagement', ['getRecipeDetailListRecords', 'createRecipe', 'deleteRecipeDetails', 'updateRecipeDetails', 'updateRecipe']),
    ...mapMutations('helper', ['setAlert']),
    addNewRecipe() {
      this.dialog = true;
    },
    async RefreshUI() {
      await this.getRecipeDetailListRecords('');
    },
    uploadToPLC() {

    },
    downloadFromPLC() {

    },
    async fnUpdateRecipeValue() {
      const request = {
        parametervalue: this.recipeValue,
      };
      const object = {
        payload: request,
        query: `?query=tagname=="${this.itemToUpdate.tagname}"`,
      };
      await this.updateRecipeDetails(object);
      const recipe = {
        editedby: 'admin',
        editedtime: new Date().getTime(),
        versionnumber: this.$route.params.id.versionnumber + 1,
      };
      const object2 = {
        payload: recipe,
        query: `?query=recipenumber=="${this.$route.params.id.recipenumber}"`,
      };
      await this.updateRecipe(object2);
      this.dialog = false;
    },
    fnUpdateRecipeDetails(item) {
      this.dialog = true;
      this.itemToUpdate = item;
      this.recipeValue = item.parametervalue;
    },
    deleteRecipeDeatils(item) {
      this.itemForDelete = item;
      this.dialogConfirm = true;
    },
    async fnDeleteOnYes() {
      await this.deleteRecipeDetails(this.itemForDelete.tagname);
      const recipe = {
        editedby: 'admin',
        editedtime: new Date().getTime(),
        versionnumber: this.$route.params.id.versionnumber + 1,
      };
      const object = {
        payload: recipe,
        query: `?query=recipenumber=="${this.$route.params.id.recipenumber}"`,
      };
      await this.updateRecipe(object);
      this.dialogConfirm = false;
    },
    async saveRecipe() {
      if (!this.recipe.recipename) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'RECIPE_NAME_EMPTY',
        });
      } else {
        const recipeFlag = this.recipeList.filter((o) => o.recipename === this.recipe.recipename);
        if (recipeFlag.length > 0) {
          this.recipe.recipename = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_RECIPE',
          });
        } else {
          this.saving = true;
          this.recipe = {
            ...this.recipe,
            versionnumber: 3,
            assetid: 4,
            machinename: 'ST20',
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
