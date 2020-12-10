<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6" xl="5">
        <v-row>
          <v-col cols="12" class="pt-0">
            <model-info />
          </v-col>
          <v-col cols="12">
            <model-warnings />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6" xl="7">
        <model-output />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ModelInfo from './widgets/ModelInfo.vue';
import ModelOutput from './widgets/ModelOutput.vue';
import ModelWarnings from './widgets/ModelWarnings.vue';

export default {
  name: 'ModelDashboard',
  components: {
    ModelInfo,
    ModelOutput,
    ModelWarnings,
  },
};
</script>
