<template>
  <div style="height:100%">
    <portal to="app-header">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>Re-order Plans</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refreshProductionPlans"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <reorder-plan-list />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ReorderPlanList from '../components/ReorderPlanList.vue';

export default {
  name: 'ReorderProductionPlans',
  components: {
    ReorderPlanList,
  },
  methods: {
    ...mapActions('productionPlanning', ['fetchReorderPlanList']),
    refreshProductionPlans() {
      this.fetchReorderPlanList();
    },
    goBack() {
      this.$router.push({ name: 'productionPlanning' });
    },
  },
};
</script>
