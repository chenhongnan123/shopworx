<template>
  <div class="row px-2 px-md-0">
    <v-col
      v-for="(option, n) in options"
      :key="n"
      cols="3"
      class="pa-1 pa-md-3"
    >
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
          <div class="text-h5 text-sm-h4 mt-2 font-weight-medium">
            <span v-if="option.value === 'totalMeters'">
              {{ totalMeters }}
            </span>
            <span v-if="option.value === 'connectedMeters'">
              {{ connectedMeters }}
            </span>
            <span v-if="option.value === 'disconnectedMeters'">
              {{ disconnectedMeters }}
            </span>
            <span v-if="option.value === 'totalConsumption'">
              {{ totalConsumption }}
            </span>
          </div>
          <div class="text-sm-h6">
            {{ option.text }}
          </div>
        </v-card>
      </v-responsive>
    </v-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'NonTvToolbar',
  inject: ['theme'],
  data() {
    return {
      options: [{
        text: 'Meters',
        value: 'totalMeters',
        color: '',
      }, {
        text: 'Connected',
        value: 'connectedMeters',
        color: 'success',
      }, {
        text: 'Disconnected',
        value: 'disconnectedMeters',
        color: 'error',
      }, {
        text: 'Total comsumption(kWh)',
        value: 'totalConsumption',
        color: 'info',
      }],
    };
  },
  computed: {
    ...mapGetters('energyDashboard', [
      'totalMeters',
      'connectedMeters',
      'disconnectedMeters',
      'totalConsumption',
    ]),
    colorHelper() {
      return this.theme.isDark ? 'darken' : 'lighten';
    },
  },
};
</script>
