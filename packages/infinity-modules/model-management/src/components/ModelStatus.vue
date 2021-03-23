<template>
  <span class="font-weight-medium">
    {{ status }}
  </span>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ModelStatus',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('modelManagement', ['lastStatusUpdate']),
    status() {
      const modelInfo = this.lastStatusUpdate[this.model.modelid];
      if (modelInfo) {
        return modelInfo.status;
      }
      return this.model.status;
    },
  },
};
</script>
