<template>
  <div>
    <portal to="app-header">
      <span>{{$t('productManagement')}}</span>
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
      <portal to="app-extension">
        <v-row justify="center">
          <v-col cols="12" md="7"></v-col>
          <v-col cols="12" md="5" justify="end">
          <div style="float:right;">
            <v-btn small color="primary"
            class="text-none" @click="setAddProductDialog(true)">
              <v-icon small left>mdi-plus</v-icon>
              {{ $t('displayTags.buttons.addProductType') }}
            </v-btn>
            <v-btn small color="primary" outlined
            v-if="!recordSelection"
            class="text-none ml-2" @click="addDuplicateProduct()">
              <v-icon small left>mdi-content-duplicate</v-icon>
              {{ $t('displayTags.buttons.duplicateProductType') }}
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
              <v-icon small left>mdi-refresh</v-icon>
              {{ $t('displayTags.buttons.refresh') }}
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
              <v-icon small left>mdi-filter-variant</v-icon>
              {{ $t('displayTags.buttons.filters') }}
            </v-btn>
          </div>
          </v-col>
        </v-row>
      </portal>
      <v-data-table
        v-model="products"
        :headers="headers"
        :items="productList"
        item-key="productnumber"
        :single-select="true"
        show-select
        fixed-header
        :height="tableHeight - 168"
        >
        <!-- eslint-disable-next-line -->
        <template v-slot:item.productname="{ item }">
          <span @click="handleClick(item)"><a>{{ item.productname }}</a></span>
        </template>
        <!-- eslint-disable-next-line -->
        <template v-slot:item.editedtime="{ item }">
          <span v-if="item.editedtime">
            {{ new Date(item.editedtime).toLocaleString("en-GB") }}</span>
          <span v-else></span>
        </template>
        <!-- eslint-disable-next-line -->
        <template v-slot:item.actions="{ item }">
          <v-row>
                <v-btn
                  icon
                  small
                  color="primary"
                  @click="updateProductType(item)"
                  >
                  <v-icon v-text="'$edit'"></v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="error"
                  @click="deleteProductDialog(item)"
                  >
                  <v-icon v-text="'$delete'"></v-icon>
                </v-btn>
              </v-row>
        </template>
      </v-data-table>
      <add-product/>
      <duplicate-product v-if="products"
      :products="products"
      @do-empty="emptyProducts"/>
      <edit-product v-if="editProductData" :product="editProductData"/>
      <delete-product v-if="productToDelete" :productToDelete="productToDelete"/>
    </v-container>
    <product-filter></product-filter>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import AddProduct from '../components/dialogs/AddProduct.vue';
import DuplicateProduct from '../components/dialogs/DuplicateProduct.vue';
import EditProduct from '../components/dialogs/EditProduct.vue';
import DeleteProduct from '../components/dialogs/DeleteProduct.vue';
import ProductFilter from '../components/ProductFilter.vue';

export default {
  name: 'ProductList',
  components: {
    AddProduct,
    DuplicateProduct,
    EditProduct,
    DeleteProduct,
    ProductFilter,
  },
  data() {
    return {
      headers: [
        {
          text: this.$t('No.'),
          value: 'numberIndex',
        },
        { text: this.$t('Line'), value: 'linename' },
        { text: this.$t('Product Type Name'), value: 'productname' },
        { text: this.$i18n.t('displayTags.productTypeNumber'), value: 'productnumber' },
        { text: this.$i18n.t('Customer'), value: 'customername' },
        { text: this.$i18n.t('displayTags.roadmap'), value: 'roadmapname' },
        { text: this.$i18n.t('displayTags.bom'), value: 'bomname' },
        { text: this.$i18n.t('displayTags.version'), value: 'productversionnumber' },
        { text: this.$i18n.t('displayTags.lastEditedOn'), value: 'editedtime' },
        { text: this.$i18n.t('displayTags.lastEditedBy'), value: 'editedby' },
        { text: this.$i18n.t('displayTags.actions'), sortable: false, value: 'actions' },
      ],
      recordSelection: false,
      loadingLine: false,
      product: {},
      products: [],
      saving: false,
      hover: true,
      tableHeight: window.innerHeight,
      lineSelected: null,
      subLineSelected: null,
      stationSelected: null,
      showLineFilter: true,
      editProductData: null,
      productToDelete: null,
    };
  },
  async created() {
    this.setExtendedHeader(true);
    await this.getProductListRecords('');
    this.products = [];
  },
  computed: {
    ...mapState('productManagement', ['productList', 'lineList', 'selectedProduct', 'selectedBOM', 'selectedRoadmap'/** ,  'filterLine', 'filterSubLine', 'filterStation' */]),
  },
  methods: {
    ...mapActions('productManagement', ['getProductListRecords', 'createProduct']),
    ...mapMutations('helper', ['setAlert', 'setExtendedHeader']),
    ...mapMutations('productManagement', ['toggleFilter', 'setFilterLine', 'setAddProductDialog',
      'setDuplicateDialog', 'setEditDialog', 'setDeleteDialog']),
    async RefreshUI() {
      let query = '?query=';
      if (this.selectedBOM) {
        query += `bomname=="${this.selectedBOM}"`;
      }
      if (this.selectedRoadmap) {
        if (query === '?query=') {
          query += `roadmapname=="${this.selectedRoadmap}"`;
        } else {
          query += `%26%26roadmapname=="${this.selectedRoadmap}"`;
        }
      }
      if (this.selectedProduct) {
        if (query === '?query=') {
          query += `productname=="${this.selectedProduct}"`;
        } else {
          query += `%26%26productname=="${this.selectedProduct}"`;
        }
      }
      await this.getProductListRecords(query);
    },
    handleClick(value) {
      this.$router.push({ name: 'productDetails', params: { id: value.productnumber } });
    },
    fnLineModel() {
      this.showLineFilter = false;
    },
    addDuplicateProduct() {
      if (this.products.length && this.products.length === 1
        && this.productList.filter((f) => f.productnumber
        === this.products[0].productnumber).length === 1) {
        this.setDuplicateDialog(true);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_SINGLE_PRODUCT_TYPE',
        });
      }
    },
    updateProductType(item) {
      this.editProductData = item;
      this.setEditDialog(true);
      this.products = [];
    },
    deleteProductDialog(item) {
      this.productToDelete = item;
      this.setDeleteDialog(true);
      this.products = [];
    },
    emptyProducts() {
      this.products = [];
    },
  },
  watch: {
    products: {
      handler(val) {
        if (val.length === 0 || val.length > 1) {
          this.recordSelection = true;
        } else {
          this.recordSelection = false;
        }
      },
    },
  },
};
</script>
