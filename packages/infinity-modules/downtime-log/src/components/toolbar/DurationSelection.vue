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
  mapState,
} from 'vuex';

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
    ...mapState('downtimeLog', ['selectedDuration']),
    duration: {
      get() {
        return this.selectedDuration;
      },
      set(val) {
        this.setSelectedDuration(val);
      },
    },
  },
  methods: {
    ...mapMutations('downtimeLog', ['setSelectedDuration']),
  },
  created() {
    if (!this.selectedDuration) {
      this.setSelectedDuration(this.durationList[0]);
    }
  },
};
</script>
