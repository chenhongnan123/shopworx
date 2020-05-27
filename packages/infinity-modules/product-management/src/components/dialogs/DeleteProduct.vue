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
        <span v-text="$t('displayTags.deleteHeader')"></span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <span v-text="$t('displayTags.deleteConfirmMeaasge')"></span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          @click="deleteProduct"
        >
          {{$t('displayTags.buttons.confirm')}}
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
  name: 'DeleteProduct',
  data() {
    return {};
  },
  props: {
    productToDelete: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('productManagement', ['deleteDialog']),
    dialog: {
      get() {
        return this.deleteDialog;
      },
      set(val) {
        this.setDeleteDialog(val);
      },
    },
  },
  mounted() {
    this.loadingProducts = false;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('productManagement', ['setDeleteDialog']),
    ...mapActions('productManagement', ['delectByQuery', 'getProductListRecords']),
    async deleteProduct() {
      console.log('PD', this.productToDelete);
      await this.delectByQuery({
        elementName: 'productdetails',
        productName: this.productToDelete.productname,
      });
      const deleteProduct = await await this.delectByQuery({
        elementName: 'part',
        productName: this.productToDelete.productname,
      });
      if (deleteProduct) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PRODUCT_DELETED',
        });
        this.getProductListRecords('');
        this.dialog = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_PRODUCT',
        });
      }
    },
  },
};
</script>
