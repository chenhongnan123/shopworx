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
        <template v-if="reportResults.length">
          <v-subheader>REPORTS</v-subheader>
          <v-list-item
            v-for="(result, index) in reportResults"
            :key="`report-${index}`"
            @click="navigateToReport(result)"
          >
            <v-list-item-icon>
              <v-icon>mdi-file-chart-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ result.reportDescription }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-divider v-if="reportResults.length && insightResults.length"></v-divider>
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
          <v-subheader>MOST VIEWED REPORTS</v-subheader>
          <v-list-item
            v-for="(result, index) in reports"
            :key="`mreport-${index}`"
            @click="navigateToReport(result)"
          >
            <v-list-item-icon>
              <v-icon>mdi-file-chart-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ result.reportDescription }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-subheader>RECENT REPORTS</v-subheader>
          <v-list-item
            v-for="(result, index) in reports"
            :key="`rreport-${index}`"
            @click="navigateToReport(result)"
          >
            <v-list-item-icon>
              <v-icon>mdi-file-chart-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ result.reportDescription }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
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
import { mapMutations } from 'vuex';

export default {
  name: 'InfinitySearch',
  data() {
    return {
      search: '',
      timeout: null,
      isFocused: false,
      isSearching: false,
      insight: null,
      report: null,
      menu: null,
      insights: [
        {
          name: 'What were the top reasons for downtime in the last week?',
          reportName: 1,
        },
        {
          name: 'What were the total parts produced last week, machine wise?',
          reportName: 2,
        },
        {
          name: 'What is the summary of yesterdays production?',
          reportName: 3,
        },
        {
          name: 'What is the trend of OEE over last 7 days?',
          reportName: 4,
        },
      ],
      reports: [
        {
          reportName: 'productionbymachine',
          reportDescription: 'Production By Machine',
        },
        {
          reportName: 'downtimebyreason',
          reportDescription: 'Downtime By Reasons',
        },
        {
          reportName: 'oeebymonth',
          reportDescription: 'OEE By Month',
        },
        {
          reportName: 'rejectionbyplan',
          reportDescription: 'Rejection By Plan',
        },
      ],
    };
  },
  beforeMount() {
    this.insight = new FlexSearch({
      doc: {
        id: 'reportName',
        field: 'name',
      },
    });
    this.report = new FlexSearch({
      doc: {
        id: 'reportName',
        field: 'reportDescription',
      },
    });
    this.insight.add(this.insights);
    this.report.add(this.reports);
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
    results() {
      if (this.insight === null || this.search === null) {
        return {
          insightResults: [],
          reportResults: [],
        };
      }
      const insightResults = this.insight.search({
        query: this.search,
        suggest: true,
        limit: 3,
      });
      const reportResults = this.report.search({
        query: this.search,
        suggest: true,
        limit: 3,
      });
      return {
        insightResults,
        reportResults,
      };
    },
    insightResults() {
      if (this.results && this.results.insightResults && this.results.insightResults.length) {
        return this.results.insightResults;
      }
      return [];
    },
    reportResults() {
      if (this.results && this.results.reportResults && this.results.reportResults.length) {
        return this.results.reportResults;
      }
      return [];
    },
    noText() {
      return !this.search;
    },
    noResults() {
      return !this.insightResults.length && !this.reportResults.length;
    },
  },
  methods: {
    ...mapMutations('insight', ['setQuery', 'setWindow']),
    ...mapMutations('helper', ['setInsightsDrawer']),
    executeInsight(query) {
      this.setWindow(1);
      this.setInsightsDrawer(true);
      this.setQuery(query);
    },
    navigateToReport(report) {
      this.$router.push({ name: 'reports', params: { id: report.reportName } });
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
