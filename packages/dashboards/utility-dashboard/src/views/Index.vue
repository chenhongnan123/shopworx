<template>
  <div style="height: 100%">
    <template>
      <config-drawer />
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import ConfigDrawer from '../components/ConfigDrawer.vue';

export default {
  name: 'Index',
  components: {
    ConfigDrawer,
  },
  data() {
    return {};
  },
};
</script>
