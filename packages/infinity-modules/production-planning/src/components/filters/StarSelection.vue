<template>
  <v-checkbox
    class="ma-0 pa-0"
    label="Starred plans"
    v-model="starred"
  ></v-checkbox>
</template>

<script>
import {
  mapGetters,
  mapMutations,
} from 'vuex';

const FIELD_NAME = 'starred';

export default {
  name: 'StarSelection',
  computed: {
    ...mapGetters('webApp', ['filters']),
    isStarFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    starred: {
      get() {
        const starredFilter = this.filters && this.filters[FIELD_NAME];
        if (starredFilter) {
          return starredFilter.value;
        }
        return false;
      },
      set(starredVal) {
        this.setStarFilter(starredVal);
      },
    },
  },
  created() {
    if (this.isStarFilterInactive) {
      this.setStarFilter(false);
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    setStarFilter(val) {
      this.setFilter({
        field: FIELD_NAME,
        value: {
          value: val,
          operation: 'eq',
        },
      });
    },
  },
  watch: {
    starredList(val) {
      if (this.isStarFilterInactive) {
        this.setStarFilter(val);
      }
    },
  },
};
</script>
