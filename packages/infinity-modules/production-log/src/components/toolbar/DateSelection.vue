<template>
  <v-date-picker
    flat
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
        return this.today;
      },
      async set(dateVal) {
        this.setDateFilter(dateVal);
        await this.fetchProductionList();
      },
    },
  },
  created() {
    if (this.isDateFilterInactive) {
      this.setDateFilter(this.today);
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    ...mapActions('productionLog', ['fetchProductionList']),
    setDateFilter(val) {
      this.setFilter({
        field: FIELD_NAME,
        value: {
          value: val,
          operation: 'eq',
        },
      });
    },
  },
};
</script>
