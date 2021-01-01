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
        Material filters
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleFilter">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 220px)">
          <!-- <v-autocomplete
            class="mt-5"
            :items="lineList"
            outlined
            dense
            hide-details
            v-model="line"
            name="name"
            label="Select Line"
            item-text="name"
            item-value="id"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete> -->
          <!-- <v-autocomplete
            class="mt-5"
            :items="sublineList"
            outlined
            dense
            hide-details
            v-model="subline"
            name="name"
            label="Select Subine"
            item-text="name"
            item-value="id"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete> -->
          <v-autocomplete
            class="mt-5"
            :items="materialList"
            outlined
            dense
            hide-details
            v-model="materialname"
            name="name"
            label="Material Name"
            item-text="name"
            clearable
            return-object
            @change="getFilteredNum"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="filteredMaterialNum"
            outlined
            dense
            hide-details
            v-model="materialnumber"
            name="materialnumber"
            label="Material Number"
            item-text="materialnumber"
            clearable
            return-object
            @change="filteredMaterialCategory"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.materialnumber"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="filterdMateriallCat"
            outlined
            dense
            hide-details
            v-model="materialncategory"
            name="name"
            label="Category"
            item-text="name"
            item-value="id"
            clearable
            return-object
            @change="filteredMaterialType"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="filterdMaterialType"
            outlined
            dense
            hide-details
            v-model="materialtype"
            name="materialtype"
            label="Material TypeID"
            item-text="materialtype"
            clearable
            return-object
            @change="filteredMaterialManufacturer"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.materialtype"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="filteredManufacture"
            outlined
            dense
            hide-details
            v-model="manufacturer"
            name="name"
            label="Manufacturer"
            item-text="manufacturer"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.manufacturer"></v-list-item-title>
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
  name: 'MaterialFilter',
  created() {
  },
  data() {
    return {
      materialname: null,
      materialnumber: null,
      materialncategory: null,
      materialtype: null,
      manufacturer: null,
    };
  },
  computed: {
    ...mapState('materialManagement', ['filter', 'materialList', 'lineList', 'sublineList', 'categoryList', 'filteredMaterialNum', 'filterdMateriallCat', 'filterdMaterialType', 'filteredManufacture']),
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
    ...mapMutations('materialManagement', ['setFilter', 'toggleFilter', 'setFilterMaterialNum', 'setFilterMaterialCat', 'setFilterMaterialType', 'setFilterMaterialMft']),
    ...mapActions('materialManagement', ['getMaterialListRecords', 'getSublineList']),
    btnApply() {
      let query = '?query=';
      if (this.materialname) {
        query += `name=="${this.materialname.name}"&`;
      }
      if (this.materialnumber) {
        query += `materialnumber==${this.materialnumber.materialnumber}&`;
      }
      if (this.materialncategory) {
        query += `materialcategory==${this.materialncategory.id}&`;
      }
      if (this.materialtype) {
        query += `materialtype=="${this.materialtype.materialtype}"&`;
      }
      if (this.manufacturer) {
        query += `manufacturer=="${this.manufacturer}"&`;
      }
      this.getMaterialListRecords(query);
    },
    btnReset() {
      this.getMaterialListRecords('');
      this.toggleFilter();
      this.materialname = '';
      this.materialnumber = '';
      this.materialncategory = '';
      this.materialtype = '';
      this.manufacturer = '';
      this.line = '';
      this.subline = '';
    },
    async getFilteredNum(item) {
      const materialNum = this.materialList.filter((o) => o.id === item.id);
      this.setFilterMaterialNum(materialNum);
      console.log(materialNum);
    },
    async filteredMaterialCategory(item) {
      const materialCategory = this.categoryList.filter((o) => o.id === item.materialcategory);
      this.setFilterMaterialCat(materialCategory);
    },
    async filteredMaterialType(item) {
      const materialType = this.materialList.filter((o) => o.materialcategory === item.id);
      this.setFilterMaterialType(materialType);
    },
    async filteredMaterialManufacturer(item) {
      const materialMft = this.materialList.filter((o) => o.manufacturer === item.manufacturer);
      this.setFilterMaterialMft(materialMft);
    },
  },
};
</script>
