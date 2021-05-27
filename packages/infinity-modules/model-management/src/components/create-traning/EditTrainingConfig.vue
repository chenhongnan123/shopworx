<template>
  <v-card-text class="px-0">
    <v-expansion-panels
      flat
      accordion
      v-model="expanded"
    >
      <v-expansion-panel v-for="(detail, index) in details" :key="index">
        <v-expansion-panel-header>
          <span>
            <v-icon left>{{ detail.icon }}</v-icon>
            {{ detail.header }}
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <component
            :is="detail.component"
            :modelDetails="modelDetails"
          >
          </component>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card-text>
</template>

<script>
import { mapState } from 'vuex';
import TrainingData from '../training-details/TrainingData.vue';

export default {
  name: 'EditModelConfig',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  components: {
    TrainingData,
  },
  data() {
    return {
      dialog: false,
      loading: false,
      expanded: null,
      details: [{
        header: 'Train Data',
        icon: 'mdi-database-cog-outline',
        component: 'training-data',
      }],
    };
  },
  computed: {
    ...mapState('modelManagement', ['modelDetails']),
  },
};
</script>
