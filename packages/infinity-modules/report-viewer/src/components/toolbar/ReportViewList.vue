<template>
  <v-menu
    bottom
    offset-y
  >
    <template #activator="{ on }">
      <v-btn
        small
        outlined
        v-on="on"
        color="primary"
        class="text-none ml-2"
      >
        Reports
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        :key="view.id"
        v-for="view in reportViews"
        @click="setReportView(view)"
      >
        <v-list-item-title>{{ view.reportViewName }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ReportViewList',
  computed: {
    ...mapState('reports', ['reportViews']),
  },
  created() {
    this.setDefaultView();
  },
  watch: {
    reportViews() {
      this.setDefaultView();
    },
  },
  beforeDestroy() {
    this.setReportViews([]);
    this.setReportView(null);
  },
  methods: {
    ...mapMutations('reports', ['setReportViews', 'setReportView']),
    setDefaultView() {
      if (this.reportViews && this.reportViews.length) {
        this.setReportView(this.reportViews[0]);
      } else {
        this.setReportView(null);
      }
    },
  },
};
</script>
