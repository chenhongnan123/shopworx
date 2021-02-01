<template>
  <span class="font-weight-medium">
    {{ new Date(lastModified).toLocaleString() }}
  </span>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ModelLastModified',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('modelManagement', ['lastStatusUpdate']),
    lastModified() {
      console.log(this.model);
      const modelInfo = this.lastStatusUpdate[this.model.model_id];
      console.log(modelInfo);
      if (modelInfo) {
        return modelInfo.lastModified;
      }
      return this.model.lastModified;
    },
  },
};
</script>
