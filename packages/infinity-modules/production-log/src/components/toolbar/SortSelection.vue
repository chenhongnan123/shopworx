<template>
  <v-combobox
    dense
    outlined
    return-object
    item-text="name"
    v-model="sort"
    :items="sortList"
    label="Order by"
    prepend-inner-icon="mdi-sort-variant"
  ></v-combobox>
</template>

<script>
import {
  mapMutations,
  mapState,
} from 'vuex';

export default {
  name: 'SortSelection',
  data() {
    return {
      sortList: [{
        name: 'Newest first',
        value: 'new',
      }, {
        name: 'Oldest first',
        value: 'old',
      }],
    };
  },
  computed: {
    ...mapState('productionLog', ['selectedSort']),
    sort: {
      get() {
        return this.selectedSort;
      },
      set(val) {
        this.setSelectedSort(val);
      },
    },
  },
  methods: {
    ...mapMutations('productionLog', ['setSelectedSort']),
  },
  created() {
    if (!this.selectedSort) {
      this.setSelectedSort(this.sortList[0]);
    }
  },
};
</script>
