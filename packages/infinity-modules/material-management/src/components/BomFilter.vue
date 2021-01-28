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
            item-value="id"
            clearable
            @change="getBomNameFromLine"
          >
          <template #item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="bomNameInState"
            outlined
            dense
            hide-details
            v-model="bomname"
            name="name"
            label="Bom Name"
            item-text="name"
            item-value="id"
            clearable
            return-object
            @change="getBomNumFromName"
          >
          <template #item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="bomNumInState"
            outlined
            dense
            hide-details
            v-model="bomnumber"
            name="name"
            label="Bom Number"
            item-text="bomnumber"
            item-value="id"
            clearable
            @change="setNumValue"
          >
          <template #item="{ item }">
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
    ...mapState('bomManagement', ['filter', 'bomList', 'lineList', 'sublineList', 'lineValue', 'bomValue', 'categoryList', 'bomNumInState', 'bomNameInState']),
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
      },
    },
  },
  methods: {
    ...mapMutations('bomManagement', ['setFilter', 'toggleFilter', 'setLineValue', 'setBomValue', 'seBomNumberInState', 'setBomNameInState', 'setBomNumValue']),
    ...mapActions('bomManagement', ['getBomListRecords', 'getSublineList']),
    btnApply() {
      let query = '?query=';
      if (this.bomname) {
        query += `name=="${this.bomname.name}"&`;
      }
      if (this.bomnumber) {
        query += `bomnumber=="${this.bomnumber}"&`;
      }
      query += `lineid=="${this.line || null}"`;
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
      this.setBomValue('');
      this.setBomNumValue('');
    },
    async getBomNameFromLine(item) {
      const bomName = this.bomList.filter((o) => o.lineid === item);
      this.setBomNameInState(bomName);
    },
    async getBomNumFromName(item) {
      this.setBomValue(item.id);
      const bomNum = this.bomList.filter((o) => o.id === item.id);
      this.seBomNumberInState(bomNum);
    },
    async setNumValue(item) {
      this.setBomNumValue(item);
    },
  },
};
</script>
