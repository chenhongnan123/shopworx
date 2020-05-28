<template>
  <div>
    <portal to="app-header">
      Parameter Configuration
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
    </portal>
    <ParameterScheduleView/>
    <!-- Coming soon! -->
  </div>
</template>

<script>
import ParameterScheduleView from './ParameterScheduleView.vue';

export default {
  name: 'ParameterConfiguration',
  components: {
    ParameterScheduleView,
  },
};
</script>
