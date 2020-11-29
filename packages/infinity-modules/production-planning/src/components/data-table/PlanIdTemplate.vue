<template>
  <span>
    {{ planid }}
  </span>
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
};
</script>
