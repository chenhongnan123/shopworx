<template>
  <v-btn-toggle
    dense
    mandatory
    v-model="time"
    color="primary"
  >
    <v-btn class="text-none" disabled>
      Hourly
    </v-btn>
    <v-btn class="text-none">
      Shift
    </v-btn>
  </v-btn-toggle>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'TimeSelection',
  computed: {
    ...mapState('machineDashboard', ['selectedTime']),
    time: {
      get() {
        return this.selectedTime;
      },
      set(val) {
        this.setSelectedTime(val);
      },
    },
  },
  methods: {
    ...mapMutations('machineDashboard', ['setSelectedTime']),
  },
};
</script>
