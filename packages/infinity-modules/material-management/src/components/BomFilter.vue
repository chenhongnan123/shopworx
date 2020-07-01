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
        bom filters
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
            return-object
            clearable
            @change="getfilteredBomNames"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
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
            :items="bomNamebylines"
            outlined
            dense
            hide-details
            v-model="bomname"
            name="name"
            label="Bom Name"
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
            :items="bomList"
            outlined
            dense
            hide-details
            v-model="bomnumber"
            name="name"
            label="Bom Number"
            item-text="bomnumber"
            clearable
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.bomnumber"></v-list-item-title>
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
  name: 'bomFilter',
  created() {
  },
  data() {
    return {
      bomname: null,
      bomnumber: null,
    };
  },
  computed: {
    ...mapState('bomManagement', ['filter', 'bomList', 'lineList', 'sublineList', 'lineValue', 'sublineValue', 'categoryList', 'bomNamebylines']),
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
        // console.log(val);
        // const query = `?query=lineid==${val}`;
        // this.getSublineList(query);
      },
    },
  },
  methods: {
    ...mapMutations('bomManagement', ['setFilter', 'toggleFilter', 'setLineValue', 'setSublineValue']),
    ...mapActions('bomManagement', ['getBomListRecords', 'getSublineList', 'getBomNamesbyline']),
    btnApply() {
      let query = '?query=';
      if (this.bomname) {
        query += `name=="${this.bomname}"&`;
      }
      if (this.bomnumber) {
        query += `bomnumber=="${this.bomnumber}"&`;
      }
      query += `lineid==${this.line.id || null}`;
      // const query = `?query=substationid=="${this.substationValue || null}"`;
      this.getBomListRecords(query);
      this.toggleFilter();
    },
    btnReset() {
      this.getBomListRecords('');
      this.toggleFilter();
      this.bomname = '';
      this.bomnumber = '';
      this.bomncategory = '';
      this.bomtype = '';
      this.manufacturer = '';
      this.line = '';
      this.subline = '';
    },
    async getfilteredBomNames(item) {
      await this.getBomNamesbyline(`?query=lineid==${item.id}`);
    },
  },
};
</script>
