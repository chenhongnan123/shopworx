<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" xl="10">
        <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
        <v-row justify="left">
                      <v-col cols="12" md="2" xl="2">
                        <v-list-item-subtitle>
                          <div><font color=primary>
                              {{this.$t('Line')}}
                            </font></div>
                        </v-list-item-subtitle>
                        <v-list-item-title>
                          <span>Line1</span>
                        </v-list-item-title>
                      </v-col>
                      <v-col cols="12" md="3" xl="2">
                        <v-list-item-subtitle>
                          <div><font color=primary>
                            {{this.$t('Current order')}}
                            </font></div>
                        </v-list-item-subtitle>
                        <v-list-item-title>
                          <span v-text="orderList[0].ordername">e</span>
                        </v-list-item-title>
                      </v-col>
                      <v-col cols="12" md="3" xl="2">
                        <v-list-item-subtitle>
                          <div><font color=primary>
                            {{this.$t('Product')}}
                            </font></div>
                        </v-list-item-subtitle>
                        <v-list-item-title>
                          <span v-text="orderList[0].productname"></span>
                        </v-list-item-title>
                      </v-col>
                    </v-row>
        <v-spacer></v-spacer>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="fnChangeOver">
            {{this.$t('Changeover')}}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            {{this.$t('Refresh')}}
          </v-btn>
        </v-toolbar>
        <v-data-table
        v-model="changeover"
        :headers="headers"
        :items="recipeList"
        item-key="recipenumber"
        show-select
        >
        <template v-slot:item="{ item, index }">
          <tr>
          <td>
            <v-checkbox
            v-model="changeover"
            primary
            hide-details
            ></v-checkbox>
          </td>
          <td>{{ index+1 }}</td>
          <td>{{ item.sublinename }}</td>
          <td>{{ item.machinename }}</td>
          <td>{{ item.substationname }}</td>
          <td>{{ item.recipename }}</td>
          <td>{{ item.recipeversion}}</td>
          <td v-if="item.notmatchname == 1"><font color=error>{{ item.plcrecipename}}</font></td>
          <td v-else>{{ item.plcrecipename}}</td>
          <td v-if="item.notmatchversion == 1">
            <font color=error>{{ item.plcrecipeversion}}</font></td>
          <td v-else>{{ item.plcrecipeversion}}</td>
          <td></td>
          <td></td>
          </tr>
        </template>
      </v-data-table>
      </v-col>
    </v-row>
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
        <span>Are you sure you want to Changeover?</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          @click="fnDoChangever"
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
import socketioclient from 'socket.io-client';

