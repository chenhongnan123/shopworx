<template>
  <v-menu
    v-model="menu"
    offset-y
    attach
  >
  <template #activator="{ on }">
    <v-text-field
      flat
      solo
      dense
      v-on="on"
      id="search"
      single-line
      name="search"
      hide-details
      label="Search for reports and insights"
      autocomplete="off"
      v-model="searchText"
      prepend-inner-icon="$search"
      v-if="$vuetify.breakpoint.mdAndUp"
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
              <v-icon v-text="'$reports'"></v-icon>
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
              <v-icon v-text="'$insights'"></v-icon>
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
              <v-icon v-text="'$reports'"></v-icon>
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
              <v-icon v-text="'$reports'"></v-icon>
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
              <v-icon v-text="'$insights'"></v-icon>
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
                No result for '{{ searchText }}'
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import SearchService from '@shopworx/services/util/search.service';
import { mapMutations } from 'vuex';

export default {
  name: 'SearchBar',
  data() {
    return {
      insight: null,
      report: null,
      menu: null,
      searchText: null,
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
  watch: {
    searchText(val) {
      if (val) {
        this.menu = true;
      }
    },
  },
  beforeMount() {
    this.insight = new SearchService({
      doc: {
        id: 'reportName',
        field: 'name',
      },
    });
    this.report = new SearchService({
      doc: {
        id: 'reportName',
        field: 'reportDescription',
      },
    });
    this.insight.add(this.insights);
    this.report.add(this.reports);
  },
  computed: {
    results() {
      if (this.insight === null || this.searchText === null) {
        return {
          insightResults: [],
          reportResults: [],
        };
      }
      const insightResults = this.insight.search({
        query: this.searchText,
        suggest: true,
        limit: 3,
      });
      const reportResults = this.report.search({
        query: this.searchText,
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
      return !this.searchText;
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
  },
};
</script>
