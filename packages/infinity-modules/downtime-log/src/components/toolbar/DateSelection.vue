<template>
  <v-menu
    offset-y
    ref="menu"
    v-model="menu"
    min-width="290px"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        small
        outlined
        v-on="on"
        color="primary"
        class="text-none ml-2"
      >
        <v-icon small left v-text="'$workingDays'"></v-icon>
          {{ date }}
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-date-picker
      no-title
      :max="today"
      v-model="date"
      @input="menu = false"
    ></v-date-picker>
  </v-menu>
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
