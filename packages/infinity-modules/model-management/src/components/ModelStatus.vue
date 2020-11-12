<template>
  <span class="success--text font-weight-medium">
    SUCCESS
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
