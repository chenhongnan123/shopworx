<template>
  <v-combobox
    dense
    outlined
    return-object
    item-text="name"
    v-model="duration"
    :items="durationList"
    label="Downtime duration"
    prepend-inner-icon="$downtimeLog"
  ></v-combobox>
</template>

<script>
import {
  mapMutations,
  mapGetters,
} from 'vuex';

const FIELD_NAME = 'downtimeduration';

export default {
  name: 'DurationSelection',
  data() {
    return {
      durationList: [{
        name: 'All durations',
        value: 0,
      }, {
        name: '> 2 mins',
        value: 120,
      }, {
        name: '> 30 mins',
        value: 1800,
      }],
    };
  },
  computed: {
    ...mapGetters('webApp', ['filters']),
    isDurationFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    duration: {
      get() {
        const durationFilter = this.filters && this.filters[FIELD_NAME];
        if (durationFilter) {
          const value = this.durationList.find((s) => s.value === durationFilter.value);
          if (value) {
            return value;
          }
        }
        return this.durationList[1];
      },
      set(durationVal) {
        this.setDurationFilter(durationVal);
      },
    },
  },
  created() {
    if (this.isDurationFilterInactive) {
      this.setDurationFilter(this.durationList[1]);
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    setDurationFilter(duration) {
      this.setFilter({
        field: FIELD_NAME,
        value: {
          value: duration.value,
          operation: 'gte',
        },
      });
    },
  },
};
</script>
