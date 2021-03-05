<template>
  <v-select
    dense
    outlined
    v-if="isMobile"
    label="Part"
    v-model="part"
    :items="partList"
    prepend-inner-icon="$production"
  ></v-select>
  <v-combobox
    dense
    v-else
    outlined
    label="Part"
    v-model="part"
    :items="partList"
    prepend-inner-icon="$production"
  ></v-combobox>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

const FIELD_NAME = 'partname';

export default {
  name: 'PartSelection',
  computed: {
    ...mapGetters('webApp', ['filters']),
    ...mapGetters('productionPlanning', ['partList']),
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isPartFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    part: {
      get() {
        const partFilter = this.filters && this.filters[FIELD_NAME];
        if (partFilter) {
          return partFilter.value;
        }
        return this.partList[0];
      },
      set(partVal) {
        this.setPartFilter(partVal);
      },
    },
  },
  created() {
    if (this.partList && this.partList.length) {
      if (this.isPartFilterInactive) {
        this.setPartFilter(this.partList[0]);
      }
    } else {
      this.fetchParts();
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    ...mapActions('productionPlanning', ['fetchParts']),
    setPartFilter(val) {
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
    partList(val) {
      if (val && val.length) {
        if (this.isPartFilterInactive) {
          this.setPartFilter(val[0]);
        }
      }
    },
  },
};
</script>
