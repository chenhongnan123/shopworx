<template>
  <div style="height:100%">
    <portal to="app-header">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>Add Plan</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
    </portal>
    <add-plan />
  </div>
</template>

<script>
import AddPlan from '../components/actions/AddPlan.vue';

export default {
  name: 'AddProductionPlan',
  components: {
    AddPlan,
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'productionPlanning' });
    },
  },
};
</script>
