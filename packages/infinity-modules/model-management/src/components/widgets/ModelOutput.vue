<template>
  <v-responsive :min-height="544">
    <v-card
      flat
      rounded="lg"
      style="height:100%"
    >
      <v-card-title primary-title>
        Model output
        <!-- <v-spacer></v-spacer>
        <v-responsive :max-width="270">
          <v-select
            dense
            filled
            label="Part T-Label"
            :items="items"
            v-model="tLabel"
            hide-details
            single-line
          ></v-select>
        </v-responsive> -->
      </v-card-title>
      <model-predictions />
      <model-features />
    </v-card>
  </v-responsive>
</template>

<script>
import ModelPredictions from './ModelPredictions.vue';
import ModelFeatures from './ModelFeatures.vue';

export default {
  name: 'ModelOutput',
  components: {
    ModelPredictions,
    ModelFeatures,
  },
  data() {
    return {
      tLabel: null,
      items: ['T530310200990948'],
    };
  },
  created() {
    [this.tLabel] = this.items;
  },
};
</script>
