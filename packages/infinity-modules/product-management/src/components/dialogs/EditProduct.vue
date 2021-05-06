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
            :rules="customerNameRule"
            :counter="20"
            @keyup="checkInputs"
        ></v-text-field>
        <v-autocomplete
            clearable
            :label="$t('displayTags.placeHolders.selectRoadmap')"
            :items="roadmapsDetails"
            return-object
            :disabled="saving"
            item-text="name"
            v-model="selectedRoadmap"
            :rules="roadmapRequiredRule"
            :loading="loadingProducts"
            prepend-icon="mdi-road-variant"
            @change="checkInputs"
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
            :rules="bomRequiredRule"
            @change="checkInputs"
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
          :disabled="!productName || !productDescription || !valid"
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
/* eslint-disable */
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
      valid: true,
      productNameRule: [(v) => !!v || 'Product Name Required',
        // (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        (v) => !/[^a-zA-Z0-9-]/.test(v) || 'Special Characters ( including space ) not allowed'],
      customerNameRule: [(v) => !!v || 'Customer Name Required',
        (v) => (v && v.length <= 20) || 'Customer Name must be less than 20 characters'],
      bomRequiredRule: [(v) => !!v || 'BOM Required'],  
      roadmapRequiredRule: [(v) => !!v || 'Roadmap Required'],  
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
    checkInputs() {
      if (this.customername && this.selectedRoadmap && this.selectedBom) {
        this.valid = true;
      } else {
        this.valid = false;
      }
    },
    async updateProduct() {
      this.$refs.form.validate();
      if (!this.productName) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PRODUCT_NAME_EMPTY',
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
