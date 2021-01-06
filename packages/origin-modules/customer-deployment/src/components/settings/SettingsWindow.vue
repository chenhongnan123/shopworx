<template>
  <div>
    <services v-if="id === 'manager'" />
    <devices v-else-if="id === 'devices'" />
    <nodebots v-else-if="id === 'nodebots'" />
  </div>
</template>

<script>
import Services from './Services.vue';
import Devices from './Devices.vue';
import Nodebots from './Nodebots.vue';

export default {
  name: 'AdminWindow',
  components: {
    Services,
    Devices,
    Nodebots,
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
