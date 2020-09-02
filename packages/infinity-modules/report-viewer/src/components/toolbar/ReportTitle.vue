<template>
  <div>
    <v-icon
      small
      v-if="!edit && isBaseReport"
      class="mr-1 mb-1"
    >
      mdi-lock
    </v-icon>
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
      v-model="reportName"
      @blur="onBlur"
      autocomplete="off"
      @keydown.esc="onEsc"
      @keydown.enter="onEnter"
    ></v-text-field>
    <v-btn
      small
      icon
      class="mx-2 mb-1"
      @click="onEdit"
      v-if="!edit && !isBaseReport"
    >
      <v-icon small>mdi-pencil</v-icon>
    </v-btn>
    <v-btn
      icon
      small
      class="mb-1"
      v-if="!edit"
      @click="executeReport()"
    >
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
  mapMutations,
  mapActions,
} from 'vuex';

export default {
  name: 'ReportTitle',
  data() {
    return {
      edit: false,
    };
  },
  computed: {
    ...mapState('reports', ['newReportTitle']),
    ...mapGetters('reports', ['reportTitle', 'isBaseReport']),
    reportName: {
      get() {
        return this.newReportTitle;
      },
      set(val) {
        this.setNewReportTitle(val);
      },
    },
  },
  created() {
    this.setNewReportTitle(this.reportTitle);
  },
  watch: {
    reportTitle(val) {
      this.setNewReportTitle(val);
    },
  },
  beforeDestroy() {
    this.setNewReportTitle(null);
  },
  methods: {
    ...mapActions('reports', ['executeReport']),
    ...mapMutations('reports', ['setNewReportTitle']),
    onEdit() {
      this.edit = true;
      this.$nextTick(() => {
        this.$refs.title.focus();
      });
    },
    onBlur() {
      this.edit = false;
    },
    onEsc() {
      this.$refs.title.blur();
    },
    onEnter() {
      this.$refs.title.blur();
    },
  },
};
</script>
