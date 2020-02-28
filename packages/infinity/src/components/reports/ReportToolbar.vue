<template>
  <div>
    Report toolbar - {{ loading }}
  </div>
</template>

<script>
export default {
  name: 'ReportToolbar',
  props: {
    id: {
      type: String,
    },
    loading: {
      type: Boolean,
    },
  },
};
</script>
