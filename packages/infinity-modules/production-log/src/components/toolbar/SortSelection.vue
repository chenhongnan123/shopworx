<template>
  <v-select
    dense
    outlined
    return-object
    item-text="name"
    v-model="timeSort"
    :items="sortList"
    label="Order by"
    prepend-inner-icon="mdi-sort-variant"
  ></v-select>
</template>

<script>
import {
  mapMutations,
  mapGetters,
} from 'vuex';

const FIELD_NAME = 'firstcycle';

export default {
  name: 'SortSelection',
  data() {
    return {
      sortList: [{
        name: 'Newest first',
        value: 'DESC',
      }, {
        name: 'Oldest first',
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
