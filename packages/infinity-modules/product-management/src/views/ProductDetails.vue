<template>
  <div style="height:100%">
    <portal to="app-header">
      <span v-text="$t('productDetails')"></span>
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
      <v-btn icon @click="$router.push({ name: 'productManagement' })">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span v-text="`${$t('displayTags.productType')} : `"> </span>
      <span v-text="productInfo.productname"></span>
      <v-row justify="center">
        <v-col cols="12" xl="10" class="py-0">
          <v-row justify="left">
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
                :label="$t('Line')"
                disabled
                v-model="productInfo.linename"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
                :label="$t('displayTags.productTypeName')"
                disabled
                v-model="productInfo.productname"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
                :label="$t('displayTags.productTypeNumber')"
                disabled
                v-model="productInfo.productnumber"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="py-2">
              <v-text-field
                :label="$t('displayTags.roadmap')"
                disabled
                v-model="productInfo.roadmapname"
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <!-- <v-col cols="12" md="1">
              <v-btn
                x-large
                :disabled="disableSave"
                icon color="primary"
                @click="saveProductDetails()"
                >
                <v-icon left>mdi-content-save</v-icon>
              </v-btn>
            </v-col> -->
          </v-row>
        </v-col>
      </v-row>
      <v-data-table
      :headers="headers"
      :items="stationRecipeList"
      item-key="stationname"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.sublinename }}</td>
            <td>{{ item.stationname }}</td>
            <td>{{ item.substationname }}</td>
            <td>
              <v-select
                dense
                flat
                solo
                outlined
                hide-details
                :items="item.recipeDetails"
                v-model="item.selectedRecipe"
                return-object
                item-text="recipename"
                @change="onRecipeChange(item)"
                >
                <template v-slot:selection="{ item }">
                  <span>{{ item.recipename }}</span>
                </template>
              </v-select>
            </td>
            <td v-if="item.selectedRecipe">{{ item.selectedRecipe.recipenumber }}</td>
            <td v-else>0</td>
            <td v-if="item.selectedRecipe">{{ item.selectedRecipe.versionnumber }}</td>
            <td v-else>0</td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
