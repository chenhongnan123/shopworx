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
        <v-row>
          <v-col cols="12" class="pt-0">
            <model-predictions />
          </v-col>
          <v-col cols="12">
            <model-features />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ModelInfo from './widgets/ModelInfo.vue';
import ModelPredictions from './widgets/ModelPredictions.vue';
import ModelFeatures from './widgets/ModelFeatures.vue';
import ModelWarnings from './widgets/ModelWarnings.vue';

export default {
  name: 'ModelDashboard',
  components: {
    ModelInfo,
    ModelPredictions,
    ModelFeatures,
    ModelWarnings,
  },
};
</script>
