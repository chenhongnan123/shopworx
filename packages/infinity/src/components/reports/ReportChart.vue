<template>
  <div>
    Report chart - {{ loading }}
  </div>
</template>

<script>
export default {
  name: 'ReportChart',
  props: {
    loading: {
      type: Boolean,
    },
  },
};
</script>