/* eslint-disable */
export default {
  name: 'ProductDetails',
  data() {
    return {
      headers: [
        {
          text: this.$i18n.t('Subline'),
          value: 'sublinename',
        },
        {
          text: this.$i18n.t('Station'),
          value: 'stationname',
        },
        {
          text: this.$i18n.t('Sub-Station Name'),
          value: 'substationname',
        },
        {
          text: this.$i18n.t('displayTags.recipeName'),
          value: 'recipeDetails',
        },
        { text: this.$i18n.t('displayTags.recipeId'), value: 'recipenumber' },
        { text: this.$i18n.t('displayTags.version'), value: 'versionnumber' },
      ],
      productId: null,
      stationRecipeList: [],
      saving: false,
      loadingDetails: false,
      disableSave: true,
    };
  },
  watch: {
    async productInfo(info) {
      this.loadingDetails = true;
      const productNumber = info.productnumber;
      await this.getRecipies('');
      await this.getProductDetails(productNumber);
      if (!this.productDetails.length) {
        this.stationRecipeList = [];
        const { roadmapid } = info;
        await this.processForNewEntry(roadmapid);
        await this.saveProductDetails();
        await this.getProductDetails(productNumber);
        this.stationRecipeList = [];
        this.productDetails.forEach((detail) => {
          let recipeList = [{
            recipename: '-',
          }];
          recipeList.push(...this.recipeList.filter(
            (recipe) => recipe.substationid === detail.substationid,
          ));
          if (recipeList.length === 0) {
            recipeList = [{
              recipename: '-',
            }];
          }
          const selectedRecipe = recipeList.filter(
            (recipe) => recipe.recipenumber === detail.recipenumber,
          );
          if (selectedRecipe.length === 0) {
            this.stationRecipeList.push({
              id: detail._id,
              sublinename: detail.sublinename,
              sublineid: detail.sublineid,
              stationname: detail.stationname,
              stationid: detail.stationid,
              substationname: detail.substationname,
              substationid: detail.substationid,
              recipeDetails: recipeList,
              selectedRecipe: recipeList[0],
            });
          } else {
            this.stationRecipeList.push({
              id: detail._id,
              sublinename: detail.sublinename,
              sublineid: detail.sublineid,
              stationname: detail.stationname,
              stationid: detail.stationid,
              substationname: detail.substationname,
              substationid: detail.substationid,
              recipeDetails: recipeList,
              selectedRecipe: selectedRecipe[0],
            });
          }
        });
      } else {
        this.stationRecipeList = [];
        this.productDetails.forEach((detail) => {
          let recipeList = [{
            recipename: '-',
          }];
          recipeList.push(...this.recipeList.filter(
            (recipe) => recipe.substationid === detail.substationid,
          ));
          if (recipeList.length === 0) {
            recipeList = [{
              recipename: '-',
            }];
          }
          const selectedRecipe = recipeList.filter(
            (recipe) => recipe.recipenumber === detail.recipenumber,
          );
          if (selectedRecipe.length === 0) {
            this.stationRecipeList.push({
              id: detail._id,
              sublinename: detail.sublinename,
              sublineid: detail.sublineid,
              stationname: detail.stationname,
              stationid: detail.stationid,
              substationname: detail.substationname,
              substationid: detail.substationid,
              recipeDetails: recipeList,
              selectedRecipe: recipeList[0],
            });
          } else {
            this.stationRecipeList.push({
              id: detail._id,
              sublinename: detail.sublinename,
              sublineid: detail.sublineid,
              stationname: detail.stationname,
              stationid: detail.stationid,
              substationname: detail.substationname,
              substationid: detail.substationid,
              recipeDetails: recipeList,
              selectedRecipe: selectedRecipe[0],
            });
          }
        });
      }
    },
  },
  created() {
    this.productId = this.$route.params.id;
  },
  computed: {
    ...mapState('productManagement', ['productList', 'productDetails', 'roadmapForProduct', 'recipeList']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
    productInfo: {
      get() {
        const info = this.productList.filter((product) => this.productId === product.productnumber);
        if (info.length) {
          return info[0];
        }
        return null;
      },
    },
  },
  methods: {
    ...mapActions('productManagement', ['getProductDetails', 'getRoadmapForProduct',
      'getRecipies', 'createProductDetails', 'updateProductDetails',
    ]),
    ...mapMutations('helper', ['setAlert']),
    async processForNewEntry(roadmapid) {
      await this.getRoadmapForProduct(roadmapid);
      if (this.roadmapForProduct.length) {
        this.roadmapForProduct.forEach((station) => {
          // TODO change tags in stationname (instaed of machinename)
          const recipeList = this.recipeList.filter(
            (recipe) => recipe.substationid === station.substationid,
          );
          this.stationRecipeList.push({
            sublinename: station.sublinename,
            sublineid: station.sublineid,
            stationname: station.machinename,
            stationid: station.stationid,
            substationname: station.substationname,
            substationid: station.substationid,
            recipeDetails: recipeList,
            selectedRecipe: recipeList[0],
          });
        });
        this.disableSave = false;
      }
    },
    async onRecipeChange(item) {
      let productDetails = {};
      if (item.selectedRecipe.recipename !== '-') {
        productDetails = {
          recipename: item.selectedRecipe.recipename,
          recipenumber: item.selectedRecipe.recipenumber,
          recipeversion: item.selectedRecipe.versionnumber,
          editedby: this.userName,
          editedtime: new Date().getTime(),
        };
      } else {
        productDetails = {
          recipename: '',
          recipenumber: '',
          recipeversion: 0,
          editedby: this.userName,
          editedtime: new Date().getTime(),
        };
      }
      if (item.id) {
        const updated = await this.updateProductDetails({
          id: item.id,
          payload: productDetails,
          productid: this.productInfo._id,
          productVersion: this.productInfo.productversionnumber,
        });
        if (updated) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'PRODUCT_DETAILS_UPDATED',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'PRODUCT_DETAILS_UPDAT_ERROR',
          });
        }
      }
    },
    async saveProductDetails() {
      this.saving = true;
      const payload = [];
      this.stationRecipeList.forEach((element) => {
        const recipeList = this.recipeList.filter(
          (recipe) => recipe.substationid === element.substationid,
        );
        let recipenum = '';
        let recipenam = '';
        let recipever = 0;
        if (recipeList.length !== 0) {
          recipenum = recipeList[0].recipenumber;
          recipenam = recipeList[0].recipename;
          recipever = recipeList[0].versionnumber;
        }
        payload.push({
          machinename: element.stationname,
          recipenumber: recipenum,
          recipename: recipenam,
          recipeversion: recipever,
          productname: this.productInfo.productname,
          productnumber: this.productInfo.productnumber,
          sublinename: element.sublinename,
          sublineid: element.sublineid,
          stationname: element.stationname,
          stationid: element.stationid,
          substationname: element.substationname,
          substationid: element.substationid,
          linename: this.productInfo.linename,
          lineid: this.productInfo.lineid,
          roadmapname: this.productInfo.roadmapname,
          roadmapid: this.productInfo.roadmapid,
          editedby: this.userName,
          editedtime: new Date().getTime(),
          assetid: 4,
        });
      });
      await this.createProductDetails(payload);
      this.saving = false;
    },
  },
};
</script>
<style>
.tableHeader{
  background: gray;
  font-size: 22px;
}
</style>
