<template>
  <div>
    Report grid - {{ loading }}
  </div>
</template>

<script>
export default {
  name: 'ReportGrid',
  props: {
    loading: {
      type: Boolean,
    },
  },
};
</script>
