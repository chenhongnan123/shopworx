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
          <v-autocomplete
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
          </v-autocomplete>
          <v-autocomplete
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
          </v-autocomplete>
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
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="materialList"
            outlined
            dense
            hide-details
            v-model="materialnumber"
            name="name"
            label="Material Number"
            item-text="materialnumber"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.materialnumber"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="materialList"
            outlined
            dense
            hide-details
            v-model="materialncategory"
            name="name"
            label="Category"
            item-text="materialncategory"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.materialncategory"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="materialList"
            outlined
            dense
            hide-details
            v-model="materialtype"
            name="name"
            label="Material TypeID"
            item-text="materialtype"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.materialtype"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="materialList"
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
          :disabled="!sublineValue"
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
    ...mapState('materialManagement', ['filter', 'materialList', 'lineList', 'sublineList', 'lineValue', 'sublineValue', 'categoryList']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
    line: {
      get() {
        return this.lineValue;
      },
      set(val) {
        this.setLineValue(val);
        this.setSublineValue('');
        console.log(val);
        const query = `?query=lineid==${val}`;
        this.getSublineList(query);
      },
    },
    subline: {
      get() {
        return this.sublineValue;
      },
      set(val) {
        this.setSublineValue(val);
      },
    },
  },
  methods: {
    ...mapMutations('materialManagement', ['setFilter', 'toggleFilter', 'setLineValue', 'setSublineValue']),
    ...mapActions('materialManagement', ['getMaterialListRecords', 'getSublineList']),
    btnApply() {
      let query = '?query=';
      if (this.materialname) {
        query += `name=="${this.materialname}"&`;
      }
      if (this.materialnumber) {
        query += `materialnumber=="${this.materialnumber}"&`;
      }
      if (this.materialncategory) {
        query += `materialncategory=="${this.materialncategory}"&`;
      }
      if (this.materialtype) {
        query += `materialtype=="${this.materialtype}"&`;
      }
      if (this.manufacturer) {
        query += `manufacturer=="${this.manufacturer}"&`;
      }
      query += `sublineid=="${this.sublineValue || null}"`;
      // const query = `?query=substationid=="${this.substationValue || null}"`;
      this.getMaterialListRecords(query);
    },
    btnReset() {
      this.getMaterialListRecords(`?sublineid=="${this.sublineValue || null}"`);
      this.toggleFilter();
      this.materialname = '';
      this.materialnumber = '';
      this.materialncategory = '';
      this.materialtype = '';
      this.manufacturer = '';
      this.line = '';
      this.subline = '';
    },
  },
};
</script>
