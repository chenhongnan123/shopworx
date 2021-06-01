<template>
  <v-card flat>
    <v-card-text class="ml-4">
      <v-row no-gutters>
        <v-col cols="12">
          <v-progress-linear
            :value="(completed/reports.length)*100"
            height="25"
          >
            <strong class="white--text">{{completed}}/{{reports.length}}</strong>
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import reports from '../../data/reportsPayload';

export default {
  name: 'Reports',
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
      reports,
    };
  },
  created() {
    if (this.complete) {
      this.completed = this.reports.length;
    }
  },
  methods: {
    ...mapActions('newCustomer', ['addReport', 'getReportCategories']),
  },
  watch: {
    async loading(val) {
      if (val) {
        const reportCategories = await this.getReportCategories();
        if (reportCategories && reportCategories.length) {
          const reportsCategoryId = reportCategories[0].id;
          const created = [];
          for (let i = 0; i < this.reports.length; i += 1) {
            const report = this.reports[i];
            // eslint-disable-next-line
            const added = await this.addReport({
              ...report,
              reportsCategoryId,
            });
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
