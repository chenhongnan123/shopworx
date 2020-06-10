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
        :loading="loading"
        class="text-none ml-2"
      >
        {{ reportMapping ? reportMapping.aggregationType : '' }}
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        :key="mapping.id"
        v-for="mapping in reportMappings"
        @click="setReportMapping(mapping)"
      >
        <v-list-item-title>{{ mapping.aggregationType }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ReportMappings',
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('reports', ['reportMappings', 'reportView', 'reportMapping']),
  },
  created() {
    this.fetchReportMappings();
  },
  watch: {
    reportView() {
      this.fetchReportMappings();
    },
    reportMappings() {
      if (this.reportMappings && this.reportMappings.length) {
        this.setReportMapping(this.reportMappings[0]);
      } else {
        this.setReportMapping(null);
      }
    },
  },
  methods: {
    ...mapActions('reports', ['getReportMappings']),
    ...mapMutations('reports', ['setReportMapping']),
    async fetchReportMappings() {
      if (this.reportView) {
        this.loading = true;
        await this.getReportMappings();
        this.loading = false;
      }
    },
  },
};
</script>
