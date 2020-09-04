<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Recipe Details</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn>
    </portal>
    <v-container fluid class="py-0">
      <v-btn icon @click="$router.push({ name: 'recipeManagement' })">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>Recipe name:</span>
      <span>{{$route.params.id.recipename}}</span>
      <v-row justify="center">
        <v-col cols="12" xl="10" class="py-0">
          <v-toolbar flat dense class="stick" :color="$vuetify.theme.dark ? '#121212': ''">
            <v-spacer></v-spacer>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
              <v-icon small left>mdi-refresh</v-icon>Refresh
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="btnUploadToPLC">
              <v-icon small left>mdi-upload</v-icon>Upload to PLC
            </v-btn>
            <v-btn
              small
              color="primary"
              outlined
              class="text-none ml-2"
              @click="btnDownloadFromPLC"
            >
              <v-icon small left>mdi-download</v-icon>Download from PLC
            </v-btn>
          </v-toolbar>
          <v-row justify="left">
            <v-col cols="12" md="2" class="py-2">
              <v-text-field :disabled="!toggleDisable" label="Line" v-model="line"></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field :disabled="!toggleDisable" label="Subline"
               v-model="subline"></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
                :disabled="!toggleDisable"
                label="Sub-Station name"
                v-model="substationname"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2"
             class="py-2">
              <v-text-field :disabled="!toggleDisable" label="Recipe Name"
               v-model="recipename"></v-text-field>
            </v-col>
          </v-row>
          <v-data-table :headers="headers" :items="recipeListDetails" item-key="tagname">
            <template v-slot:item="{ item, index }">
              <tr>
                <td>{{ index+1 }}</td>
                <td>{{ item.tagname }}</td>
                <td
                  v-if="datatypeList
                    .filter((d) => Number(d.id) === Number(item.datatype)).length > 0"
                >{{ datatypeList
                  .filter((d) => Number(d.id) === Number(item.datatype))[0].name }}</td>
                <td v-else>{{ item.datatype }}</td>
                <td>{{ item.parametervalue }}</td>
                <td>{{ item.monitorvalue }}</td>
                <td>
                  <v-row justify="center">
                    <v-btn
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
                    </v-btn>
                  </v-row>
                </td>
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
            <span>Update parameter value</span>
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
            <v-btn color="primary" class="text-none" @click="fnUpdateRecipeValue">Save</v-btn>
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
            <span>Alert</span>
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
            <v-btn color="primary" class="text-none" @click="fnDeleteOnYes">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
