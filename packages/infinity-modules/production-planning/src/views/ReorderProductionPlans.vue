<template>
  <div style="height:100%">
    <portal to="app-header">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>Re-order plans</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            small
            v-on="on"
            v-bind="attrs"
            class="ml-2 mb-1"
            @click="refreshProductionPlans"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        Last refreshed at: <strong>{{ lastRefreshedReorder }}</strong>
      </v-tooltip>
    </portal>
    <reorder-plan-list />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ReorderPlanList from '../components/ReorderPlanList.vue';

export default {
  name: 'ReorderProductionPlans',
  components: {
    ReorderPlanList,
  },
  computed: {
    ...mapState('productionPlanning', ['lastRefreshedReorder']),
  },
  methods: {
    ...mapActions('productionPlanning', ['fetchReorderPlanList']),
    refreshProductionPlans() {
      this.fetchReorderPlanList();
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
