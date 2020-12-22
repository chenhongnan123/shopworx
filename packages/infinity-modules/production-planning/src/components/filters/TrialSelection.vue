<template>
  <v-checkbox
    hide-details
    class="ma-0 pa-0"
    label="Trial plans"
    v-model="trial"
  ></v-checkbox>
</template>

<script>
import {
  mapGetters,
  mapMutations,
} from 'vuex';

const FIELD_NAME = 'trial';

export default {
  name: 'TrialSelection',
  computed: {
    ...mapGetters('webApp', ['filters']),
    isTrialFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    trial: {
      get() {
        const trialFilter = this.filters && this.filters[FIELD_NAME];
        if (trialFilter) {
          return trialFilter.value;
        }
        return false;
      },
      set(trialVal) {
        this.setTrialFilter(trialVal);
      },
    },
  },
  created() {
    if (this.isTrialFilterInactive) {
      this.setTrialFilter(false);
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    setTrialFilter(val) {
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
    trialList(val) {
      if (this.isTrialFilterInactive) {
        this.setTrialFilter(val);
      }
    },
  },
};
</script>
