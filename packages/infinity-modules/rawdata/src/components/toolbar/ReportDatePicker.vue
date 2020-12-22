<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :close-on-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    ref="menu"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        small
        outlined
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="text-none"
      >
        <v-icon small left>mdi-calendar-range-outline</v-icon>
        {{ dateRangeText }}
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-date-picker
      range
      :max="today"
      v-model="dates"
      no-title scrollable
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        class="text-none"
        :disabled="dates.length != 2"
        @click="saveDateRange"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'ReportDatePicker',
  data() {
    return {
      today: new Date().toISOString().substr(0, 10),
      dates: [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
      menu: false,
    };
  },
  created() {
    this.dates = this.dateRange;
  },
  computed: {
    ...mapState('rawdata', ['dateRange']),
    dateRangeText() {
      return this.dates.join(' to ');
    },
  },
  methods: {
    ...mapMutations('rawdata', ['setDateRange']),
    saveDateRange() {
      if (this.dates && this.dates.length === 2) {
        let [start, end] = this.dates;
        if (new Date(end).getTime() < new Date(start).getTime()) {
          const temp = start;
          start = end;
          end = temp;
          this.dates = [start, end];
        }
        this.setDateRange([start, end]);
      }
      this.$refs.menu.save(this.dates);
    },
  },
};
</script>
