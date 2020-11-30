<template>
  <a @click="goToPlan">
    {{ planid }}
  </a>
</template>

<script>
export default {
  name: 'PlanIdTemplate',
  props: {
    planid: {
      type: String,
      required: true,
    },
  },
  methods: {
    goToPlan() {
      this.$router.push({
        name: 'productionPlanDetails',
        params: { id: this.planid },
      });
    },
  },
};
</script>
