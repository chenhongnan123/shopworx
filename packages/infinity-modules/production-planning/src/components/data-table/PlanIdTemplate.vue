<template>
  <a @click="goToPlan" class="text-decoration-underline">
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
