<template>
  <v-responsive :min-height="544">
    <v-card
      flat
      rounded="lg"
      style="height:100%"
    >
      <v-card-title primary-title>
        Live trend
        <v-spacer></v-spacer>
        <span>
          <v-btn small icon @click="dialog = true">
            <v-icon v-text="'$settings'"></v-icon>
          </v-btn>
          <v-btn
            small
            color="error"
            icon
            v-if="configDrawer"
            @click="$emit('remove-widget', widget.i)"
          >
            <v-icon>mdi-minus-circle</v-icon>
          </v-btn>
        </span>
      </v-card-title>
      <model-predictions
        :chartType="selectedPredictionChart"
      />
      <model-features
        :chartType="selectedFeatureChart"
      />
      <v-dialog
        v-model="dialog"
        scrollable
        max-width="500px"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-title primary-title>
            Configure parameters
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="title mb-2">
              Water soluble coolants
            </div>
            <v-select
              filled
              dense
              :items="predictionCharts"
              v-model="selectedPredictionChart"
              label="Select chart type"
            ></v-select>
            <div class="title mb-2">
              Neat oil/Hydraulic oil/Gear oil
            </div>
            <v-combobox
              filled
              dense
              disabled
              multiple
              single-line
              small-chips
              v-model="selectedFeatures"
              :items="features"
              label="Select parameters"
            ></v-combobox>
            <v-select
              filled
              dense
              :items="featureCharts"
              v-model="selectedFeatureChart"
              label="Select chart type"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="text-none"
              @click="dialog = false"
            >
              Exit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-responsive>
</template>

<script>
import { mapState } from 'vuex';
import ModelPredictions from './ModelPredictions.vue';
import ModelFeatures from './ModelFeatures.vue';

export default {
  name: 'ModelOutput',
  props: {
    widget: {
      type: Object,
      default: null,
    },
  },
  components: {
    ModelPredictions,
    ModelFeatures,
  },
  data() {
    return {
      dialog: false,
      selectedFeatures: [],
      selectedPredictionChart: null,
      selectedFeatureChart: null,
      features: [
        'Vicosity',
        'Specific gravity',
        'Moisture content',
      ],
      predictionCharts: [{
        text: 'Area spline',
        value: 'areaspline',
      }, {
        text: 'Line',
        value: 'line',
      }],
      featureCharts: [{
        text: 'Line',
        value: 'line',
      }, {
        text: 'Area spline',
        value: 'areaspline',
      }],
    };
  },
  computed: {
    ...mapState('helper', ['configDrawer']),
  },
  created() {
    this.selectedPredictionChart = this.predictionCharts[0].value;
    this.selectedFeatureChart = this.featureCharts[0].value;
    this.selectedFeatures = [...this.features];
  },
};
</script>
