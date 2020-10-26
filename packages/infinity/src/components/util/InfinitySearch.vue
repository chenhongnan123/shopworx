<template>
  <v-menu
    v-model="menu"
    offset-y
    attach
  >
    <template #activator="{ on }">
      <v-text-field
        flat
        dense
        rounded
        v-on="on"
        outlined
        id="search"
        single-line
        ref="search"
        class="mr-2"
        hide-details
        :label="$t('modules.search')"
        @blur="onBlur"
        v-model="search"
        @focus="onFocus"
        autocomplete="off"
        @keydown.esc="onEsc"
        prepend-inner-icon="$search"
      ></v-text-field>
    </template>
    <v-card>
      <v-list dense>
        <template v-if="insightResults.length">
          <v-subheader>INSIGHTS</v-subheader>
          <v-list-item
            v-for="(result, index) in insightResults"
            :key="`insight-${index}`"
            @click="executeInsight(result)"
          >
            <v-list-item-icon>
              <v-icon>mdi-atom-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ result.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-if="noText">
          <v-subheader>INSIGHTS</v-subheader>
          <v-list-item
            v-for="(result, index) in insights"
            :key="`rinisght-${index}`"
            @click="executeInsight(result)"
          >
            <v-list-item-icon>
              <v-icon>mdi-atom-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ result.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-else-if="noResults">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                No result for '{{ search }}'
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import FlexSearch from 'flexsearch';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'InfinitySearch',
  data() {
    return {
      search: '',
      timeout: null,
      isFocused: false,
      isSearching: false,
      insight: null,
      menu: null,
    };
  },
  beforeMount() {
    this.insight = new FlexSearch({
      doc: {
        id: 'reportName',
        field: 'name',
      },
    });
    this.insight.add(this.insights);
  },
  watch: {
    insights: {
      deep: true,
      handler() {
        this.insight.add(this.insights);
      },
    },
  },
  mounted() {
    document.onkeydown = (event) => {
      const e = event || window.event;
      if (e.key === '/' && e.target !== this.$refs.search.$refs.input) {
        e.preventDefault();
        this.$refs.search.focus();
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
  },
  computed: {
    ...mapState('insight', ['insights']),
    results() {
      if (this.insight === null || this.search === null) {
        return {
          insightResults: [],
        };
      }
      const insightResults = this.insight.search({
        query: this.search,
        suggest: true,
        limit: 3,
      });
      return {
        insightResults,
      };
    },
    insightResults() {
      if (this.results && this.results.insightResults && this.results.insightResults.length) {
        return this.results.insightResults;
      }
      return [];
    },
    noText() {
      return !this.search;
    },
    noResults() {
      return !this.insightResults.length;
    },
  },
  methods: {
    ...mapMutations('insight', ['setQuery', 'setWindow', 'setLoading']),
    ...mapMutations('helper', ['setInsightsDrawer']),
    ...mapActions('insight', ['fetchInsightDetails']),
    async executeInsight(query) {
      this.setQuery(query);
      this.setWindow(1);
      this.setInsightsDrawer(true);
      this.setLoading(true);
      await this.fetchInsightDetails();
      this.setLoading(false);
    },
    onBlur() {
      this.resetSearch();
    },
    onEsc() {
      this.$refs.search.blur();
    },
    onFocus() {
      clearTimeout(this.timeout);
      this.isFocused = true;
    },
    resetSearch(timeout = 0) {
      clearTimeout(this.timeout);
      this.$nextTick(() => {
        this.search = undefined;
        this.isSearching = false;
        this.timeout = setTimeout(() => {
          this.isFocused = false;
        }, timeout);
      });
    },
  },
};
</script>
