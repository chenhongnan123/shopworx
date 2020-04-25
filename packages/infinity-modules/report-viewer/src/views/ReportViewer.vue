<template>
  <div style="height: 2000px;">
    <portal to="app-header">
      Production reports
    </portal>
    <portal
      to="app-extension"
    >
      <div>
        <v-btn
          small
          color="primary"
          class="text-none"
          disabled
        >
          Saved
        </v-btn>
        <v-btn
          small
          color="primary"
          class="text-none ml-2"
        >
          Save as...
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
        >
          Reports
          <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
        </v-btn>
      </div>
    </portal>
    <v-toolbar
      flat
      dense
      class="stick"
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <v-icon small class="mr-1 mb-1">mdi-lock</v-icon>
      <v-toolbar-title>
        <span v-if="!edit">
          {{ reportName }}
        </span>
        <v-text-field
          dense
          v-else
          outlined
          ref="title"
          single-line
          hide-details
          v-model="newReportName"
          @blur="onBlur"
          autocomplete="off"
          @keydown.esc="onEsc"
          @keydown.enter="onEnter"
        ></v-text-field>
      </v-toolbar-title>
      <v-btn small icon class="ml-2 mb-1" @click="onEdit" v-if="!edit">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn small outlined color="primary" class="text-none">
        <v-icon small left>mdi-calendar-range-outline</v-icon>
        Date range
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
      <v-btn small color="primary" outlined class="text-none ml-2">
        Monthly
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
      <v-btn small color="primary" outlined class="text-none ml-2">
        <v-icon small left>mdi-chart-bar</v-icon>
        Bar
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </v-toolbar>
    <report-container />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import ReportContainer from '../components/ReportContainer.vue';

export default {
  name: 'ReportViewer',
  components: {
    ReportContainer,
  },
  data() {
    return {
      edit: false,
      reportName: 'Production by plan',
      newReportName: '',
    };
  },
  async created() {
    this.setExtendedHeader(true);
    await this.getReportViews();
  },
  watch: {
    $route() {
      this.setExtendedHeader(true);
    },
  },
  methods: {
    ...mapActions('reports', ['getReportViews']),
    ...mapMutations('helper', ['setExtendedHeader']),
    onEdit() {
      this.newReportName = this.reportName;
      this.edit = true;
      this.$nextTick(() => {
        this.$refs.title.focus();
      });
    },
    onBlur() {
      this.edit = false;
    },
    onEsc() {
      this.newReportName = this.reportName;
      this.$refs.title.blur();
    },
    onEnter() {
      this.reportName = this.newReportName;
      this.$refs.title.blur();
    },
  },
};
</script>
