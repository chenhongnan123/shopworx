<template>
  <v-card flat class="transparent">
    <v-subheader
      class="caption py-0 text-uppercase"
      v-text="$t('infinity.insights.onDemand.header')"
    ></v-subheader>
    <v-card-text class="pa-0">
      <v-expansion-panels accordion>
        <v-expansion-panel
          :key="index"
          class="my-1 transparent"
          v-for="(insight, index) in insights"
        >
          <v-expansion-panel-header class="body-2 px-0">
            <v-row no-gutters>
              <v-col cols="2" class="px-1">
                <v-icon v-text="insight.icon"></v-icon>
              </v-col>
              <v-col cols="9">
                <span v-text="insight.category"></span>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="exapnsion-padding">
            <template v-for="(query, n) in insight.queries">
              <v-card
                :key="n"
                flat
                class="transparent my-1"
                @click="navigateToDetails(query)"
              >
                <v-card-text
                  class="pa-0 px-2 text-justify"
                  :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"
                >
                  <span v-text="query.name"></span>
                </v-card-text>
              </v-card>
              <v-divider :key="`divider-${n}`"></v-divider>
            </template>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'InsightsOnDemand',
  data() {
    return {
      insights: [
        {
          category: 'Basic performance',
          icon: 'mdi-speedometer',
          queries: [
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
          ],
        },
        {
          category: 'Understanding trends',
          icon: 'mdi-trending-up',
          queries: [
            {
              name: 'What is the trend of OEE over last 7 days?',
              reportName: 4,
            },
          ],
        },
      ],
    };
  },
  methods: {
    ...mapMutations('insight', ['setWindow', 'setQuery']),
    navigateToDetails(query) {
      this.setQuery(query);
      this.setWindow(1);
    },
  },
};
</script>

<style>
.exapnsion-padding .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>
