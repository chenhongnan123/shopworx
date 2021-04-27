<template>
  <v-select
    dense
    outlined
    return-object
    item-text="name"
    v-model="timeSort"
    :items="sortList"
    :label="$t('downtime.orderBy')"
    prepend-inner-icon="mdi-sort-variant"
  ></v-select>
</template>

<script>
import {
  mapMutations,
  mapGetters,
} from 'vuex';

const FIELD_NAME = 'downtimestart';

export default {
  name: 'SortSelection',
  data() {
    return {
      sortList: [{
        name: this.$t('downtime.newest'),
        value: 'DESC',
      }, {
        name: this.$t('downtime.oldest'),
        value: 'ASC',
      }],
    };
  },
  computed: {
    ...mapGetters('webApp', ['sort']),
    isTimeSortInactive() {
      return !Object
        .keys(this.sort)
        .includes(FIELD_NAME);
    },
    timeSort: {
      get() {
        const timeSort = this.sort && this.sort[FIELD_NAME];
        if (timeSort) {
          const value = this.sortList.find((s) => s.value === timeSort.value);
          if (value) {
            return value;
          }
        }
        return this.sortList[0];
      },
      set(sortVal) {
        this.setTimeSort(sortVal);
      },
    },
  },
  created() {
    if (this.isTimeSortInactive) {
      this.setTimeSort(this.sortList[0]);
    }
  },
  methods: {
    ...mapMutations('webApp', ['setSort']),
    setTimeSort(sort) {
      this.setSort({
        field: FIELD_NAME,
        value: sort.value,
      });
    },
  },
};
</script>
