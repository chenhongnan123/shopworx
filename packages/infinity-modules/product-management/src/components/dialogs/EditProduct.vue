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
            v-model="productName"
            :rules="productNameRule"
            required
            :counter="10"
            @keyup="validName"
        ></v-text-field>
        <v-text-field
            :disabled="saving"
            :label="$t('displayTags.productTypeDescription')"
            prepend-icon="mdi-tray-plus"
            v-model="productDescription"
        ></v-text-field>
        <v-text-field
            :disabled="saving"
            :label="$t('displayTags.customer')"
            prepend-icon="mdi-account"
            v-model="customername"
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
            <template #item="{ item }">
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
            <template #item="{ item }">
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
          :disabled="!productName || !productDescription"
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
      saving: false,
      message: null,
      loadingProducts: false,
      producttypecategory: null,
      productName: null,
      description: null,
      valid: false,
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
      this.customername = val.customername;
      this.selectedRoadmap = val.roadmapname;
      this.selectedBom = val.bomname;
    },
  },
  created() {
    this.productName = this.product.productname;
    this.productDescription = this.product.description;
    this.customername = this.product.customername;
    this.selectedRoadmap = this.product.roadmapname;
    this.selectedBom = this.product.bomname;
  },
  computed: {
    ...mapState('productManagement', ['bom', 'roadmapsDetails', 'productTypeCategory', 'editProductDialog', 'productList']),
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
          (o) => o.productname === this.productName,
        );
        if (duplicateName.length > 0 && this.valid) {
          this.productName = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_PRODUCT',
          });
        } else {
          const object = {};
          if (this.selectedBom) {
            object.bomname = this.selectedBom.name;
            object.bomid = this.selectedBom.id;
          }
          const payload = {
            ...object,
            productname: this.productName,
            description: this.productDescription,
            editedby: this.userName,
            roadmapname: this.selectedRoadmap.name,
            roadmapid: this.selectedRoadmap.id,
            roadmaptype: this.selectedRoadmap.roadmaptype,
            customername: this.customername,
            productversionnumber: (this.product.productversionnumber + 1),
            // TODO asset, check editedtime on value and datatype
            editedtime: new Date().getTime(),
          };
          let update = false;
          update = this.updateProductType({ id: this.product._id, payload });
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
      }
    },
    async validName() {
      const roadmapFlag = this.productList
        .filter((o) => o.productname.toLowerCase().split(' ').join('') === this.productName.toLowerCase().split(' ').join(''));
      if (roadmapFlag.length > 0) {
        this.valid = false;
        this.validupdate = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST',
        });
      } else {
        this.valid = true;
        this.validupdate = true;
      }
    },
  },
};
</script>
