<template>
  <department-master v-if="id === 'department'" />
  <position-master v-else-if="id === 'position'" />
</template>

<script>
import DepartmentMaster from './DepartmentMaster.vue';
import PositionMaster from './PositionMaster.vue';

export default {
  components: { DepartmentMaster, PositionMaster },
  name: 'AdminWindow',
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
