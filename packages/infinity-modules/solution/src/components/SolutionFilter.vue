<template>
  <!-- eslint-disable max-len -->
  <v-navigation-drawer absolute right :overlay-opacity="0" temporary v-model="showFilter">
    <v-toolbar flat :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'">
      <v-toolbar-title>
        {{ $t('solution.filter.title') }}
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
            :items="solutiontypeList"
            outlined
            dense
            hide-details
            v-model="type"
            name="name"
            :label="$t('solution.main.header.type')"
            item-text="name"
            item-value="name"
            clearable
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
          :disabled="!type"
          :loading="saving"
        >
          {{ $t('solution.general.apply') }}
        </v-btn>
        <v-btn class="text-none" color="primary" @click="btnReset" text>
          {{ $t('solution.general.reset') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'SolutionFilter',
  data() {
    return {
      saving: false,
    };
  },
  computed: {
    ...mapState('solution', ['filter', 'solutiontypeList', 'solutiontypeValue', 'assets']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
    type: {
      get() {
        return this.solutiontypeValue;
      },
      set(val) {
        this.setSolutiontypeValue(val);
      },
    },
  },
  methods: {
    ...mapMutations('solution', [
      'setFilter',
      'toggleFilter',
      'setSolutiontypeList',
      'setSolutiontypeValue',
      'setApply',
    ]),
    ...mapActions('solution', [
      'updateSolution',
      'deleteSolution',
      'createSolution',
      'createSolutionList',
      'getDepartments',
      'getPositions',
      'getRecords',
    ]),
    async btnApply() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.type) {
        query += `%26%26type=="${this.type}"`;
      }
      this.saving = true;

      await this.getRecords(query);
      this.saving = false;

      this.toggleFilter();
      this.setApply(true);
    },
    btnReset() {
      this.getRecords('?pagenumber=1&pagesize=10');
      this.toggleFilter();
      this.type = '';
    },
  },
};
</script>
