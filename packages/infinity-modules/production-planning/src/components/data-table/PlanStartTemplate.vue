<template>
  <span>
    {{ new Date(datetime).toLocaleString('en-GB') }}
  </span>
</template>

<script>
export default {
  name: 'PlanStartTemplate',
  props: {
    datetime: {
      type: [String, Number],
      required: true,
    },
  },
};
</script>
