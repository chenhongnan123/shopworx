<template>
  <v-toolbar
    flat
    dense
    class="stick"
    :color="$vuetify.theme.dark ? '#121212': ''"
  >
    <v-spacer></v-spacer>
    <add-plan
      #default="{ on }"
      @on-add="$emit('fetch-plans')"
    >
      <v-btn
        small
        v-on="on"
        color="primary"
        class="text-none"
      >
        <v-icon small left>mdi-plus</v-icon>
        Add plan
      </v-btn>
    </add-plan>
    <v-btn
      small
      outlined
      color="primary"
      class="text-none ml-2"
      @click="$emit('fetch-plans')"
    >
      <v-icon small left>mdi-refresh</v-icon>
      Refresh
    </v-btn>
    <machine-selection @selected="$emit('fetch-plans')" />
  </v-toolbar>
</template>

<script>
import MachineSelection from './MachineSelection.vue';
import AddPlan from '../AddPlan.vue';

export default {
  name: 'ScheduleToolbar',
  components: {
    MachineSelection,
    AddPlan,
  },
};
</script>

<style scoped>
.stick {
  position: -webkit-sticky;
  position: sticky;
  top: 104px;
  z-index: 1;
}
</style>
