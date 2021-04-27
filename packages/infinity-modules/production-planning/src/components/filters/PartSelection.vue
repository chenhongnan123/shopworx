<template>
  <v-select
    dense
    outlined
    item-value="value"
    item-text="name"
    v-if="isMobile"
    :label="$t('planning.part')"
    v-model="part"
    :items="parts"
    prepend-inner-icon="$production"
  ></v-select>
  <v-autocomplete
    dense
    v-else
    outlined
    item-value="value"
    item-text="name"
    :label="$t('planning.part')"
    v-model="part"
    :items="parts"
    prepend-inner-icon="$production"
  ></v-autocomplete>
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
    isPartFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    parts() {
      let parts = [];
      if (this.partList && this.partList.length) {
        parts = [{
          name: this.$t('planning.allParts'),
          value: 'All',
        }, ...this.partList];
      }
      return parts;
    },
    part: {
      get() {
        const partFilter = this.filters && this.filters[FIELD_NAME];
        if (partFilter) {
          return partFilter.value;
        }
        return this.parts && this.parts.length && this.parts[0].value;
      },
      set(partVal) {
        this.setPartFilter(partVal);
      },
    },
  },
  created() {
    if (this.parts && this.parts.length) {
      if (this.isPartFilterInactive) {
        this.setPartFilter(this.parts[0].value);
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
    parts(val) {
      if (val && val.length) {
        if (this.isPartFilterInactive) {
          this.setPartFilter(val[0].value);
        }
      }
    },
  },
};
</script>
