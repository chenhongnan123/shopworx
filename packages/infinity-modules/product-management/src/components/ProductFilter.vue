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
        Product filters
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
            v-model="selectedBOM"
            name="name"
            label="BOM name"
            item-text="name"
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
            v-model="selectedRoadmap"
            name="name"
            label="Roadmap name"
            item-text="name"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
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
          Apply
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
      selectedBOM: null,
      selectedRoadmap: null,
      flag: false,
    };
  },
  computed: {
    ...mapState('productManagement', ['filter', 'productList', 'productTypeCategory', 'bom', 'roadmapsDetails']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
  },
  methods: {
    ...mapMutations('productManagement', ['setProductList', 'setFilter', 'toggleFilter']),
    ...mapActions('productManagement', ['getProductListRecords']),
    btnApply() {
      if (this.selectedBOM) {
        this.setProductList(this.productList.filter((r) => r.bomname === this.selectedBOM));
      }
      if (this.selectedRoadmap) {
        this.setProductList(this.productList.filter((r) => r.roadmapname === this.selectedRoadmap));
      }
    },
    async btnReset() {
      await this.getProductListRecords('');
      this.toggleFilter();
      this.selectedBOM = '';
      this.selectedRoadmap = '';
    },
  },
};
</script>
