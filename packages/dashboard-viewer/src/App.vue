<template>
  <v-app>
    <div id="app">
      <HelloWorld msg="Welcome to Your Vue.js App" />
    </div>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
};
</script>
