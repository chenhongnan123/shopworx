<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
        <v-card-title primary-title>
          <span v-text="$t('displayTags.createProductType')"></span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="(dialog = false); dialogReset();">
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
            :rules="selectLineRule"
            required
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
            required
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
            :rules="customerNameRule"
            :counter="15"
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
            required
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
            !product ||
            !valid"
            @click="saveProduct"
            >
            {{ $t('displayTags.buttons.save') }}
            </v-btn>
        </v-card-actions>
    </v-card>
  </v-form>
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
      valid: true,
      productname: '',
      customername: '',
      productNameRule: [(v) => !!v || 'Product Name Required',
        // (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        (v) => !/[^a-zA-Z0-9-]/.test(v) || 'Special Characters ( including space ) not allowed'],
      selectLineRule: [(v) => !!v || 'Line selection Required'],
      selectProductTypeRule: [(v) => !!v || 'Roadmap selection Required'],
      selectBomRule: [(v) => !!v || 'BOM selection Required'],
      customerNameRule: [(v) => (v && v.length <= 15) || 'Name must be less than 15 characters'],
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
        this.getProductListRecords('');
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
    ...mapActions('productManagement', ['createProduct', 'getProductListRecords']),
    async saveProduct() {
      this.$refs.form.validate();
      if (!this.product.productname) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PRODUCT_NAME_EMPTY',
        });
      } else {
        const duplicateProduct = this.productList.filter(
          (o) => o.productname.toLowerCase().split(' ').join('') === this.product.productname.toLowerCase().split(' ').join(''),
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
            roadmaptype: this.selectedRoadmap.roadmaptype,
            productversionnumber: 1,
            createdby: this.userName,
            assetid: 4,
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
            this.$refs.form.reset();
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
    async dialogReset() {
      this.$refs.form.reset();
    },
  },
};
</script>
