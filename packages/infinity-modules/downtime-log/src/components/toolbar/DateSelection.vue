<template>
  <v-date-picker
    flat
    no-title
    full-width
    :max="today"
    v-model="date"
  ></v-date-picker>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'DateSelection',
  data() {
    return {
      menu: false,
      today: new Date().toISOString().substr(0, 10),
    };
  },
  computed: {
    ...mapState('downtimeLog', ['selectedDate']),
    date: {
      get() {
        return this.selectedDate;
      },
      set(val) {
        this.setSelectedDate(val);
      },
    },
  },
  created() {
    if (!this.selectedDate) {
      this.setSelectedDate(this.today);
    }
  },
  methods: {
    ...mapMutations('downtimeLog', ['setSelectedDate']),
  },
};
</script>
