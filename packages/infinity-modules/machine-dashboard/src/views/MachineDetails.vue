<template>
  <v-container
    fluid
    class="py-0"
  >
    <widget-add-drawer />
    <detail-dashboard />
  </v-container>
</template>

<script>
import WidgetAddDrawer from '../components/details/WidgetAddDrawer.vue';
import DetailDashboard from '../components/details/DetailDashboard.vue';

export default {
  name: 'MachineDetails',
  components: {
    DetailDashboard,
    WidgetAddDrawer,
  },
};
</script>
