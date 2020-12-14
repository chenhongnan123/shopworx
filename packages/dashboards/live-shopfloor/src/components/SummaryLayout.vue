<template>
  <v-row>
    <v-col v-for="(option, n) in options" :key="n" cols="3">
      <v-responsive max-height="80" min-height="80">
        <v-card
          flat
          outlined
          class="flex text-center"
          height="100%"
          rounded="lg"
          dark
          :color="`${option.color} darken-2`"
        >
          <div class="display-1 mt-2 font-weight-medium">
            <span v-if="option.value === 'totalMachines'">
              {{ totalMachines }}
            </span>
            <span v-if="option.value === 'operatingMachines'">
              {{ operatingMachines }}
            </span>
            <span v-if="option.value === 'stoppedMachines'">
              {{ stoppedMachines }}
            </span>
            <span v-if="option.value === 'idleMachines'">
              {{ idleMachines }}
            </span>
          </div>
          <div class="title">
            {{ option.text }}
          </div>
        </v-card>
      </v-responsive>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'NonTvToolbar',
  inject: ['theme'],
  data() {
    return {
      options: [{
        text: 'Machines',
        value: 'totalMachines',
        color: '',
      }, {
        text: 'Operating',
        value: 'operatingMachines',
        color: 'success',
      }, {
        text: 'Stopped',
        value: 'stoppedMachines',
        color: 'error',
      }, {
        text: 'Idle',
        value: 'idleMachines',
        color: 'warning',
      }],
    };
  },
  computed: {
    ...mapGetters('shopfloor', [
      'totalMachines',
      'operatingMachines',
      'stoppedMachines',
      'idleMachines',
    ]),
    colorHelper() {
      return this.theme.isDark ? 'darken' : 'lighten';
    },
  },
};
</script>
