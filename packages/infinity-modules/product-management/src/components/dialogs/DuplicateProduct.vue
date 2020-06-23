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
        <span>
          {{ $t('displayTags.duplicateDialogTitle') }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
            :disabled="saving"
            :label="$t('displayTags.productTypeName')"
            prepend-icon="mdi-tray-plus"
            v-model="duplicateProductName"
        ></v-text-field>
        <v-text-field
            :disabled="saving"
            :label="$t('displayTags.productTypeDescription')"
            prepend-icon="mdi-tray-plus"
            v-model="duplicateProductDescription"
        ></v-text-field>
        <v-autocomplete
            clearable
            :label="$t('displayTags.placeHolders.selectProductTypeCategory')"
            :items="productTypeCategory"
            return-object
            :disabled="saving"
            item-text="name"
            v-model="selectedProductTypeCategory"
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
          :disabled="!selectedProductTypeCategory ||
          !duplicateProductName ||
          !duplicateProductDescription"
          @click="saveDuplicate"
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
  name: 'DuplicateProduct',
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
      duplicateProductName: null,
      duplicateProductDescription: null,
    };
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState('productManagement', ['productTypeCategory', 'duplicateProductDialog', 'productList']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
    dialog: {
      get() {
        return this.duplicateProductDialog;
      },
      set(val) {
        this.setDuplicateDialog(val);
      },
    },
  },
  mounted() {
    this.loadingProducts = false;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('productManagement', ['setDuplicateDialog']),
    ...mapActions('productManagement', ['createProduct']),
    async saveDuplicate() {
      if (!this.duplicateProductName) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PRODUCT_NAME_EMPTY',
        });
      } else {
        const duplicateName = this.productList.filter(
          (o) => o.productname.toLowerCase().split(' ').join('') === this.duplicateProductName.toLowerCase().split(' ').join(''),
        );
        if (duplicateName.length > 0) {
          this.duplicateProductName = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_PRODUCT',
          });
        } else {
          this.product = {
            productname: this.duplicateProductName,
            description: this.duplicateProductDescription,
            linename: this.products[0].linename,
            lineid: this.products[0].lineid,
            customername: this.products[0].customername,
            roadmapname: this.products[0].roadmapname,
            roadmapid: this.products[0].roadmapid,
            productversionnumber: 1,
            createdby: this.userName,
            editedby: this.userName,
            bomname: this.products[0].bomname,
            bomid: this.products[0].bomid,
            producttypecategory: this.selectedProductTypeCategory.name,
            productTypecategoryid: this.selectedProductTypeCategory.id,
            // TODO asset, check editedtime on value and datatype
            assetid: 4,
            editedtime: new Date().getTime(),
          };
          let created = false;
          const payload = this.product;
          created = await this.createProduct(payload);
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
        }
      }
    },
  },
};
</script>
