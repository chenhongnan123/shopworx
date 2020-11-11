<template>
  <v-menu
    offset-y
    ref="menu"
    v-model="menu"
    min-width="290px"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        prepend-inner-icon="$workingDays"
        readonly
        outlined
        dense
        label="Date"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
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
    ...mapState('productionLog', ['selectedDate']),
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
    ...mapMutations('productionLog', ['setSelectedDate']),
  },
};
</script>
