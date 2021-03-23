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
            :items="recipeList"
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
  created() {
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
    ...mapState('recipeManagement', ['recipeList', 'filter', 'subLineList', 'stationList', 'filterBList']),
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
    ...mapActions('recipeManagement', ['getRecipeListRecords']),
    ...mapMutations('recipeManagement', ['setFilter', 'toggleFilter', 'setFilterSubLine', 'setFilterStation', 'setRecipeList', 'setFilterRecipe']),
    onChangeLine() {
    },
    onChangeSubLine(val) {
      this.$root.$emit('filteredSubline', val);
    },
    onChangeStation(val) {
      this.$root.$emit('filteredStation', val);
    },
    onChangeRecipe(val) {
      console.log(val);
      this.$root.$emit('filteredRecipe', val);
    },
    btnApply() {
      if (this.sublines != null) {
        this.setFilterSubLine(this.sublines);
        const newarray = this.filterBList.filter((o) => o.sublineid === this.sublines.id);
        this.setRecipeList(newarray);
        if (this.stations != null) {
          this.setFilterStation(this.stations);
          this.setRecipeList(this.filterBList.filter((o) => o.stationid === this.stations.id));
        }
        if (this.recipes != null) {
          this.setFilterRecipe(this.recipes);
          this.setRecipeList(this.filterBList
            .filter((o) => o.recipename === this.recipes.recipename));
        }
      } else if (this.stations != null) {
        this.setFilterStation(this.stations);
        const newStation = this.filterBList.filter((o) => o.stationid === this.stations.id);
        this.setRecipeList(newStation);
      } else if (this.recipes != null) {
        this.setFilterRecipe(this.recipes);
        console.log(this.filterBList);
        const newRecipe = this.filterBList.filter((o) => o.recipename === this.recipes.recipename);
        this.setRecipeList(newRecipe);
      }
      this.toggleFilter();
    },
    async btnReset() {
      await this.getRecipeListRecords('');
      // this.setRecipeList(this.filterBList);
      this.$root.$emit('filteredSubline', null);
      this.$root.$emit('filteredStation', null);
      this.sublines = '';
      this.stations = '';
      this.setFilterSubLine(this.sublines);
      this.setFilterStation(this.stations);
      this.toggleFilter();
    },
  },
};
</script>
