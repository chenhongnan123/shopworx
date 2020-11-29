<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-avatar
        size="16"
        class="mb-1"
        v-bind="attrs"
        v-on="on"
        :color="getPlanStatus(status).color"
      ></v-avatar>
    </template>
    {{ getPlanStatus(status).text }}
  </v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PlanStatusTemplate',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('productionPlanning', ['planning', 'planStatus']),
  },
  methods: {
    getPlanStatus(status) {
      return this.planStatus(status);
    },
  },
};
</script>