export default {
  name: 'RecipeList',
  data() {
    return {
      headers: [
        {
          text: this.$t('No.'),
          value: 'number',
        },
        {
          text: this.$t('Subline'),
          value: 'sublinename',
        },
        {
          text: this.$t('Station name'),
          value: 'machinename',
        },
        {
          text: this.$t('SubStation name'),
          value: 'substationname',
        },
        { text: this.$t('Recipe name'), value: 'recipename' },
        // { text: 'Recipe number', value: 'recipenumber' },
        { text: this.$t('Recipe version'), value: 'versionnumber' },
        { text: this.$t('PLC Recipe name'), value: 'plcrecipename' },
        // { text: 'PLC Recipe number', value: 'plcrecipenumber' },
        { text: this.$t('PLC Recipe version'), value: 'plcrecipeversion' },
      ],
      dialog: false,
      recipe: {},
      changeover: [],
      saving: false,
      orderList: [],
      recipeList: [],
      dialogConfirm: false,
    };
  },
  async created() {
    this.socket = socketioclient.connect('http://:10190');
    this.socket.on('connect', () => {
      // console.log('connected to socketwebhook');
    });
    // await this.getRecipeListRecords('');
    this.orderList = await this.getOrderRecords('?query=orderstatus=="Running"');
    this.recipeList = await this.getProductDetails(`?query=productnumber=="${this.orderList[0].productid}"`);
    for (let i = 0; i < this.recipeList.length; i += 1) {
      const recipe = this.recipeList[i];
      const object = {
        lineid: Number(recipe.lineid),
        sublineid: recipe.sublineid,
        substationid: recipe.substationid,
      };
      this.socket.on(`update_parameter_${object.lineid}_${object.sublineid}_${object.substationid}`, (data) => {
        console.log('event received');
        if (data) {
          if (data.substationid === recipe.substationid) {
            this.recipeList[i].plcrecipename = data.recipename;
            this.recipeList[i].plcrecipeversion = data.recipeversion;
            if (recipe.recipename === data.recipename) {
              this.recipeList[i].notmatchname = 0;
            }
            if (recipe.recipeversion === data.recipeversion) {
              this.recipeList[i].notmatchversion = 0;
            }
          }
        }
      });
      // eslint-disable-next-line
      await this.getMonitorValues(object);
    }
  },
  beforeDestroy() {
    this.socket.close();
  },
  computed: {
    ...mapState('recipeManagement', ['filterLine', 'filterSubLine', 'filterStation', 'recipeListDetails']),
  },
  methods: {
    ...mapActions('recipeManagement',
      [
        'getRecipeListRecords',
        'getProductDetails',
        'getOrderRecords',
        'getMonitorValues',
        'getRecipeDetailListRecords',
        'uploadToPLC',
      ]),
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('recipeManagement', ['toggleFilter']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
    async fnDoChangever() {
      await Promise.all(this.recipeList.map(async (recipe) => {
        await this.getRecipeDetailListRecords(`?query=recipeid=="${recipe.recipenumber}"%26%26versionnumber==${recipe.recipeversion}&sortquery=sequence==1`);
        if (this.recipeListDetails.length > 0) {
          const parameterList = [];
          this.recipeListDetails.forEach((element) => {
            if (element.datatype === '11') {
              parameterList.push({
                parametername: element.tagname,
                parametervalue: element.parametervalue,
              });
            } else if (element.datatype === '9') {
              parameterList.push({
                parametername: element.tagname,
                parametervalue: parseFloat(element.parametervalue, 10),
              });
            } else {
              parameterList.push({
                parametername: element.tagname,
                parametervalue: Number(element.parametervalue),
              });
            }
          });
          const recipecheck = parameterList.filter((n) => n.parametername === 'recipename');
          if (recipecheck.length > 0) {
            parameterList.forEach((pr) => {
              if (pr.parametername === 'recipename') {
                pr.parametervalue = recipe.recipename;
              }
            });
          } else {
            parameterList.push({
              parametername: 'recipename',
              parametervalue: recipe.recipename,
            });
          }
          const versioncheck = parameterList.filter((n) => n.parametername === 'recipeversion');
          if (versioncheck.length > 0) {
            parameterList.forEach((pr) => {
              if (pr.parametername === 'recipeversion') {
                pr.parametervalue = Number(recipe.recipeversion);
              }
            });
          } else {
            parameterList.push({
              parametername: 'recipeversion',
              parametervalue: Number(recipe.recipeversion),
            });
          }
          const recipenumcheck = parameterList.filter((n) => n.parametername === 'recipenumber');
          if (recipenumcheck.length > 0) {
            parameterList.forEach((pr) => {
              if (pr.parametername === 'recipenumber') {
                pr.parametervalue = recipe.recipenumber;
              }
            });
          } else {
            parameterList.push({
              parametername: 'recipenumber',
              parametervalue: recipe.recipenumber,
            });
          }
          const object = {
            lineid: Number(recipe.lineid),
            sublineid: recipe.sublineid,
            substationid: recipe.substationid,
            recipenumber: recipe.recipenumber,
            recipename: recipe.recipename,
            versionnumber: recipe.versionnumber,
            recipeversion: recipe.recipeversion,
            // tagname, parametervalue
            recipeparameter: parameterList,
          };
          this.socket.on(`update_upload_${object.lineid}_${object.sublineid}_${object.substationid}`, () => {
          });
          await this.uploadToPLC(object);
        }
      }));
      this.dialogConfirm = false;
    },
    addNewRecipe() {
      this.dialog = true;
    },
    async RefreshUI() {
      this.orderList = await this.getOrderRecords('?query=orderstatus=="Running"');
      this.recipeList = await this.getProductDetails(`?query=productnumber=="${this.orderList[0].productid}"`);
      for (let i = 0; i < this.recipeList.length; i += 1) {
        const recipe = this.recipeList[i];
        const object = {
          lineid: Number(recipe.lineid),
          sublineid: recipe.sublineid,
          substationid: recipe.substationid,
        };
        this.socket.on(`update_parameter_${object.lineid}_${object.sublineid}_${object.substationid}`, (data) => {
          console.log('event received');
          if (data) {
            if (data.substationid === recipe.substationid) {
              this.recipeList[i].plcrecipename = data.recipename;
              this.recipeList[i].plcrecipeversion = data.recipeversion;
              if (recipe.recipename === data.recipename) {
                this.recipeList[i].notmatchname = 0;
              }
              if (recipe.recipeversion === data.recipeversion) {
                this.recipeList[i].notmatchversion = 0;
              }
            }
          }
        });
        // eslint-disable-next-line
        await this.getMonitorValues(object);
      }
    },
    fnChangeOver() {
      this.dialogConfirm = true;
    },
  },
};
</script>
