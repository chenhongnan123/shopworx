<template>
  <!-- eslint-disable max-len -->
  <v-navigation-drawer absolute right :overlay-opacity="0" temporary v-model="showFilter">
    <v-toolbar flat :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'">
      <v-toolbar-title>
        Parameter filters
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleFilter">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 220px)">
          <v-autocomplete class="mt-5" :items="elementList" outlined dense hide-details v-model="element" name="name" label="Select Element" item-text="elementdescription" item-value="elementName" clearable>
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.elementname"></v-list-item-title>
                <v-list-item-subtitle v-text="item.elementdescription"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn class="text-none" color="primary" @click="btnApply" :class="$vuetify.theme.dark ? 'black--text' : 'white--text'" :disabled="!element" :loading="saving"> Apply </v-btn>
        <v-btn class="text-none" color="primary" @click="btnReset" text>
          Reset
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'SpcFilter',
  created() {},
  data() {
    return {
      saving: false,
    };
  },
  computed: {
    ...mapState('masters', ['elements']),
    ...mapState('spc', ['filter', 'isApply', 'elementValue']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
    element: {
      get() {
        return this.elementValue;
      },
      set(val) {
        this.setElementValue(val);
      },
    },
    elementList() {
      // eslint-disable-next-line
      return this.elements.map((element) => {
        return element.element;
      });
    },
  },
  methods: {
    ...mapMutations('spc', ['setFilter', 'toggleFilter', 'setApply', 'setElementValue']),
    ...mapActions('spc', ['getParameterListRecords', 'getSublineList', 'getStationList', 'getSubstationList', 'getLineList', 'getParameters', 'getSpcconfigurationListRecords']),
    async btnApply() {
      let query = '?query=';
      if (this.elementValue) {
        query += `elementName=="${this.elementValue}"`;
      }
      this.saving = true;

      await this.getSpcconfigurationListRecords(query);
      this.saving = false;

      this.toggleFilter();
      this.setApply(true);
    },
    btnReset() {
      this.getSpcconfigurationListRecords('?pagenumber=1&pagesize=10');
      this.toggleFilter();
      this.element = '';
    },
  },
};
</script>
