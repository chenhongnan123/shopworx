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
          {{ $t('displayTags.updateDialog') }}
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
            v-model="productName"
        ></v-text-field>
        <v-text-field
            :disabled="saving"
            :label="$t('displayTags.productTypeDescription')"
            prepend-icon="mdi-tray-plus"
            v-model="productDescription"
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
          :disabled="!selectedProductTypeCategory || !productName || !productDescription"
          @click="updateProduct"
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
  name: 'EditProduct',
  data() {
    return {
      saving: false,
      message: null,
      loadingProducts: false,
      selectedProductTypeCategory: null,
      productName: null,
      productDescription: null,
    };
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  watch: {
    product(val) {
      this.productName = val.productname;
      this.productDescription = val.description;
    },
  },
  computed: {
    ...mapState('productManagement', ['productTypeCategory', 'editProductDialog', 'productList']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
    dialog: {
      get() {
        return this.editProductDialog;
      },
      set(val) {
        this.setEditDialog(val);
      },
    },
  },
  mounted() {
    this.loadingProducts = false;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('productManagement', ['setEditDialog']),
    ...mapActions('productManagement', ['updateProductType']),
    async updateProduct() {
      if (!this.productName) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PRODUCT_NAME_EMPTY',
        });
      } else {
        const duplicateName = this.productList.filter(
          (o) => o.productname.toLowerCase().split(' ').join('') === this.productName.toLowerCase().split(' ').join(''),
        );
        if (duplicateName.length > 0) {
          this.productName = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_PRODUCT',
          });
        } else {
          const payload = {
            productname: this.productName,
            description: this.productDescription,
            editedby: this.userName,
            producttypecategory: this.selectedProductTypeCategory.name,
            productTypecategoryid: this.selectedProductTypeCategory.id,
            productversionnumber: (this.product.productversionnumber + 1),
            // TODO asset, check editedtime on value and datatype
            assetid: 4,
            editedtime: new Date().getTime(),
          };
          let update = false;
          update = await this.updateProductType({ id: this.product._id, payload });
          if (update) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'PRODUCT_UPDATED',
            });
            this.dialog = false;
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_UPDATING_PRODUCT',
            });
          }
        }
      }
    },
  },
};
</script>
