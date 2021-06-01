<template>
  <v-date-picker
    flat
    full-width
    no-title
    v-model="focus"
    :locale="locale"
  ></v-date-picker>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'CalendarDateSelection',
  computed: {
    ...mapState('productionPlanning', ['today', 'calendarFocus']),
    ...mapGetters('helper', ['locale']),
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
