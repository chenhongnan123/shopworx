<template>
  <v-menu
    bottom
    offset-y
  >
    <template #activator="{ on }">
      <v-btn
        small
        outlined
        v-on="on"
        color="primary"
        class="text-none ml-2"
      >
        <v-icon small left>{{ chartType ? chartType.icon : '' }}</v-icon>
        {{ chartType ? chartType.name : '' }}
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        :key="n"
        v-for="(chart, n) in chartTypes"
        @click="setChartType(chart)"
      >
        <v-list-item-title>
          <v-icon small left>{{ chart.icon }}</v-icon>
          <span>{{ chart.name }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ReportChartType',
  data() {
    return {
      chartTypes: [
        {
          name: 'Bar',
          value: 'column',
          icon: 'mdi-chart-bar',
        },
        {
          name: 'Area spline',
          value: 'areaspline',
          icon: 'mdi-chart-areaspline',
        },
        {
          name: 'None',
          value: null,
          icon: 'mdi-close-circle-outline',
        },
      ],
    };
  },
  created() {
    this.setChartType(this.chartTypes[0]);
  },
  computed: {
    ...mapState('reports', ['chartType']),
  },
  methods: {
    ...mapMutations('reports', ['setChartType']),
  },
};
</script>
