<template>
  <v-date-picker
    flat
    range
    no-title
    full-width
    :max="today"
    v-model="date"
  ></v-date-picker>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

const FIELD_NAME = 'date';

export default {
  name: 'DateSelection',
  data() {
    return {
      menu: false,
      today: new Date().toISOString().substr(0, 10),
    };
  },
  computed: {
    ...mapGetters('webApp', ['filters']),
    isDateFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    date: {
      get() {
        const dateFilter = this.filters && this.filters[FIELD_NAME];
        if (dateFilter) {
          return dateFilter.value;
        }
        return [
          this.today,
          this.today,
        ];
      },
      async set(dateVal) {
        this.setDateFilter(dateVal);
        if (dateVal && dateVal.length === 2) {
          let [start, end] = dateVal;
          if (new Date(end).getTime() < new Date(start).getTime()) {
            const temp = start;
            start = end;
            end = temp;
          }
          this.setDateFilter([start, end]);
          await this.fetchPlanningList();
        }
      },
    },
  },
  created() {
    if (this.isDateFilterInactive) {
      this.setDateFilter([
        this.today,
        this.today,
      ]);
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    ...mapActions('productionPlanning', ['fetchPlanningList']),
    setDateFilter(val) {
      this.setFilter({
        field: FIELD_NAME,
        value: {
          value: val,
          operation: 'range',
        },
      });
    },
  },
};
</script>
