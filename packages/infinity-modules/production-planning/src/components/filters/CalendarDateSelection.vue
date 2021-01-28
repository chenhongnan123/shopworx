<template>
  <v-date-picker
    flat
    full-width
    no-title
    v-model="focus"
  ></v-date-picker>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'CalendarDateSelection',
  computed: {
    ...mapState('productionPlanning', ['today', 'calendarFocus']),
    focus: {
      get() {
        return this.calendarFocus || this.today;
      },
      set(val) {
        this.setCalendarFocus(val);
      },
    },
  },
  methods: {
    ...mapMutations('productionPlanning', ['setCalendarFocus']),
  },
};
</script>
