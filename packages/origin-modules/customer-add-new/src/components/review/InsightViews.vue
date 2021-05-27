<template>
  <v-card flat>
    <v-card-text class="ml-4">
      <v-row no-gutters>
        <v-col cols="12">
          <v-progress-linear
            :value="(completed/totalInsights)*100"
            height="25"
          >
            <strong class="white--text">{{completed}}/{{totalInsights}}</strong>
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import insights from '../../data/insightsPayload';

export default {
  name: 'InsightViews',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      completed: 0,
      insights,
    };
  },
  created() {
    if (this.complete) {
      this.completed = this.totalInsights;
    }
  },
  computed: {
    totalInsights() {
      const allInsights = this.insights
        .map((i) => i.insights)
        .flat();
      return allInsights.length;
    },
  },
  methods: {
    ...mapActions('newCustomer', [
      'getInsightCategories',
      'addInsightView',
      'getReports',
    ]),
  },
  watch: {
    async loading(val) {
      if (val) {
        const reports = await this.getReports();
        const insightCatgories = await this.getInsightCategories();
        if (reports && reports.length) {
          const created = [];
          for (let i = 0; i < this.insights.length; i += 1) {
            const insight = this.insights[i];
            const { id: reportId } = reports.find((r) => r.reportName === insight.reportName);
            const { id: categoryId } = insightCatgories
              .find((r) => r.name === insight.categoryName);
            const payload = {
              insightViewName: insight.insightViewName,
              inputMap: insight.inputMap,
              parentId: insight.parentId,
              categoryId,
              reportId,
            };
            // eslint-disable-next-line
            const added = await this.addInsightView(payload);
            if (added) {
              this.completed += 1;
            }
            created.push(added);
          }
          if (created.every((c) => c === true)) {
            this.$emit('on-complete');
          }
        }
      }
    },
  },
};
</script>