// import socketioclient from 'socket.io-client';

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
      substationname: null,
      dialogConfirm: false,
      recipename: null,
      toggleDisable: true,
      itemToUpdate: {},
      itemForDelete: null,
    };
  },
  async created() {
    await this.getRecipeDetailListRecords('');
    await this.getRecipeDetailListRecords(
      `?query=recipeid=='${this.$route.params.id.recipenumber}'`,
    );
    await this.getDataTypes('');
    this.substationname = this.$route.params.id.substationname;
    this.recipename = this.$route.params.id.recipename;
    this.line = this.$route.params.id.linename;
    this.subline = this.$route.params.id.sublinename;
    this.toggleDisable = false;
    if (this.recipeListDetails.length === 0) {
      const payload = [];
      // %26%26%28parametercategory=="36"%7C%7Cparametercategory=="7"%29
      await this.getParametersRecords(
        `?query=substationid=="${this.$route.params.id.substationid}"`,
      );
      this.parametersList.forEach((element) => {
        if (element.datatype === '11') {
          payload.push({
            tagname: element.name,
            datatype: element.datatype,
            recipeid: this.$route.params.id.recipenumber,
            parametervalue: '',
            lineid: this.$route.params.id.lineid,
            linename: this.$route.params.id.linename,
            sublineid: this.$route.params.id.sublineid,
            sublinename: this.$route.params.id.sublinename,
            assetid: 4,
          });
        } else {
          payload.push({
            tagname: element.name,
            datatype: element.datatype,
            recipeid: this.$route.params.id.recipenumber,
            parametervalue: 0,
            lineid: this.$route.params.id.lineid,
            linename: this.$route.params.id.linename,
            sublineid: this.$route.params.id.sublineid,
            sublinename: this.$route.params.id.sublinename,
            assetid: 4,
          });
        }
      });
      await this.createRecipeDetails(payload);
      await this.getRecipeDetailListRecords(
        `?query=recipeid=='${this.$route.params.id.recipenumber}'`,
      );
    }
    // this.socket = socketioclient.connect('http://:10190');
    this.socket.on('connect', () => {
      console.log('connected to socketwebhook');
    });
  },
  beforeDestroy() {
    this.socket.close();
  },
  computed: {
    ...mapState('recipeManagement', [
      "recipeListDetails, 'parametersList', 'datatypeList'",
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
  },
  methods: {
    ...mapActions('recipeManagement', [
      'getRecipeDetailListRecords',
      'createRecipe',
      'deleteRecipeDetails',
      'updateRecipeDetails',
      'updateRecipe',
      'getParametersRecords',
      'createRecipeDetails',
      'getMonitorValues',
      'uploadToPLC',
      'downloadFromPLC',
      'getDataTypes']),
    ...mapMutations('helper', ['setAlert']),
    addNewRecipe() {
      this.dialog = true;
    },
    async RefreshUI() {
      // await this.getRecipeDetailListRecords('');
      const object = {
        lineid: Number(this.$route.params.id.lineid),
        sublineid: this.$route.params.id.sublineid,
        substationid: this.$route.params.id.substationid,
      };
      this.socket.on(`update_parameter_${object.lineid}_${object.sublineid}_${object.substationid}`, (data) => {
        console.log('event received');
        if (data) {
          this.recipeListDetails.forEach((element) => {
            if (data[element.tagname]) {
              this.$set(element, 'monitorvalue', data[element.tagname]);
            }
          });
        }
      });
      await this.getMonitorValues(object);
    },
    async btnUploadToPLC() {
      const parameterList = [];
      this.recipeListDetails.forEach((element) => {
        if (element.datatype === '11') {
          parameterList.push({
            tagname: element.tagname,
            parametervalue: element.parametervalue,
          });
        } else if (element.datatype === '9') {
          parameterList.push({
            tagname: element.tagname,
            parametervalue: parseFloat(element.parametervalue, 10),
          });
        } else {
          parameterList.push({
            tagname: element.tagname,
            parametervalue: Number(element.parametervalue),
          });
        }
      });
      const object = {
        lineid: Number(this.$route.params.id.lineid),
        sublineid: this.$route.params.id.sublineid,
        substationid: this.$route.params.id.substationid,
        recipenumber: this.$route.params.id.recipenumber,
        // tagname, parametervalue
        recipeparameter: parameterList,
      };
      this.socket.on(`update_upload_${object.lineid}_${object.sublineid}_${object.substationid}`, (data) => {
      });
      await this.uploadToPLC(object);
    },
    async btnDownloadFromPLC() {
      const object = {
        lineid: Number(this.$route.params.id.lineid),
        sublineid: this.$route.params.id.sublineid,
        substationid: this.$route.params.id.substationid,
      };
      this.socket.off(`update_download_${object.lineid}_${object.sublineid}_${object.substationid}`, () => {
      });
      this.socket.on(`update_download_${object.lineid}_${object.sublineid}_${object.substationid}`, (data) => {
        if (data) {
          this.recipeListDetails.forEach(async (element) => {
            if (data[element.tagname]) {
              this.$set(element, 'parametervalue', data[element.tagname]);
              const request = {
                parametervalue: data[element.tagname],
              };
              const objectForUpdate = {
                payload: request,
                query: `?query=tagname=="${element.tagname}"%26%26recipeid=="${this.$route.params.id.recipenumber}"`,
              };
              await this.updateRecipeDetails(objectForUpdate);
            }
          });
          const recipe = {
            editedby: this.userName,
            editedtime: new Date().getTime(),
            versionnumber: this.$route.params.id.versionnumber + 1,
          };
          const object2 = {
            payload: recipe,
            query: `?query=recipenumber=="${this.$route.params.id.recipenumber}"`,
          };
          this.updateRecipe(object2);
        }
      });
      await this.downloadFromPLC(object);
    },
    async fnUpdateRecipeValue() {
      let request = '';
      if (this.itemToUpdate.datatype === '11') {
        request = {
          parametervalue: this.recipeValue,
        };
      } else if (this.itemToUpdate.datatype === '9') {
        request = {
          parametervalue: parseFloat(this.recipeValue, 10),
        };
      } else {
        request = {
          parametervalue: Number(this.recipeValue),
        };
      }
      const object = {
        payload: request,
        query: `?query=tagname=="${this.itemToUpdate.tagname}"%26%26recipeid=="${this.$route.params.id.recipenumber}"`,
      };
      await this.updateRecipeDetails(object);
      const recipe = {
        editedby: this.userName,
        editedtime: new Date().getTime(),
        versionnumber: this.$route.params.id.versionnumber + 1,
      };
      const object2 = {
        payload: recipe,
        query: `?query=recipenumber=="${this.$route.params.id.recipenumber}"`,
      };
      await this.updateRecipe(object2);
      this.dialog = false;
      await this.getRecipeDetailListRecords(`?query=recipeid=="${this.$route.params.id.recipenumber}"`);
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
      await this.deleteRecipeDetails(`?query=tagname=="${this.itemForDelete.tagname}"%26%26recipeid=="${this.$route.params.id.recipenumber}"`);
      const recipe = {
        editedby: this.userName,
        editedtime: new Date().getTime(),
        versionnumber: this.$route.params.id.versionnumber + 1,
      };
      const object = {
        payload: recipe,
        query: `?query=recipenumber=="${this.$route.params.id.recipenumber}"`,
      };
      await this.updateRecipe(object);
      this.dialogConfirm = false;
      await this.getRecipeDetailListRecords(`?query=recipeid=="${this.$route.params.id.recipenumber}"`);
    },
  },
};
</script>
