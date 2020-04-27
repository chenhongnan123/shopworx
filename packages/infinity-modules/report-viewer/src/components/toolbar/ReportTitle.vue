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
      class="ml-2 mb-1"
      @click="onEdit"
      v-if="!edit && !isBaseReport"
    >
      <v-icon small>mdi-pencil</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ReportTitle',
  data() {
    return {
      reportName: '',
      edit: false,
    };
  },
  computed: {
    ...mapGetters('reports', ['reportTitle', 'isBaseReport']),
  },
  created() {
    this.reportName = this.reportTitle;
  },
  watch: {
    reportTitle(val) {
      this.reportName = val;
    },
  },
  methods: {
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
