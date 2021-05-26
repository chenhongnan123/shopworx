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
        Recipe filters
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
            v-model="sublines"
            :items="subLineList"
            outlined
            dense
            hide-details
            return-object
            item-text="name"
            :label="this.$t('Select Subline')"
            @change="onChangeSubLine(sublines)"
          ></v-autocomplete>
          <div class="subheading font-weight-regular mt-4"></div>
          <v-autocomplete
            v-model="stations"
            :items="stationList"
            outlined
            dense
            hide-details
            return-object
            item-text="name"
            :label="this.$t('Select Station')"
            @change="onChangeStation(stations)"
          ></v-autocomplete>
          <div class="subheading font-weight-regular mt-4"></div>
          <v-autocomplete
            v-model="recipes"
            :items="recipeNames"
            outlined
            dense
            hide-details
            return-object
            item-text="recipename"
            :label="this.$t('Select Recipe name')"
            @change="onChangeRecipe(recipes)"
          ></v-autocomplete>
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
        <v-btn class="text-none" color="primary" @click="btnReset" text>Reset</v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'RecipeFilter',
  async created() {
    await this.getRecipeNameByStation('');
  },
  data() {
    return {
      lines: null,
      sublines: null,
      stations: null,
      recipes: null,
    };
  },
  computed: {
    ...mapState('recipeManagement', ['recipeList', 'filter', 'subLineList', 'stationList', 'filterBList', 'subStationList', 'recipeNames']),
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
    ...mapActions('recipeManagement', ['getRecipeListRecords', 'getStations', 'getSubStations', 'getRecipeNameByStation']),
    ...mapMutations('recipeManagement', ['setFilter', 'toggleFilter', 'setFilterSubLine', 'setFilterStation', 'setRecipeList', 'setFilterRecipe']),
    onChangeLine() {
    },
    async onChangeSubLine(val) {
      this.$root.$emit('filteredSubline', val);
      const query = `?query=sublineid=="${val.id}"`;
      await this.getStations(query);
    },
    async onChangeStation(val) {
      this.$root.$emit('filteredStation', val);
      const query = `?query=stationid=="${val.id}"`;
      await this.getRecipeNameByStation(query);
      // this.setRecipeList(this.recipeNames);
    },
    onChangeRecipe(val) {
      this.$root.$emit('filteredRecipe', val);
    },
    async btnApply() {
      let query = '?query=';
      if (this.sublines != null && this.stations === null && this.recipes === null) {
        this.setFilterSubLine(this.sublines);
        query += `sublineid=="${this.sublines.id}"`;
      }
      if (this.stations != null && this.sublines === null && this.recipes === null) {
        this.setFilterStation(this.stations);
        query += `stationid=="${this.stations.id}"`;
      }
      if (this.recipes != null && this.sublines === null && this.stations === null) {
        this.setFilterRecipe(this.recipes);
        query += `recipenumber=="${this.recipes.recipenumber}"`;
      }
      if (this.sublines != null && this.stations != null && this.recipes === null) {
        this.setFilterSubLine(this.sublines);
        this.setFilterStation(this.stations);
        query += `sublineid=="${this.sublines.id}"%26%26stationid=="${this.stations.id}"`;
      }
      if (this.stations != null && this.recipes != null && this.sublines === null) {
        this.setFilterStation(this.stations);
        this.setFilterRecipe(this.recipes);
        query += `stationid=="${this.stations.id}"%26%26recipenumber=="${this.recipes.recipenumber}"`;
      }
      if (this.sublines != null && this.stations != null && this.recipes != null) {
        this.setFilterSubLine(this.sublines);
        this.setFilterStation(this.stations);
        this.setFilterRecipe(this.recipes);
        query += `sublineid=="${this.sublines.id}"%26%26stationid=="${this.stations.id}"%26%26recipenumber=="${this.recipes.recipenumber}"`;
      }
      await this.getRecipeListRecords(query);
      this.toggleFilter();
    },
    async btnReset() {
      await this.getRecipeListRecords('');
      // this.setRecipeList(this.filterBList);
      this.$root.$emit('filteredSubline', null);
      this.$root.$emit('filteredStation', null);
      this.sublines = '';
      this.stations = '';
      this.recipes = '';
      this.setFilterSubLine(this.sublines);
      this.setFilterStation(this.stations);
      this.toggleFilter();
    },
  },
  async beforeDestroy() {
    this.sublines = '';
    this.stations = '';
    this.recipes = '';
  },
};
</script>
