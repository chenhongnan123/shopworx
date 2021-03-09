<template>
  <v-select
    dense
    outlined
    label="Type"
    v-model="type"
    return-object
    item-text="name"
    :items="typeList"
    prepend-inner-icon="mdi-text-box-multiple-outline"
  ></v-select>
</template>

<script>
import {
  mapMutations,
  mapGetters,
} from 'vuex';

const FIELD_NAME = 'reasonname';

export default {
  name: 'TypeSelection',
  data() {
    return {
      typeList: [{
        name: 'All',
        value: 'All',
      }, {
        name: 'With reason',
        value: 'reason',
      }, {
        name: 'Without reason',
        value: 'noreason',
      }],
    };
  },
  computed: {
    ...mapGetters('webApp', ['filters']),
    isTypeFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    type: {
      get() {
        const typeFilter = this.filters && this.filters[FIELD_NAME];
        if (typeFilter) {
          const value = this.typeList.find((s) => s.value === typeFilter.value);
          if (value) {
            return value;
          }
        }
        return this.typeList[0];
      },
      set(typeVal) {
        this.setTypeFilter(typeVal);
      },
    },
  },
  created() {
    if (this.isTypeFilterInactive) {
      this.setTypeFilter(this.typeList[0]);
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    setTypeFilter(type) {
      this.setFilter({
        field: FIELD_NAME,
        value: {
          value: type.value,
          operation: type.value === 'reason'
            ? 'exists'
            : 'notexists',
        },
      });
    },
  },
};
</script>
