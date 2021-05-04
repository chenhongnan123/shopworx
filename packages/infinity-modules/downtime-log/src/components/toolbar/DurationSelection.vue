<template>
  <v-select
    dense
    outlined
    return-object
    item-text="name"
    v-model="duration"
    :items="durationList"
    :label="$t('downtime.downtimeDuration')"
    prepend-inner-icon="$downtimeLog"
  ></v-select>
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
        name: this.$t('downtime.allDurations'),
        value: 0,
      }, {
        name: this.$t('downtime.mins', { min: 2 }),
        value: 120,
      }, {
        name: this.$t('downtime.mins', { min: 30 }),
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
