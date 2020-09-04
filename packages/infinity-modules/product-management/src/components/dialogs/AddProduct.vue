<template>
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
          <span v-text="$t('displayTags.createProductType')"></span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            clearable
            :label="$t('displayTags.placeHolders.selectLineName')"
            :items="lineList"
            return-object
            :disabled="saving"
            item-text="name"
            v-model="lineSelected"
            :loading="loadingProducts"
            prepend-icon="mdi-chart-timeline"
            >
            <template v-slot:item="{ item }">
                <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
            :disabled="saving"
            :label="$t('displayTags.productTypeName')"
            prepend-icon="mdi-tray-plus"
            v-model="product.productname"
          ></v-text-field>
          <v-text-field
            :disabled="saving"
            :label="$t('displayTags.productTypeDescription')"
            prepend-icon="mdi-tray-plus"
            v-model="product.description"
          ></v-text-field>
          <v-text-field
            :disabled="saving"
            :label="$t('displayTags.customer')"
            prepend-icon="mdi-account"
            v-model="product.customername"
          ></v-text-field>
          <v-autocomplete
            clearable
            :label="$t('displayTags.placeHolders.selectRoadmap')"
            :items="roadmapsDetails"
            return-object
            :disabled="saving"
            item-text="name"
            v-model="selectedRoadmap"
            :loading="loadingProducts"
            prepend-icon="mdi-road-variant"
            >
            <template v-slot:item="{ item }">
                <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            clearable
            :label="$t('displayTags.placeHolders.selectBom')"
            :items="bom"
            return-object
            :disabled="saving"
            item-text="name"
            v-model="selectedBom"
            :loading="loadingProducts"
            prepend-icon="mdi-road-variant"
            >
            <template v-slot:item="{ item }">
                <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
            </template>
          </v-autocomplete>
           <v-autocomplete
            clearable
            :label="$t('displayTags.placeHolders.selectProductTypeCategory')"
            :items="productTypeCategory"
            return-object
            :disabled="saving"
            item-text="name"
            v-model="selectedProductTypeCategory"
            :loading="loadingProducts"
            prepend-icon="mdi-road-variant"
            >
            <template v-slot:item="{ item }">
                <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            color="primary"
            class="text-none"
            :disabled="!lineSelected ||
            !selectedRoadmap ||
            !selectedProductTypeCategory ||
            !product"
            @click="saveProduct"
            >
            {{ $t('displayTags.buttons.save') }}
            </v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
} from 'vuex';

export default {
  name: 'AddProduct',
  data() {
    return {
      product: {},
      AddProduct: false,
      assetId: null,
      saving: false,
      message: null,
      loadingProducts: false,
      lineSelected: null,
      selectedRoadmap: null,
      selectedBom: null,
      selectedProductTypeCategory: null,
    };
  },
  computed: {
    ...mapState('productManagement', ['lineList', 'roadmapsDetails', 'bom', 'productTypeCategory', 'addProductDialog', 'productList']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
    dialog: {
      get() {
        return this.addProductDialog;
      },
      set(val) {
        this.setAddProductDialog(val);
      },
    },
  },
  mounted() {
    this.loadingProducts = false;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('productManagement', ['setAddProductDialog']),
    ...mapActions('productManagement', ['createProduct']),
    async saveProduct() {
      if (!this.product.productname) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PRODUCT_NAME_EMPTY',
        });
      } else {
        const duplicateProduct = this.productList.filter(
          (o) => o.productname === this.product.productname,
        );
        if (duplicateProduct.length > 0) {
          this.product.productname = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_PRODUCT',
          });
        } else {
          this.saving = true;
          if (this.selectedBom) {
            this.product.bomname = this.selectedBom.name;
            this.product.bomid = this.selectedBom.id;
          }
          this.product = {
            ...this.product,
            linename: this.lineSelected.name,
            lineid: this.lineSelected.id,
            roadmapname: this.selectedRoadmap.name,
            roadmapid: this.selectedRoadmap.id,
            productversionnumber: 1,
            createdby: this.userName,
            editedby: this.userName,
            producttypecategory: this.selectedProductTypeCategory.name,
            productTypecategoryid: this.selectedProductTypeCategory.id,
            // TODO asset, check editedtime on value and datatype
            assetid: 4,
            editedtime: new Date().getTime(),
          };
          const payload = this.product;
          const created = await this.createProduct(payload);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'PRODUCT_CREATED',
            });
            this.dialog = false;
            this.product = {};
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_PRODUCT',
            });
          }
          this.saving = false;
        }
      }
    },
  },
};
</script>
