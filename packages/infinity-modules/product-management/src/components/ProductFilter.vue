<template>
  <v-navigation-drawer
    absolute
    right
    :overlay-opacity="0"
    temporary
    v-model="showFilter"
  >
    <v-toolbar
      flat
      :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'"
    >
      <v-toolbar-title>
        {{ $t('Product filters') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleFilter">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 180px)">
          <v-autocomplete
            :items="bom"
            outlined
            dense
            hide-details
            v-model="filteredBOM"
            name="name"
            :label="$t('BOM name')"
            item-text="name"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-2"
            :items="roadmapsDetails"
            outlined
            dense
            hide-details
            v-model="filteredRoadmap"
            name="name"
            :label="$t('Roadmap name')"
            item-text="name"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-2"
            :items="productList"
            outlined
            dense
            hide-details
            v-model="filteredProduct"
            name="productname"
            :label="this.$t('Product Type name')"
            item-text="productname"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.productname"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          class="text-none"
          color="primary"
          @click="btnApply"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          {{ $t('Apply') }}
        </v-btn>
        <v-btn
         class="text-none"
         color="primary"
         @click="btnReset"
         text>
         Reset
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'OrderFilter',
  created() {
  },
  data() {
    return {
      orderStatusSelected: null,
      // selectedProduct: null,
      // selectedBOM: null,
      // selectedRoadmap: null,
      flag: false,
    };
  },
  computed: {
    ...mapState('productManagement', ['filter', 'productList', 'productTypeCategory', 'bom', 'roadmapsDetails', 'selectedProduct', 'selectedBOM', 'selectedRoadmap']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
    filteredProduct: {
      get() {
        return this.selectedProduct;
      },
      set(val) {
        this.setSelectedProduct(val);
      },
    },
    filteredBOM: {
      get() {
        return this.selectedBOM;
      },
      set(val) {
        this.setSelectedBOM(val);
      },
    },
    filteredRoadmap: {
      get() {
        return this.selectedRoadmap;
      },
      set(val) {
        this.setSelectedRoadmap(val);
      },
    },
  },
  methods: {
    ...mapMutations('productManagement', ['setProductList', 'setFilter', 'toggleFilter', 'setSelectedProduct', 'setSelectedBOM', 'setSelectedRoadmap']),
    ...mapActions('productManagement', ['getProductListRecords']),
    btnApply() {
      let query = '?query=';
      if (this.filteredBOM) {
        query += `bomname=="${this.filteredBOM}"`;
      }
      if (this.filteredRoadmap) {
        if (query === '?query=') {
          query += `roadmapname=="${this.filteredRoadmap}"`;
        } else {
          query += `%26%26roadmapname=="${this.filteredRoadmap}"`;
        }
      }
      if (this.filteredProduct) {
        if (query === '?query=') {
          query += `productname=="${this.filteredProduct}"`;
        } else {
          query += `%26%26productname=="${this.filteredProduct}"`;
        }
      }
      this.getProductListRecords(query);
      this.toggleFilter();
    },
    async btnReset() {
      await this.getProductListRecords('');
      this.filteredBOM = '';
      this.filteredRoadmap = '';
      this.filteredProduct = '';
      this.toggleFilter();
    },
  },
};
</script>
