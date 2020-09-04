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
        <span>
          {{ $t('displayTags.updateDialog') }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); dialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
            :disabled="saving"
            :label="$t('displayTags.productTypeName')"
            prepend-icon="mdi-tray-plus"
            v-model="productNew.productname"
            :rules="productNameRule"
            required
            :counter="10"
            @keyup="validName"
        ></v-text-field>
        <v-text-field
            :disabled="saving"
            :label="$t('displayTags.productTypeDescription')"
            prepend-icon="mdi-tray-plus"
            v-model="productNew.description"
        ></v-text-field>
        <v-autocomplete
            clearable
            :label="$t('displayTags.placeHolders.selectProductTypeCategory')"
            :items="productTypeCategory"
            return-object
            :disabled="saving"
            item-text="name"
            v-model="productNew.producttypecategory"
            :rules="selectProductTypeRule"
            required
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
          :disabled="!valid"
          @click="updateProduct"
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
  name: 'EditProduct',
  data() {
    return {
      productNew: {},
      saving: false,
      message: null,
      loadingProducts: false,
      producttypecategory: null,
      productname: null,
      description: null,
      valid: true,
      productNameRule: [(v) => !!v || 'Product Name Required',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        (v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters ( including space ) not allowed'],
      selectProductTypeRule: [(v) => !!v || 'Product Type selection Required'],
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
      return val;
    },
  },
  created() {
    this.productNew = { ...this.product };
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
      this.$refs.form.validate();
      if (!this.productNew.productname) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PRODUCT_NAME_EMPTY',
        });
      } else {
        const payload = {
          productname: this.productNew.productname,
          description: this.productNew.description,
          editedby: this.userName,
          producttypecategory: this.productNew.producttypecategory.name,
          productTypecategoryid: this.productNew.producttypecategory.id,
          productversionnumber: (this.productNew.productversionnumber + 1),
          // TODO asset, check editedtime on value and datatype
          assetid: 4,
          editedtime: new Date().getTime(),
        };
        let update = false;
        update = this.updateProductType({ id: this.productNew._id, payload });
        if (update) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'PRODUCT_UPDATED',
          });
          this.dialog = false;
          this.$refs.form.reset();
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_UPDATING_PRODUCT',
          });
        }
      }
    },
    async validName() {
      const duplicateName = this.productList.filter(
        (o) => o.productname.toLowerCase().split(' ').join('') === this.productNew.productname.toLowerCase().split(' ').join(''),
      );
      if (duplicateName.length > 0) {
        this.valid = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST_PRODUCT',
        });
      } else {
        this.valid = true;
        // this.saving = false;
      }
    },
    async dialogReset() {
      this.$refs.form.resetValidation();
      this.productNew = { ...this.product };
    },
  },
};
</script>
