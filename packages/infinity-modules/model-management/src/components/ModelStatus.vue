<template>
  <span class="warning--text font-weight-medium">
    N.A
  </span>
</template>

<script>
export default {
  name: 'ModelStatus',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
};
</script>
