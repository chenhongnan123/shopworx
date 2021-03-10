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
        <v-row justify="left">
                      <v-col cols="12" md="2" xl="2">
                        <v-list-item-subtitle>
                          <div><font color=primary>Line</font></div>
                        </v-list-item-subtitle>
                        <v-list-item-title>
                          <span>Line1</span>
                        </v-list-item-title>
                      </v-col>
                      <v-col cols="12" md="3" xl="2">
                        <v-list-item-subtitle>
                          <div><font color=primary>Current order</font></div>
                        </v-list-item-subtitle>
                        <!-- <v-list-item-title>
                          <span v-text="orderList[0].ordername">e</span>
                        </v-list-item-title> -->
                      </v-col>
                      <!-- <v-col cols="12" md="3" xl="2">
                        <v-list-item-subtitle>
                          <div><font color=primary>Product</font></div>
                        </v-list-item-subtitle>
                        <v-list-item-title>
                          <span v-text="orderList[0].productname"></span>
                        </v-list-item-title>
                      </v-col> -->
                    </v-row>
        <v-spacer></v-spacer>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="fnChangeOver">
            Changeover
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            Refresh
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
            :value ="item"
            primary
            hide-details
            ></v-checkbox>
          </td>
          <td>{{ index+1 }}</td>
          <td>{{ item.sublinename }}</td>
          <td>{{ item.machinename }}</td>
          <td>{{ item.substationname }}</td>
          <td>{{ item.recipename }}</td>
          <td>{{ item.recipenumber}}</td>
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
          text: 'No.',
          value: 'number',
        },
        {
          text: 'Subline',
          value: 'sublinename',
        },
        {
          text: 'Station name',
          value: 'machinename',
        },
        {
          text: 'SubStation name',
          value: 'substationname',
        },
        { text: 'Recipe name', value: 'recipename' },
        { text: 'Recipe number', value: 'recipenumber' },
        { text: 'PLC Recipe name', value: 'plcrecipename' },
        { text: 'PLC Recipe number', value: 'plcrecipenumber' },
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
    const list = await Promise.all(this.recipeList.map(async (recipe) => {
      let { plcrecipename, plcrecipenumber } = recipe;
      const object = {
        lineid: Number(recipe.lineid),
        sublineid: recipe.sublineid,
        substationid: recipe.substationid,
      };
      this.socket.on(`update_parameter_${object.lineid}_${object.sublineid}_${object.substationid}`, (data) => {
        console.log('event received');
        if (data) {
          if (data.substationid === recipe.substationid) {
            plcrecipename = data.substationname;
            plcrecipenumber = data.substationname;
          }
        }
      });
      await this.getMonitorValues(object);
      return { ...recipe, plcrecipename, plcrecipenumber };
    }));
    console.log(list);
    this.recipeList = list;
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
      'uploadToPLC'
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
        await this.getRecipeDetailListRecords(`?query=recipeid=="${recipe.recipenumber}"`);
        if (recipeListDetails.length > 0) {
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
          const object = {
            lineid: Number(recipe.lineid),
            sublineid: recipe.sublineid,
            substationid: recipe.substationid,
            recipenumber: recipe.recipenumber,
            // tagname, parametervalue
            recipeparameter: parameterList,
          };
          console.log(object);
          this.socket.on(`update_upload_${object.lineid}_${object.sublineid}_${object.substationid}`, () => {
          });
          await this.uploadToPLC(object);
        }
      }));
    },
    addNewRecipe() {
      this.dialog = true;
    },
    async RefreshUI() {
      await this.getRecipeListRecords('');
    },
    fnChangeOver() {
      this.dialogConfirm = true;
    },
  },
};
</script>
